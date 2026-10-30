/**
 * <av-inicio> — shell de la landing pública, en el orden del React original: Hero, Comunidad, Características,
 * Productividad, Precios, Tecnología y Software abierto, y el pie. Escucha `av-inicio-ir` de sus hijos y enruta.
 * Los datos salen de `../utils/landing.ts` (sin DOM).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvInicioProps } from '../../../src/js/consts/schemas/inicio.schemas.js';
import { ir } from '../../../src/js/core/router.js';
import { ABIERTO_TITULO, caracteristicas, COMUNIDAD, personas, pilares, planes, productividad, tecnologia } from '../utils/landing.js';
import './av-hero.js';
import './av-comunidad.js';
import './av-caracteristicas.js';
import './av-precios.js';
import './av-abierto.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const AvInicio = crearComponente<AvInicioProps>(import.meta.url, 'av-inicio', { sesion: false }, (root, props) => {
  const navegar = (e: Event) => {
    const { vista } = (e as CustomEvent<{ vista: string }>).detail;
    ir(vista);
  };
  root.append(html`
    <div class="pagina" part="pagina" onav-inicio-ir=${navegar}>
      <av-hero id="hero"></av-hero>
      <av-comunidad id="comunidad"></av-comunidad>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <div class="franja"><av-caracteristicas id="productividad"></av-caracteristicas></div>
      <av-precios id="precios"></av-precios>
      <av-caracteristicas id="tecnologia"></av-caracteristicas>
      <av-abierto id="abierto"></av-abierto>
      <footer class="pie" part="pie">
        <span class="marca">Avatar</span>
        <span>Gestión digital y automatización · Odys — Operation Dashboard Year System</span>
        <span>© ${new Date().getFullYear()}</span>
      </footer>
    </div>
  `);
  const de = (id: string) => root.querySelector(`#${id}`) as ConProps;
  de('hero').props = { sesion: props.sesion };
  de('comunidad').props = { ...COMUNIDAD, personas: personas(12) };
  de('caracteristicas').props = { titulo: 'Características principales', items: caracteristicas(), variante: 'tarjetas' };
  de('productividad').props = { titulo: 'Productividad para tu equipo', items: productividad(), variante: 'iconos' };
  de('precios').props = { planes: planes() };
  de('tecnologia').props = { titulo: 'Tecnología que te respalda', items: tecnologia(), variante: 'iconos' };
  de('abierto').props = { titulo: ABIERTO_TITULO, pilares: pilares() };
});

define('av-inicio', AvInicio);
