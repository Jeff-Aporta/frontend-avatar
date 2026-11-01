/**
 * <av-comunidad> — «Únete a nuestra comunidad», como en el React original: una constelación de personas (`iswc-avatar`
 * con foto) que aparecen y se desvanecen en ciclo, el título, un texto y tres cifras. Las fotos se cargan perezosas.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvComunidadProps } from '../../../src/js/consts/schemas/inicio.schemas.js';

const AvComunidad = crearComponente<AvComunidadProps>(import.meta.url, 'av-comunidad', { titulo: '', texto: '', personas: [], cifras: [] }, (root, props) => {
  const total = props.personas.length || 1;
  root.append(html`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <div class="constelacion" part="constelacion" aria-hidden="true">
        ${props.personas.map((src, i) => html`
          <iswc-avatar class="persona" style=${`--i:${i};--n:${total}`} image=${new URL(src, document.baseURI).href} loading="lazy" shape="circle"></iswc-avatar>
        `)}
        <span class="nucleo"><iswc-icon icon="mdi:account-group"></iswc-icon></span>
      </div>
      <div class="texto">
        <iswc-heading level="2" id="t" class="titulo">${props.titulo}</iswc-heading>
        <p class="lede">${props.texto}</p>
        <div class="cifras">
          ${props.cifras.map((c) => html`<div class="cifra"><strong class="valor">${c.valor}</strong><span class="etiqueta">${c.etiqueta}</span></div>`)}
        </div>
      </div>
    </section>
  `);
});

define('av-comunidad', AvComunidad);
