/**
 * <av-invitar-form> — diálogo para invitar un usuario a la empresa: usuario (select de los existentes si llegaron, o
 * texto libre), rol y cargo. Emite `av-invitar-guardar { datos }` y `av-invitar-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvInvitarFormProps, InvitarForm } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { ROLES_EMPRESA } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { etiquetaRol, validarInvitacion } from '../utils/organizacion.js';

type Campo = HTMLElement & { value: string };
type Dialogo = HTMLElement & { open: boolean };

const AvInvitarForm = crearComponente<AvInvitarFormProps>(
  import.meta.url,
  'av-invitar-form',
  { abierto: false, usuarios: [], ocupado: false, error: '' },
  (root, props, host) => {
    const guardar = () => {
      const rol = (root.querySelector('#rol') as Campo).value as InvitarForm['rol'];
      const datos: InvitarForm = { iusuario: (root.querySelector('#usuario') as Campo).value, rol: ROLES_EMPRESA.includes(rol) ? rol : 'miembro', cargo: (root.querySelector('#cargo') as Campo).value };
      const errores = validarInvitacion(datos);
      const aviso = root.querySelector('#aviso') as HTMLElement;
      if (errores.length) {
        aviso.textContent = errores.join('. ');
        aviso.hidden = false;
        return;
      }
      aviso.hidden = true;
      emitir(host, 'av-invitar-guardar', { datos });
    };
    const cerrar = () => emitir(host, 'av-invitar-cerrar', {});
    root.append(html`
      <iswc-dialog id="dialogo" label="Invitar a la empresa" backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          ${props.usuarios.length
            ? html`<iswc-select id="usuario" label="Usuario" required placeholder="Elige un usuario">${props.usuarios.map((u) => html`<iswc-option value=${u.iusuario}>${u.nombre || u.iusuario} · ${u.iusuario}</iswc-option>`)}</iswc-select>`
            : html`<iswc-input id="usuario" label="Usuario" required placeholder="id del usuario" hint="Debe existir: lo crea un administrador."></iswc-input>`}
          <iswc-select id="rol" label="Rol" value="miembro">${ROLES_EMPRESA.map((r) => html`<iswc-option value=${r}>${etiquetaRol(r)}</iswc-option>`)}</iswc-select>
          <iswc-input id="cargo" label="Cargo" maxlength="120" placeholder="Opcional"></iswc-input>
          <iswc-callout id="aviso" tone="danger" ?hidden=${!props.error}>${props.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="guardar" color="brand" ?loading=${props.ocupado} oniswc-click=${guardar}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.usuarios !== previos.usuarios) return false;
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

define('av-invitar-form', AvInvitarForm);
