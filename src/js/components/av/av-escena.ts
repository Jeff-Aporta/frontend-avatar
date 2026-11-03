/**
 * <av-escena> — ilustración por capas (ver `core/escenas.ts`): collages de la identidad recompuestos con sus retazos,
 * vectores de marca y dibujos CSS, o escenas Corporate Memphis con piezas WebP y formas en los colores de la paleta.
 * Cada capa tiene dos niveles: el contenedor se desplaza con el cursor según su profundidad (parallax de
 * `core/paralaje.ts`) y el contenido combina sus loops (desplazamiento, rotación, escala, alfa; ver `core/escenas.ts`),
 * así no se pisan; las protagonistas emiten radar u ondas. Toda la escena se inclina hacia el cursor y, al pasarle
 * encima, las capas cercanas se acercan un poco más. Las piezas se pueden tomar con el mouse y halar un poco (con
 * resistencia creciente); al soltarlas vuelven a su sitio con un rebote suave (`halar`).
 * Retazos y vectores se tiñen al tono de la paleta (`hue-rotate` desde el turquesa de origen). Los retazos se piden con
 * `srcset`/`sizes`: cada pantalla baja la variante WebP del ancho que va a pintar. Decorativa salvo que se pase
 * `etiqueta`. Escala con el ancho del host.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvEscenaProps } from '../../consts/schemas/componentes.schemas.js';
import { COLLAGES } from '../../consts/collages.js';
import { animacionCss, type Capa, ESCENAS, srcsetRetazo, urlPieza } from '../../core/escenas.js';

/** Capas de fondo que no se halan: estructura del collage, no piezas. */
const FIJAS = new Set(['reticula', 'linea-h', 'linea-v', 'sombra', 'base']);
const arrastrable = (c: Capa): boolean => !FIJAS.has(c.tipo === 'dibujo' ? c.dibujo : c.tipo === 'retazo' ? c.id : '');

/**
 * Halar piezas: con mouse o lápiz, la capa tomada sigue al puntero con resistencia (tanh: cuanto más se aleja, menos
 * cede; tope ≈ 4 % del ancho de la escena, cuesta moverla) y al soltar vuelve a 0 con la transición elástica del CSS. Táctil no: ahí el
 * gesto es desplazar la página.
 */
function halar(figura: HTMLElement): void {
  figura.addEventListener('pointerdown', (ev) => {
    if (ev.pointerType === 'touch' || ev.button !== 0) return;
    const capa = (ev.target as Element | null)?.closest?.('.capa[data-arrastrable]') as HTMLElement | null;
    if (!capa) return;
    ev.preventDefault();
    try {
      figura.setPointerCapture(ev.pointerId);
    } catch {
      /* puntero sintético o ya liberado: sin captura, los eventos siguen llegando a la figura */
    }
    const x0 = ev.clientX, y0 = ev.clientY;
    const tope = Math.max(8, figura.clientWidth * 0.04);
    const ceder = (d: number) => tope * Math.tanh(d / (tope * 3.2));
    capa.dataset['arrastrando'] = '';
    const mover = (e: PointerEvent) => {
      capa.style.setProperty('--_hx', `${ceder(e.clientX - x0).toFixed(1)}px`);
      capa.style.setProperty('--_hy', `${ceder(e.clientY - y0).toFixed(1)}px`);
    };
    const soltar = () => {
      delete capa.dataset['arrastrando'];
      capa.style.setProperty('--_hx', '0px');
      capa.style.setProperty('--_hy', '0px');
      figura.removeEventListener('pointermove', mover);
      figura.removeEventListener('pointerup', soltar);
      figura.removeEventListener('pointercancel', soltar);
    };
    figura.addEventListener('pointermove', mover);
    figura.addEventListener('pointerup', soltar);
    figura.addEventListener('pointercancel', soltar);
  });
}

/** Ancho máximo (px CSS) al que se pinta una escena: tope de `sizes` para elegir variante. */
const ANCHO_MAX = 600;

const estiloBase = (c: Capa) => `--z:${c.z ?? 1};--prof:${c.prof ?? 0.5};--retraso:${c.retraso ?? 0}s;--giro:${c.giro ?? 0}deg`;
/** Estilo del contenido: los loops combinados de la capa (ver `animacionCss`). */
const estiloMov = (c: Capa) => `animation:${animacionCss(c.anim, c.retraso ?? 0) || 'none'}`;
const caja = (x: number, y: number, ancho: number, alto?: number) => `--x:${x}%;--y:${y}%;--ancho:${ancho}%${alto === undefined ? '' : `;--alto:${alto}%`}`;

