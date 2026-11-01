/**
 * <av-boton-enlace> — `iswc-button` que navega: lleva `href` real, y el router atiende el clic sin recargar.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvBotonEnlaceProps } from '../../consts/schemas/componentes.schemas.js';
import { hrefDe } from '../../core/router.js';

const AvBotonEnlace = crearComponente<AvBotonEnlaceProps>(import.meta.url, 'av-boton-enlace', { vista: '', registro: null, variant: 'outlined compact', color: 'brand' }, (root, props, host) => {
  const vista = props.vista || (host.getAttribute('vista') ?? 'inicio');
  root.append(html`<iswc-button part="boton" variant=${host.getAttribute('variant') ?? props.variant} color=${host.getAttribute('color') ?? props.color} href=${hrefDe(vista, props.registro ?? host.getAttribute('registro'))}><slot></slot></iswc-button>`);
});

define('av-boton-enlace', AvBotonEnlace);
