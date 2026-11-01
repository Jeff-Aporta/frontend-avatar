/**
 * <av-perfiles-tabla> — diálogo «Perfiles de prueba» del pie: `<av-perfiles-lista>` en modo select. Su PIN es público a propósito hasta tener MVP. Emite `av-perfiles-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvPerfilesTablaProps } from '../../consts/schemas/componentes.schemas.js';
import './av-perfiles-lista.js';

type Dialogo = HTMLElement & { open: boolean };

const AvPerfilesTabla = crearComponente<AvPerfilesTablaProps>(
  import.meta.url,
  'av-perfiles-tabla',
  { abierto: false },
  (root, props, host) => {
    const cerrar = () => emitir(host, 'av-perfiles-cerrar', {});
    root.append(html`
      <iswc-dialog id="dialogo" label="Perfiles de prueba" backdrop-variant="basic" ?open=${props.abierto} oniswc-after-hide=${cerrar}>
        <p class="nota">Cuentas de testing: el PIN es público hasta tener MVP.</p>
        ${props.abierto ? html`<av-perfiles-lista modo="select" onav-perfil-usar=${cerrar}></av-perfiles-lista>` : null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cerrar</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props) => {
    if (props.abierto) return false;
    (root.querySelector('#dialogo') as Dialogo).open = false;
    return true;
  },
);

define('av-perfiles-tabla', AvPerfilesTabla);
