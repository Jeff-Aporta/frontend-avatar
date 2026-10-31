// correos.test.ts — dominio de la vista `correos` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-CORREO-01  indicadores del buzón
//   W-CORREO-02  carpetas en orden con total y no leídos solo en la entrada
//   W-CORREO-04  búsqueda por todas las palabras, sin tildes ni mayúsculas, también por nombre
//   W-CORREO-06  borradores de respuesta / a todos / reenvío y movimientos por carpeta
//   W-CORREO-07  etiquetas normalizadas y validación del borrador
//   W-CORREO-08  relacionados por conversación
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const u = await import('../../dist/cdn/view/correos/utils/correos.js');
const { filtrarTexto } = await import('../../dist/cdn/js/core/datos.js');
const { CorreoDatosSchema } = await import('../../dist/cdn/js/consts/schemas/correos.schemas.js');

const base = { carpeta: 'entrada', leido: true, destacado: false, cc: [], etiquetas: [], respuesta_a: null, creado: '2026-10-30T10:00:00.000Z' };
const C1 = { ...base, ibuzon: 1, icorreo: 10, remitente: 'carla', destinatarios: ['ana', 'beto'], cc: ['dario'], asunto: 'Propuesta Global Finance', cuerpo: 'Necesito tu visto bueno.\nGracias', etiquetas: ['crm', 'urgente'], leido: false };
const C2 = { ...base, ibuzon: 2, icorreo: 11, remitente: 'ana', destinatarios: ['carla'], asunto: 'Re: Propuesta Global Finance', cuerpo: 'Aprobada', respuesta_a: 10 };
const C3 = { ...base, ibuzon: 3, icorreo: 12, remitente: 'admin', destinatarios: ['ana'], asunto: 'Bienvenidos a DUO eMail', cuerpo: 'Correo interno' };
const NOMBRES = { carla: 'Carla Méndez', ana: 'Ana Gestora', admin: 'Administración' };

