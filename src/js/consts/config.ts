/**
 * config.ts — la URL del API de Avatar (api-avatar en Cloudflare Workers + D1).
 *
 * Un solo valor publicado; en desarrollo se puede apuntar a un API local con `?api=http://localhost:8788/api`
 * (queda en localStorage `avatar:api`) o volviendo al publicado con `?api=`.
 */
export const API_PUBLICADA = 'https://api-avatar.jeffaporta.workers.dev/api';
const CLAVE = 'avatar:api';

/** URL base del API: `?api=` > localStorage > la publicada. */
export function apiUrl(): string {
  if (typeof location === 'undefined') return API_PUBLICADA;
  try {
    const q = new URLSearchParams(location.search).get('api');
    if (q !== null) {
      if (q) localStorage.setItem(CLAVE, q);
      else localStorage.removeItem(CLAVE);
    }
    return localStorage.getItem(CLAVE) || API_PUBLICADA;
  } catch {
    return API_PUBLICADA;
  }
}
