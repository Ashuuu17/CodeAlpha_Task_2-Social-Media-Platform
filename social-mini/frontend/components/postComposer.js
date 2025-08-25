import { api } from '../api.js';

export function PostComposer(onPosted) {
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="row">
      <div class="avatar"></div>
      <textarea id="text" class="input" rows="3" placeholder="What's happening?"></textarea>
    </div>
    <div class="row" style="justify-content:space-between; margin-top:8px;">
      <input id="imageUrl" class="input" placeholder="Optional image URL" />
      <button class="btn" id="postBtn">Post</button>
    </div>`;

  el.querySelector('#postBtn').onclick = async () => {
    const text = el.querySelector('#text').value.trim();
    const imageUrl = el.querySelector('#imageUrl').value.trim();
    try {
      await api('/posts', { method: 'POST', body: { text, imageUrl } });
      el.querySelector('#text').value = '';
      el.querySelector('#imageUrl').value = '';
      onPosted?.();
    } catch (e) { alert(e.message); }
  };

  return el;
}
