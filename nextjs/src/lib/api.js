export function apiBaseUrl() {
  return process.env.SAILS_URL || 'http://localhost:1338';
}

export async function apiFetch(path, init = {}) {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
