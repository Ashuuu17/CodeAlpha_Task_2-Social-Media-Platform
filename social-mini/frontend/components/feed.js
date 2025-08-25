import { api } from '../api.js';

function PostItem(post, onRefresh) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="row">
      <div class="avatar"></div>
      <div>
        <div><strong>@${post.author.username}</strong> <span class="small">${new Date(post.createdAt).toLocaleString()}</span></div>
        <div class="post-text">${post.text}</div>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="" style="max-width:100%; border-radius:10px; margin-top:8px;"/>` : ''}
        <div class="row" style="gap:16px; margin-top:8px;">
          <span class="like" id="like">❤️ ${post.likes?.length || 0}</span>
          <span class="link" id="comments">💬 Comments</span>
        </div>
        <div id="commentsBox" class="hidden"></div>
      </div>
    </div>`;

  el.querySelector('#like').onclick = async () => {
    await api(`/posts/${post._id}/like`, { method: 'POST' });
    onRefresh();
  };

  el.querySelector('#comments').onclick = async () => {
    const box = el.querySelector('#commentsBox');
    if (!box.classList.contains('hidden')) { box.classList.add('hidden'); box.innerHTML = ''; return; }
    const comments = await api(`/posts/${post._id}/comments`, { method: 'GET', auth: false });
    box.classList.remove('hidden');
    box.innerHTML = comments.map(c => `<div class="small"><strong>@${c.author.username}</strong>: ${c.text}</div>`).join('');
    const input = document.createElement('input');
    input.className = 'input'; input.placeholder = 'Write a comment…';
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Send';
    const row = document.createElement('div'); row.className = 'row'; row.append(input, btn); box.append(row);
    btn.onclick = async () => { await api(`/posts/${post._id}/comments`, { method: 'POST', body: { text: input.value } }); onRefresh(); };
  };

  return el;
}

export function FeedView() {
  const container = document.createElement('div');
  container.className = 'container';

  const composerSlot = document.createElement('div');
  const list = document.createElement('div');

  container.append(composerSlot, list);

  const refresh = async () => {
    const posts = await api('/posts/feed', { method: 'GET' });
    list.innerHTML = '';
    posts.forEach(p => list.appendChild(PostItem(p, refresh)));
  };

  import('./postComposer.js').then(({ PostComposer }) => {
    composerSlot.appendChild(PostComposer(refresh));
  });

  refresh();
  return container;
}
