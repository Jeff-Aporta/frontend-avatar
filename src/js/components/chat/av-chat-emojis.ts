/**
 * <av-chat-emojis> — selector de emojis (W-CHAT-19/24): recientes, categorías con atajos, búsqueda por palabra (en
 * español, sin tildes) y cuadrícula navegable con flechas. Emite `av-chat-emoji { emoji, destino }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatEmojisProps } from '../../consts/schemas/chat.schemas.js';
import { buscarEmojis, CATEGORIAS_EMOJI, recientes, usarEmoji } from '../../chat/emojis.js';
import { textos } from '../../chat/textos.js';

type Campo = HTMLElement & { value: string; focus(): void };

const COLUMNAS = 8;

const AvChatEmojis = crearComponente<AvChatEmojisProps>(import.meta.url, 'av-chat-emojis', { destino: '' }, (root, props, host) => {
  const t = textos();
  const elegir = (e: string) => {
    usarEmoji(e);
    emitir(host, 'av-chat-emoji', { emoji: e, destino: props.destino });
  };
  const boton = (e: string, k = '') => html`<button class="emoji" type="button" tabindex="-1" title=${k} aria-label=${k || e} data-e=${e}>${e}</button>`;
  const rec = recientes();
  root.append(html`
    <div class="selector" part="selector" role="dialog" aria-label=${t.emojis}>
      <iswc-input class="buscar" type="search" clearable placeholder=${t.buscar} aria-label=${t.buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
      <nav class="categorias" aria-label=${t.emojis}>
        ${rec.length ? html`<button type="button" class="cat" data-ir="recientes" title="Recientes" aria-label="Recientes"><iswc-icon icon="mdi:clock-outline"></iswc-icon></button>` : null}
        ${CATEGORIAS_EMOJI.map((c) => html`<button type="button" class="cat" data-ir=${c.id} title=${c.nombre} aria-label=${c.nombre}><iswc-icon icon=${c.icono}></iswc-icon></button>`)}
      </nav>
      <div class="rejilla" role="grid">
        <div class="resultados" hidden></div>
        <div class="secciones">
          ${rec.length ? html`<section data-cat="recientes"><h3>Recientes</h3><div class="grupo">${rec.map((e) => boton(e))}</div></section>` : null}
          ${CATEGORIAS_EMOJI.map((c) => html`<section data-cat=${c.id}><h3>${c.nombre}</h3><div class="grupo">${c.emojis.map((e) => boton(e.e, e.k))}</div></section>`)}
        </div>
      </div>
    </div>
  `);
  const rejilla = root.querySelector('.rejilla') as HTMLElement;
  const resultados = root.querySelector('.resultados') as HTMLElement;
  const secciones = root.querySelector('.secciones') as HTMLElement;
  const visibles = () => [...(resultados.hidden ? secciones : resultados).querySelectorAll<HTMLElement>('.emoji')];
  const primero = visibles()[0];
  if (primero) primero.tabIndex = 0;
  rejilla.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.emoji');
    if (b?.dataset['e']) elegir(b.dataset['e']);
  });
  rejilla.addEventListener('keydown', (e) => {
    const lista = visibles();
    const i = lista.indexOf(root.activeElement as HTMLElement);
    if (i < 0) return;
    const pasos: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLUMNAS, ArrowUp: -COLUMNAS };
    const paso = pasos[e.key];
    if (paso === undefined) return;
    e.preventDefault();
    const d = lista[Math.max(0, Math.min(lista.length - 1, i + paso))];
    if (!d) return;
    lista[i]!.tabIndex = -1;
    d.tabIndex = 0;
    d.focus();
  });
  for (const c of root.querySelectorAll<HTMLElement>('.cat')) {
    c.addEventListener('click', () => {
      const s = secciones.querySelector(`[data-cat="${c.dataset['ir']}"]`) as HTMLElement | null;
      s?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }
  const buscar = root.querySelector('.buscar') as Campo;
  buscar.addEventListener('iswc-input', () => {
    const q = buscar.value ?? '';
    resultados.hidden = !q.trim();
    secciones.hidden = !!q.trim();
    resultados.replaceChildren(...(q.trim() ? [html`<div class="grupo">${buscarEmojis(q).map((e) => boton(e.e, e.k))}</div>`] : []));
    const p = visibles()[0];
    if (p) p.tabIndex = 0;
  });
});

define('av-chat-emojis', AvChatEmojis);
