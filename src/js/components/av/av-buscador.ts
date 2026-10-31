/**
 * <av-buscador> — búsqueda global del área privada (Ctrl+K o el botón de la barra). Compone `<iswc-command-palette>`
 * del kit con los comandos de `consts/comandos.ts` (módulos + acciones) y les da un orden POR SIGNIFICADO: los vectores
 * de los comandos vienen horneados (`assets/ia/comandos.json`) y la consulta la vectoriza el API (`core/semantica.ts`);
 * sin API, el orden es léxico. También trae registros de la empresa (clientes, tareas, productos…) con `buscarIa` del
 * API. Elegir un comando navega a su vista (con su intención) o ejecuta la acción global; un registro abre su vista.
 * Emite `av-buscador-global { accion }` para lo que resuelve el shell (tema, paleta, salir).
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvBuscadorProps } from '../../consts/schemas/componentes.schemas.js';
import { type Comando, COMANDOS, textoDe } from '../../consts/comandos.js';
import { dominio } from '../../core/api.js';
import { empresaActiva } from '../../core/estado.js';
import { ir } from '../../core/router.js';
import { buscar, cargarCorpus, type Corpus } from '../../core/semantica.js';

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

type Paleta = HTMLElement & { open(): void; close(): void; commands: Comando[]; ranker?: (q: string, c: Comando[]) => Promise<Comando[]> };

const AvBuscador = crearComponente<AvBuscadorProps>(import.meta.url, 'av-buscador', { permitidos: [] }, (root, props, host) => {
  const visibles = props.permitidos.length ? COMANDOS.filter((c) => !c.vista || props.permitidos.includes(c.vista)) : COMANDOS;
  let corpus: Corpus<Comando> | null = null;
  const elegir = (e: Event) => {
    const { id } = (e as CustomEvent<{ id: string }>).detail;
    if (id.startsWith('ent:')) {
      const [, entidad = '', registro = ''] = id.split(':');
      const e = ENTIDADES[entidad];
      if (e) ir(e.vista, e.porId ? registro : null, e.porId ? undefined : `ver-${entidad}:${registro}`);
      return;
    }
    const c = visibles.find((x) => x.id === id);
    if (!c) return;
    if (c.global) return emitir(host, 'av-buscador-global', { accion: c.global });
    if (c.vista) ir(c.vista, null, c.intencion);
  };
  const frag = html`
    <iswc-button class="abrir" part="abrir" variant="outlined" color="neutral" aria-label="Buscar en Avatar (Ctrl+K)" oniswc-click=${() => (root.querySelector('iswc-command-palette') as Paleta).open()}>
      <iswc-icon slot="start" icon="mdi:magnify"></iswc-icon><span class="texto">Buscar…</span><kbd>Ctrl K</kbd>
    </iswc-button>
    <iswc-command-palette placeholder="Busca un módulo o una acción: «cobrar a un cliente», «pedir vacaciones»…" max-results="10" empty-text="Nada coincide. Prueba con otras palabras." oniswc-select=${elegir}></iswc-command-palette>
  `;
  const paleta = frag.querySelector('iswc-command-palette') as Paleta;
  // Los comandos van en el <script type="application/json"> que lee el kit al conectarse (texto plano: sin escapar como HTML).
  const datos = document.createElement('script');
  datos.type = 'application/json';
  datos.textContent = JSON.stringify(visibles.map(({ id, title, group, icon, hint, keywords }) => ({ id, title, group, icon, hint, keywords })));
  paleta.append(datos);
  root.append(frag);
  // Orden por significado (el kit usa `ranker` si existe; con un pin anterior sigue su orden léxico).
  // Además de comandos, registros de la empresa (clientes, tareas, productos…) por significado desde el API.
  const registros = async (q: string): Promise<Comando[]> => {
    const iempresa = empresaActiva();
    if (q.trim().length < 3 || !iempresa) return [];
    try {
      const entidades = Object.keys(ENTIDADES).filter((k) => !props.permitidos.length || props.permitidos.includes(ENTIDADES[k]!.vista));
      const r = (await dominio()['buscarIa']!({ q, entidades, iempresa, limite: 6, modo: 'auto' })) as { resultados: Hallazgo[] };
      return r.resultados.filter((h) => ENTIDADES[h.entidad]).map((h) => {
        const e = ENTIDADES[h.entidad]!;
        return { id: `ent:${h.entidad}:${h.id}`, title: h.titulo, group: 'En tu empresa', icon: e.icon, hint: [e.nombre, h.detalle].filter(Boolean).join(' · '), keywords: [] };
      });
    } catch {
      return [];
    }
  };
  paleta.ranker = async (q: string) => {
    corpus ??= await cargarCorpus<Comando>('comandos', document.baseURI).catch(() => null);
    const ids = new Set(visibles.map((c) => c.id));
    const [cmds, regs] = await Promise.all([
      corpus ? buscar(corpus, q, 8).then((rs) => rs.map((r) => r.item).filter((c) => ids.has(c.id))) : Promise.resolve(visibles.filter((c) => textoDe(c).toLowerCase().includes(q.toLowerCase()))),
      registros(q),
    ]);
    return [...cmds, ...regs];
  };
});

define('av-buscador', AvBuscador);
