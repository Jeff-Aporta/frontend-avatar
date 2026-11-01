// tabla.test.ts — `av-tabla` y los presets de estado, sobre lo PUBLICADO en dist/cdn.
//
//   W-TAB-01   cada tabla de negocio declara su configuración completa con el prefijo de su vista
//   W-TAB-02   la búsqueda de clientes cubre sus campos y la etiqueta de la etapa
//   W-TAB-03   el grid se nombra en un solo lugar: ningún componente de tabla lleva el tag literal
//   W-EST-01   los presets «sin empresa» y «sin permiso» salen de `consts/estados`
//   W-EST-02   ninguna vista repite a mano los presets
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const rrhh = await import('../../dist/cdn/view/rrhh/utils/rrhh.js');
const finanzas = await import('../../dist/cdn/view/finanzas/utils/finanzas.js');
const inventario = await import('../../dist/cdn/view/inventario/utils/inventario.js');
const crm = await import('../../dist/cdn/view/crm/utils/crm.js');
const estados = await import('../../dist/cdn/js/consts/estados.js');

const raiz = new URL('../../', import.meta.url);
const VISTAS = ['rrhh', 'finanzas', 'inventario', 'crm', 'correos', 'proyectos', 'canales', 'panel', 'organizacion', 'admin'];

type Config = { prefijo: string; entidad: string; idCampo: string; buscador: string; vacio: { titulo: string }; columnas: { field: string }[] };

export default definirPruebas([
  {
    nombre: 'tabla W-TAB-01 cada tabla declara su configuración con el prefijo de su vista',
    categoria: 'what',
    correr({ eq, expect }) {
      const casos: [string, string[], (e: string) => Config][] = [
        ['av-rrhh', ['empleados', 'asistencias'], rrhh.tablaRrhh],
        ['av-finanzas', ['transacciones', 'facturas'], finanzas.tablaFinanzas],
        ['av-inventario', ['productos', 'movimientos', 'pedidos', 'proveedores'], inventario.tablaInventario],
        ['av-crm', ['clientes'], () => crm.tablaClientes()],
      ];
      for (const [prefijo, entidades, config] of casos) {
        for (const entidad of entidades) {
          const c = config(entidad);
          eq(`${entidad} prefijo`, c.prefijo, prefijo);
          eq(`${entidad} entidad`, c.entidad, entidad);
          expect(`${entidad} completa`, !!c.idCampo && !!c.buscador && !!c.vacio.titulo && c.columnas.length > 0);
        }
      }
      eq('clientes por página', crm.tablaClientes().porPagina, 25);
    },
  },
  {
    nombre: 'tabla W-TAB-02 la búsqueda de clientes cubre sus campos y la etapa legible',
    categoria: 'what',
    correr({ expect }) {
      const campos = crm.camposCliente({ icliente: 1, iempresa: 1, nombre: 'Ana', organizacion: 'Tech', email: 'a@t.test', telefono: '300', etapa: 'negociacion', valor: 1, responsable: 'carla' });
      for (const v of ['Ana', 'Tech', 'a@t.test', '300', 'Negociación', 'carla']) expect(v, campos.includes(v));
    },
  },
  {
    nombre: 'tabla W-TAB-03 el grid se nombra una sola vez',
    categoria: 'how',
    async correr({ expect }) {
      const fuente = await Deno.readTextFile(new URL('src/js/components/av/av-tabla.ts', raiz));
      expect('av-tabla usa GRID_TAG', fuente.includes('GRID_TAG') && !fuente.includes('iswc-data-grid'));
      const tags = await Deno.readTextFile(new URL('src/js/kit-tags.ts', raiz));
      expect('una declaración', tags.match(/GRID_TAG = '/g)?.length === 1);
    },
  },
  {
    nombre: 'estados W-EST-01 presets compartidos',
    categoria: 'what',
    correr({ eq }) {
      eq('sin empresa', estados.sinEmpresa('su CRM'), { icono: 'mdi:domain', titulo: 'Sin empresa activa', texto: 'Elige una empresa en la barra para ver su CRM.' });
      eq('sin membresía', estados.sinMembresia('Pide acceso.').titulo, 'Aún no perteneces a una empresa');
      eq('sin permiso', estados.sinPermiso('chat', 'Pídelo.'), { icono: 'mdi:lock-outline', titulo: 'Sin permiso de chat', texto: 'Pídelo.' });
      eq('sin permiso con ícono', estados.sinPermiso('x', 'y', 'mdi:shield-lock-outline').icono, 'mdi:shield-lock-outline');
    },
  },
  {
    nombre: 'estados W-EST-02 ninguna vista repite a mano los presets',
    categoria: 'how',
    async correr({ expect }) {
      for (const v of VISTAS) {
        const fuente = await Deno.readTextFile(new URL(`view/${v}/components/av-${v}.ts`, raiz));
        expect(v, !/titulo: '(Sin empresa activa|Aún no perteneces|Sin permiso de)/.test(fuente) && fuente.includes('consts/estados.js'));
      }
    },
  },
]);
