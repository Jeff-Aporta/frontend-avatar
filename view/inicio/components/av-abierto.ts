/**
 * <av-abierto> — «Un software empresarial moderno, flexible y abierto» (OpenSoftware del React original): seis pilares
 * con ícono, título y texto sobre una banda con el degradado de la paleta. El collage `red` (la marca conectada a datos
 * y personas, por retazos con parallax), sin fondo, ocupa la columna derecha de la rejilla a lo alto de las dos filas.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvAbiertoProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvAbierto = crearComponente<AvAbiertoProps>(import.meta.url, 'av-abierto', { titulo: '', pilares: [] }, (root, props) => {
  root.append(html`
    <section class="banda" part="banda" aria-labelledby="t">
      <div class="interior">
        <iswc-heading level="2" id="t" class="titulo">${props.titulo}</iswc-heading>
        <div class="rejilla" part="rejilla">
          <av-escena class="ilustracion" part="ilustracion" escena="red"></av-escena>
          ${props.pilares.map((p) => html`
            <article class="pilar">
              <iswc-heading level="3" class="nombre"><iswc-icon icon=${p.icono}></iswc-icon><span>${p.titulo}</span></iswc-heading>
              <p class="texto">${p.texto}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `);
});

define('av-abierto', AvAbierto);
