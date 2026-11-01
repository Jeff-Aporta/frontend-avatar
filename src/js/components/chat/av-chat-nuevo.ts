/**
 * <av-chat-nuevo> — «Nuevo chat» (W-CHAT-05): diálogo con buscador de personas de la empresa; elegir una abre (o crea)
 * el directo. Acceso directo a «Nuevo grupo». Emite `av-chat-directo { iusuario }`, `av-chat-panel { panel: 'grupo' }`
 * y `av-chat-panel-cerrar { panel: 'nuevo' }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatNuevoProps, PersonaVista } from '../../consts/schemas/chat.schemas.js';
import { iniciales, normalizar } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; focus(): void };

/** Fila de persona (también la usa el formulario de grupo). */
export function filaPersona(pe: PersonaVista, extra: Node | null = null) {
  return html`
    <span class="foto" data-color=${String(pe.color)}><iswc-avatar initials=${iniciales(pe.nombre)} image=${pe.foto ?? ''} label=${pe.nombre}></iswc-avatar>${pe.enLinea ? html`<span class="presencia"></span>` : null}</span>
    <span class="datos"><strong>${pe.nombre}</strong><span>${pe.detalle}</span></span>
    ${extra}`;
}

function montar(root: ShadowRoot, inicial: AvChatNuevoProps, host: HTMLElement) {
  const t = textos();
  let p = inicial;
  root.append(html`
    <iswc-dialog class="dialogo" label=${t.nuevoChat} backdrop-variant="basic">
      <div class="contenido">
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarPersonas} aria-label=${t.buscarPersonas}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <iswc-button class="fila grupo" variant="row" color="neutral"><span class="foto icono"><iswc-icon icon="mdi:account-multiple-plus"></iswc-icon></span><span class="datos"><strong>${t.nuevoGrupo}</strong></span></iswc-button>
        <div class="personas" role="list"></div>
      </div>
    </iswc-dialog>
  `);
  const dialogo = root.querySelector('.dialogo') as Dialogo;
  const q = root.querySelector('.q') as Campo;
  const lista = root.querySelector('.personas') as HTMLElement;
  const pintar = () => {
    const f = normalizar((q.value ?? '').trim());
    const visibles = p.personas.filter((x) => !f || normalizar(`${x.nombre} ${x.detalle}`).includes(f));
    lista.replaceChildren(...visibles.map((pe) => {
      const b = document.createElement('iswc-button');
      b.className = 'fila';
      b.setAttribute('variant', 'row');
      b.setAttribute('color', 'neutral');
      b.setAttribute('role', 'listitem');
      b.append(filaPersona(pe));
      b.addEventListener('click', () => emitir(host, 'av-chat-directo', { iusuario: pe.id }));
      return b;
    }));
    if (!visibles.length) lista.append(Object.assign(document.createElement('p'), { className: 'vacio', textContent: t.sinResultados }));
  };
  q.addEventListener('iswc-input', pintar);
  root.querySelector('.grupo')?.addEventListener('click', () => emitir(host, 'av-chat-panel', { panel: 'grupo' }));
  dialogo.addEventListener('iswc-hide', () => emitir(host, 'av-chat-panel-cerrar', { panel: 'nuevo' }));
  const aplicar = (sig: AvChatNuevoProps, previo: AvChatNuevoProps | null) => {
    p = sig;
    if (!previo || JSON.stringify(previo.personas) !== JSON.stringify(sig.personas)) pintar();
    if (sig.abierto !== dialogo.open) dialogo.open = sig.abierto;
    if (sig.abierto && !previo?.abierto) {
      q.value = '';
      pintar();
      requestAnimationFrame(() => q.focus());
    }
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatNuevo = crearComponente<AvChatNuevoProps>(
  import.meta.url,
  'av-chat-nuevo',
  { abierto: false, personas: [] },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatNuevoProps, q: AvChatNuevoProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-nuevo', AvChatNuevo);
