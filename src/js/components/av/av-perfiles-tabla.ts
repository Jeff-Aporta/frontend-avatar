/**
 * <av-perfiles-tabla> — diálogo con los perfiles de prueba: usuario, nombre, rol y PIN sin hash. Son cuentas de testing:
 * esta tabla es pública a propósito hasta tener MVP. Emite `av-perfil-usar { usuario }` y `av-perfiles-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvPerfilesTablaProps } from '../../consts/schemas/componentes.schemas.js';

type Dialogo = HTMLElement & { open: boolean };

const AvPerfilesTabla = crearComponente<AvPerfilesTablaProps>(
  import.meta.url,
  'av-perfiles-tabla',
  { abierto: false, perfiles: [] },
  (root, props, host) => {
    root.append(html`
      <iswc-dialog id="dialogo" label="Perfiles de prueba" backdrop-variant="basic" ?open=${props.abierto} oniswc-after-hide=${() => emitir(host, 'av-perfiles-cerrar', {})}>
        <p class="nota">Cuentas de testing: el PIN es público hasta tener MVP.</p>
        <div class="marco">
          <table class="tabla" part="tabla">
            <thead><tr><th scope="col">Usuario</th><th scope="col">Nombre</th><th scope="col">Rol</th><th scope="col">PIN</th><th scope="col"><span class="oculto">Acción</span></th></tr></thead>
            <tbody>
              ${props.perfiles.map((p) => html`
                <tr>
                  <td><code>${p.iusuario}</code></td>
                  <td>${p.nombre}</td>
                  <td>${p.rol}</td>
                  <td><code class="pin">${p.pin}</code></td>
                  <td><iswc-button variant="outlined" color="neutral" size="sm" oniswc-click=${() => emitir(host, 'av-perfil-usar', { usuario: p.iusuario })}>Usar</iswc-button></td>
                </tr>`)}
            </tbody>
          </table>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${() => emitir(host, 'av-perfiles-cerrar', {})}>Cerrar</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.perfiles !== previos.perfiles) return false;
    (root.querySelector('#dialogo') as Dialogo).open = props.abierto;
    return true;
  },
);

define('av-perfiles-tabla', AvPerfilesTabla);
