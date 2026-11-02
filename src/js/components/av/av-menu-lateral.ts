/**
 * <av-menu-lateral> — índice de módulos: `iswc-doc-index` ligado a la ruta. Elegir un módulo navega y el ítem activo sigue a la URL.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvMenuLateralProps } from '../../consts/schemas/componentes.schemas.js';
import { escuchar, ir, precargar, rutaActual } from '../../core/router.js';
import { alCambio } from '../../notificaciones/centro.js';

type Item = { id: string; title: string };
type Indice = HTMLElement & { items: unknown[]; current: string; textos: Record<string, string> };

/** Módulos con el contador de lo que tienen sin leer en el título. */
const conContadores = (items: unknown[], vistas: Record<string, number>): unknown[] => (items as Item[]).map((m) => (vistas[m.id] ? { ...m, title: `${m.title} (${vistas[m.id]})` } : m));

const AvMenuLateral = crearComponente<AvMenuLateralProps>(
  import.meta.url,
  'av-menu-lateral',
  { items: [], compacto: false },
  (root, props, host) => {
  root.append(html`<iswc-doc-index part="indice" flat placeholder="Buscar módulo…" oniswc-doc-index-select=${(e: Event) => ir((e as CustomEvent<{ id: string }>).detail.id)}></iswc-doc-index>`);
  const indice = root.querySelector('iswc-doc-index') as Indice;
  indice.textos = { placeholder: 'Buscar módulo…', sinResultados: 'Ningún módulo coincide.', resumen: '' };
  let pintado = '';
  const finContadores = alCambio((v) => {
    if (!host.isConnected && pintado) return finContadores();
    const huella = JSON.stringify(v.vistas);
    if (huella === pintado) return;
    pintado = huella;
    indice.items = conContadores(props.items, v.vistas);
  });
  indice.toggleAttribute('compact', props.compacto);
  const marcar = () => (indice.current = rutaActual().vista);
  const fin = escuchar(() => (host.isConnected ? marcar() : fin()));
  marcar();
  indice.addEventListener('pointerover', (e) => {
    const id = (e.composedPath().find((n) => n instanceof HTMLElement && n.dataset['id']) as HTMLElement | undefined)?.dataset['id'];
    if (id) void precargar(id);
  });
  },
  (root, props, previos) => {
    if (props.items !== previos.items) return false;
    root.querySelector('iswc-doc-index')?.toggleAttribute('compact', props.compacto);
    return true;
  },
);

define('av-menu-lateral', AvMenuLateral);
