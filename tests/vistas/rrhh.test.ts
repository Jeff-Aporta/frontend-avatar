// rrhh.test.ts — dominio de la vista `rrhh` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-RRHH-01  indicadores
//   W-RRHH-02  series (asistencia de hoy y departamentos)
//   W-RRHH-03  filas de empleados y búsqueda
//   W-RRHH-04  filas y conteo del control de asistencia de un día
//   W-RRHH-05  filas del historial de asistencias
//   W-RRHH-06  solicitudes con nombre, orden, filtro, conteo y días
//   W-RRHH-07  validación de solicitud
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const r = await import('../../dist/cdn/view/rrhh/utils/rrhh.js');
const { filtrarTexto } = await import('../../dist/cdn/js/core/datos.js');
const { SolicitudDatosSchema } = await import('../../dist/cdn/js/consts/schemas/rrhh.schemas.js');

const E = [
  { iempleado: 1, iempresa: 1, nombre: 'María Aguirre', email: 'maria@x.test', departamento: 'Diseño', cargo: 'Diseñadora', salario: 6500000, estado: 'activo', fingreso: '2022-03-14' },
  { iempleado: 2, iempresa: 1, nombre: 'Juan Rodríguez', email: null, departamento: 'Desarrollo', cargo: 'Full-Stack', salario: 7200000, estado: 'vacaciones', fingreso: null },
  { iempleado: 3, iempresa: 1, nombre: 'Ana Vieja', departamento: 'Desarrollo', estado: 'retirado' },
  { iempleado: 4, iempresa: 1, nombre: 'Carlos Gómez', departamento: null, estado: 'activo' },
];
const A = [
  { iempleado: 1, fecha: '2026-10-30', iempresa: 1, estado: 'presente', entrada: '08:02', salida: null },
  { iempleado: 2, fecha: '2026-10-30', iempresa: 1, estado: 'vacaciones' },
  { iempleado: 1, fecha: '2026-10-29', iempresa: 1, estado: 'retardo', entrada: '09:25', salida: '18:00' },
];
const RES = { iempresa: 1, empleados: 3, por_estado: { activo: 2, vacaciones: 1 }, asistencia_hoy: { presente: 1, ausente: 0, retardo: 1, vacaciones: 1, sin_marcar: 0, porcentaje: 67 }, solicitudes_pendientes: 2, nomina_mensual: 13700000 };

