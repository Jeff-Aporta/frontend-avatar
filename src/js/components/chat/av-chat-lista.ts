/**
 * <av-chat-lista> — columna de chats (W-CHAT-01..07): cabecera con «Nuevo chat», «Nuevo grupo» y «Buscar mensajes»,
 * aviso de conexión, buscador por nombre de chat o persona, filtros rápidos (Todos, No leídos, Grupos, Directos),
 * acceso a «Archivados» y la lista.
 *
 * Sin parpadeo (HW-CHAT-03): la estructura se pinta una vez y luego las filas se RECONCILIAN por id (se agregan,
 * actualizan, mueven o quitan una a una). Flechas arriba/abajo, Inicio y Fin recorren la lista; Enter abre.
 * Emite `av-chat-lista-filtro { filtro?, q?, archivados? }`, `av-chat-panel { panel }` y deja subir lo de las filas.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatListaProps, ItemChat } from '../../consts/schemas/chat.schemas.js';
import { textos } from '../../chat/textos.js';
import './av-chat-item.js';

type Item = HTMLElement & { props: { chat?: ItemChat; activo?: boolean } };
type Campo = HTMLElement & { value: string };

const FILTROS = ['todos', 'noleidos', 'grupos', 'directos'] as const;

function sincronizar(root: ShadowRoot, props: AvChatListaProps): void {
  const t = textos();
  const ul = root.querySelector('.filas') as HTMLElement | null;
  if (!ul) return;
  for (const b of root.querySelectorAll<HTMLElement>('[data-filtro]')) {
    const activo = b.dataset['filtro'] === props.filtro;
    b.setAttribute('variant', activo ? 'soft' : 'plain');
    b.setAttribute('color', activo ? 'brand' : 'neutral');
    b.setAttribute('aria-pressed', activo ? 'true' : 'false');
  }
  const cab = root.querySelector('.cabeza') as HTMLElement;
  cab.dataset['archivados'] = props.archivados ? '1' : '0';
  (root.querySelector('.titulo') as HTMLElement).textContent = props.archivados ? t.archivados : props.titulo || t.chats;
  const arch = root.querySelector('.archivados') as HTMLElement;
  arch.hidden = props.archivados || props.cantidadArchivados === 0;
  (root.querySelector('.archivados-n') as HTMLElement).textContent = String(props.cantidadArchivados);
  const banda = root.querySelector('.conexion') as HTMLElement;
  banda.hidden = props.conexion === 'conectado';
  banda.dataset['estado'] = props.conexion;
  (banda.querySelector('span') as HTMLElement).textContent = props.conexion === 'conectando' ? t.conectando : t.desconectado;
  const q = root.querySelector('.buscador') as Campo;
  if ((q.value ?? '') !== props.q && !q.matches(':focus-within')) q.value = props.q;

  // filas: reconciliación por id (nunca se rehace la lista entera)
  const existentes = new Map<string, Item>();
  for (const n of [...ul.children] as Item[]) existentes.set(n.dataset['id'] ?? '', n);
  props.chats.forEach((c, i) => {
    let el = existentes.get(c.id);
    if (!el) {
      el = document.createElement('av-chat-item') as Item;
      el.dataset['id'] = c.id;
      el.setAttribute('role', 'option');
    }
    existentes.delete(c.id);
    el.props = { chat: c, activo: c.id === props.activo };
    el.setAttribute('aria-selected', c.id === props.activo ? 'true' : 'false');
    if (ul.children[i] !== el) ul.insertBefore(el, ul.children[i] ?? null);
  });
  for (const el of existentes.values()) el.remove();
  // un solo elemento con tabindex 0 (foco itinerante): el que tiene el foco, el activo o el primero
  const filas = [...ul.children] as HTMLElement[];
  const conFoco = filas.find((f) => f === root.activeElement) ?? filas.find((f) => f.dataset['id'] === props.activo) ?? filas[0];
  for (const f of filas) f.tabIndex = f === conFoco ? 0 : -1;
  const vacio = root.querySelector('.vacio') as HTMLElement;
  vacio.hidden = props.chats.length > 0 || props.cargando;
  (vacio.querySelector('strong') as HTMLElement).textContent = props.q ? t.sinResultados : props.archivados ? t.sinElementos : t.sinChats;
  (vacio.querySelector('span') as HTMLElement).textContent = props.q || props.archivados ? '' : t.sinChatsTexto;
  (root.querySelector('.esqueletos') as HTMLElement).hidden = !(props.cargando && props.chats.length === 0);
}

const AvChatLista = crearComponente<AvChatListaProps>(
  import.meta.url,
  'av-chat-lista',
  { chats: [], activo: null, filtro: 'todos', q: '', archivados: false, cantidadArchivados: 0, conexion: 'conectado', titulo: '', cargando: false },
  (root, props, host) => {
    const t = textos();
    const rotulos: Record<string, string> = { todos: t.todos, noleidos: t.noLeidos, grupos: t.grupos, directos: t.directos };
    const teclas = (e: Event) => {
      const k = e as KeyboardEvent;
      const filas = [...root.querySelectorAll<HTMLElement>('.filas > av-chat-item')];
      const i = filas.indexOf(root.activeElement as HTMLElement);
      let destino: HTMLElement | undefined;
      if (k.key === 'ArrowDown') destino = filas[Math.min(filas.length - 1, i + 1)];
      else if (k.key === 'ArrowUp') destino = filas[Math.max(0, i - 1)];
      else if (k.key === 'Home') destino = filas[0];
      else if (k.key === 'End') destino = filas[filas.length - 1];
      else if ((k.key === 'Enter' || k.key === ' ') && i >= 0 && k.target === filas[i]) {
        k.preventDefault();
        emitir(host, 'av-chat-abrir', { icanal: filas[i]!.dataset['id'] });
        return;
      } else return;
      k.preventDefault();
      if (!destino) return;
      for (const f of filas) f.tabIndex = -1;
      destino.tabIndex = 0;
      destino.focus();
    };
    root.append(html`
      <nav class="lista" part="lista" aria-label=${t.chats}>
        <header class="cabeza" part="cabeza">
          <iswc-button class="atras" variant="plain compact" color="neutral" title=${t.volverChats} aria-label=${t.volverChats} oniswc-click=${() => emitir(host, 'av-chat-lista-filtro', { archivados: false })}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
          <iswc-heading class="titulo" level="2"></iswc-heading>
          <span class="acciones">
            <iswc-button variant="plain compact" color="neutral" title=${t.buscarMensajes} aria-label=${t.buscarMensajes} oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'busqueda' })}><iswc-icon icon="mdi:text-search"></iswc-icon></iswc-button>
            <iswc-button variant="plain compact" color="neutral" title=${t.nuevoGrupo} aria-label=${t.nuevoGrupo} oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'grupo' })}><iswc-icon icon="mdi:account-multiple-plus-outline"></iswc-icon></iswc-button>
            <iswc-button class="nuevo" variant="soft compact" color="brand" title=${t.nuevoChat} aria-label=${t.nuevoChat} oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'nuevo' })}><iswc-icon icon="mdi:message-plus-outline"></iswc-icon></iswc-button>
          </span>
        </header>
        <div class="conexion" role="status" hidden><iswc-spinner></iswc-spinner><span></span></div>
        <div class="herramientas">
          <iswc-input class="buscador" type="search" clearable placeholder=${t.buscarChats} aria-label=${t.buscarChats}
            oniswc-input=${(e: Event) => emitir(host, 'av-chat-lista-filtro', { q: (e.currentTarget as Campo).value ?? '' })}>
            <iswc-icon slot="start" icon="mdi:magnify"></iswc-icon>
          </iswc-input>
          <div class="filtros" role="group" aria-label=${t.todos}>
            ${FILTROS.map((f) => html`<iswc-button pill data-filtro=${f} variant="plain compact" color="neutral" oniswc-click=${() => emitir(host, 'av-chat-lista-filtro', { filtro: f })}>${rotulos[f]}</iswc-button>`)}
          </div>
        </div>
        <iswc-button class="archivados" variant="row" color="neutral" hidden onclick=${() => emitir(host, 'av-chat-lista-filtro', { archivados: true })}>
          <iswc-icon icon="mdi:archive-outline"></iswc-icon><span class="archivados-t">${t.archivados}</span><span class="archivados-n"></span>
        </iswc-button>
        <div class="filas" part="filas" role="listbox" aria-label=${t.chats} onkeydown=${teclas}></div>
        <div class="esqueletos" hidden>${[1, 2, 3, 4, 5].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>
        <div class="vacio" hidden><iswc-icon icon="mdi:chat-processing-outline"></iswc-icon><strong></strong><span></span></div>
      </nav>
    `);
    sincronizar(root, props);
  },
  (root, props) => {
    if (!root.querySelector('.filas')) return false;
    sincronizar(root, props);
    return true;
  },
);

define('av-chat-lista', AvChatLista);
