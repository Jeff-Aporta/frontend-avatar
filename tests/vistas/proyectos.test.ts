// proyectos.test.ts — dominio de la vista `proyectos` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-PRY-03   color por prioridad y tarea vencida
//   W-PRY-04   orden de tarjetas en una columna
//   W-PRY-08   columnas por defecto de un proyecto nuevo
//   W-PRY-06   etiquetas separadas por comas; columna inicial de una tarea nueva
//   W-PRY-05   posición de una tarjeta tras moverla
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const t = await import('../../dist/cdn/view/proyectos/utils/tareas.js');

export default definirPruebas([
  {
    nombre: 'proyectos W-PRY-03 color por prioridad',
    categoria: 'what',
    correr({ eq }) {
      eq('colores', ['urgente', 'alta', 'media', 'baja', 'otra'].map((p) => t.colorPrioridad(p)), ['danger', 'warning', 'brand', 'neutral', 'brand']);
    },
  },
  {
    nombre: 'proyectos W-PRY-03 vencida solo si la fecha pasó y no está cerrada',
    categoria: 'what',
    correr({ expect }) {
      expect('pasada y abierta', t.estaVencida({ fvence: '2026-01-01', estado: 'abierta' }, '2026-10-30'));
      expect('pasada pero cerrada', !t.estaVencida({ fvence: '2026-01-01', estado: 'cerrada' }, '2026-10-30'));
      expect('hoy no vence', !t.estaVencida({ fvence: '2026-10-30', estado: 'abierta' }, '2026-10-30'));
      expect('sin fecha', !t.estaVencida({ fvence: null, estado: 'abierta' }, '2026-10-30'));
    },
  },
  {
    nombre: 'proyectos W-PRY-04 tarjetas por orden y luego por urgencia',
    categoria: 'what',
    correr({ eq }) {
      const r = t.ordenarTareas([
        { id: 'a', orden: 1, prioridad: 'baja' },
        { id: 'b', orden: 0, prioridad: 'media' },
        { id: 'c', orden: 1, prioridad: 'urgente' },
      ]);
      eq('orden', r.map((x: { id: string }) => x.id), ['b', 'c', 'a']);
    },
  },
  {
    nombre: 'proyectos W-PRY-08 un proyecto nace con cuatro columnas y la última cierra',
    categoria: 'what',
    correr({ eq, expect }) {
      const cols = t.columnasPorDefecto(7);
      eq('nombres', cols.map((c: { nombre: string }) => c.nombre), ['Por hacer', 'En progreso', 'En revisión', 'Hecho']);
      expect('solo Hecho cierra', cols.filter((c: { cierra: boolean }) => c.cierra).length === 1 && cols[3]!.cierra);
      expect('del proyecto', cols.every((c: { iproyecto: number }) => c.iproyecto === 7));
    },
  },
  {
    nombre: 'proyectos W-PRY-06 etiquetas y columna inicial',
    categoria: 'what',
    correr({ eq }) {
      eq('etiquetas', t.parsearEtiquetas(' odys, api ,, odys '), ['odys', 'api']);
      eq('desde json', t.etiquetasDe(['a', 'b']), ['a', 'b']);
      eq('columna inicial', t.columnaInicial([{ icolumna: 9, nombre: 'Hecho', cierra: true }, { icolumna: 3, nombre: 'Por hacer', cierra: false }]), 3);
      eq('sin columnas', t.columnaInicial([]), null);
    },
  },
  {
    nombre: 'proyectos W-PRY-05 la posición tras mover es su índice en la columna destino',
    categoria: 'what',
    correr({ eq }) {
      eq('en medio', t.ordenEnColumna([4, 8, 2], 8), 1);
      eq('no está: al final', t.ordenEnColumna([4, 2], 8), 2);
    },
  },
]);
