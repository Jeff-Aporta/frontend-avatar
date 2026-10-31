/**
 * <av-asistencia-dia> — control de asistencia de una fecha: selector de fecha, contadores por estado y una fila por
 * empleado vigente con su marca (o «sin marcar»), horas de entrada/salida y botones rápidos Presente · Retardo ·
 * Ausente · Vacaciones, más «Salida» para quien ya entró. Sin `avatar.rrhh` los botones quedan deshabilitados.
 * Emite `av-asistencia-fecha { fecha }` y `av-asistencia-marcar { iempleado, estado, fecha, entrada, salida }`.
 * Un refresco solo rehace las filas: el selector de fecha no se toca.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { type AvAsistenciaDiaProps, ESTADOS_ASISTENCIA, type FilaAsistencia } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { hoyISO, iniciales } from '../../../src/js/core/datos.js';
import { colorDe, conteoDia, ETIQUETA, horaActual, ICONO } from '../utils/rrhh.js';

type Campo = HTMLElement & { value: string };

function pintarFilas(root: ShadowRoot, props: AvAsistenciaDiaProps, host: HTMLElement): void {
  const c = conteoDia(props.filas);
  (root.querySelector('.conteo') as HTMLElement).replaceChildren(html`${['presente', 'retardo', 'ausente', 'vacaciones', 'sin_marcar'].map((k) => html`
    <span class="contador" data-estado=${k}><strong>${c[k] ?? 0}</strong><span>${ETIQUETA[k]}</span></span>`)}`);
  const lista = root.querySelector('.lista') as HTMLElement;
  if (props.cargando && !props.filas.length) {
    lista.replaceChildren(html`${[1, 2, 3].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}`);
    return;
  }
  if (!props.filas.length) {
    lista.replaceChildren(html`<iswc-callout color="brand">No hay empleados vigentes para marcar.</iswc-callout>`);
    return;
  }
  const esHoy = props.fecha === hoyISO();
  const marcar = (f: FilaAsistencia, estado: string) => () => {
    const conHora = estado === 'presente' || estado === 'retardo';
    emitir(host, 'av-asistencia-marcar', { iempleado: f.iempleado, estado, fecha: props.fecha, entrada: conHora ? (f.entrada ?? (esHoy ? horaActual() : null)) : null, salida: conHora ? f.salida : null });
  };
  const salida = (f: FilaAsistencia) => () => emitir(host, 'av-asistencia-marcar', { iempleado: f.iempleado, estado: f.estado, fecha: props.fecha, entrada: f.entrada, salida: horaActual() });
  lista.replaceChildren(html`${props.filas.map((f) => {
    const ocupado = props.ocupados.includes(f.iempleado);
    const dentro = (f.estado === 'presente' || f.estado === 'retardo') && !f.salida;
    return html`
      <div class="fila" part="fila" data-estado=${f.estado ?? 'sin_marcar'} aria-busy=${ocupado ? 'true' : 'false'}>
        <iswc-avatar class="avatar" initials=${iniciales(f.nombre)} label=${f.nombre}></iswc-avatar>
        <div class="quien">
          <span class="nombre">${f.nombre}</span>
          <span class="cargo">${[f.cargo, f.departamento].filter(Boolean).join(' · ')}</span>
        </div>
        <div class="marca">
          <iswc-tag color=${colorDe(f.estado)} pill variant=${f.estado ? 'filled-outlined' : 'outlined'}>${ETIQUETA[f.estado ?? 'sin_marcar']}</iswc-tag>
          ${f.entrada || f.salida ? html`<span class="horas"><iswc-icon icon="mdi:clock-outline"></iswc-icon>${f.entrada ?? '—'} – ${f.salida ?? '…'}</span>` : null}
        </div>
        <div class="botones" role="group" aria-label=${`Marcar a ${f.nombre}`}>
          ${ESTADOS_ASISTENCIA.map((e) => html`<iswc-button size="small" variant=${f.estado === e ? 'soft' : 'plain'} color=${f.estado === e ? colorDe(e) : 'neutral'} aria-label=${ETIQUETA[e]} title=${ETIQUETA[e]} aria-pressed=${f.estado === e ? 'true' : 'false'} ?disabled=${!props.puedeMarcar || ocupado} oniswc-click=${marcar(f, e)}><iswc-icon icon=${ICONO[e]}></iswc-icon></iswc-button>`)}
          ${dentro ? html`<iswc-button size="small" variant="outlined" color="brand" ?disabled=${!props.puedeMarcar || ocupado || !esHoy} oniswc-click=${salida(f)}><iswc-icon slot="start" icon="mdi:logout-variant"></iswc-icon>Salida</iswc-button>` : null}
        </div>
      </div>`;
  })}`);
}

const AvAsistenciaDia = crearComponente<AvAsistenciaDiaProps>(
  import.meta.url,
  'av-asistencia-dia',
  { fecha: '', filas: [], cargando: false, puedeMarcar: false, ocupados: [] },
  (root, props, host) => {
    root.append(html`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon="mdi:calendar-check-outline"></iswc-icon> Control de asistencia</strong>
        <div class="barra" part="barra">
          <iswc-input class="fecha" type="date" label="Fecha" value=${props.fecha || hoyISO()} oniswc-change=${(e: Event) => emitir(host, 'av-asistencia-fecha', { fecha: (e.target as Campo).value || hoyISO() })}></iswc-input>
          <div class="conteo" part="conteo" aria-live="polite"></div>
        </div>
        <div class="lista" part="lista"></div>
      </iswc-card>
    `);
    pintarFilas(root, props, host);
  },
  (root, props, _previos, host) => {
    if (!root.querySelector('.lista')) return false;
    pintarFilas(root, props, host);
    const f = root.querySelector('.fecha') as Campo | null;
    if (f && props.fecha && f.value !== props.fecha) f.value = props.fecha;
    return true;
  },
);

define('av-asistencia-dia', AvAsistenciaDia);
