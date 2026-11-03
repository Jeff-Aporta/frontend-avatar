/**
 * <av-chat-burbuja> — un mensaje (W-CHAT-14/15/17/19/22/23): burbuja con cola (solo el primero de la ráfaga), nombre del
 * autor con su color en grupos, «Reenviado», cita tocable, adjunto (`av-chat-adjunto` / `av-chat-audio`), texto con
 * formato ligero (emojis solos en grande), «editado», hora y marcas ✓/✓✓, progreso de subida cancelable, «no enviado ·
 * reintentar» y reacciones (`av-chat-reacciones`). Los de sistema y las llamadas van centrados.
 *
 * Menú contextual: clic derecho, mantener pulsado o el botón que aparece al pasar el puntero → `av-chat-menu
 * { imensaje, x, y }`. Emite `av-chat-accion { accion: 'ir' | 'reintentar' | 'cancelar-subida' | 'ver', imensaje }`.
 * Progreso, marca y resaltado se actualizan sin repintar (la imagen no se recarga).
 */
import { crearComponente, define, emitir, html, raw } from '../../base/componente.js';
import type { AvChatBurbujaProps } from '../../consts/schemas/chat.schemas.js';
import { formatearHtml, horaCorta, soloEmojis, textoLlamada } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';
import { ICONO_MARCA } from './marcas.js';
import './av-chat-adjunto.js';
import './av-chat-audio.js';
import './av-chat-reacciones.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const PULSACION_MS = 480;

