/**
 * arranque.ts — enciende el centro de notificaciones con la sesión: backend del API de la empresa activa. Sin sesión, y fuera de
 * una fuente de demo, no hay nada que escuchar. Va aparte de `centro.ts` para que el demo no cargue el backend del API.
 */
import { alCambiar as alCambiarEstado, empresaActiva, haySesion } from '../core/estado.js';
import { claveFuente, detener, fuenteDe } from './centro.js';

let escuchando = false;

/** Fuente del API para la empresa activa, o ninguna. */
export function arrancar(): void {
  if (!escuchando) {
    escuchando = true;
    alCambiarEstado('empresa', arrancar);
  }
  const clave = claveFuente();
  const iempresa = empresaActiva();
  if (!haySesion() || !iempresa) {
    if (clave?.startsWith('empresa-')) detener();
    return;
  }
  if (clave === `empresa-${iempresa}`) return;
  void import('../chat/backend-avatar.js').then(({ crearBackendAvatar }) => {
    if (haySesion() && empresaActiva() === iempresa) fuenteDe(`empresa-${iempresa}`, 'canales', () => crearBackendAvatar({ iempresa }));
  });
}
