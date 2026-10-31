/**
 * buscador.ts — conecta `<iswc-semantic-search>` del kit con Avatar: comandos de `consts/comandos.ts` (módulos + acciones),
 * orden POR SIGNIFICADO (vectores horneados en `assets/ia/comandos.json`; la consulta la vectoriza el API, ver
 * `semantica.ts`) y registros de la empresa (clientes, tareas, productos…) con `buscarIa` del API. Sin API, el orden es
 * léxico. Elegir un comando navega a su vista (con su intención) o pide la acción global; un registro abre su vista.
 */
import { type Comando, COMANDOS, textoDe } from '../consts/comandos.js';
import { dominio } from './api.js';
import { empresaActiva } from './estado.js';
import { ir } from './router.js';
import { buscar, cargarCorpus, type Corpus } from './semantica.js';

/** Registro encontrado por el API (`buscarIa`). */
type Hallazgo = { entidad: string; id: number; titulo: string; detalle: string; score: number };
/** Entidad → vista que la muestra, ícono y si la vista abre el registro por id (si no, va como intención `ver:<id>`). */
const ENTIDADES: Record<string, { vista: string; icon: string; porId: boolean; nombre: string }> = {
  clientes: { vista: 'crm', icon: 'mdi:account-heart-outline', porId: true, nombre: 'Cliente' },
  proyectos: { vista: 'proyectos', icon: 'mdi:view-column-outline', porId: true, nombre: 'Proyecto' },
  tareas: { vista: 'proyectos', icon: 'mdi:checkbox-marked-circle-outline', porId: false, nombre: 'Tarea' },
  productos: { vista: 'inventario', icon: 'mdi:package-variant-closed', porId: false, nombre: 'Producto' },
  proveedores: { vista: 'inventario', icon: 'mdi:truck-outline', porId: false, nombre: 'Proveedor' },
  empleados: { vista: 'rrhh', icon: 'mdi:account-tie-outline', porId: false, nombre: 'Empleado' },
  correos: { vista: 'correos', icon: 'mdi:email-outline', porId: false, nombre: 'Correo' },
  facturas: { vista: 'finanzas', icon: 'mdi:file-document-outline', porId: false, nombre: 'Factura' },
};

type BuscadorEl = HTMLElement & { props: Record<string, unknown> };

/** `permitidos` limita las vistas; `global` resuelve lo que no es navegar (tema, paleta, salir). */
export function conectarBuscador(el: BuscadorEl, permitidos: readonly string[], global: (accion: string) => void): void {
  const visibles = permitidos.length ? COMANDOS.filter((c) => !c.vista || permitidos.includes(c.vista)) : COMANDOS;
  let corpus: Corpus<Comando> | null = null;

  const ranker = async (q: string): Promise<Comando[]> => {
    corpus ??= await cargarCorpus<Comando>('comandos', document.baseURI).catch(() => null);
    if (!corpus) return visibles.filter((c) => textoDe(c).toLowerCase().includes(q.toLowerCase()));
    const ids = new Set(visibles.map((c) => c.id));
    return (await buscar(corpus, q, 8)).map((r) => r.item).filter((c) => ids.has(c.id));
  };

  const registros = async (q: string): Promise<Comando[]> => {
    const iempresa = empresaActiva();
    if (q.trim().length < 3 || !iempresa) return [];
    const entidades = Object.keys(ENTIDADES).filter((k) => !permitidos.length || permitidos.includes(ENTIDADES[k]!.vista));
    const r = (await dominio()['buscarIa']!({ q, entidades, iempresa, limite: 6, modo: 'auto' })) as { resultados: Hallazgo[] };
    return r.resultados.filter((h) => ENTIDADES[h.entidad]).map((h) => {
      const e = ENTIDADES[h.entidad]!;
      return { id: `ent:${h.entidad}:${h.id}`, title: h.titulo, group: 'En tu empresa', icon: e.icon, hint: [e.nombre, h.detalle].filter(Boolean).join(' · '), keywords: [] };
    });
  };

  el.addEventListener('iswc-select', (ev) => {
    const { id } = (ev as CustomEvent<{ id: string }>).detail;
    if (id.startsWith('ent:')) {
      const [, entidad = '', registro = ''] = id.split(':');
      const e = ENTIDADES[entidad];
      if (e) ir(e.vista, e.porId ? registro : null, e.porId ? undefined : `ver-${entidad}:${registro}`);
      return;
    }
    const c = visibles.find((x) => x.id === id);
    if (c?.global) global(c.global);
    else if (c?.vista) ir(c.vista, null, c.intencion);
  });

  el.props = {
    comandos: visibles.map(({ id, title, group, icon, hint, keywords }) => ({ id, title, group, icon, hint, keywords })),
    ranker,
    buscar: registros,
    etiqueta: 'Buscar en Avatar (Ctrl+K)',
    placeholder: 'Busca un módulo o una acción: «cobrar a un cliente», «pedir vacaciones»…',
  };
}
