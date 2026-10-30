/**
 * <av-usuario-form> — diálogo crear/editar usuario del plugin de identidad (usuario, nombre, correo, contraseña, activo).
 * Valida con `validarUsuario` y emite `av-usuario-guardar { datos }`; cerrar emite `av-usuario-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvUsuarioFormProps, UsuarioForm } from '../../../src/js/consts/schemas/admin.schemas.js';
import { validarUsuario } from '../utils/admin.js';

type Campo = HTMLElement & { value: string };
type Interruptor = HTMLElement & { checked: boolean };
type Dialogo = HTMLElement & { open: boolean };

const AvUsuarioForm = crearComponente<AvUsuarioFormProps>(
  import.meta.url,
  'av-usuario-form',
  { abierto: false, datos: { nuevo: true, iusuario: '', nombre: '', email: '', password: '', bactivo: true }, ocupado: false, error: '' },
  (root, props, host) => {
    const guardar = () => {
      const datos: UsuarioForm = {
        nuevo: props.datos.nuevo,
        iusuario: props.datos.nuevo ? (root.querySelector('#iusuario') as Campo).value : props.datos.iusuario,
        nombre: (root.querySelector('#nombre') as Campo).value,
        email: (root.querySelector('#email') as Campo).value,
        password: (root.querySelector('#password') as Campo).value,
        bactivo: (root.querySelector('#bactivo') as Interruptor).checked,
      };
      const errores = validarUsuario(datos);
      const aviso = root.querySelector('#aviso') as HTMLElement;
      if (errores.length) {
        aviso.textContent = errores.join('. ');
        aviso.hidden = false;
        return;
      }
      aviso.hidden = true;
      emitir(host, 'av-usuario-guardar', { datos });
    };
    const cerrar = () => emitir(host, 'av-usuario-cerrar', {});
    const nuevo = props.datos.nuevo;
    root.append(html`
      <iswc-dialog id="dialogo" label=${nuevo ? 'Nuevo usuario' : `Editar ${props.datos.iusuario}`} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          ${nuevo ? html`<iswc-input id="iusuario" label="Usuario" required maxlength="120" autocomplete="off" value=${props.datos.iusuario}></iswc-input>` : null}
          <iswc-input id="nombre" label="Nombre" maxlength="200" value=${props.datos.nombre}></iswc-input>
          <iswc-input id="email" type="email" label="Correo" maxlength="200" value=${props.datos.email}></iswc-input>
          <iswc-input id="password" type="password" label=${nuevo ? 'Contraseña' : 'Nueva contraseña'} password-toggle autocomplete="new-password" hint=${nuevo ? 'Mínimo 8 caracteres' : 'Déjala vacía para no cambiarla'} ?required=${nuevo}></iswc-input>
          <iswc-switch id="bactivo" ?checked=${props.datos.bactivo}>Activo</iswc-switch>
          <iswc-callout id="aviso" tone="danger" ?hidden=${!props.error}>${props.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="guardar" color="brand" ?loading=${props.ocupado} oniswc-click=${guardar}>${nuevo ? 'Crear' : 'Guardar'}</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.datos !== previos.datos) return false;
    const d = root.querySelector('#dialogo') as Dialogo | null;
    if (!d) return false;
    d.open = props.abierto;
    const aviso = root.querySelector('#aviso') as HTMLElement;
    aviso.textContent = props.error;
    aviso.hidden = !props.error;
    (root.querySelector('#guardar') as HTMLElement).toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-usuario-form', AvUsuarioForm);
