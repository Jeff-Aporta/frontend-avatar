/**
 * <av-correo-carpetas> — navegación de carpetas del buzón (Entrada, Enviados, Archivados, Papelera) con su total y los
 * no leídos de la entrada. Clic emite `av-correos-carpeta { carpeta }`. En pantallas angostas se vuelve una fila.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCorreoCarpetasProps } from '../../../src/js/consts/schemas/correos.schemas.js';

const AvCorreoCarpetas = crearComponente<AvCorreoCarpetasProps>(import.meta.url, 'av-correo-carpetas', { carpetas: [], activa: 'entrada' }, (root, props, host) => {
  root.append(html`
    <nav class="carpetas" part="carpetas" aria-label="Carpetas del correo">
      ${props.carpetas.map((c) => html`
        <iswc-button class="carpeta" data-carpeta=${c.carpeta} variant=${c.carpeta === props.activa ? 'soft' : 'plain'} color=${c.carpeta === props.activa ? 'brand' : 'neutral'} aria-current=${c.carpeta === props.activa ? 'page' : 'false'}
          oniswc-click=${() => emitir(host, 'av-correos-carpeta', { carpeta: c.carpeta })}>
          <iswc-icon slot="start" icon=${c.icono}></iswc-icon>
          <span class="nombre">${c.label}</span>
          ${c.noLeidos ? html`<iswc-badge slot="end" class="no-leidos" color="warning" variant="filled" pill>${c.noLeidos}</iswc-badge>` : c.total ? html`<span slot="end" class="total">${c.total}</span>` : null}
        </iswc-button>
      `)}
    </nav>
  `);
});

define('av-correo-carpetas', AvCorreoCarpetas);
