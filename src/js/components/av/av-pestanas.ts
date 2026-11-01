/**
 * <av-pestanas> — liga a la URL el `iswc-tab-group` que lleva dentro: cambiar de pestaña hace `/<vista>/<pestaña>/` y la URL
 * (atrás, adelante, entrada directa) elige la pestaña. Sin id, la primera.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvPestanasProps } from '../../consts/schemas/componentes.schemas.js';
import { escuchar, ir, rutaActual } from '../../core/router.js';

type Grupo = HTMLElement & { active: string };

/** Para un shell con pestañas: un cambio solo de `id` no lo repinta (lo atiende `av-pestanas`). */
export function soloPestana<P extends object>(root: ShadowRoot, props: P, previos: P): boolean {
  const cambia = Object.keys(props).filter((k) => props[k as keyof P] !== previos[k as keyof P]);
  return cambia.length === 1 && cambia[0] === 'id' && !!root.querySelector('av-pestanas');
}

const AvPestanas = crearComponente<AvPestanasProps>(import.meta.url, 'av-pestanas', { vista: '' }, (root, props, host) => {
  const vista = props.vista || (host.getAttribute('vista') ?? '');
  root.append(html`<slot></slot>`);
  const grupo = () => host.querySelector('iswc-tab-group') as Grupo | null;
  const primera = () => host.querySelector('iswc-tab[slot="nav"]')?.getAttribute('panel') ?? null;
  const elegida = () => rutaActual().id ?? primera();
  const seguir = () => {
    const g = grupo();
    const r = rutaActual();
    if (g && r.vista === vista && r.id != null && g.active !== r.id) g.active = r.id;
    if (g && r.vista === vista && r.id == null && g.active !== primera()) g.active = primera() ?? '';
  };
  const fin = escuchar(() => (host.isConnected ? seguir() : fin()));
  host.addEventListener('iswc-tab-show', (e) => {
    const { name } = (e as CustomEvent<{ name: string }>).detail;
    if ((e.target as HTMLElement).closest('av-pestanas') === host && rutaActual().vista === vista && name !== elegida()) ir(vista, name);
  });
  queueMicrotask(seguir);
});

define('av-pestanas', AvPestanas);
