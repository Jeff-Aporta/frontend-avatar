/**
 * <av-precios> — planes y precios (tarjetas; el destacado resalta). «Suscribirse» emite `av-inicio-ir { vista: 'acceso' }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvPreciosProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvPrecios = crearComponente<AvPreciosProps>(import.meta.url, 'av-precios', { planes: [] }, (root, props, host) => {
  root.append(html`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <h2 id="t" class="titulo">Planes y precios</h2>
      <div class="rejilla" part="rejilla">
        ${props.planes.map((p) => html`
          <iswc-card variant=${p.destacado ? 'accent' : 'outlined'} class="plan" data-destacado=${p.destacado ? '1' : '0'}>
            <strong slot="header" class="cabeza">${p.titulo}${p.destacado ? html`<iswc-badge color="success" pill>Recomendado</iswc-badge>` : null}</strong>
            <p class="precio"><span class="valor">${p.precio}</span> <span class="periodo">${p.periodo}</span></p>
            <ul class="incluye">${p.incluye.map((i) => html`<li><iswc-icon icon="mdi:check"></iswc-icon>${i}</li>`)}</ul>
            <iswc-button slot="footer" color=${p.destacado ? 'brand' : 'neutral'} variant=${p.destacado ? 'filled' : 'outlined'} oniswc-click=${() => emitir(host, 'av-inicio-ir', { vista: 'acceso', plan: p.id })}>Suscribirse</iswc-button>
          </iswc-card>
        `)}
      </div>
    </section>
  `);
});

define('av-precios', AvPrecios);
