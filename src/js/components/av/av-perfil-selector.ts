/**
 * <av-perfil-selector> — dueño de entrar como otro perfil. Con sesión guardada lo activa al instante; si no, entra con el
 * PIN público del perfil y, si no sirve, abre un diálogo para escribirlo. El JWT queda guardado. Cualquier parte de la app
 * lo pide con el evento `av-perfil-elegir { usuario, fin? }` en `window`. Con sesión muestra además el menú de cambio
 * rápido; sin sesión no pinta botón: los perfiles están en la pestaña «Entrar como…» del acceso.
 */
import { avisar, crearComponente, define, html } from '../../base/componente.js';
import type { AvPerfilSelectorProps } from '../../consts/schemas/componentes.schemas.js';
import { cambiarPerfil, iniciarSesion, mensajeDe, perfilesPrueba } from '../../core/api.js';
import { tieneCuenta } from '../../core/cuentas.js';
import { destinoTrasAcceso, ir, rutaActual, VISTAS_PRIVADAS } from '../../core/router.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; focus(): void };
type Host = HTMLElement & { props: Partial<AvPerfilSelectorProps> };
type Pedido = { usuario: string; fin?: () => void };

/** Entra y sigue: en una vista privada recarga con la nueva sesión; en una pública va al destino recordado. */
async function entrarCon(usuario: string, pin: string): Promise<void> {
  await iniciarSesion(usuario, pin);
  if (VISTAS_PRIVADAS.includes(rutaActual().vista)) {
    location.reload();
    return;
  }
  const destino = destinoTrasAcceso();
  ir(destino.vista, destino.id);
}

const textoFallo = (err: unknown) => (/429|intentos|bloque/i.test(mensajeDe(err)) ? 'Demasiados intentos: espera unos minutos.' : 'PIN incorrecto.');

/** El render se repite con cada cambio de props: solo el último escucha. */
let oyente: EventListener | null = null;

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
      await entrarCon(pedido, campo.value);
      q<Dialogo>('#dialogo').open = false;
    } catch (err) {
      fallo(textoFallo(err));
      campo.value = '';
      campo.focus();
    } finally {
      q('#entrar').toggleAttribute('loading', false);
    }
  };
  const pedirPin = (usuario: string, nombre: string, aviso: string) => {
    pedido = usuario;
    q('.para').textContent = nombre;
    fallo(aviso);
    q<Campo>('#pin').value = '';
    q<Dialogo>('#dialogo').open = true;
    setTimeout(() => q<Campo>('#pin').focus(), 80);
  };
  const elegir = async ({ usuario, fin }: Pedido) => {
    if (usuario === props.activo) return fin?.();
    if (tieneCuenta(usuario)) return cambiarPerfil(usuario);
    const perfiles = props.perfiles.length ? props.perfiles : await perfilesPrueba().catch(() => []);
    const perfil = perfiles.find((p) => p.iusuario === usuario);
    try {
      if (!/^\d{4}$/.test(perfil?.pin ?? '')) throw new Error('sin PIN público');
      await entrarCon(usuario, perfil!.pin);
    } catch (err) {
      pedirPin(usuario, perfil?.nombre ?? usuario, perfil?.pin ? textoFallo(err) : '');
    } finally {
      fin?.();
    }
  };
  root.append(html`
    ${props.activo ? html`
      <iswc-dropdown class="menu" part="menu" placement="auto">
        <iswc-button slot="trigger" variant="outlined compact" color="neutral" with-caret aria-label="Cambiar de perfil">
          <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${activo?.nombre.split(' ')[0] ?? 'Perfiles'}
        </iswc-button>
        ${props.perfiles.map((p) => html`
          <iswc-dropdown-item value=${p.iusuario} oniswc-click=${() => void elegir({ usuario: p.iusuario })}>
            <iswc-icon slot="start" icon=${p.iusuario === props.activo ? 'mdi:check-circle' : tieneCuenta(p.iusuario) ? 'mdi:account-check-outline' : 'mdi:lock-outline'}></iswc-icon>${p.nombre} · ${p.rol}
          </iswc-dropdown-item>`)}
      </iswc-dropdown>` : null}
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${(e: Event) => { if ((e.currentTarget as Campo).value.length === 4) void entrar(); }}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${() => (q<Dialogo>('#dialogo').open = false)}>Cancelar</iswc-button>
      <iswc-button variant="compact" slot="footer" id="entrar" color="brand" oniswc-click=${() => void entrar()}>Entrar</iswc-button>
    </iswc-dialog>
  `);
  if (oyente) removeEventListener('av-perfil-elegir', oyente);
  oyente = (e) => void elegir((e as CustomEvent<Pedido>).detail);
  addEventListener('av-perfil-elegir', oyente);
  if (props.activo && !props.perfiles.length) void perfilesPrueba().then((perfiles) => (h.props = { perfiles })).catch((err: unknown) => avisar(mensajeDe(err), 'danger'));
});

define('av-perfil-selector', AvPerfilSelector);
