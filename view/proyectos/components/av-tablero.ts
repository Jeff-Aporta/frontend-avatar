/**
 * <av-tablero> — tablero kanban (`iswc-kanban`) de un proyecto: una columna por columna del tablero y una tarjeta por
 * tarea (código, título, prioridad, vencimiento, asignado). Arrastrar una tarjeta emite `av-tarea-mover
 * { itarea, icolumna, orden }`; clic en una tarjeta emite `av-tarea-abrir { itarea }`; «+» en una columna emite
 * `av-tarea-nueva { icolumna }`. No habla con el API: el shell decide.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvTableroProps } from '../../../src/js/consts/schemas/proyectos.schemas.js';
import { colorPrioridad, encabezado, estaVencida, etiquetasDe, fechaCorta, ordenarTareas, ordenEnColumna, PRIORIDAD_LABEL } from '../utils/tareas.js';

const AvTablero = crearComponente<AvTableroProps>(import.meta.url, 'av-tablero', { tablero: null, cargando: false, puedeMover: false }, (root, props, host) => {
  if (props.cargando || !props.tablero) {
    root.append(props.cargando
      ? html`<iswc-empty-state estado="cargando"></iswc-empty-state>`
      : html`<iswc-empty-state icono="mdi:view-column-outline" titulo="Sin tablero" texto="Elige un proyecto para ver su tablero."></iswc-empty-state>`);
    return;
  }
  const mover = (e: Event) => {
    if (!props.puedeMover) return;
    const { card, to } = (e as CustomEvent<{ card: HTMLElement; from: HTMLElement | null; to: HTMLElement }>).detail;
    const itarea = Number(card.dataset['itarea']);
    const icolumna = Number(to.dataset['icolumna']);
    const ids = [...to.querySelectorAll<HTMLElement>(':scope > iswc-kanban-card')].map((c) => Number(c.dataset['itarea']));
    emitir(host, 'av-tarea-mover', { itarea, icolumna, orden: ordenEnColumna(ids, itarea) });
  };
  const abrir = (e: Event) => {
    const { card } = (e as CustomEvent<{ card: HTMLElement }>).detail;
    emitir(host, 'av-tarea-abrir', { itarea: Number(card.dataset['itarea']) });
  };
  root.append(html`
    <iswc-kanban class="tablero" part="tablero" oniswc-kanban-move=${mover} oniswc-kanban-card-click=${abrir}>
      ${props.tablero.columnas.map((col) => html`
        <iswc-kanban-column title=${col.nombre} accent=${col.color ?? 'var(--iswc-accent)'} data-icolumna=${String(col.icolumna)} badge=${col.limite != null ? `${col.tareas.length}/${col.limite}` : String(col.tareas.length)}>
          ${props.puedeMover ? html`<iswc-button slot="header-actions" variant="plain compact" color="neutral" class="nueva" title="Nueva tarea" oniswc-click=${() => emitir(host, 'av-tarea-nueva', { icolumna: col.icolumna })}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>` : null}
          ${ordenarTareas(col.tareas).map((t) => html`
            <iswc-kanban-card class="tarjeta" heading=${encabezado(t)} tag=${PRIORIDAD_LABEL[t.prioridad] ?? t.prioridad} tag-color=${colorPrioridad(t.prioridad)} data-itarea=${String(t.itarea)} data-vencida=${estaVencida(t) ? '1' : '0'}>
              ${t.descripcion ? html`<span class="descripcion">${t.descripcion}</span>` : null}
              ${etiquetasDe(t.etiquetas).length ? html`<span class="etiquetas">${etiquetasDe(t.etiquetas).map((e) => html`<iswc-tag color="neutral" variant="outlined">${e}</iswc-tag>`)}</span>` : null}
              <span slot="footer" class="pie">
                ${t.fvence ? html`<span class="vence" data-vencida=${estaVencida(t) ? '1' : '0'}><iswc-icon icon=${estaVencida(t) ? 'mdi:alarm' : 'mdi:calendar-outline'}></iswc-icon>${fechaCorta(t.fvence)}</span>` : html`<span></span>`}
                ${t.asignado_a ? html`<iswc-person class="asignado" compacto usuario=${t.asignado_a} nombre=${t.asignado?.nombre ?? ''}></iswc-person>` : null}
              </span>
            </iswc-kanban-card>
          `)}
        </iswc-kanban-column>
      `)}
    </iswc-kanban>
  `);
});

define('av-tablero', AvTablero);
