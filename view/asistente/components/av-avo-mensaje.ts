/**
 * <av-avo-mensaje> — una burbuja del chat con AVO: la del usuario a la derecha (su `iswc-person`), la de AVO a la izquierda
 * con su ícono de robot. Texto con saltos de línea y hora relativa.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvAvoMensajeProps } from '../../../src/js/consts/schemas/asistente.schemas.js';

const AvAvoMensaje = crearComponente<AvAvoMensajeProps>(import.meta.url, 'av-avo-mensaje', { turno: null, nombre: '' }, (root, props) => {
  const t = props.turno;
  if (!t) return;
  const avo = t.quien === 'avo';
  root.append(html`
    <article class="turno" part="turno" data-quien=${t.quien}>
      ${avo
        ? html`<span class="avo" part="avatar" title="AVO"><iswc-icon icon="mdi:robot-outline"></iswc-icon></span>`
        : html`<iswc-person class="persona" compacto usuario=${props.nombre || 'yo'} nombre=${props.nombre}></iswc-person>`}
      <div class="burbuja" part="burbuja">
        ${avo ? html`<strong class="quien">AVO</strong>` : null}
        <p class="texto">${t.texto}</p>
        ${t.creado ? html`<iswc-relative-time class="cuando" date=${t.creado} format="short"></iswc-relative-time>` : null}
      </div>
    </article>
  `);
});

define('av-avo-mensaje', AvAvoMensaje);
