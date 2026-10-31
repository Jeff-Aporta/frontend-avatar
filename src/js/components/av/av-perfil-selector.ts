/**
 * <av-perfil-selector> — cambio de perfil de la barra. Elegir uno con sesión guardada lo activa al instante; si no, abre
 * un diálogo con su PIN de 4 dígitos, como iniciar sesión, y desde ahí el JWT queda guardado. Cualquier parte de la app
 * pide un cambio con el evento `av-perfil-elegir { usuario }` en `window`.
 */
import { avisar, crearComponente, define, html } from '../../base/componente.js';
import type { AvPerfilSelectorProps } from '../../consts/schemas/componentes.schemas.js';
import { cambiarPerfil, iniciarSesion, mensajeDe, perfilesPrueba } from '../../core/api.js';
import { tieneCuenta } from '../../core/cuentas.js';
import { ir, rutaActual, VISTA_SESION, VISTAS_PRIVADAS } from '../../core/router.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; focus(): void };
type Host = HTMLElement & { props: Partial<AvPerfilSelectorProps> };

const AvPerfilSelector = crearComponente<AvPerfilSelectorProps>(import.meta.url, 'av-perfil-selector', { perfiles: [], activo: '' }, (root, props, host) => {
  const h = host as Host;
  let pedido = '';
  const q = <T extends Element>(s: string) => root.querySelector(s) as T;
  const activo = props.perfiles.find((p) => p.iusuario === props.activo);
  const fallo = (texto: string) => {
    const e = q<HTMLElement>('.error');
    e.textContent = texto;
    e.hidden = !texto;
  };
  const entrar = async () => {
    const campo = q<Campo>('#pin');
    if (!/^\d{4}$/.test(campo.value)) return fallo('Escribe los 4 dígitos.');
    q('#entrar').toggleAttribute('loading', true);
    try {
      await iniciarSesion(pedido, campo.value);
      if (VISTAS_PRIVADAS.includes(rutaActual().vista)) location.reload();
      else ir(VISTA_SESION);
    } catch (err) {
      fallo(/429|intentos|bloque/i.test(mensajeDe(err)) ? 'Demasiados intentos: espera unos minutos.' : 'PIN incorrecto.');
      campo.value = '';
      campo.focus();
    } finally {
      q('#entrar').toggleAttribute('loading', false);
    }
  };
  const elegir = (usuario: string) => {
    if (usuario === props.activo) return;
    if (tieneCuenta(usuario)) return cambiarPerfil(usuario);
    pedido = usuario;
    q('.para').textContent = props.perfiles.find((p) => p.iusuario === usuario)?.nombre ?? usuario;
    fallo('');
    q<Campo>('#pin').value = '';
    q<Dialogo>('#dialogo').open = true;
    setTimeout(() => q<Campo>('#pin').focus(), 80);
  };
  root.append(html`
    <iswc-dropdown class="menu" part="menu" placement="auto">
      <iswc-button slot="trigger" variant="outlined" color="neutral" caret aria-label="Cambiar de perfil">
        <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${activo?.nombre.split(' ')[0] ?? 'Perfiles'}
      </iswc-button>
      ${props.perfiles.map((p) => html`
        <iswc-dropdown-item value=${p.iusuario} oniswc-click=${() => elegir(p.iusuario)}>
          <iswc-icon slot="start" icon=${p.iusuario === props.activo ? 'mdi:check-circle' : tieneCuenta(p.iusuario) ? 'mdi:account-check-outline' : 'mdi:lock-outline'}></iswc-icon>${p.nombre} · ${p.rol}
        </iswc-dropdown-item>`)}
    </iswc-dropdown>
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${(e: Event) => { if ((e.currentTarget as Campo).value.length === 4) void entrar(); }}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${() => (q<Dialogo>('#dialogo').open = false)}>Cancelar</iswc-button>
      <iswc-button slot="footer" id="entrar" color="brand" oniswc-click=${() => void entrar()}>Entrar</iswc-button>
    </iswc-dialog>
  `);
  host.addEventListener('av-perfil-pedir', (e) => elegir((e as CustomEvent<{ usuario: string }>).detail.usuario));
  if (!props.perfiles.length) void perfilesPrueba().then((perfiles) => (h.props = { perfiles })).catch((err: unknown) => avisar(mensajeDe(err), 'danger'));
});

define('av-perfil-selector', AvPerfilSelector);
