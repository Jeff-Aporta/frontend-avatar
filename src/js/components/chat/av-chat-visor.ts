/**
 * <av-chat-visor> — imágenes y videos del chat a pantalla completa (W-CHAT-22) sobre `iswc-lightbox` del kit (zoom y
 * arrastre): anterior/siguiente (también con flechas), autor y fecha, descarga y cerrar (Esc).
 * Emite `av-chat-visor-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatVisorProps } from '../../consts/schemas/chat.schemas.js';
import { horaCorta, claveDia, rotuloDia } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

type Caja = HTMLElement & { show(): void; hide(): void; recenter?(): void };

function montar(root: ShadowRoot, inicial: AvChatVisorProps, host: HTMLElement) {
  const t = textos();
  let p = inicial;
  let i = inicial.indice;
  root.append(html`
    <iswc-lightbox class="caja" toolbar="default" no-default-actions>
      <div class="medio" part="medio"></div>
      <div slot="toolbar" class="barra">
        <span class="quien"><strong class="autor"></strong><span class="fecha"></span></span>
        <span class="contador"></span>
        <iswc-button class="ant" variant="plain" color="neutral" title=${t.anterior} aria-label=${t.anterior}><iswc-icon icon="mdi:chevron-left"></iswc-icon></iswc-button>
        <iswc-button class="sig" variant="plain" color="neutral" title=${t.siguiente} aria-label=${t.siguiente}><iswc-icon icon="mdi:chevron-right"></iswc-icon></iswc-button>
        <iswc-button class="bajar" variant="plain" color="neutral" title=${t.descargar} aria-label=${t.descargar}><iswc-icon icon="mdi:download"></iswc-icon></iswc-button>
        <iswc-button class="cerrar" variant="plain" color="neutral" title=${t.cerrar} aria-label=${t.cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
      </div>
    </iswc-lightbox>
  `);
  const caja = root.querySelector('.caja') as Caja;
  const medio = root.querySelector('.medio') as HTMLElement;
  const bajar = root.querySelector('.bajar') as HTMLElement;
  const mostrar = () => {
    const it = p.items[i];
    if (!it) return;
    medio.replaceChildren(it.tipo === 'video'
      ? Object.assign(document.createElement('video'), { src: it.url, controls: true, autoplay: true, playsInline: true })
      : Object.assign(document.createElement('img'), { src: it.url, alt: it.nombre }));
    (root.querySelector('.autor') as HTMLElement).textContent = it.autor;
    (root.querySelector('.fecha') as HTMLElement).textContent = it.ts ? `${rotuloDia(claveDia(it.ts), t)} · ${horaCorta(it.ts)}` : '';
    (root.querySelector('.contador') as HTMLElement).textContent = p.items.length > 1 ? `${i + 1} / ${p.items.length}` : '';
    root.querySelector('.ant')?.toggleAttribute('disabled', i <= 0);
    root.querySelector('.sig')?.toggleAttribute('disabled', i >= p.items.length - 1);
    bajar.setAttribute('href', it.url);
    bajar.setAttribute('download', it.nombre || 'archivo');
    requestAnimationFrame(() => caja.recenter?.());
  };
  const mover = (d: number) => {
    const n = Math.max(0, Math.min(p.items.length - 1, i + d));
    if (n === i) return;
    i = n;
    mostrar();
  };
  root.querySelector('.ant')?.addEventListener('iswc-click', () => mover(-1));
  root.querySelector('.sig')?.addEventListener('iswc-click', () => mover(1));
  root.querySelector('.cerrar')?.addEventListener('iswc-click', () => caja.hide());
  caja.addEventListener('iswc-after-hide', () => {
    medio.replaceChildren();
    emitir(host, 'av-chat-visor-cerrar');
  });
  caja.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
  });
  const aplicar = (sig: AvChatVisorProps, previo: AvChatVisorProps | null) => {
    p = sig;
    if (sig.abierto && (!previo?.abierto || previo.indice !== sig.indice || JSON.stringify(previo.items) !== JSON.stringify(sig.items))) {
      i = Math.max(0, Math.min(sig.items.length - 1, sig.indice));
      mostrar();
      if (!previo?.abierto) caja.show();
    } else if (!sig.abierto && previo?.abierto) caja.hide();
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatVisor = crearComponente<AvChatVisorProps>(
  import.meta.url,
  'av-chat-visor',
  { abierto: false, items: [], indice: 0 },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatVisorProps, q: AvChatVisorProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-visor', AvChatVisor);
