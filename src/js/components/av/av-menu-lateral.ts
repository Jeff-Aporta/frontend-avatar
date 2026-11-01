/**
 * <av-menu-lateral> — índice de módulos: `iswc-doc-index` ligado a la ruta. Elegir un módulo navega y el ítem activo sigue a la URL.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvMenuLateralProps } from '../../consts/schemas/componentes.schemas.js';
import { escuchar, ir, precargar, rutaActual } from '../../core/router.js';

type Indice = HTMLElement & { items: unknown[]; current: string; textos: Record<string, string> };

const AvMenuLateral = crearComponente<AvMenuLateralProps>(import.meta.url, 'av-menu-lateral', { items: [] }, (root, props, host) => {
  root.append(html`<iswc-doc-index part="indice" placeholder="Buscar módulo…" oniswc-doc-index-select=${(e: Event) => ir((e as CustomEvent<{ id: string }>).detail.id)}></iswc-doc-index>`);
  const indice = root.querySelector('iswc-doc-index') as Indice;
  indice.textos = { placeholder: 'Buscar módulo…', sinResultados: 'Ningún módulo coincide.', resumen: '' };
  indice.items = props.items;
  const marcar = () => (indice.current = rutaActual().vista);
  const fin = escuchar(() => (host.isConnected ? marcar() : fin()));
  marcar();
  indice.addEventListener('pointerover', (e) => {
    const id = (e.composedPath().find((n) => n instanceof HTMLElement && n.dataset['id']) as HTMLElement | undefined)?.dataset['id'];
    if (id) void precargar(id);
  });
});

define('av-menu-lateral', AvMenuLateral);
