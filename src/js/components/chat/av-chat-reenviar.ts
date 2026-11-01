/**
 * <av-chat-reenviar> — reenviar un mensaje a uno o varios chats (W-CHAT-27): buscador, casillas y botón «Reenviar».
 * Emite `av-chat-reenviar { imensaje, chats }` y `av-chat-panel-cerrar { panel: 'reenviar' }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatReenviarProps } from '../../consts/schemas/chat.schemas.js';
import { normalizar } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; focus(): void };

function montar(root: ShadowRoot, inicial: AvChatReenviarProps, host: HTMLElement) {
  const t = textos();
  let p = inicial;
  let elegidos = new Set<string>();
  root.append(html`
    <iswc-dialog class="dialogo" label=${t.reenviarA} backdrop-variant="basic">
      <div class="contenido">
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarChats} aria-label=${t.buscarChats}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <div class="chats" role="group" aria-label=${t.chats}></div>
      </div>
      <span slot="footer" class="cuenta"></span>
      <iswc-button variant="compact" slot="footer" class="enviar" color="brand" disabled><iswc-icon slot="start" icon="mdi:share"></iswc-icon>${t.reenviar}</iswc-button>
    </iswc-dialog>
  `);
  const dialogo = root.querySelector('.dialogo') as Dialogo;
  const q = root.querySelector('.q') as Campo;
  const lista = root.querySelector('.chats') as HTMLElement;
  const enviar = root.querySelector('.enviar') as HTMLElement;
  const cuenta = root.querySelector('.cuenta') as HTMLElement;
  const refrescar = () => {
    enviar.toggleAttribute('disabled', elegidos.size === 0);
    cuenta.textContent = elegidos.size ? String(elegidos.size) : '';
  };
  const pintar = () => {
    const f = normalizar((q.value ?? '').trim());
    lista.replaceChildren(...p.chats.filter((c) => !f || normalizar(c.nombre).includes(f)).map((c) => {
      const fila = document.createElement('label');
      fila.className = 'fila';
      fila.append(html`<span class="foto" data-color=${String(c.color)}><iswc-avatar initials=${c.iniciales} image=${c.foto ?? ''} label=${c.nombre}></iswc-avatar></span><span class="nombre">${c.nombre}</span>`);
      const marca = document.createElement('iswc-checkbox');
      marca.toggleAttribute('checked', elegidos.has(c.id));
      marca.setAttribute('aria-label', c.nombre);
      marca.addEventListener('iswc-change', (e) => {
        const on = (e as CustomEvent<{ checked: boolean }>).detail?.checked ?? !elegidos.has(c.id);
        if (on) elegidos.add(c.id);
        else elegidos.delete(c.id);
        refrescar();
      });
      fila.append(marca);
      return fila;
    }));
  };
  q.addEventListener('iswc-input', pintar);
  enviar.addEventListener('iswc-click', () => {
    if (!p.ref || !elegidos.size) return;
    emitir(host, 'av-chat-reenviar', { imensaje: p.ref, chats: [...elegidos] });
  });
  dialogo.addEventListener('iswc-hide', () => emitir(host, 'av-chat-panel-cerrar', { panel: 'reenviar' }));
  const aplicar = (sig: AvChatReenviarProps, previo: AvChatReenviarProps | null) => {
    p = sig;
    if (sig.abierto && !previo?.abierto) {
      elegidos = new Set();
      q.value = '';
      requestAnimationFrame(() => q.focus());
    }
    pintar();
    refrescar();
    if (sig.abierto !== dialogo.open) dialogo.open = sig.abierto;
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatReenviar = crearComponente<AvChatReenviarProps>(
  import.meta.url,
  'av-chat-reenviar',
  { abierto: false, ref: null, chats: [] },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatReenviarProps, q: AvChatReenviarProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-reenviar', AvChatReenviar);
