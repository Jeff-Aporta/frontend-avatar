/**
 * rrhh.ts — dominio de la vista `rrhh` (sin DOM): indicadores, series de las gráficas (asistencia de hoy y plantilla
 * por departamento), filas del control de asistencia de un día, columnas y filas de empleados y asistencias,
 * solicitudes con nombre, conteos y filtros, días de una solicitud y campos de búsqueda.
 */
import type { ColumnaGrilla, Fila } from '../../../src/js/base/grilla.js';
import type { Indicador } from '../../../src/js/consts/schemas/componentes.schemas.js';
import type { Asistencia, Empleado, FilaAsistencia, ResumenRrhh, Solicitud, SolicitudVista } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { celdaTag, diasEntre, fechaISO, formatoMoneda, formatoNumero } from '../../../src/js/core/datos.js';

/** Etiquetas legibles. */
export const ETIQUETA: Record<string, string> = {
  activo: 'Activo', vacaciones: 'Vacaciones', licencia: 'Licencia', retirado: 'Retirado',
  presente: 'Presente', ausente: 'Ausente', retardo: 'Retardo', sin_marcar: 'Sin marcar',
  permiso: 'Permiso', certificado: 'Certificado',
  pendiente: 'Pendiente', aprobada: 'Aprobada', rechazada: 'Rechazada',
};

/** Ícono por estado de asistencia y tipo de solicitud. */
export const ICONO: Record<string, string> = {
  presente: 'mdi:account-check-outline', retardo: 'mdi:clock-alert-outline', ausente: 'mdi:account-cancel-outline', vacaciones: 'mdi:beach',
  permiso: 'mdi:calendar-clock', certificado: 'mdi:certificate-outline',
};

/** Color del kit por estado. */
export function colorDe(clave: string | null): 'neutral' | 'brand' | 'success' | 'warning' | 'danger' {
  if (clave === 'presente' || clave === 'activo' || clave === 'aprobada') return 'success';
  if (clave === 'retardo' || clave === 'pendiente' || clave === 'licencia') return 'warning';
  if (clave === 'ausente' || clave === 'rechazada' || clave === 'retirado') return 'danger';
  if (clave === 'vacaciones') return 'brand';
  return 'neutral';
}

/** KPIs de RRHH. */
export function indicadoresRrhh(r: ResumenRrhh): Indicador[] {
  const a = r.asistencia_hoy;
  return [
    { id: 'empleados', label: 'Empleados', value: formatoNumero(r.empleados), helper: Object.entries(r.por_estado).map(([k, v]) => `${v} ${(ETIQUETA[k] ?? k).toLowerCase()}`).join(' · ') || 'sin plantilla', icon: 'mdi:account-group-outline', color: 'brand', trend: '', trendDirection: '' },
    { id: 'asistencia', label: 'Asistencia hoy', value: `${a.porcentaje} %`, helper: `${a.presente + a.retardo} de ${r.empleados} · ${a.sin_marcar} sin marcar`, icon: 'mdi:calendar-check-outline', color: a.porcentaje >= 85 ? 'success' : a.porcentaje >= 60 ? 'warning' : 'danger', trend: '', trendDirection: '' },
    { id: 'solicitudes', label: 'Solicitudes pendientes', value: formatoNumero(r.solicitudes_pendientes), helper: r.solicitudes_pendientes ? 'esperan aprobación' : 'todo resuelto', icon: 'mdi:inbox-full-outline', color: r.solicitudes_pendientes ? 'warning' : 'success', trend: '', trendDirection: '' },
    { id: 'nomina', label: 'Nómina mensual', value: formatoMoneda(r.nomina_mensual), helper: 'salarios vigentes', icon: 'mdi:cash-multiple', color: 'neutral', trend: '', trendDirection: '' },
  ];
}

/** Dona de la asistencia de hoy (solo estados con valor). Null si nadie tiene registro ni pendiente. */
export function serieAsistenciaHoy(r: ResumenRrhh): { data: { labels: string[]; datasets: { label: string; data: number[] }[] } } | null {
  const pares = (['presente', 'retardo', 'ausente', 'vacaciones', 'sin_marcar'] as const).map((k) => [ETIQUETA[k]!, r.asistencia_hoy[k]] as const).filter(([, v]) => v > 0);
  if (!pares.length) return null;
  return { data: { labels: pares.map(([k]) => k), datasets: [{ label: 'Asistencia de hoy', data: pares.map(([, v]) => v) }] } };
}

