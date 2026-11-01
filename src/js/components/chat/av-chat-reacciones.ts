/**
 * <av-chat-reacciones> — reacciones de un mensaje agrupadas por emoji con su conteo y quién reaccionó (W-CHAT-24).
 * Tocar una reacción propia la quita; tocar otra la pone (reemplaza la anterior: una por persona).
 * Emite `av-chat-reaccionar { imensaje, emoji | null }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatReaccionesProps } from '../../consts/schemas/chat.schemas.js';

const AvChatReacciones = crearComponente<AvChatReaccionesProps>(import.meta.url, 'av-chat-reacciones', { ref: '', reacciones: [], propio: false }, (root, props, host) => {
  if (!props.reacciones.length) return;
  root.append(html`
    <div class="reacciones" part="reacciones" role="group" data-propio=${props.propio ? '1' : '0'}>
      ${props.reacciones.map((r) => html`
        <iswc-button class="reaccion" variant="row" color=${r.mia ? 'brand' : 'neutral'} shape="pill" data-mia=${r.mia ? '1' : '0'} aria-pressed=${r.mia ? 'true' : 'false'}
          title=${r.nombres.join(', ')} aria-label=${`${r.emoji} ${r.n}: ${r.nombres.join(', ')}`}
          onclick=${() => emitir(host, 'av-chat-reaccionar', { imensaje: props.ref, emoji: r.mia ? null : r.emoji })}>
          <span class="emoji">${r.emoji}</span>${r.n > 1 ? html`<span class="n">${r.n}</span>` : null}
        </iswc-button>`)}
    </div>
  `);
});

define('av-chat-reacciones', AvChatReacciones);
