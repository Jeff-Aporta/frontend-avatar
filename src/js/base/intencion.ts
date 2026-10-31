/**
 * intencion.ts — las intenciones de navegación (`ir(vista, null, intencion)`, p. ej. desde la paleta global) que un
 * shell de vista debe resolver: la pendiente al montar (`tomarIntencion`) y las que llegan con `av-ruta` mientras la
 * vista sigue abierta. Un repintado del shell reemplaza al oyente anterior (nunca hay dos).
 */
import { tomarIntencion } from '../core/router.js';

const OYENTES = new WeakMap<HTMLElement, EventListener>();

/** Llama `fn` con cada intención de `vista` mientras `host` siga conectado. */
export function escucharIntencion(host: HTMLElement, vista: string, fn: (intencion: string) => void): void {
  const previo = OYENTES.get(host);
  if (previo) removeEventListener('av-ruta', previo);
  const alRuta: EventListener = (e) => {
    if (!host.isConnected) {
      removeEventListener('av-ruta', alRuta);
      return;
    }
    const d = (e as CustomEvent<{ vista?: string; intencion?: string | null }>).detail;
    if (d?.vista !== vista || !d.intencion) return;
    tomarIntencion(vista);
    fn(d.intencion);
  };
  OYENTES.set(host, alRuta);
  addEventListener('av-ruta', alRuta);
  const inicial = tomarIntencion(vista);
  if (inicial) queueMicrotask(() => fn(inicial));
}
