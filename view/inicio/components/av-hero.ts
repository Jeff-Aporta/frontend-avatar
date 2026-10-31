/**
 * <av-hero> — portada de la landing, como la del React original: banner de fondo (`bgbanner.svg`) teñido al tono de la
 * paleta activa (`hue-rotate` del kit) y velado con un degradado del fondo, lema grande con la tipografía de marca,
 * botón principal («Empieza ahora», o «Ir al panel» con sesión), enlace de información y la escena Memphis
 * `bienvenida` (`av-escena`) con relieve al pasar el mouse. Emite `av-inicio-ir { vista }`; el shell enruta.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvHeroProps } from '../../../src/js/consts/schemas/inicio.schemas.js';
import { LEMA } from '../utils/landing.js';

const AvHero = crearComponente<AvHeroProps>(import.meta.url, 'av-hero', { sesion: false }, (root, props, host) => {
  const ir = (vista: string) => emitir(host, 'av-inicio-ir', { vista });
  const recurso = (ruta: string) => new URL(ruta, document.baseURI).href;
  root.append(html`
    <section class="hero" part="hero" aria-labelledby="titulo">
      <img class="banner" part="banner" src=${recurso('assets/img/bgbanner.svg')} alt="" aria-hidden="true">
      <div class="velo" aria-hidden="true"></div>
      <div class="contenido">
        <div class="texto">
          <p class="kicker"><iswc-tag color="brand" pill>Avatar · Odys</iswc-tag></p>
          <h1 id="titulo" class="titulo" part="titulo">${LEMA.titulo}</h1>
          <p class="lede">${LEMA.texto}</p>
          <div class="acciones">
            <iswc-button id="empezar" color="brand" class="principal" oniswc-click=${() => ir(props.sesion ? 'panel' : 'acceso')}>
              ${props.sesion ? 'Ir al panel' : 'Empieza ahora'}<iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
            </iswc-button>
            <iswc-button variant="outlined" color="brand" oniswc-click=${() => ir('asistente')}><iswc-icon slot="start" icon="mdi:robot-outline"></iswc-icon>Conoce a AVO</iswc-button>
          </div>
          <iswc-button variant="text" color="brand" class="enlace" oniswc-click=${() => ir(props.sesion ? 'panel' : 'acceso')}>${LEMA.enlace} →</iswc-button>
        </div>
        <av-escena class="ilustracion" part="ilustracion" escena="bienvenida" etiqueta="Equipo celebrando con Avatar"></av-escena>
      </div>
    </section>
  `);
});

define('av-hero', AvHero);