/** Plantilla vigente (sin retirados) por departamento, de mayor a menor. */
export function departamentosDe(empleados: Empleado[]): { nombre: string; cantidad: number }[] {
  const m = new Map<string, number>();
  for (const e of empleados) if (e.estado !== 'retirado') m.set(e.departamento || 'Sin departamento', (m.get(e.departamento || 'Sin departamento') ?? 0) + 1);
  return [...m.entries()].map(([nombre, cantidad]) => ({ nombre, cantidad })).sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'));
}

/** Barras de plantilla por departamento. */
export function seriePorDepartamento(deps: { nombre: string; cantidad: number }[]): { data: { labels: string[]; datasets: { label: string; data: number[] }[] } } | null {
  if (!deps.length) return null;
  return { data: { labels: deps.map((d) => d.nombre), datasets: [{ label: 'Personas', data: deps.map((d) => d.cantidad) }] } };
}

/** Filas del control de asistencia de una fecha: empleados vigentes con su marca (o sin marcar). */
export function filasAsistenciaDia(empleados: Empleado[], asistencias: Asistencia[], fecha: string): FilaAsistencia[] {
  const del = new Map(asistencias.filter((a) => fechaISO(a.fecha) === fecha).map((a) => [a.iempleado, a]));
  return empleados
    .filter((e) => e.estado !== 'retirado')
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    .map((e) => {
      const a = del.get(e.iempleado);
      return { iempleado: e.iempleado, nombre: e.nombre, cargo: e.cargo ?? '', departamento: e.departamento ?? '', estadoEmpleado: e.estado, estado: a?.estado ?? null, entrada: a?.entrada ?? null, salida: a?.salida ?? null };
    });
}

/** Conteo por estado de un día (incluye `sin_marcar`). */
export function conteoDia(filas: FilaAsistencia[]): Record<string, number> {
  const c: Record<string, number> = { presente: 0, retardo: 0, ausente: 0, vacaciones: 0, sin_marcar: 0 };
  for (const f of filas) c[f.estado ?? 'sin_marcar'] = (c[f.estado ?? 'sin_marcar'] ?? 0) + 1;
  return c;
}

/** Hora local `HH:MM`. */
export function horaActual(d = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function columnasEmpleados(): ColumnaGrilla[] {
  return [
    { field: 'nombre', headerName: 'Empleado', flex: 1.3, minWidth: 180 },
    { field: 'email', headerName: 'Correo', flex: 1.2, minWidth: 180 },
    { field: 'departamento', headerName: 'Departamento', flex: 0.9, minWidth: 130 },
    { field: 'cargo', headerName: 'Cargo', flex: 1.2, minWidth: 170 },
    { field: 'estado', headerName: 'Estado', width: 120, renderCell: ({ row }) => celdaTag(String(row['estado']), colorDe(String(row['estadoClave']))) },
    { field: 'salarioTexto', headerName: 'Salario', width: 140 },
    { field: 'fingreso', headerName: 'Ingreso', width: 110 },
  ];
}

function columnasAsistencias(): ColumnaGrilla[] {
  return [
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'empleado', headerName: 'Empleado', flex: 1.3, minWidth: 180 },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: ({ row }) => celdaTag(String(row['estado']), colorDe(String(row['estadoClave']))) },
    { field: 'entrada', headerName: 'Entrada', width: 100 },
    { field: 'salida', headerName: 'Salida', width: 100 },
  ];
}

/** Columnas por entidad de la vista. */
export const columnasRrhh = (entidad: string): ColumnaGrilla[] => (entidad === 'asistencias' ? columnasAsistencias() : columnasEmpleados());

