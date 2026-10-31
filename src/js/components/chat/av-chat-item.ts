/**
 * <av-chat-item> — una fila de la lista de chats: foto o iniciales con punto de presencia, nombre, hora, marcas de
 * lectura si el último es propio, autor y vista previa del último mensaje (o «escribiendo…»), contador de no leídos e
 * íconos de fijado/silenciado. Menú propio para fijar, silenciar, archivar y marcar como no leído (W-CHAT-02/07).
 * Emite `av-chat-abrir { icanal }` y `av-chat-preferencias { icanal, …preferencia }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatItemProps } from '../../consts/schemas/chat.schemas.js';
import { textos } from '../../chat/textos.js';
import { ICONO_MARCA } from './marcas.js';

const AvChatItem = crearComponente<AvChatItemProps>(import.meta.url, 'av-chat-item', { chat: null, activo: false }, (root, props, host) => {
  const c = props.chat;
  if (!c) return;
  const t = textos();
  const abrir = () => emitir(host, 'av-chat-abrir', { icanal: c.id });
  const pref = (e: Event) => {
    e.stopPropagation();
    const v = (e as CustomEvent<{ item?: { value?: string } }>).detail?.item?.value ?? '';
    const p: Record<string, boolean> = {};
    if (v === 'fijar') p['fijado'] = !c.fijado;
    if (v === 'silenciar') p['silenciado'] = !c.silenciado;
    if (v === 'archivar') p['archivado'] = !c.archivado;
    if (v === 'noleido') p['marcadoNoLeido'] = !(c.noLeidos > 0 || c.marcadoNoLeido);
    emitir(host, 'av-chat-preferencias', { icanal: c.id, ...p });
  };
  const sinLeer = c.noLeidos > 0 || c.marcadoNoLeido;
  root.append(html`
    <div class="fila" part="fila" data-activo=${props.activo ? '1' : '0'} data-sinleer=${sinLeer ? '1' : '0'} onclick=${abrir}>
      <span class="foto" data-color=${String(c.color)}>
        <iswc-avatar class="avatar" initials=${c.iniciales} image=${c.foto ?? ''} label=${c.nombre} shape="circle"></iswc-avatar>
        ${c.tipo !== 'directo' ? html`<iswc-icon class="tipo" icon=${c.tipo === 'publico' ? 'mdi:bullhorn-variant-outline' : 'mdi:account-group'}></iswc-icon>` : null}
        ${c.enLinea ? html`<span class="presencia" title=${t.enLinea}></span>` : null}
      </span>
      <span class="cuerpo">
        <span class="linea">
          <strong class="nombre">${c.nombre}</strong>
          <span class="hora">${c.hora}</span>
        </span>
        <span class="linea">
          ${c.escribiendo
            ? html`<span class="previa escribiendo">${c.escribiendo}</span>`
            : html`<span class="previa">${c.marca ? html`<iswc-icon class="marca" data-marca=${c.marca} icon=${ICONO_MARCA[c.marca]}></iswc-icon>` : null}${c.autorUltimo ? html`<span class="autor">${c.autorUltimo}: </span>` : null}${c.ultimo}</span>`}
          <span class="estado">
            ${c.silenciado ? html`<iswc-icon class="icono" icon="mdi:bell-off-outline" title=${t.silenciar}></iswc-icon>` : null}
            ${c.fijado ? html`<iswc-icon class="icono" icon="mdi:pin-outline" title=${t.fijarChat}></iswc-icon>` : null}
            ${c.noLeidos > 0 ? html`<span class="contador" data-silenciado=${c.silenciado ? '1' : '0'}>${c.noLeidos > 99 ? '99+' : c.noLeidos}</span>` : c.marcadoNoLeido ? html`<span class="contador punto"></span>` : null}
          </span>
        </span>
      </span>
      <iswc-dropdown class="menu" placement="bottom-end" oniswc-select=${pref} onclick=${(e: Event) => e.stopPropagation()}>
        <iswc-button slot="trigger" class="menu-boton" variant="plain" color="neutral" title=${t.menu} aria-label=${t.menu} tabindex="-1"><iswc-icon icon="mdi:chevron-down"></iswc-icon></iswc-button>
        <iswc-dropdown-item value="fijar"><iswc-icon slot="icon" icon=${c.fijado ? 'mdi:pin-off-outline' : 'mdi:pin-outline'}></iswc-icon>${c.fijado ? t.desfijarChat : t.fijarChat}</iswc-dropdown-item>
        <iswc-dropdown-item value="silenciar"><iswc-icon slot="icon" icon=${c.silenciado ? 'mdi:bell-outline' : 'mdi:bell-off-outline'}></iswc-icon>${c.silenciado ? t.activarSonido : t.silenciar}</iswc-dropdown-item>
        <iswc-dropdown-item value="archivar"><iswc-icon slot="icon" icon=${c.archivado ? 'mdi:archive-arrow-up-outline' : 'mdi:archive-arrow-down-outline'}></iswc-icon>${c.archivado ? t.desarchivar : t.archivar}</iswc-dropdown-item>
        <iswc-dropdown-item value="noleido"><iswc-icon slot="icon" icon=${sinLeer ? 'mdi:email-open-outline' : 'mdi:email-mark-as-unread'}></iswc-icon>${sinLeer ? t.marcarLeido : t.marcarNoLeido}</iswc-dropdown-item>
      </iswc-dropdown>
    </div>
  `);
});

define('av-chat-item', AvChatItem);
