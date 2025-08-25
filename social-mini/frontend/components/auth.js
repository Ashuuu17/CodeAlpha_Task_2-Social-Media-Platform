import { api, setToken } from '../api.js';

export function AuthView(onAuth) {
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>Welcome</h2>
      <div class="row">
        <input class="input" id="username" placeholder="Username" />
        <input class="input" id="password" type="password" placeholder="Password" />
        <button class="btn" id="login">Login</button>
      </div>
      <div class="small">No account? <span class="link" id="registerLink">Register</span></div>
    </div>`;

  el.querySelector('#login').onclick = async () => {
    try {
      const username = el.querySelector('#username').value.trim();
      const password = el.querySelector('#password').value;
      const { token, user } = await api('/auth/login', { method: 'POST', body: { username, password }, auth: false });
      setToken(token); onAuth(user);
    } catch (e) { alert(e.message); }
  };

  el.querySelector('#registerLink').onclick = async () => {
    const username = prompt('Choose a username');
    const email = prompt('Your email');
    const password = prompt('Choose a password');
    if (!username || !email || !password) return;
    try {
      await api('/auth/register', { method: 'POST', body: { username, email, password }, auth: false });
      alert('Registered! Now login.');
    } catch (e) { alert(e.message); }
  };

  return el;
}
