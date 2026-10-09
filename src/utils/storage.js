const TOKEN_KEY = 'token';
const USER_KEY = 'senaigo_user';

const safeGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* armazenamento indisponível */ }
};
const safeRemove = (key) => {
  try { localStorage.removeItem(key); } catch { /* armazenamento indisponível */ }
};

export const getToken = () => safeGet(TOKEN_KEY);
export const setToken = (token) => safeSet(TOKEN_KEY, token);
export const removeToken = () => safeRemove(TOKEN_KEY);

export const getStoredUser = () => {
  const raw = safeGet(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};
export const setStoredUser = (user) => safeSet(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => safeRemove(USER_KEY);
