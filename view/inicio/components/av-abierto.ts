/**
 * <av-abierto> — «Un software empresarial moderno, flexible y abierto» (OpenSoftware del React original): seis pilares
 * con ícono, título y texto sobre una banda con el degradado de la paleta.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvAbiertoProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvAbierto = crearComponente<AvAbiertoProps>(import.meta.url, 'av-abierto', { titulo: '', pilares: [] }, (root, props) => {
  root.append(html`
    <section class="banda" part="banda" aria-labelledby="t">
      <div class="interior">
        <h2 id="t" class="titulo">${props.titulo}</h2>
        <div class="rejilla" part="rejilla">
          ${props.pilares.map((p) => html`
            <article class="pilar">
              <h3 class="nombre"><iswc-icon icon=${p.icono}></iswc-icon><span>${p.titulo}</span></h3>
              <p class="texto">${p.texto}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `);
});

define('av-abierto', AvAbierto);
