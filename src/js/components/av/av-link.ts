/**
 * <av-link> — enlace interno: un `<a href>` real (Ctrl+clic y clic medio abren pestaña) a `vista`/`registro`. El clic normal lo
 * atiende el router sin recargar, y pasar por encima precarga la vista. Marca `aria-current` si la ruta coincide.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvLinkProps } from '../../consts/schemas/componentes.schemas.js';
import { activa, escuchar, hrefDe } from '../../core/router.js';

const AvLink = crearComponente<AvLinkProps>(import.meta.url, 'av-link', { vista: '', registro: null }, (root, props, host) => {
  const vista = props.vista || (host.getAttribute('vista') ?? 'inicio');
  const registro = props.registro ?? host.getAttribute('registro');
  root.append(html`<a part="enlace" href=${hrefDe(vista, registro)} aria-label=${host.getAttribute('aria-label') ?? ''}><slot></slot></a>`);
  const a = root.querySelector('a')!;
  if (!a.getAttribute('aria-label')) a.removeAttribute('aria-label');
  const marcar = () => a.toggleAttribute('data-activo', activa(vista, registro ?? undefined));
  const fin = escuchar(() => (host.isConnected ? marcar() : fin()));
  marcar();
});

define('av-link', AvLink);
