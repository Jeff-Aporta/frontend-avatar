/**
 * <av-chat-adjunto> — un archivo adjunto (W-CHAT-20/22): imagen o video en miniatura (tocar → visor a pantalla
 * completa), documento con ícono por tipo, nombre, tamaño y descarga. En modo `previa` (antes de enviar) muestra el
 * botón para quitarlo, el motivo si se rechazó y el progreso.
 * Emite `av-chat-adjunto-ver` y `av-chat-adjunto-quitar { id }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatAdjuntoProps } from '../../consts/schemas/chat.schemas.js';
import { tipoDeMime } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

/** Ícono por extensión o mime. */
export function iconoArchivo(nombre: string, mime: string): string {
  const ext = nombre.toLowerCase().split('.').pop() ?? '';
  if (ext === 'pdf' || mime === 'application/pdf') return 'mdi:file-pdf-box';
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'mdi:file-word-box';
  if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'mdi:file-excel-box';
  if (['ppt', 'pptx', 'odp'].includes(ext)) return 'mdi:file-powerpoint-box';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'mdi:folder-zip-outline';
  if (mime.startsWith('audio/')) return 'mdi:file-music-outline';
  if (mime.startsWith('video/')) return 'mdi:file-video-outline';
  if (mime.startsWith('image/')) return 'mdi:file-image-outline';
  if (['txt', 'md', 'json', 'xml', 'html', 'ts', 'js', 'css'].includes(ext)) return 'mdi:file-code-outline';
  return 'mdi:file-document-outline';
}

const AvChatAdjunto = crearComponente<AvChatAdjuntoProps>(
  import.meta.url,
  'av-chat-adjunto',
  { adjunto: null, modo: 'burbuja', progreso: null, propio: false, error: '' },
  (root, props, host) => {
    const a = props.adjunto;
    if (!a) return;
    const t = textos();
    const tipo = tipoDeMime(a.mime);
    const ver = () => emitir(host, 'av-chat-adjunto-ver', { id: a.id });
    const quitar = () => emitir(host, 'av-chat-adjunto-quitar', { id: a.id });
    const proporcion = a.ancho && a.alto ? `aspect-ratio:${a.ancho}/${a.alto}` : '';
    const ext = (a.nombre.split('.').pop() ?? '').slice(0, 5).toUpperCase();
    const cuerpo = !a.url
      ? html`<div class="no-disponible"><iswc-icon icon="mdi:file-hidden"></iswc-icon><span>${a.nombre}</span></div>`
      : tipo === 'imagen'
      ? html`<iswc-button class="miniatura" variant="row" color="neutral" onclick=${ver} aria-label=${`${t.abrir} ${a.nombre}`}><img src=${a.url} alt=${a.nombre} loading="lazy" decoding="async" style=${proporcion}></iswc-button>`
      : tipo === 'video'
      ? html`<iswc-button class="miniatura video" variant="row" color="neutral" onclick=${ver} aria-label=${`${t.reproducir} ${a.nombre}`}><video src=${a.url} preload="metadata" muted playsinline style=${proporcion}></video><span class="play"><iswc-icon icon="mdi:play"></iswc-icon></span></iswc-button>`
      : html`
        <div class="documento" part="documento">
          <span class="icono" data-ext=${ext}><iswc-icon icon=${iconoArchivo(a.nombre, a.mime)}></iswc-icon></span>
          <span class="datos"><strong class="nombre" title=${a.nombre}>${a.nombre}</strong><span class="detalle"><iswc-format-bytes value=${String(a.bytes)} autofit></iswc-format-bytes>${ext ? ` · ${ext}` : ''}</span></span>
          ${props.modo === 'burbuja' ? html`<iswc-button class="bajar" variant="soft compact" color="neutral" href=${a.url} download=${a.nombre} title=${t.descargar} aria-label=${t.descargar}><iswc-icon icon="mdi:download"></iswc-icon></iswc-button>` : null}
        </div>`;
    root.append(html`
      <div class="adjunto" part="adjunto" data-modo=${props.modo} data-tipo=${tipo} data-error=${props.error ? '1' : '0'}>
        ${cuerpo}
        ${props.modo === 'previa' ? html`<iswc-button class="quitar" variant="filled compact" color="neutral" pill title=${t.quitar} aria-label=${`${t.quitar} ${a.nombre}`} oniswc-click=${quitar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>` : null}
        ${props.modo === 'previa' && props.progreso != null ? html`<iswc-progress-bar class="progreso" value=${String(Math.round(props.progreso * 100))}></iswc-progress-bar>` : null}
        ${props.error ? html`<span class="error" role="alert">${props.error}</span>` : null}
      </div>
    `);
  },
);

define('av-chat-adjunto', AvChatAdjunto);
