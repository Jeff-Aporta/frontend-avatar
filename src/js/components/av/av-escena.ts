/**
 * <av-escena> — ilustración Corporate Memphis compuesta por capas (ver `core/escenas.ts`): personajes y objetos en WebP
 * con fondo transparente, más formas geométricas pintadas con los colores de la paleta activa y un halo de neón detrás.
 * Las piezas flotan con animaciones suaves (se apagan con `prefers-reduced-motion`). Decorativa salvo que se pase
 * `etiqueta`. Escala con el ancho del host.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvEscenaProps } from '../../consts/schemas/componentes.schemas.js';
import { type Capa, ESCENAS, urlPieza } from '../../core/escenas.js';

const capa = (c: Capa, base: string) => {
  const estilo = `--x:${c.x}%;--y:${c.y}%;--ancho:${c.ancho}%;--z:${c.z ?? 1};--retraso:${c.retraso ?? 0}s;--giro:${c.giro ?? 0}deg`;
  if (c.tipo === 'pieza') return html`<img class="capa pieza" data-anim=${c.anim ?? 'ninguna'} style=${estilo} src=${urlPieza(c.pieza, base)} alt="" loading="lazy" decoding="async" draggable="false">`;
  return html`<span class="capa forma" data-forma=${c.forma} data-color=${c.color} data-anim=${c.anim ?? 'ninguna'} style=${estilo}></span>`;
};

const AvEscena = crearComponente<AvEscenaProps>(import.meta.url, 'av-escena', { escena: 'bienvenida', etiqueta: '' }, (root, props, host) => {
  // Se usa sobre todo como marcado (`<av-escena escena="chat">`): los atributos equivalen a las props.
  const nombre = host.getAttribute('escena') ?? props.escena;
  const etiqueta = host.getAttribute('etiqueta') ?? props.etiqueta;
  const e = ESCENAS[nombre] ?? ESCENAS['vacio']!;
  const lienzo = html`
    <figure class="lienzo" part="lienzo" style=${`--proporcion:${e.proporcion}`}>
      <span class="halo" part="halo"></span>
      ${e.capas.map((c) => capa(c, document.baseURI))}
    </figure>
  `;
  const figura = lienzo.firstElementChild as HTMLElement;
  if (etiqueta) {
    figura.setAttribute('role', 'img');
    figura.setAttribute('aria-label', etiqueta);
  } else figura.setAttribute('aria-hidden', 'true');
  root.append(lienzo);
});

define('av-escena', AvEscena);
