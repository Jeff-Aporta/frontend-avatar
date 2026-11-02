/**
 * demo.ts — lógica del demo del chat (sin DOM salvo BroadcastChannel/location): elegir con quién hablar (la persona de
 * `?como=` o la primera que ninguna otra pestaña esté usando) y armar la URL para abrir otra pestaña como otra persona.
 */
import { CANAL_DEMO, personasDemo } from '../../../src/js/chat/backend-demo.js';

const CLAVE_PERSONA = 'av-chat-demo:como';

/** Persona pedida: `?como=` y, sin él, la que esta pestaña ya venía usando (recargar o volver por la SPA no la cambia). */
export function personaPedida(busqueda: string = typeof location === 'undefined' ? '' : location.search): string | null {
  const q = new URLSearchParams(busqueda).get('como');
  if (q) return q;
  try {
    return sessionStorage.getItem(CLAVE_PERSONA);
  } catch {
    return null;
  }
}

/** Recuerda la persona de esta pestaña. */
export function recordarPersona(id: string): void {
  try {
    sessionStorage.setItem(CLAVE_PERSONA, id);
  } catch {
    /* sin almacenamiento */
  }
}

/** Raíz `ws(s)://` del servidor a partir de la URL del API. */
export const raizSala = (api: string): string => new URL(api).origin.replace(/^http/, 'ws');

/** Primera persona libre (no está en `ocupadas`); si todas lo están, la primera. */
export function primeraLibre(personas: string[], ocupadas: Iterable<string>): string {
  const o = new Set(ocupadas);
  return personas.find((p) => !o.has(p)) ?? personas[0] ?? 'ana';
}

/** Escucha por `ms` quién está en línea en otras pestañas del demo (latidos de presencia por BroadcastChannel). */
export function ocupadasAhora(ms = 650, nombre = CANAL_DEMO): Promise<Set<string>> {
  return new Promise((ok) => {
    const vistas = new Set<string>();
    let canal: BroadcastChannel | null = null;
    try {
      canal = new BroadcastChannel(nombre);
    } catch {
      ok(vistas);
      return;
    }
    canal.onmessage = (ev) => {
      const d = ev.data as { op?: string; usuario?: string; enLinea?: boolean };
      if (d?.op === 'presencia' && d.usuario && d.enLinea) vistas.add(d.usuario);
    };
    canal.postMessage({ op: 'hola', front: `sonda-${Date.now()}` });
    setTimeout(() => {
      canal?.close();
      ok(vistas);
    }, ms);
  });
}

/** Persona inicial: la pedida (si existe) o la primera libre. */
export async function personaInicial(pedida: string | null): Promise<string> {
  const ids = personasDemo().map((p) => p.id);
  if (pedida && ids.includes(pedida)) return pedida;
  return primeraLibre(ids, await ocupadasAhora());
}

/** URL de esta misma página hablando como `como` (para abrir otra pestaña). */
export function urlComo(como: string, base: string = typeof location === 'undefined' ? 'http://localhost/' : location.href): string {
  const u = new URL(base);
  u.searchParams.set('como', como);
  return u.href;
}
