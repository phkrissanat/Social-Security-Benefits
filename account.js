const accountChanged = 'sithi-account-changed';

export async function initAccount(container, onUser) {
  const panel = document.createElement('div');
  panel.className = 'account-panel';
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  const login = document.createElement('a');
  const logout = document.createElement('button');
  login.textContent = 'เข้าสู่ระบบด้วย Google';
  login.target = '_top';
  login.href = window === window.top ? './auth/google' : './auth/google?return=%2Fphone-preview.html';
  logout.type = 'button';
  logout.textContent = 'ออกจากระบบ';
  panel.append(status, login, logout);
  panel.hidden = login.hidden = logout.hidden = true;
  container.prepend(panel);
  let currentUser;
  let pending;

  function update(session) {
    const user = session.user;
    const id = user?.id ?? null;
    const changed = id !== currentUser;
    currentUser = id;
    panel.hidden = !session.enabled && !user;
    login.hidden = !session.enabled || Boolean(user);
    logout.hidden = !user;
    status.textContent = user
      ? (user.email || 'เข้าสู่ระบบด้วย Google แล้ว')
      : '';
    if (changed) onUser(id);
  }

  function refresh() {
    if (!pending) {
      pending = fetch('./auth/session', {cache: 'no-store', signal: AbortSignal.timeout(3000)})
        .then(response => {
          if (!response.ok) throw Error('Account unavailable');
          return response.json();
        })
        .then(update)
        .catch(() => {
          if (currentUser === undefined) {
            currentUser = null;
            onUser(null);
          }
        })
        .finally(() => { pending = undefined; });
    }
    return pending;
  }

  function notifyTabs() {
    try { localStorage.setItem(accountChanged, String(Date.now())); } catch {}
  }

  logout.onclick = async () => {
    logout.disabled = true;
    try {
      await pending;
      const response = await fetch('./auth/logout', {method: 'POST', cache: 'no-store'});
      if (!response.ok) throw Error('Could not sign out');
      update(await response.json());
      notifyTabs();
    } catch {
      status.textContent = 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง';
    } finally {
      logout.disabled = false;
    }
  };
  await refresh();
  if (currentUser) notifyTabs();
  if (new URLSearchParams(location.search).get('login') === 'failed') {
    status.textContent = 'เข้าสู่ระบบ Google ไม่สำเร็จ กรุณาลองอีกครั้ง';
    history.replaceState(null, '', location.pathname);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.addEventListener('online', refresh);
  window.addEventListener('storage', event => { if (event.key === accountChanged) refresh(); });
}
