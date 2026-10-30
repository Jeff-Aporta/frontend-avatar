/**
 * <av-caracteristicas> — sección de la landing con título y una rejilla de características (ícono, título, texto).
 * Sirve para Features, Productivity y Technology del React original: `variante="tarjetas"` las pinta en tarjetas con
 * velo de la paleta; `variante="iconos"` como en el original, con el ícono grande centrado y sin caja.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvCaracteristicasProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvCaracteristicas = crearComponente<AvCaracteristicasProps>(
  import.meta.url,
  'av-caracteristicas',
  { titulo: 'Características principales', subtitulo: '', items: [], variante: 'tarjetas' },
  (root, props) => {
    root.append(html`
      <section class="seccion" part="seccion" data-variante=${props.variante} aria-labelledby="t">
        <h2 id="t" class="titulo">${props.titulo}</h2>
        ${props.subtitulo ? html`<p class="subtitulo">${props.subtitulo}</p>` : null}
        <div class="rejilla" part="rejilla">
          ${props.items.map((c, i) => html`
            <article class="item" style=${`--i:${i}`}>
              <span class="icono" aria-hidden="true"><iswc-icon icon=${c.icono}></iswc-icon></span>
              <h3 class="nombre">${c.titulo}</h3>
              <p class="texto">${c.texto}</p>
            </article>
          `)}
        </div>
      </section>
    `);
  },
);

define('av-caracteristicas', AvCaracteristicas);
