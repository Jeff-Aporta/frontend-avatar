// panel.test.ts — dominio del dashboard (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-PAN-02   seis KPIs en orden a partir del resumen; vencidas en rojo solo si hay
//   W-PAN-03   series de la dona (por estado) y del embudo (por etapa, con ceros)
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { kpis, serieTareas, serieEmbudo, moneda } = await import('../../dist/cdn/view/panel/utils/panel.js');

const resumen = {
  iempresa: 1, nombre: 'Demo', miembros: 4, equipos: 2, canales: 3, proyectos: 1,
  tareas: { total: 6, abiertas: 2, en_progreso: 2, en_revision: 1, cerradas: 1, vencidas: 0 },
  clientes: { total: 4, por_etapa: { contacto: 1, propuesta: 1, negociacion: 1, cerrado: 1 }, valor_pipeline: 20100 },
  mensajes_hoy: 5,
};

export default definirPruebas([
  {
    nombre: 'panel W-PAN-02 seis KPIs en orden y color por situación',
    categoria: 'what',
    correr({ eq }) {
      const k = kpis(resumen);
      eq('ids', k.map((x: { id: string }) => x.id), ['miembros', 'canales', 'proyectos', 'pendientes', 'vencidas', 'pipeline']);
      eq('pendientes = total − cerradas', k[3]!.value, '5');
      eq('sin vencidas → success', k[4]!.color, 'success');
      eq('con vencidas → danger', kpis({ ...resumen, tareas: { ...resumen.tareas, vencidas: 2 } })[4]!.color, 'danger');
      eq('pipeline en COP', k[5]!.value, moneda(20100));
    },
  },
  {
    nombre: 'panel W-PAN-03 series de tareas por estado y del embudo por etapa',
    categoria: 'what',
    correr({ eq }) {
      eq('dona', serieTareas(resumen.tareas), { labels: ['Abiertas', 'En progreso', 'En revisión', 'Cerradas'], data: [2, 2, 1, 1] });
      eq('embudo con ceros', serieEmbudo(resumen.clientes).data, [1, 1, 1, 1, 0]);
    },
  },
]);
