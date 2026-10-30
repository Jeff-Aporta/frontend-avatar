/**
 * <av-hero> — portada de la landing: lema, texto, botón principal («Empieza ahora» → acceso, o «Ir al panel» con
 * sesión) y la ilustración. Emite `av-inicio-ir { vista }` al pulsar un botón; el shell enruta.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvHeroProps } from '../../../src/js/consts/schemas/inicio.schemas.js';
import { LEMA } from '../utils/landing.js';

const AvHero = crearComponente<AvHeroProps>(import.meta.url, 'av-hero', { sesion: false }, (root, props, host) => {
  const ir = (vista: string) => emitir(host, 'av-inicio-ir', { vista });
  const ilustracion = new URL('assets/img/ilustration.svg', document.baseURI).href;
  root.append(html`
    <section class="hero" part="hero" aria-labelledby="titulo">
      <div class="texto">
        <p class="kicker"><iswc-tag color="brand" pill>Avatar · Odys</iswc-tag></p>
        <h1 id="titulo" class="titulo" part="titulo">${LEMA.titulo}</h1>
        <p class="lede">${LEMA.texto}</p>
        <div class="acciones">
          <iswc-button id="empezar" color="brand" oniswc-click=${() => ir(props.sesion ? 'panel' : 'acceso')}>
            ${props.sesion ? 'Ir al panel' : 'Empieza ahora'}<iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
          </iswc-button>
          <iswc-button variant="outlined" color="neutral" oniswc-click=${() => ir('asistente')}>Conoce a AVO</iswc-button>
        </div>
        <p class="nota">Equipos, canales, kanban, CRM y permisos por rol. Sin instalar nada.</p>
      </div>
      <img class="ilustracion" part="ilustracion" src=${ilustracion} alt="" loading="eager">
    </section>
  `);
});

define('av-hero', AvHero);
