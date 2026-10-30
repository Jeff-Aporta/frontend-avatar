/**
 * <av-conversacion> — columna derecha: cabecera del canal (nombre, tipo, descripción, botones volver y refrescar),
 * mensajes agrupados por día (`av-mensaje`) con scroll al final, y el redactor. Emite `av-conversacion-refrescar`,
 * `av-conversacion-volver` y deja subir `av-mensaje-enviar` del redactor.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvConversacionProps } from '../../../src/js/consts/schemas/canales.schemas.js';
import { agruparPorDia, esPropio, ICONO_CANAL } from '../utils/chat.js';
import './av-mensaje.js';
import './av-redactor.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const AvConversacion = crearComponente<AvConversacionProps>(import.meta.url, 'av-conversacion', { canal: null, mensajes: [], yo: '', cargando: false, enviando: false, puedeEscribir: false }, (root, props, host) => {
  if (!props.canal) {
    root.append(html`<av-vacio id="sin-canal" class="vacio"></av-vacio>`);
    (root.querySelector('#sin-canal') as ConProps).props = props.cargando ? { estado: 'cargando' } : { icono: 'mdi:forum-outline', titulo: 'Elige un canal', texto: 'La conversación aparecerá aquí.' };
    return;
  }
  const c = props.canal;
  const grupos = agruparPorDia(props.mensajes);
  root.append(html`
    <section class="conversacion" part="conversacion" aria-label=${`Canal ${c.nombre}`}>
      <header class="cabeza" part="cabeza">
        <iswc-button class="volver" variant="plain" color="neutral" title="Volver a la lista" oniswc-click=${() => emitir(host, 'av-conversacion-volver')}><iswc-icon icon="mdi:chevron-left"></iswc-icon></iswc-button>
        <iswc-icon class="icono" icon=${ICONO_CANAL[c.tipo] ?? 'mdi:pound'}></iswc-icon>
        <div class="titulo"><strong>${c.nombre}</strong>${c.descripcion ? html`<span class="descripcion">${c.descripcion}</span>` : null}</div>
        <iswc-tag color="neutral" class="tipo">${c.tipo}</iswc-tag>
        <iswc-button class="refrescar" variant="plain" color="neutral" title="Actualizar" ?loading=${props.cargando} oniswc-click=${() => emitir(host, 'av-conversacion-refrescar')}><iswc-icon icon="mdi:refresh"></iswc-icon></iswc-button>
      </header>
      <div class="mensajes" part="mensajes" id="mensajes">
        ${props.mensajes.length === 0
          ? html`<av-vacio id="vacio" class="vacio"></av-vacio>`
          : grupos.map((g) => html`
            <div class="dia" data-dia=${g.dia}>
              <div class="separador"><iswc-tag color="neutral" pill>${g.rotulo}</iswc-tag></div>
              ${g.mensajes.map((m) => {
                const el = document.createElement('av-mensaje') as ConProps;
                el.props = { mensaje: m, propio: esPropio(m, props.yo) };
                return el;
              })}
            </div>
          `)}
      </div>
      <av-redactor id="redactor" class="redactor"></av-redactor>
    </section>
  `);
  const vacio = root.querySelector('#vacio') as ConProps | null;
  if (vacio) vacio.props = props.cargando ? { estado: 'cargando' } : { icono: 'mdi:message-text-outline', titulo: 'Sin mensajes', texto: 'Sé quien empieza la conversación.' };
  (root.querySelector('#redactor') as ConProps).props = { deshabilitado: !props.puedeEscribir, enviando: props.enviando };
  const caja = root.querySelector('#mensajes');
  if (caja) requestAnimationFrame(() => caja.scrollTo({ top: caja.scrollHeight }));
});

define('av-conversacion', AvConversacion);
