/**
 * <av-logo> — el logo de Avatar en SVG en línea: la «A» de cinta de la identidad (dos trazos redondeados y un pliegue
 * oscuro que cruza por detrás de la pierna derecha), la misma de favicon, íconos y collages. Se pinta con los tokens de
 * la paleta activa (`--iswc-accent`, `--iswc-color-contrast`), así que cambia de color con ella; con `wordmark`
 * agrega el nombre en Orbitron y con `animado` un brillo recorre la cinta. Escala con el font-size del contexto: em.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvLogoProps } from '../../consts/schemas/componentes.schemas.js';

const AvLogo = crearComponente<AvLogoProps>(import.meta.url, 'av-logo', { wordmark: false, animado: false }, (root, props, host) => {
  // Se usa sobre todo como marcado (`<av-logo wordmark animado>`): los atributos booleanos equivalen a las props.
  const wordmark = props.wordmark || host.hasAttribute('wordmark');
  const animado = props.animado || host.hasAttribute('animado');
  root.append(html`
    <span class="logo" part="logo" data-animado=${animado ? '1' : '0'} role="img" aria-label="Avatar">
      <svg class="marca" part="marca" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="izq" x1="0" y1="1" x2="0.4" y2="0">
            <stop offset="0" stop-color="var(--_c2)"></stop>
            <stop offset="1" stop-color="var(--_c1)"></stop>
          </linearGradient>
          <linearGradient id="der" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stop-color="var(--_c1)"></stop>
            <stop offset="1" stop-color="var(--_c3)"></stop>
          </linearGradient>
        </defs>
        <path class="pierna" d="M17 51 31 15" stroke="url(#izq)"></path>
        <path class="pliegue" d="M20.6 47.5C25.5 40.5 33 37.2 41.6 38.4L38.6 30.6C30.4 30.4 24.4 35 21.4 41Z"></path>
        <path class="pierna" d="M33 15 47 51" stroke="url(#der)"></path>
        <path class="brillo" d="M17 51 31 15 47 51" pathLength="100"></path>
      </svg>
      ${wordmark ? html`<span class="nombre" part="nombre">Avatar</span>` : null}
    </span>
  `);
});

define('av-logo', AvLogo);
