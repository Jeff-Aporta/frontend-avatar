// crm.test.ts — dominio de la vista `crm` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-CRM-02   totales por etapa en orden del embudo, con 0 donde no hay clientes
//   W-CRM-03   filtro por etapa (null = todos)
//   W-CRM-04   pipeline = todo menos lo perdido
//   W-CRM-01   columnas y filas del grid
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const c = await import('../../dist/cdn/view/crm/utils/crm.js');

const CLIENTES = [
  { icliente: 1, iempresa: 1, nombre: 'A', etapa: 'contacto', valor: 100 },
  { icliente: 2, iempresa: 1, nombre: 'B', etapa: 'contacto', valor: 50 },
  { icliente: 3, iempresa: 1, nombre: 'C', etapa: 'perdido', valor: 1000 },
  { icliente: 4, iempresa: 1, nombre: 'D', etapa: 'cerrado', valor: null },
];

export default definirPruebas([
  {
    nombre: 'crm W-CRM-02 totales por etapa en orden y con ceros',
    categoria: 'what',
    correr({ eq }) {
      const t = c.totalesPorEtapa(CLIENTES);
      eq('etapas', t.map((x: { etapa: string }) => x.etapa), ['contacto', 'propuesta', 'negociacion', 'cerrado', 'perdido']);
      eq('cantidades', t.map((x: { cantidad: number }) => x.cantidad), [2, 0, 0, 1, 1]);
      eq('valores', t.map((x: { valor: number }) => x.valor), [150, 0, 0, 0, 1000]);
    },
  },
  {
    nombre: 'crm W-CRM-03 filtro por etapa',
    categoria: 'what',
    correr({ eq }) {
      eq('contacto', c.filtrarPorEtapa(CLIENTES, 'contacto').map((x: { icliente: number }) => x.icliente), [1, 2]);
      eq('sin filtro', c.filtrarPorEtapa(CLIENTES, null).length, 4);
    },
  },
  {
    nombre: 'crm W-CRM-04 pipeline sin lo perdido',
    categoria: 'what',
    correr({ eq }) {
      eq('pipeline', c.valorPipeline(CLIENTES), 150);
    },
  },
  {
    nombre: 'crm W-CRM-01 columnas y filas del grid',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('campos', c.columnasClientes().map((x: { field: string }) => x.field), ['nombre', 'organizacion', 'email', 'telefono', 'etapa', 'valor', 'responsable']);
      const filas = c.filasClientes(CLIENTES);
      eq('etapa legible', filas[0].etapa, 'Contacto');
      expect('id = icliente', filas.every((f: { id: number; icliente: number }) => f.id === f.icliente));
      eq('valor nulo → 0', filas[3].valor, 0);
    },
  },
  {
    nombre: 'crm W-CRM-02 color por etapa',
    categoria: 'how',
    correr({ eq }) {
      eq('colores', ['contacto', 'propuesta', 'negociacion', 'cerrado', 'perdido'].map((e) => c.colorEtapa(e)), ['neutral', 'brand', 'warning', 'success', 'danger']);
    },
  },
]);
