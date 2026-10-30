/**
 * <av-mensaje> — un mensaje del chat: avatar y nombre del autor (`av-persona`), burbuja con el texto y hora relativa.
 * `propio` lo alinea a la derecha con el color de marca; los mensajes de sistema van centrados y atenuados.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvMensajeProps } from '../../../src/js/consts/schemas/canales.schemas.js';
import { fechaDe } from '../utils/chat.js';

const AvMensaje = crearComponente<AvMensajeProps>(import.meta.url, 'av-mensaje', { mensaje: null, propio: false }, (root, props) => {
  const m = props.mensaje;
  if (!m) return;
  const iso = fechaDe(m.creado);
  if (m.tipo === 'sistema') {
    root.append(html`<div class="sistema" part="sistema"><iswc-tag color="neutral" pill>${m.contenido}</iswc-tag></div>`);
    return;
  }
  root.append(html`
    <article class="mensaje" part="mensaje" data-propio=${props.propio ? '1' : '0'}>
      <av-persona class="autor" id="autor"></av-persona>
      <div class="burbuja" part="burbuja">
        <p class="texto">${m.contenido}</p>
        <span class="meta">${m.editado ? html`<span class="editado">editado · </span>` : null}${iso ? html`<iswc-relative-time date=${iso} format="short"></iswc-relative-time>` : null}</span>
      </div>
    </article>
  `);
  (root.querySelector('#autor') as HTMLElement & { props: Record<string, unknown> }).props = { iusuario: m.iusuario, nombre: m.autor?.nombre ?? null, compacto: true };
});

define('av-mensaje', AvMensaje);