function contenido(c: Capa, collage: string | undefined, base: string) {
  const anim = estiloMov(c);
  if (c.tipo === 'pieza') return html`<img class="mov" style=${anim} src=${urlPieza(c.pieza, base)} alt="" loading="lazy" decoding="async" draggable="false">`;
  if (c.tipo === 'forma') return html`<span class="mov forma" style=${anim} data-forma=${c.forma} data-color=${c.color}></span>`;
  if (c.tipo === 'vector') return html`<img class="mov tenido" style=${anim} src=${new URL(c.src, base).href} alt="" loading="lazy" decoding="async" draggable="false">`;
  if (c.tipo === 'retazo') {
    const r = collage ? COLLAGES[collage]?.piezas.find((p) => p.id === c.id) : undefined;
    if (!r || !collage) return null;
    const sizes = `min(${Math.round(r.ancho * 0.92)}vw, ${Math.round((r.ancho / 100) * ANCHO_MAX)}px)`;
    return html`<img class="mov tenido" style=${anim} srcset=${srcsetRetazo(collage, c.id, r.anchos, base)} sizes=${sizes} alt="" loading="lazy" decoding="async" draggable="false">`;
  }
  if (c.dibujo === 'tarjeta-comunidad') return html`<span class="mov dibujo" style=${anim} data-dibujo=${c.dibujo}><iswc-icon icon="mdi:account-group"></iswc-icon></span>`;
  if (c.dibujo === 'tarjeta-video') return html`<span class="mov dibujo" style=${anim} data-dibujo=${c.dibujo}><i class="barra"></i><i class="pantalla"></i></span>`;
  return html`<span class="mov dibujo" style=${anim} data-dibujo=${c.dibujo}></span>`;
}

function capa(c: Capa, collage: string | undefined, base: string) {
  const cuerpo = contenido(c, collage, base);
  if (!cuerpo) return null;
  // Radar u ondas detrás del contenido (no se mueven con sus loops: quedan fijas al centro de la capa).
  const mov = c.radar ? html`<span class="radar" data-radar=${c.radar}></span>${cuerpo}` : cuerpo;
  const oscuro = c.oscuro ?? 'no';
  const tomar = arrastrable(c);
  if (c.tipo === 'pieza' || c.tipo === 'forma') return html`<span class="capa centro" data-tipo=${c.tipo} data-oscuro=${oscuro} ?data-arrastrable=${tomar} style=${`${caja(c.x, c.y, c.ancho)};${estiloBase(c)}`}>${mov}</span>`;
  if (c.tipo === 'retazo') {
    const r = COLLAGES[collage ?? '']?.piezas.find((p) => p.id === c.id);
    if (!r) return null;
    return html`<span class="capa" data-tipo="retazo" data-id=${c.id} data-oscuro=${oscuro} ?data-arrastrable=${tomar} style=${`${caja(r.x, r.y, r.ancho)};${estiloBase(c)}`}>${mov}</span>`;
  }
  return html`<span class="capa" data-tipo=${c.tipo} data-oscuro=${oscuro} ?data-arrastrable=${tomar} style=${`${caja(c.x, c.y, c.ancho, c.alto)};${estiloBase(c)}`}>${mov}</span>`;
}

const AvEscena = crearComponente<AvEscenaProps>(import.meta.url, 'av-escena', { escena: 'bienvenida', etiqueta: '' }, (root, props, host) => {
  // Se usa sobre todo como marcado (`<av-escena escena="chat">`): los atributos equivalen a las props.
  const nombre = host.getAttribute('escena') ?? props.escena;
  const etiqueta = host.getAttribute('etiqueta') ?? props.etiqueta;
  const e = ESCENAS[nombre] ?? ESCENAS['vacio']!;
  const lienzo = html`
    <figure class="lienzo" part="lienzo" data-collage=${e.collage ? '1' : '0'} style=${`--proporcion:${e.proporcion}`}>
      <span class="halo" part="halo"></span>
      ${e.capas.map((c) => capa(c, e.collage, document.baseURI))}
    </figure>
  `;
  const figura = lienzo.firstElementChild as HTMLElement;
  if (etiqueta) {
    figura.setAttribute('role', 'img');
    figura.setAttribute('aria-label', etiqueta);
  } else figura.setAttribute('aria-hidden', 'true');
  halar(figura);
  root.append(lienzo);
});

define('av-escena', AvEscena);