export default definirPruebas([
  {
    nombre: 'correos W-CORREO-02 carpetas en orden con total y no leídos solo en la entrada',
    categoria: 'what',
    correr({ eq }) {
      const c = u.carpetasConConteo({ iempresa: 1, carpeta: 'entrada', no_leidos: 3, por_carpeta: { entrada: 7, enviados: 2, archivados: 1 }, correos: [] });
      eq('orden', c.map((x: { carpeta: string }) => x.carpeta), ['entrada', 'enviados', 'archivados', 'papelera']);
      eq('totales', c.map((x: { total: number }) => x.total), [7, 2, 1, 0]);
      eq('no leídos', c.map((x: { noLeidos: number }) => x.noLeidos), [3, 0, 0, 0]);
      eq('sin bandeja', u.carpetasConConteo(null).map((x: { total: number }) => x.total), [0, 0, 0, 0]);
    },
  },
  {
    nombre: 'correos W-CORREO-01 indicadores del buzón',
    categoria: 'what',
    correr({ eq }) {
      const k = u.indicadoresCorreo({ iempresa: 1, no_leidos: 2, destacados: 1, entrada: 9, enviados_hoy: 4 });
      eq('ids', k.map((x: { id: string }) => x.id), ['no-leidos', 'entrada', 'destacados', 'enviados-hoy']);
      eq('valores', k.map((x: { value: string }) => x.value), ['2', '9', '1', '4']);
      eq('sin leer en alerta', k[0]!.color, 'warning');
      eq('al día en verde', u.indicadoresCorreo({ iempresa: 1, no_leidos: 0, destacados: 0, entrada: 0, enviados_hoy: 0 })[0]!.color, 'success');
    },
  },
  {
    nombre: 'correos W-CORREO-04 búsqueda por palabras, tildes, nombres y etiquetas',
    categoria: 'what',
    correr({ eq }) {
      const buscar = (t: string) => filtrarTexto([C1, C2, C3], t, (c: typeof C1) => u.camposCorreo(c, NOMBRES)).map((c: { ibuzon: number }) => c.ibuzon);
      eq('vacío = todos', buscar('  '), [1, 2, 3]);
      eq('por asunto sin mayúsculas', buscar('propuesta'), [1, 2]);
      eq('todas las palabras', buscar('propuesta aprobada'), [2]);
      eq('por nombre con tilde', buscar('mendez'), [1, 2]);
      eq('por etiqueta', buscar('URGENTE'), [1]);
      eq('sin coincidencias', buscar('factura'), []);
    },
  },
  {
    nombre: 'correos W-CORREO-06 borradores de respuesta, a todos y reenvío',
    categoria: 'what',
    correr({ eq, expect }) {
      const r = u.borradorRespuesta(C1, 'ana', NOMBRES);
      eq('al remitente', r.destinatarios, ['carla']);
      eq('Re: sin repetir', u.borradorRespuesta(C2, 'carla', NOMBRES).asunto, 'Re: Propuesta Global Finance');
      eq('respuesta_a', r.respuesta_a, 10);
      expect('cita el original', r.cuerpo.includes('> Necesito tu visto bueno.') && r.cuerpo.includes('> Gracias') && r.cuerpo.includes('Carla Méndez'));
      const t = u.borradorRespuesta(C1, 'ana', NOMBRES, true);
      eq('a todos sin mí', t.destinatarios, ['carla', 'beto']);
      eq('cc sin mí', t.cc, ['dario']);
      eq('mi propio enviado responde al destinatario', u.borradorRespuesta(C2, 'ana', NOMBRES).destinatarios, ['carla']);
      const f = u.borradorReenvio(C1, NOMBRES);
      eq('reenvío sin destinatarios', f.destinatarios, []);
      eq('Rv:', f.asunto, 'Rv: Propuesta Global Finance');
      eq('reenvío no es respuesta', f.respuesta_a, null);
    },
  },
  {
    nombre: 'correos W-CORREO-06 mover según la carpeta',
    categoria: 'what',
    correr({ eq }) {
      const destinos = (c: string) => u.movimientosDesde(c).map((m: { carpeta: string }) => m.carpeta);
      eq('entrada', destinos('entrada'), ['archivados', 'papelera']);
      eq('archivados', destinos('archivados'), ['entrada', 'papelera']);
      eq('papelera', destinos('papelera'), ['entrada']);
    },
  },
  {
    nombre: 'correos W-CORREO-07 etiquetas normalizadas y validación del borrador',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('etiquetas', u.etiquetasDe(' CRM, urgente ,, crm '), ['crm', 'urgente']);
      eq('máximo 10', u.etiquetasDe(Array.from({ length: 14 }, (_, i) => `e${i}`).join(',')).length, 10);
      expect('válido', CorreoDatosSchema.safeParse({ destinatarios: ['ana'], asunto: 'Hola', cuerpo: 'Texto' }).success);
      expect('sin destinatario', !CorreoDatosSchema.safeParse({ destinatarios: [], asunto: 'Hola', cuerpo: 'Texto' }).success);
      expect('sin asunto', !CorreoDatosSchema.safeParse({ destinatarios: ['ana'], asunto: '  ', cuerpo: 'Texto' }).success);
      expect('sin mensaje', !CorreoDatosSchema.safeParse({ destinatarios: ['ana'], asunto: 'Hola', cuerpo: '' }).success);
    },
  },
  {
    nombre: 'correos W-CORREO-08 relacionados por conversación',
    categoria: 'what',
    correr({ eq }) {
      eq('original → respuesta', u.relacionadosDe(C1, [C1, C2, C3]).map((r: { ibuzon: number }) => r.ibuzon), [2]);
      eq('respuesta → original', u.relacionadosDe(C2, [C1, C2, C3]).map((r: { ibuzon: number }) => r.ibuzon), [1]);
      eq('sin relacionados', u.relacionadosDe(C3, [C1, C2, C3]), []);
      eq('asunto base', u.asuntoBase('RE: Rv: fwd:  Hola'), 'Hola');
      eq('vista previa en una línea', u.vistaPrevia('a\n\nb   c', 50), 'a b c');
    },
  },
]);
