/**
 * <av-outlet> — donde se monta la vista de la ruta: el shell queda en light DOM, con esqueleto hasta que su tag se define.
 * Otro id solo se lo pasa al shell; otra vista o `version` remontan. Una URL fuera de la tabla pinta «no encontrada».
 */
import { crearComponente, define, html } from '../../base/componente.js';
import { PAGINAS, paginaDe } from '../../consts/paginas.js';
import type { AvOutletProps } from '../../consts/schemas/componentes.schemas.js';
import { precargar, VISTA_404 } from '../../core/router.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

/** Vista → tag de su shell. */
const SHELLS: Record<string, string> = Object.fromEntries(PAGINAS.map((p) => [p.vista, p.shell]));

function montar(host: HTMLElement, p: AvOutletProps): void {
  const pie = [...host.querySelectorAll(':scope > [slot="pie"], :scope > av-perfiles-tabla')];
  host.dataset['layout'] = paginaDe(p.vista)?.layout ?? 'normal';
  if (p.vista === VISTA_404) {
    const nada = document.createElement('iswc-empty-state') as ConProps;
    nada.props = { icono: 'mdi:map-marker-question-outline', titulo: 'Página no encontrada', texto: 'Esta dirección no existe en Avatar.' };
    const volver = document.createElement('av-boton-enlace');
    volver.setAttribute('vista', 'inicio');
    volver.textContent = 'Ir al inicio';
    nada.append(volver);
    host.replaceChildren(nada, ...pie);
    return;
  }
  const tag = SHELLS[p.vista] ?? SHELLS['inicio']!;
  void precargar(p.vista);
  const shell = document.createElement(tag) as ConProps;
  if (p.vista === 'inicio') shell.props = { sesion: p.sesion };
  else if (p.id != null) shell.props = { id: p.id };
  host.replaceChildren(shell, ...pie);
  if (customElements.get(tag)) return;
  const esqueleto = document.createElement('iswc-empty-state') as ConProps;
  esqueleto.props = { estado: 'cargando' };
  esqueleto.classList.add('esqueleto');
  host.insertBefore(esqueleto, shell.nextSibling);
  void customElements.whenDefined(tag).then(() => esqueleto.remove());
}

const AvOutlet = crearComponente<AvOutletProps>(
  import.meta.url,
  'av-outlet',
  { vista: '', id: null, sesion: false, version: 0 },
  (root, props, host) => {
    root.append(html`<slot></slot><slot name="pie"></slot>`);
    if (props.vista) montar(host, props);
  },
  (_root, props, previos, host) => {
    if (props.vista === previos.vista && props.version === previos.version && props.sesion === previos.sesion) {
      if (props.id !== previos.id) (host.firstElementChild as ConProps | null)!.props = { id: props.id };
      return true;
    }
    montar(host, props);
    return true;
  },
);

define('av-outlet', AvOutlet);
