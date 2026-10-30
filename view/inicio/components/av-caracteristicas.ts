/**
 * <av-caracteristicas> — rejilla de tarjetas (ícono, título, texto) con las características principales.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvCaracteristicasProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvCaracteristicas = crearComponente<AvCaracteristicasProps>(import.meta.url, 'av-caracteristicas', { items: [] }, (root, props) => {
  root.append(html`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <h2 id="t" class="titulo">Características principales</h2>
      <div class="rejilla" part="rejilla">
        ${props.items.map((c) => html`
          <iswc-card variant="outlined" class="tarjeta">
            <strong slot="header" class="cabeza"><span class="icono"><iswc-icon icon=${c.icono}></iswc-icon></span>${c.titulo}</strong>
            <p>${c.texto}</p>
          </iswc-card>
        `)}
      </div>
    </section>
  `);
});

define('av-caracteristicas', AvCaracteristicas);
