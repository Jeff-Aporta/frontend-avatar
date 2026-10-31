/**
 * <av-credenciales-demo> — tarjeta con los usuarios de muestra; cada fila tiene un botón «Usar» que emite
 * `av-credencial-elegida { usuario, password }` para que el shell rellene el login.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCredencialesDemoProps } from '../../../src/js/consts/schemas/acceso.schemas.js';

const AvCredencialesDemo = crearComponente<AvCredencialesDemoProps>(import.meta.url, 'av-credenciales-demo', { items: [] }, (root, props, host) => {
  root.append(html`
    <iswc-card variant="filled-outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Cuentas de prueba</strong>
      <ul class="lista" part="lista">
        ${props.items.map((c) => html`
          <li class="fila">
            <iswc-person class="persona"></iswc-person>
            <span class="descripcion">${c.descripcion} PIN <code>${c.password}</code></span>
            <iswc-button variant="outlined" color="neutral" class="usar" data-usuario=${c.usuario} oniswc-click=${() => emitir(host, 'av-credencial-elegida', { usuario: c.usuario, password: c.password })}>Usar</iswc-button>
          </li>
        `)}
      </ul>
      <p class="nota">Cada cuenta entra con su PIN de 4 dígitos.</p>
    </iswc-card>
  `);
  const personas = root.querySelectorAll<HTMLElement & { props: Record<string, unknown> }>('iswc-person');
  props.items.forEach((c, i) => {
    const p = personas[i];
    if (p) p.props = { usuario: c.usuario, nombre: c.usuario, detalle: c.rol };
  });
});

define('av-credenciales-demo', AvCredencialesDemo);