export default definirPruebas([
  {
    nombre: 'rrhh W-RRHH-01 indicadores',
    categoria: 'what',
    correr({ eq, expect }) {
      const k = r.indicadoresRrhh(RES);
      eq('ids', k.map((x: { id: string }) => x.id), ['empleados', 'asistencia', 'solicitudes', 'nomina']);
      eq('desglose por estado', k[0]!.helper, '2 activo · 1 vacaciones');
      eq('porcentaje', k[1]!.value, '67 %');
      eq('67 % en ámbar', k[1]!.color, 'warning');
      expect('nómina en COP', k[3]!.value.includes('13.700.000'), k[3]!.value);
    },
  },
  {
    nombre: 'rrhh W-RRHH-02 series de las gráficas',
    categoria: 'what',
    correr({ eq }) {
      eq('asistencia solo con valor', r.serieAsistenciaHoy(RES)!.data.labels, ['Presente', 'Retardo', 'Vacaciones']);
      eq('sin datos = null', r.serieAsistenciaHoy({ ...RES, asistencia_hoy: { presente: 0, ausente: 0, retardo: 0, vacaciones: 0, sin_marcar: 0, porcentaje: 0 } }), null);
      eq('departamentos sin retirados', r.departamentosDe(E), [{ nombre: 'Desarrollo', cantidad: 1 }, { nombre: 'Diseño', cantidad: 1 }, { nombre: 'Sin departamento', cantidad: 1 }]);
      eq('sin plantilla = null', r.seriePorDepartamento([]), null);
    },
  },
  {
    nombre: 'rrhh W-RRHH-04 control de asistencia de un día',
    categoria: 'what',
    correr({ eq }) {
      const filas = r.filasAsistenciaDia(E, A, '2026-10-30');
      eq('vigentes ordenados', filas.map((f: { nombre: string }) => f.nombre), ['Carlos Gómez', 'Juan Rodríguez', 'María Aguirre']);
      eq('marcas del día', filas.map((f: { estado: string | null }) => f.estado), [null, 'vacaciones', 'presente']);
      eq('horas', filas[2].entrada, '08:02');
      eq('conteo', r.conteoDia(filas), { presente: 1, retardo: 0, ausente: 0, vacaciones: 1, sin_marcar: 1 });
      eq('otra fecha', r.filasAsistenciaDia(E, A, '2026-10-29').map((f: { estado: string | null }) => f.estado), [null, null, 'retardo']);
      eq('hora HH:MM', r.horaActual(new Date(2026, 9, 30, 7, 5)), '07:05');
    },
  },
  {
    nombre: 'rrhh W-RRHH-03 filas de empleados y búsqueda',
    categoria: 'what',
    correr({ eq }) {
      const filas = r.filasEmpleados(E);
      eq('estado legible', filas.map((f: { estado: string }) => f.estado), ['Activo', 'Vacaciones', 'Retirado', 'Activo']);
      eq('campos', r.columnasRrhh('empleados').map((c: { field: string }) => c.field), ['nombre', 'email', 'departamento', 'cargo', 'estado', 'salarioTexto', 'fingreso']);
      eq('búsqueda sin tildes', filtrarTexto(E, 'diseno', r.camposEmpleado).map((e: { iempleado: number }) => e.iempleado), [1]);
      eq('búsqueda por estado legible', filtrarTexto(E, 'vacaciones', r.camposEmpleado).map((e: { iempleado: number }) => e.iempleado), [2]);
    },
  },
  {
    nombre: 'rrhh W-RRHH-05 historial de asistencias',
    categoria: 'what',
    correr({ eq }) {
      const filas = r.filasAsistencias(A, E);
      eq('clave empleado-fecha', filas.map((f: { clave: string }) => f.clave), ['1-2026-10-30', '2-2026-10-30', '1-2026-10-29']);
      eq('nombre', filas[0].empleado, 'María Aguirre');
      eq('estado legible', filas[2].estado, 'Retardo');
    },
  },
  {
    nombre: 'rrhh W-RRHH-06 solicitudes: nombre, orden, filtro, conteo y días',
    categoria: 'what',
    correr({ eq }) {
      const S = [
        { isolicitud: 1, iempresa: 1, iempleado: 1, tipo: 'vacaciones', desde: '2026-11-03', hasta: '2026-11-07', estado: 'aprobada', creado: '2026-10-30T10:00:00Z' },
        { isolicitud: 2, iempresa: 1, iempleado: 4, tipo: 'permiso', desde: '2026-10-30', hasta: '2026-10-30', estado: 'pendiente', creado: '2026-10-29T10:00:00Z' },
        { isolicitud: 3, iempresa: 1, iempleado: 9, tipo: 'certificado', desde: null, hasta: null, estado: 'pendiente', creado: '2026-10-30T11:00:00Z' },
      ];
      const vista = r.solicitudesVista(S, E);
      eq('pendientes primero, recientes antes', vista.map((s: { isolicitud: number }) => s.isolicitud), [3, 2, 1]);
      eq('nombre o id', vista.map((s: { empleado: string }) => s.empleado), ['Empleado #9', 'Carlos Gómez', 'María Aguirre']);
      eq('filtro', r.filtrarSolicitudes(vista, 'aprobada').map((s: { isolicitud: number }) => s.isolicitud), [1]);
      eq('todas', r.filtrarSolicitudes(vista, 'todas').length, 3);
      eq('conteo', r.conteoSolicitudes(S), { todas: 3, pendiente: 2, aprobada: 1, rechazada: 0 });
      eq('días', S.map((s) => r.diasSolicitud(s)), [5, 1, 1]);
    },
  },
  {
    nombre: 'rrhh W-RRHH-07 validación de solicitud',
    categoria: 'what',
    correr({ expect }) {
      const ok = { iempleado: 1, tipo: 'vacaciones', desde: '2026-11-03', hasta: '2026-11-07' };
      expect('válida', SolicitudDatosSchema.safeParse(ok).success);
      expect('mismo día', SolicitudDatosSchema.safeParse({ ...ok, hasta: '2026-11-03' }).success);
      expect('hasta antes de desde', !SolicitudDatosSchema.safeParse({ ...ok, hasta: '2026-11-01' }).success);
      expect('tipo fuera de lista', !SolicitudDatosSchema.safeParse({ ...ok, tipo: 'licencia' }).success);
    },
  },
]);
