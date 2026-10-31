/**
 * <av-solicitudes> — solicitudes de vacaciones, permisos y certificados como tarjetas: empleado, tipo, rango de fechas
 * y días, motivo, estado y quién la resolvió. Filtro por estado con conteos (oculto en modo `compacto`, que muestra
 * solo pendientes). Con `avatar.rrhh`, Aprobar y Rechazar (con confirmación). Emite `av-solicitudes-filtro { filtro }`
 * y `av-solicitud-resolver { isolicitud, accion: 'aprobar' | 'rechazar' }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvSolicitudesProps } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { fechaISO, iniciales } from '../../../src/js/core/datos.js';
import { colorDe, conteoSolicitudes, diasSolicitud, ETIQUETA, filtrarSolicitudes, ICONO } from '../utils/rrhh.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const FILTROS = ['pendiente', 'aprobada', 'rechazada', 'todas'] as const;

const AvSolicitudes = crearComponente<AvSolicitudesProps>(import.meta.url, 'av-solicitudes', { solicitudes: null, filtro: 'pendiente', puedeResolver: false, compacto: false, ocupados: [] }, (root, props, host) => {
  const todas = props.solicitudes;
  if (!todas) {
    root.append(html`<div class="lista" aria-busy="true">${[1, 2].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);
    return;
  }
  const filtro = props.compacto ? 'pendiente' : props.filtro;
  const conteo = conteoSolicitudes(todas);
  const visibles = filtrarSolicitudes(todas, filtro);
  root.append(html`
    <section class="solicitudes" part="solicitudes">
      ${props.compacto ? null : html`
        <div class="filtros" part="filtros" role="group" aria-label="Filtrar solicitudes">
          ${FILTROS.map((f) => html`<iswc-button size="small" variant=${filtro === f ? 'soft' : 'plain'} color=${filtro === f ? 'brand' : 'neutral'} aria-pressed=${filtro === f ? 'true' : 'false'} oniswc-click=${() => emitir(host, 'av-solicitudes-filtro', { filtro: f })}>${f === 'todas' ? 'Todas' : `${ETIQUETA[f]}s`}<iswc-badge slot="end" color=${f === 'pendiente' && conteo[f] ? 'warning' : 'neutral'} pill>${conteo[f] ?? 0}</iswc-badge></iswc-button>`)}
        </div>`}
      <div class="lista" part="lista">
        ${visibles.length ? visibles.map((s) => {
          const ocupado = props.ocupados.includes(s.isolicitud);
          const desde = fechaISO(s.desde);
          const hasta = fechaISO(s.hasta);
          const dias = diasSolicitud(s);
          return html`
            <article class="solicitud" part="solicitud" data-estado=${s.estado} aria-busy=${ocupado ? 'true' : 'false'}>
              <div class="icono"><iswc-icon icon=${ICONO[s.tipo] ?? 'mdi:file-document-outline'}></iswc-icon></div>
              <div class="cuerpo">
                <div class="linea">
                  <iswc-avatar class="avatar" initials=${iniciales(s.empleado)} label=${s.empleado}></iswc-avatar>
                  <strong class="empleado">${s.empleado}</strong>
                  <iswc-tag color=${colorDe(s.estado)} pill>${ETIQUETA[s.estado] ?? s.estado}</iswc-tag>
                </div>
                <div class="detalle">
                  <span class="tipo">${ETIQUETA[s.tipo] ?? s.tipo}</span>
                  ${desde ? html`<span><iswc-icon icon="mdi:calendar-range"></iswc-icon>${desde === hasta || !hasta ? desde : `${desde} → ${hasta}`}${s.tipo !== 'certificado' ? ` · ${dias} día${dias === 1 ? '' : 's'}` : ''}</span>` : null}
                </div>
                ${s.motivo ? html`<p class="motivo">${s.motivo}</p>` : null}
                ${s.estado !== 'pendiente' && (s.resuelto_por || s.comentario) ? html`<p class="resolucion">${s.resuelto_por ? `Resuelta por ${s.resuelto_por}` : ''}${s.comentario ? ` · «${s.comentario}»` : ''}</p>` : null}
              </div>
              ${s.estado === 'pendiente' && props.puedeResolver ? html`
                <div class="acciones">
                  <iswc-button size="small" color="success" ?disabled=${ocupado} oniswc-click=${() => emitir(host, 'av-solicitud-resolver', { isolicitud: s.isolicitud, accion: 'aprobar' })}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Aprobar</iswc-button>
                  <iswc-button size="small" variant="outlined" color="danger" id=${`rechazar-${s.isolicitud}`} ?disabled=${ocupado}><iswc-icon slot="start" icon="mdi:close"></iswc-icon>Rechazar</iswc-button>
                  <iswc-popconfirm for=${`rechazar-${s.isolicitud}`} message=${`¿Rechazar la solicitud de ${s.empleado}?`} oniswc-popconfirm-confirm=${() => emitir(host, 'av-solicitud-resolver', { isolicitud: s.isolicitud, accion: 'rechazar' })}><iswc-button slot="confirm" color="danger">Sí, rechazar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>
                </div>` : null}
            </article>`;
        }) : html`<av-vacio class="vacio"></av-vacio>`}
      </div>
    </section>
  `);
  const vacio = root.querySelector('.vacio') as ConProps | null;
  if (vacio) vacio.props = filtro === 'pendiente' ? { icono: 'mdi:inbox-outline', titulo: 'Nada pendiente', texto: 'No hay solicitudes esperando aprobación.' } : { icono: 'mdi:file-search-outline', titulo: 'Sin solicitudes', texto: 'No hay solicitudes con este filtro.' };
});

define('av-solicitudes', AvSolicitudes);
