/**
 * <av-canal-lista> — columna de canales: cada fila con ícono por tipo, nombre, último mensaje y badge de no leídos.
 * Emite `av-canal-elegido { icanal }` al pulsar una fila y `av-canal-nuevo` con el botón «Nuevo» (si `puedeCrear`).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCanalListaProps } from '../../../src/js/consts/schemas/canales.schemas.js';
import { ICONO_CANAL, ordenarCanales } from '../utils/chat.js';

const AvCanalLista = crearComponente<AvCanalListaProps>(import.meta.url, 'av-canal-lista', { canales: [], activo: null, cargando: false, puedeCrear: false }, (root, props, host) => {
  const lista = ordenarCanales(props.canales);
  root.append(html`
    <nav class="lista" part="lista" aria-label="Canales">
      <header class="cabeza">
        <strong>Canales</strong>
        ${props.puedeCrear ? html`<iswc-button class="nuevo" variant="plain" color="brand" oniswc-click=${() => emitir(host, 'av-canal-nuevo')}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nuevo</iswc-button>` : null}
      </header>
      ${props.cargando && lista.length === 0
        ? html`<div class="esqueletos">${[1, 2, 3].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`
        : lista.length === 0
        ? html`<av-vacio id="vacio"></av-vacio>`
        : html`<ul class="filas">
            ${lista.map((c) => html`
              <li class="fila" part="fila" data-activo=${c.icanal === props.activo ? '1' : '0'} data-icanal=${String(c.icanal)}>
                <iswc-button class="boton" variant=${c.icanal === props.activo ? 'soft' : 'plain'} color=${c.icanal === props.activo ? 'brand' : 'neutral'} oniswc-click=${() => emitir(host, 'av-canal-elegido', { icanal: c.icanal })}>
                  <iswc-icon slot="start" icon=${ICONO_CANAL[c.tipo] ?? 'mdi:pound'}></iswc-icon>
                  <span class="texto"><span class="nombre">${c.nombre}</span><span class="ultimo">${c.ultimo ? `${c.ultimo.iusuario}: ${c.ultimo.contenido}` : c.descripcion ?? ''}</span></span>
                  ${c.sin_leer > 0 ? html`<iswc-badge slot="end" color="danger" pill>${c.sin_leer}</iswc-badge>` : null}
                </iswc-button>
              </li>
            `)}
          </ul>`}
    </nav>
  `);
  const vacio = root.querySelector('#vacio') as (HTMLElement & { props: Record<string, unknown> }) | null;
  if (vacio) vacio.props = { icono: 'mdi:forum-outline', titulo: 'Sin canales', texto: props.puedeCrear ? 'Crea el primer canal de la empresa.' : 'Aún no hay canales visibles para ti.' };
});

define('av-canal-lista', AvCanalLista);