/** Filas planas de empleados. */
export function filasEmpleados(es: Empleado[]): Fila[] {
  return es.map((e) => ({ id: e.iempleado, iempleado: e.iempleado, nombre: e.nombre, email: e.email ?? '', departamento: e.departamento ?? '', cargo: e.cargo ?? '', estado: ETIQUETA[e.estado] ?? e.estado, estadoClave: e.estado, salario: Number(e.salario ?? 0), salarioTexto: formatoMoneda(Number(e.salario ?? 0)), fingreso: fechaISO(e.fingreso) }));
}

/** Filas planas del historial de asistencias (id compuesto empleado-fecha). */
export function filasAsistencias(as: Asistencia[], empleados: Empleado[]): Fila[] {
  const nombres = new Map(empleados.map((e) => [e.iempleado, e.nombre]));
  return as.map((a) => ({ id: `${a.iempleado}-${fechaISO(a.fecha)}`, clave: `${a.iempleado}-${fechaISO(a.fecha)}`, iempleado: a.iempleado, fecha: fechaISO(a.fecha), empleado: nombres.get(a.iempleado) ?? `#${a.iempleado}`, estado: ETIQUETA[a.estado] ?? a.estado, estadoClave: a.estado, entrada: a.entrada ?? '', salida: a.salida ?? '' }));
}

/** Campos de búsqueda. */
export const camposEmpleado = (e: Empleado): unknown[] => [e.nombre, e.email, e.departamento, e.cargo, e.estado, ETIQUETA[e.estado], e.iusuario];
export const camposAsistencia = (a: Asistencia, empleados: Empleado[]): unknown[] => [empleados.find((e) => e.iempleado === a.iempleado)?.nombre, a.estado, ETIQUETA[a.estado], fechaISO(a.fecha)];

/** Solicitudes con el nombre del empleado, pendientes primero y luego las más recientes. */
export function solicitudesVista(ss: Solicitud[], empleados: Empleado[]): SolicitudVista[] {
  const nombres = new Map(empleados.map((e) => [e.iempleado, e.nombre]));
  const orden = (s: Solicitud) => (s.estado === 'pendiente' ? 0 : 1);
  return ss
    .map((s) => ({ ...s, empleado: nombres.get(s.iempleado) ?? `Empleado #${s.iempleado}` }))
    .sort((a, b) => orden(a) - orden(b) || String(b.creado ?? '').localeCompare(String(a.creado ?? '')));
}

/** Conteo de solicitudes por estado (y `todas`). */
export function conteoSolicitudes(ss: Solicitud[]): Record<string, number> {
  const c: Record<string, number> = { todas: ss.length, pendiente: 0, aprobada: 0, rechazada: 0 };
  for (const s of ss) c[s.estado] = (c[s.estado] ?? 0) + 1;
  return c;
}

/** Solicitudes de un estado (`todas` = sin filtro). */
export const filtrarSolicitudes = <T extends { estado: string }>(ss: T[], filtro: string): T[] => (filtro === 'todas' ? ss : ss.filter((s) => s.estado === filtro));

/** Días calendario que cubre una solicitud (incluye ambos extremos; mínimo 1). */
export function diasSolicitud(s: Pick<Solicitud, 'desde' | 'hasta'>): number {
  const d = fechaISO(s.desde);
  const h = fechaISO(s.hasta) || d;
  if (!d) return 1;
  return Math.max(1, diasEntre(d, h) + 1);
}

/** Campos de búsqueda de una solicitud. */
export const camposSolicitud = (s: SolicitudVista): unknown[] => [s.empleado, s.tipo, ETIQUETA[s.tipo], s.estado, ETIQUETA[s.estado], s.motivo, s.comentario];

/** Configuración de cada tabla. */
export const TABLAS_RRHH: Record<string, { idCampo: string; buscador: string; vacio: { icono: string; titulo: string; texto: string } }> = {
  empleados: { idCampo: 'iempleado', buscador: 'Buscar por nombre, departamento, cargo…', vacio: { icono: 'mdi:account-group-outline', titulo: 'Sin empleados', texto: 'Registra a las personas de la empresa.' } },
  asistencias: { idCampo: 'clave', buscador: 'Buscar por empleado, estado, fecha…', vacio: { icono: 'mdi:calendar-blank-outline', titulo: 'Sin asistencias', texto: 'Las marcas de asistencia aparecen aquí.' } },
};
