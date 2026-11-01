/**
 * <av-chat-cabecera> — cabecera de la conversación (W-CHAT-08/36): volver (en pantallas estrechas), foto, nombre y
 * estado («en línea», «escribiendo…», «grabando audio…», «últ. vez…»; en grupos quién escribe o cuántos integrantes
 * hay), y las acciones: llamada de voz, videollamada, buscar en el chat e info.
 * Emite `av-chat-volver`, `av-chat-llamar { tipo }` y `av-chat-panel { panel: 'busqueda' | 'info' }`.
 * Un cambio de estado solo reescribe esa línea (no repinta la cabecera).
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatCabeceraProps } from '../../consts/schemas/chat.schemas.js';
import { textos } from '../../chat/textos.js';

const AvChatCabecera = crearComponente<AvChatCabeceraProps>(
  import.meta.url,
  'av-chat-cabecera',
  { id: null, tipo: 'directo', nombre: '', foto: null, iniciales: '', color: 0, estado: '', activo: false, integrantes: 0, puedeLlamar: true, volver: false },
  (root, props, host) => {
    if (!props.id) return;
    const t = textos();
    const info = () => emitir(host, 'av-chat-panel', { panel: 'info' });
    root.append(html`
      <header class="cabecera" part="cabecera" data-volver=${props.volver ? '1' : '0'}>
        <iswc-button class="volver" variant="plain compact" color="neutral" title=${t.volverChats} aria-label=${t.volverChats} oniswc-click=${() => emitir(host, 'av-chat-volver')}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
        <iswc-button class="quien" variant="row" color="neutral" onclick=${info} title=${props.tipo === 'directo' ? t.infoContacto : t.infoGrupo}>
          <span class="foto" data-color=${String(props.color)}>
            <iswc-avatar initials=${props.iniciales} image=${props.foto ?? ''} label=${props.nombre}></iswc-avatar>
          </span>
          <span class="texto">
            <strong class="nombre">${props.nombre}</strong>
            <span class="estado" data-activo=${props.activo ? '1' : '0'} aria-live="polite">${props.estado}</span>
          </span>
        </iswc-button>
        <span class="acciones">
          ${props.puedeLlamar ? html`
            <iswc-button variant="plain compact" color="neutral" title=${t.videollamar} aria-label=${t.videollamar} oniswc-click=${() => emitir(host, 'av-chat-llamar', { tipo: 'video' })}><iswc-icon icon="mdi:video-outline"></iswc-icon></iswc-button>
            <iswc-button variant="plain compact" color="neutral" title=${t.llamar} aria-label=${t.llamar} oniswc-click=${() => emitir(host, 'av-chat-llamar', { tipo: 'voz' })}><iswc-icon icon="mdi:phone-outline"></iswc-icon></iswc-button>` : null}
          <iswc-button variant="plain compact" color="neutral" title=${t.buscarMensajes} aria-label=${t.buscarMensajes} oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'busqueda' })}><iswc-icon icon="mdi:magnify"></iswc-icon></iswc-button>
          <iswc-button variant="plain compact" color="neutral" title=${t.infoChat} aria-label=${t.infoChat} oniswc-click=${info}><iswc-icon icon="mdi:information-outline"></iswc-icon></iswc-button>
        </span>
      </header>
    `);
  },
  (root, props, previos) => {
    const solo = Object.keys(props).every((k) => k === 'estado' || k === 'activo' || (props as Record<string, unknown>)[k] === (previos as Record<string, unknown>)[k]);
    const e = root.querySelector('.estado') as HTMLElement | null;
    if (!solo || !e) return false;
    e.textContent = props.estado;
    e.dataset['activo'] = props.activo ? '1' : '0';
    return true;
  },
);

define('av-chat-cabecera', AvChatCabecera);