const AvChatBurbuja = crearComponente<AvChatBurbujaProps>(
  import.meta.url,
  'av-chat-burbuja',
  { mensaje: null, propio: false, primero: true, ultimo: true, autor: null, marca: null, cita: null, menciones: [], reacciones: [], resaltado: false },
  (root, props, host) => {
    const m = props.mensaje;
    if (!m) return;
    const t = textos();
    const ref = m.clave;
    const accion = (a: string) => emitir(host, 'av-chat-accion', { accion: a, imensaje: ref });
    if (m.tipo === 'sistema' || m.tipo === 'llamada') {
      const llamada = m.tipo === 'llamada';
      const perdida = llamada && m.meta['perdida'] === true;
      root.append(html`
        <div class="sistema" part="sistema" data-tipo=${m.tipo} data-perdida=${perdida ? '1' : '0'}>
          <span class="pildora">
            ${llamada ? html`<iswc-icon icon=${m.meta['medio'] === 'video' ? 'mdi:video-outline' : perdida ? 'mdi:phone-missed-outline' : 'mdi:phone-outline'}></iswc-icon>` : null}
            <span>${llamada ? textoLlamada(m.meta, t) : m.texto}</span>
            ${llamada ? html`<span class="hora">${horaCorta(m.ts)}</span>` : null}
          </span>
        </div>
      `);
      return;
    }
    const menu = (x: number, y: number) => emitir(host, 'av-chat-menu', { imensaje: ref, x, y });
    let pulsacion: ReturnType<typeof setTimeout> | null = null;
    const abajo = (e: Event) => {
      const p = e as PointerEvent;
      if (p.pointerType !== 'touch') return;
      pulsacion = setTimeout(() => {
        pulsacion = null;
        navigator.vibrate?.(12);
        menu(p.clientX, p.clientY);
      }, PULSACION_MS);
    };
    const cancelarPulsacion = () => {
      if (pulsacion) clearTimeout(pulsacion);
      pulsacion = null;
    };
    const teclas = (e: Event) => {
      const k = e as KeyboardEvent;
      if (k.key === 'ContextMenu' || (k.shiftKey && k.key === 'F10') || k.key === 'Enter') {
        k.preventDefault();
        const r = (k.currentTarget as HTMLElement).getBoundingClientRect();
        menu(r.left + r.width / 2, r.top + r.height / 2);
      }
    };
    const grande = !m.eliminado && !m.adjunto ? soloEmojis(m.texto) : 0;
    const conTexto = !m.eliminado && m.texto.trim().length > 0;
    const audio = !!m.adjunto && (m.tipo === 'audio' || m.adjunto.mime.startsWith('audio/'));
    const soloMedio = !!m.adjunto && !conTexto && (m.tipo === 'imagen' || m.tipo === 'video');
    const meta = html`
      <span class="meta" part="meta">
        ${m.editado && !m.eliminado ? html`<span class="editado">${t.editado}</span>` : null}
        ${m.destacado ? html`<iswc-icon class="estrella" icon="mdi:star" title=${t.destacados}></iswc-icon>` : null}
        <span class="hora">${horaCorta(m.ts)}</span>
        ${props.marca ? html`<iswc-icon class="marca" data-marca=${props.marca} icon=${ICONO_MARCA[props.marca]} aria-label=${props.marca}></iswc-icon>` : null}
      </span>`;
    root.append(html`
      <div class="fila" part="fila" data-propio=${props.propio ? '1' : '0'} data-primero=${props.primero ? '1' : '0'} data-ultimo=${props.ultimo ? '1' : '0'} data-resaltado=${props.resaltado ? '1' : '0'} data-grande=${grande ? String(grande) : '0'}>
        <div class="burbuja" part="burbuja" tabindex="0" role="article" data-solomedio=${soloMedio ? '1' : '0'} data-eliminado=${m.eliminado ? '1' : '0'} data-estado=${m.estado}
          aria-label=${`${props.autor?.nombre ?? (props.propio ? t.tu : '')} ${m.eliminado ? t.eliminado : m.texto || m.adjunto?.nombre || ''} ${horaCorta(m.ts)}`}
          oncontextmenu=${(e: Event) => { const p = e as MouseEvent; p.preventDefault(); menu(p.clientX, p.clientY); }}
          onpointerdown=${abajo} onpointerup=${cancelarPulsacion} onpointerleave=${cancelarPulsacion} onpointermove=${cancelarPulsacion} onkeydown=${teclas}>
          ${props.autor && props.primero ? html`<span class="autor" data-color=${String(props.autor.color)}>${props.autor.nombre}</span>` : null}
          ${m.reenviado && !m.eliminado ? html`<span class="reenviado"><iswc-icon icon="mdi:share-outline"></iswc-icon>${t.reenviado}</span>` : null}
          ${props.cita && !m.eliminado ? html`
            <iswc-button class="cita" variant="row" color="neutral" data-color=${String(props.cita.color)} onclick=${(e: Event) => { e.stopPropagation(); emitir(host, 'av-chat-accion', { accion: 'ir', imensaje: props.cita!.ref }); }}>
              <span class="cita-texto"><strong>${props.cita.autor}</strong><span>${props.cita.texto}</span></span>
              ${props.cita.miniatura ? html`<img class="cita-mini" src=${props.cita.miniatura} alt="" loading="lazy" decoding="async">` : null}
            </iswc-button>` : null}
          ${m.adjunto && !m.eliminado ? (audio ? html`<av-chat-audio class="medio" id="medio"></av-chat-audio>` : html`<av-chat-adjunto class="medio" id="medio"></av-chat-adjunto>`) : null}
          ${m.eliminado
            ? html`<p class="texto eliminado"><iswc-icon icon="mdi:cancel"></iswc-icon>${props.propio ? t.eliminadoPorMi : t.eliminado}${meta}</p>`
            : conTexto
            ? html`<div class="texto" dir="auto">${raw(formatearHtml(m.texto, props.menciones))}${meta}</div>`
            : html`<div class="texto vacio">${meta}</div>`}
          ${m.estado === 'pendiente' && m.progreso != null ? html`
            <div class="subida"><iswc-progress-bar id="progreso" value=${String(Math.round(m.progreso * 100))} label=${t.adjuntar}></iswc-progress-bar>
            <iswc-button variant="plain compact" color="neutral" title=${t.cancelar} aria-label=${t.cancelar} oniswc-click=${() => accion('cancelar-subida')}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button></div>` : null}
          <iswc-button class="mas" variant="plain compact" color="neutral" title=${t.menu} aria-label=${t.menu} tabindex="-1"
            oniswc-click=${(e: Event) => { e.stopPropagation(); const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); menu(r.left, r.bottom); }}><iswc-icon icon="mdi:chevron-down"></iswc-icon></iswc-button>
        </div>
        ${m.estado === 'fallido' ? html`<iswc-button class="fallo" variant="text compact" color="danger" onclick=${() => accion('reintentar')}><iswc-icon slot="start" icon="mdi:alert-circle-outline"></iswc-icon>${t.noEnviado} · <u>${t.reintentar}</u></iswc-button>` : null}
        <av-chat-reacciones id="reacciones" class="reacciones"></av-chat-reacciones>
      </div>
    `);
    const medio = root.querySelector('#medio') as ConProps | null;
    if (medio && m.adjunto) {
      medio.props = audio
        ? { url: m.adjunto.url, duracion: m.adjunto.duracion, onda: m.adjunto.onda, propio: props.propio }
        : { adjunto: m.adjunto, modo: 'burbuja', propio: props.propio, progreso: null };
      if (!audio) medio.addEventListener('av-chat-adjunto-ver', (e) => { e.stopPropagation(); accion('ver'); });
    }
    (root.querySelector('#reacciones') as ConProps).props = { ref, reacciones: props.reacciones, propio: props.propio };
  },
  // Progreso, marca y resaltado sin repintar (la miniatura no parpadea)
  (root, props, previos) => {
    const claves = new Set(['mensaje', 'marca', 'resaltado']);
    const otros = Object.keys(props).some((k) => !claves.has(k) && JSON.stringify((props as Record<string, unknown>)[k]) !== JSON.stringify((previos as Record<string, unknown>)[k]));
    const a = props.mensaje;
    const b = previos.mensaje;
    if (otros || !a || !b) return false;
    const soloProgreso = JSON.stringify({ ...a, progreso: 0 }) === JSON.stringify({ ...b, progreso: 0 });
    if (!soloProgreso) return false;
    const fila = root.querySelector('.fila') as HTMLElement | null;
    if (!fila) return false;
    if (a.progreso !== b.progreso) {
      const barra = root.querySelector('#progreso');
      if (!barra || a.progreso == null) return false;
      barra.setAttribute('value', String(Math.round(a.progreso * 100)));
    }
    if (props.marca !== previos.marca) {
      const icono = root.querySelector('.marca');
      if (!icono || !props.marca) return false;
      icono.setAttribute('data-marca', props.marca);
      icono.setAttribute('icon', ICONO_MARCA[props.marca]!);
    }
    fila.dataset['resaltado'] = props.resaltado ? '1' : '0';
    return true;
  },
);

define('av-chat-burbuja', AvChatBurbuja);
