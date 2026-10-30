// asistente.test.ts — dominio de la vista `asistente` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-AVO-01   historial (más reciente primero) → turnos cronológicos pregunta/respuesta
//   W-AVO-03   pregunta vacía o > 2000 no se envía; se recorta
//   W-AVO-06   hay sugerencias iniciales
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { turnosDe, preguntaValida, SUGERENCIAS_INICIALES, idLocal } = await import('../../dist/cdn/view/asistente/utils/avo.js');

export default definirPruebas([
  {
    nombre: 'asistente W-AVO-01 historial a turnos en orden cronológico',
    categoria: 'what',
    correr({ eq }) {
      const turnos = turnosDe([
        { iconsulta: 2, iusuario: 'beto', pregunta: 'segunda', respuesta: 'r2', creado: '2026-10-30T10:00:00Z' },
        { iconsulta: 1, iusuario: 'beto', pregunta: 'primera', respuesta: 'r1', creado: '2026-10-29T10:00:00Z' },
        { iconsulta: 3, iusuario: 'beto', pregunta: 'sin respuesta', respuesta: null },
      ]);
      eq('quién habla', turnos.map((t: { quien: string }) => t.quien), ['yo', 'avo', 'yo', 'avo', 'yo']);
      eq('textos', turnos.map((t: { texto: string }) => t.texto), ['primera', 'r1', 'segunda', 'r2', 'sin respuesta']);
    },
  },
  {
    nombre: 'asistente W-AVO-03 valida la pregunta',
    categoria: 'what',
    correr({ eq }) {
      eq('recorta', preguntaValida('  ¿cuántas tareas?  '), '¿cuántas tareas?');
      eq('vacía', preguntaValida(''), null);
      eq('demasiado larga', preguntaValida('x'.repeat(2001)), null);
    },
  },
  {
    nombre: 'asistente W-AVO-06 sugerencias iniciales e ids locales únicos',
    categoria: 'what',
    correr({ expect }) {
      expect('al menos tres sugerencias', SUGERENCIAS_INICIALES.length >= 3);
      expect('ids distintos', idLocal('p') !== idLocal('p'));
    },
  },
]);
