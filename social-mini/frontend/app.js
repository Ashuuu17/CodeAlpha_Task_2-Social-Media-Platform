import { api, getToken } from './api.js';
import { AuthView } from './components/auth.js';
import { FeedView } from './components/feed.js';
import { ProfileView } from './components/profile.js';

const app = document.getElementById('app');
const navUsername = document.getElementById('nav-username');

function setView(el) { app.innerHTML = ''; app.append(el); }

function setAuthedUI(user) {
  navUsername.textContent = user ? `@${user.username}` : '';
  document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); location.reload(); };
  if (user) localStorage.setItem('me_username', user.username);
}

async function init() {
  if (!getToken()) {
    setView(AuthView(async (user) => { setAuthedUI(user); setView(FeedView()); }));
    return;
  }
  try {
    const me = await api('/users/me');
    setAuthedUI(me);
    setView(FeedView());
  } catch (e) {
    localStorage.clear();
    setView(AuthView(async (user) => { setAuthedUI(user); setView(FeedView()); }));
  }
}

// Simple hash router for profiles: #/u/USERNAME
window.addEventListener('hashchange', () => {
  const hash = location.hash;
  const match = hash.match(/^#\/u\/(.+)$/);
  if (match) setView(ProfileView(match[1]));
  else init();
});

init();
