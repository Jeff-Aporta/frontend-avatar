/**
 * <av-tarea-detalle> — cajón lateral (`iswc-drawer`) con la tarea completa (código, estado, prioridad, asignado,
 * vencimiento, etiquetas, descripción) y sus comentarios; caja para comentar y botones Editar / Eliminar.
 * Emite `av-tarea-comentar { itarea, contenido }`, `av-tarea-editar { itarea }`, `av-tarea-eliminar { itarea }`
 * y `av-tarea-detalle-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvTareaDetalleProps } from '../../../src/js/consts/schemas/proyectos.schemas.js';
import { colorPrioridad, ESTADO_LABEL, estaVencida, etiquetasDe, fechaCorta, PRIORIDAD_LABEL } from '../utils/tareas.js';

type CampoEl = HTMLElement & { value: string };
type DrawerEl = HTMLElement & { open: boolean };

const AvTareaDetalle = crearComponente<AvTareaDetalleProps>(
  import.meta.url,
  'av-tarea-detalle',
  { abierto: false, tarea: null, comentarios: [], puedeComentar: false, puedeEditar: false, puedeEliminar: false, ocupado: false },
  (root, props, host) => {
    const t = props.tarea;
    const cerrar = () => emitir(host, 'av-tarea-detalle-cerrar', {});
    const comentar = () => {
      const campo = root.querySelector('#comentario') as CampoEl | null;
      const contenido = (campo?.value ?? '').trim();
      if (!t || !contenido) return;
      emitir(host, 'av-tarea-comentar', { itarea: t.itarea, contenido });
      if (campo) campo.value = '';
    };
    root.append(html`
      <iswc-drawer id="cajon" placement="end" label=${t ? (t.codigo ?? `Tarea ${t.itarea}`) : 'Tarea'} ?open=${props.abierto} oniswc-hide=${cerrar}>
        ${t
          ? html`
            <article class="tarea" part="tarea">
              <iswc-heading level="2" class="titulo">${t.titulo}</iswc-heading>
              <div class="chips">
                <iswc-tag color=${t.estado === 'cerrada' ? 'success' : 'brand'}>${ESTADO_LABEL[t.estado] ?? t.estado}</iswc-tag>
                <iswc-tag color=${colorPrioridad(t.prioridad)}>${PRIORIDAD_LABEL[t.prioridad] ?? t.prioridad}</iswc-tag>
                ${t.fvence ? html`<iswc-tag color=${estaVencida(t) ? 'danger' : 'neutral'} variant="outlined"><iswc-icon slot="start" icon="mdi:calendar-outline"></iswc-icon>${fechaCorta(t.fvence)}</iswc-tag>` : null}
                ${etiquetasDe(t.etiquetas).map((e) => html`<iswc-tag color="neutral" variant="outlined">${e}</iswc-tag>`)}
              </div>
              <dl class="datos">
                <dt>Asignado</dt><dd>${t.asignado_a ? html`<iswc-person usuario=${t.asignado_a} nombre=${t.asignado?.nombre ?? ''}></iswc-person>` : 'Sin asignar'}</dd>
                <dt>Creado por</dt><dd>${t.creado_por ?? '—'}</dd>
              </dl>
              <p class="descripcion">${t.descripcion || 'Sin descripción.'}</p>
              <iswc-divider></iswc-divider>
              <iswc-heading level="3" class="subtitulo"><iswc-icon icon="mdi:comment-text-multiple-outline"></iswc-icon> Comentarios (${props.comentarios.length})</iswc-heading>
              ${props.comentarios.length === 0 ? html`<p class="vacio">Nadie ha comentado todavía.</p>` : html`<ul class="comentarios" part="comentarios">
                ${props.comentarios.map((c) => html`
                  <li class="comentario">
                    <iswc-person class="autor" usuario=${c.iusuario} nombre=${c.autor?.nombre ?? ''}></iswc-person>
                    <p class="texto">${c.contenido}</p>
                    ${c.creado ? html`<iswc-relative-time class="cuando" date=${typeof c.creado === 'string' ? c.creado : c.creado.toISOString()} format="short"></iswc-relative-time>` : null}
                  </li>
                `)}
              </ul>`}
              ${props.puedeComentar ? html`<div class="redactar"><iswc-textarea id="comentario" placeholder="Escribe un comentario…" rows="2" autosize max-rows="5"></iswc-textarea><iswc-button variant="compact" color="brand" ?loading=${props.ocupado} oniswc-click=${comentar}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Comentar</iswc-button></div>` : null}
            </article>
            ${props.puedeEditar ? html`<iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${() => emitir(host, 'av-tarea-editar', { itarea: t.itarea })}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>` : null}
            ${props.puedeEliminar ? html`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta tarea y sus comentarios?" oniswc-popconfirm-confirm=${() => emitir(host, 'av-tarea-eliminar', { itarea: t.itarea })}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>` : null}
          `
          : html`<iswc-empty-state estado="cargando"></iswc-empty-state>`}
      </iswc-drawer>
    `);
  },
  (root, props, previos) => {
    if (props.tarea !== previos.tarea || props.comentarios !== previos.comentarios) return false;
    const d = root.querySelector('#cajon') as DrawerEl | null;
    if (!d) return false;
    d.open = props.abierto;
    return props.ocupado === previos.ocupado;
  },
);

define('av-tarea-detalle', AvTareaDetalle);
