/**
 * <av-chat-busqueda> — búsqueda de mensajes (W-CHAT-33): en este chat o en todos, por «Texto» (palabras) o por
 * «Significado» (semántica, la resuelve el backend). Resultados con chat, autor, fecha y el fragmento resaltado; tocar
 * uno abre el chat en ese mensaje. Emite `av-chat-buscar { q, modo, icanal }`, `av-chat-abrir { icanal, imensaje }` y
 * `av-chat-panel-cerrar { panel: 'busqueda' }`. Lo escrito y el foco se conservan al llegar resultados.
 */
import { crearComponente, define, emitir, html, raw } from '../../base/componente.js';
import type { AvChatBusquedaProps } from '../../consts/schemas/chat.schemas.js';
import { claveDia, horaCorta, rotuloDia } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

type Campo = HTMLElement & { value: string; focus(): void };

function montar(root: ShadowRoot, inicial: AvChatBusquedaProps, host: HTMLElement) {
  const t = textos();
  let p = inicial;
  let modo: 'texto' | 'semantica' = 'texto';
  let alcance: 'chat' | 'todos' = inicial.chat ? 'chat' : 'todos';
  let espera: ReturnType<typeof setTimeout> | null = null;
  root.append(html`
    <aside class="busqueda" part="busqueda" aria-label=${t.buscarMensajes}>
      <header class="cabeza">
        <iswc-button variant="plain" color="neutral" class="cerrar" title=${t.cerrar} aria-label=${t.cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
        <h3>${t.buscarMensajes}</h3>
      </header>
      <div class="controles">
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarPlaceholder} aria-label=${t.buscarMensajes}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <div class="opciones">
          <span class="grupo" role="group" aria-label="Modo">
            <iswc-button pill class="modo" data-v="texto">${t.modoTexto}</iswc-button>
            <iswc-button pill class="modo" data-v="semantica"><iswc-icon slot="start" icon="mdi:creation-outline"></iswc-icon>${t.modoSignificado}</iswc-button>
          </span>
          <span class="grupo alcance" role="group" aria-label="Alcance">
            <iswc-button pill class="alc" data-v="chat">${t.enEsteChat}</iswc-button>
            <iswc-button pill class="alc" data-v="todos">${t.enTodos}</iswc-button>
          </span>
        </div>
      </div>
      <div class="estado" role="status"></div>
      <ol class="resultados"></ol>
    </aside>
  `);
  const q = root.querySelector('.q') as Campo;
  const lista = root.querySelector('.resultados') as HTMLElement;
  const estadoEl = root.querySelector('.estado') as HTMLElement;
  const pedir = () => {
    const texto = (q.value ?? '').trim();
    emitir(host, 'av-chat-buscar', { q: texto, modo, icanal: alcance === 'chat' ? p.chat : null });
  };
  const pintarOpciones = () => {
    for (const b of root.querySelectorAll<HTMLElement>('.modo')) {
      const on = b.dataset['v'] === modo;
      b.setAttribute('variant', on ? 'soft' : 'plain');
      b.setAttribute('color', on ? 'brand' : 'neutral');
      b.setAttribute('aria-pressed', String(on));
    }
    for (const b of root.querySelectorAll<HTMLElement>('.alc')) {
      const on = b.dataset['v'] === alcance;
      b.setAttribute('variant', on ? 'soft' : 'plain');
      b.setAttribute('color', on ? 'brand' : 'neutral');
      b.setAttribute('aria-pressed', String(on));
      if (b.dataset['v'] === 'chat') b.toggleAttribute('disabled', !p.chat);
    }
  };
  q.addEventListener('iswc-input', () => {
    if (espera) clearTimeout(espera);
    espera = setTimeout(pedir, 280);
  });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') pedir();
    if (e.key === 'Escape') emitir(host, 'av-chat-panel-cerrar', { panel: 'busqueda' });
  });
  for (const b of root.querySelectorAll<HTMLElement>('.modo')) b.addEventListener('iswc-click', () => { modo = b.dataset['v'] === 'semantica' ? 'semantica' : 'texto'; pintarOpciones(); pedir(); });
  for (const b of root.querySelectorAll<HTMLElement>('.alc')) b.addEventListener('iswc-click', () => { alcance = b.dataset['v'] === 'chat' ? 'chat' : 'todos'; pintarOpciones(); pedir(); });
  root.querySelector('.cerrar')?.addEventListener('iswc-click', () => emitir(host, 'av-chat-panel-cerrar', { panel: 'busqueda' }));

  const aplicar = (sig: AvChatBusquedaProps, previo: AvChatBusquedaProps | null) => {
    p = sig;
    if (!sig.chat && alcance === 'chat') alcance = 'todos';
    if (previo && previo.chat !== sig.chat && sig.chat) alcance = 'chat';
    pintarOpciones();
    if (sig.abierto && !previo?.abierto) requestAnimationFrame(() => q.focus());
    estadoEl.textContent = sig.cargando ? t.buscando : sig.buscado && sig.resultados.length === 0 ? t.sinResultados : '';
    lista.replaceChildren(...sig.resultados.map((r) => html`
      <li><button class="resultado" type="button" data-chat=${r.chat} data-ref=${r.ref}>
        <span class="linea"><strong class="chat">${r.chatNombre}</strong><span class="fecha">${rotuloDia(claveDia(r.ts), t)} ${horaCorta(r.ts)}</span></span>
        <span class="autor" data-color=${String(r.color)}>${r.autor}</span>
        <span class="fragmento">${raw(r.fragmento)}</span>
      </button></li>`));
    for (const b of lista.querySelectorAll<HTMLElement>('.resultado')) {
      b.addEventListener('click', () => emitir(host, 'av-chat-abrir', { icanal: b.dataset['chat'], imensaje: b.dataset['ref'] }));
    }
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatBusqueda = crearComponente<AvChatBusquedaProps>(
  import.meta.url,
  'av-chat-busqueda',
  { abierto: false, chat: null, chatNombre: '', resultados: [], cargando: false, buscado: '' },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatBusquedaProps, q: AvChatBusquedaProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-busqueda', AvChatBusqueda);
