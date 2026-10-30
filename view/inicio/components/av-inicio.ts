/**
 * <av-inicio> — shell de la landing pública: hero, características, precios y pie. Escucha `av-inicio-ir` de sus hijos
 * y enruta. Datos desde `../utils/landing.ts` (sin DOM).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvInicioProps } from '../../../src/js/consts/schemas/inicio.schemas.js';
import { ir } from '../../../src/js/core/router.js';
import { caracteristicas, planes } from '../utils/landing.js';
import './av-hero.js';
import './av-caracteristicas.js';
import './av-precios.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const AvInicio = crearComponente<AvInicioProps>(import.meta.url, 'av-inicio', { sesion: false }, (root, props) => {
  const navegar = (e: Event) => {
    const { vista } = (e as CustomEvent<{ vista: string }>).detail;
    ir(vista);
  };
  root.append(html`
    <div class="pagina" part="pagina" onav-inicio-ir=${navegar}>
      <av-hero id="hero"></av-hero>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <av-precios id="precios"></av-precios>
      <footer class="pie" part="pie">
        <span>Avatar · Odys — Operation Dashboard Year System</span>
        <span>Web components (kit iswc) · API DER en Cloudflare</span>
      </footer>
    </div>
  `);
  (root.querySelector('#hero') as ConProps).props = { sesion: props.sesion };
  (root.querySelector('#caracteristicas') as ConProps).props = { items: caracteristicas() };
  (root.querySelector('#precios') as ConProps).props = { planes: planes() };
});

define('av-inicio', AvInicio);
