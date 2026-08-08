const STORAGE_KEY = "tuenties_session";
const listeners = new Set();

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let current = read();

export function getStoredSession() {
  return current;
}

export function setStoredSession(session) {
  current = session;
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((listener) => listener(session?.user ?? null));
}

export function clearStoredSession() {
  setStoredSession(null);
}

/**
 * Se suscribe a cambios de sesión (login/logout). Retorna función para desuscribirse.
 */
export function subscribeToSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
