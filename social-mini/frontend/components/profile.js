import { api } from '../api.js';

export function ProfileView(username) {
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `<div class="card"><h2>Profile</h2><div id="body">Loading…</div></div>`;

  const render = (u) => {
    const body = el.querySelector('#body');
    const me = localStorage.getItem('me_username');
    const canFollow = me && me !== u.username;
    body.innerHTML = `
      <div class="row" style="justify-content:space-between;">
        <div>
          <div class="avatar"></div>
          <div><strong>@${u.username}</strong> ${u.name ? `• ${u.name}` : ''}</div>
          <div class="small">${u.bio || ''}</div>
          <div class="small">Followers: ${u.followers?.length || 0} • Following: ${u.following?.length || 0}</div>
        </div>
        ${canFollow ? `<button class="btn" id="followBtn">Follow / Unfollow</button>` : ''}
      </div>`;

    if (canFollow) {
      body.querySelector('#followBtn').onclick = async () => {
        await api(`/users/${u.username}/follow`, { method: 'POST' });
        load();
      };
    }
  };

  const load = async () => {
    const u = await api(`/users/${username}`, { method: 'GET', auth: false });
    render(u);
  };

  load();
  return el;
}
