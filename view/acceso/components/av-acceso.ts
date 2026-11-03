/**
 * <av-acceso> — shell del login, dos pestañas del kit: «Entrar» con `<iswc-login compact>` (no autentica: emite
 * `iswc-login-submit`) y «Entrar como…» con `<av-perfiles-lista>`, la misma lista de la barra.
 * Al enviar llama `iniciarSesion` (POST usuarios/login vía el plugin identity de DER) y navega al panel.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvAccesoProps } from '../../../src/js/consts/schemas/acceso.schemas.js';
import { iniciarSesion, mensajeDe, perfilesPrueba } from '../../../src/js/core/api.js';
import { ir, VISTA_SESION } from '../../../src/js/core/router.js';
import { mensajeAcceso } from '../utils/demo.js';

type LoginEl = HTMLElement & { busy: boolean; reset(): void; focus(): void };
type Host = HTMLElement & { props: Partial<AvAccesoProps> };

/** Escribe usuario y contraseña en los campos internos del `<iswc-login>` (misma técnica que un gestor de contraseñas). */
export function rellenar(login: HTMLElement, usuario: string, password: string): void {
  const campos = [...(login.shadowRoot?.querySelectorAll<HTMLElement & { value: string }>('iswc-input') ?? [])].slice(0, 2);
  for (const campo of campos) {
    const tipo = campo.getAttribute('type') ?? campo.getAttribute('name') ?? '';
    const esClave = /password/i.test(tipo) || /password|clave|contrase/i.test(campo.getAttribute('name') ?? '') || /password/i.test(campo.getAttribute('label') ?? '') || /contrase/i.test(campo.getAttribute('label') ?? '');
    campo.value = esClave ? password : usuario;
    campo.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

const AvAcceso = crearComponente<AvAccesoProps>(
  import.meta.url,
  'av-acceso',
  { ocupado: false, error: '' },
  (root, props, host) => {
    const h = host as Host;
    const enviar = async (e: Event) => {
      const login = e.currentTarget as LoginEl;
      const { username, password } = (e as CustomEvent<{ username: string; password: string }>).detail;
      h.props = { ocupado: true, error: '' };
      try {
        await iniciarSesion(username, password);
        login.reset();
        ir(VISTA_SESION);
      } catch (err) {
        h.props = { error: mensajeAcceso(mensajeDe(err)) };
      } finally {
        h.props = { ocupado: false };
      }
    };
    root.append(html`
      <div class="pagina" part="pagina">
        <iswc-card class="panel" part="panel" variant="filled-outlined">
          <strong slot="header">Entrar a Avatar</strong>
          <iswc-tab-group active="entrar" without-scroll-controls>
            <iswc-tab slot="nav" panel="entrar">Entrar</iswc-tab>
            <iswc-tab slot="nav" panel="como">Entrar como…</iswc-tab>
            <iswc-tab-panel name="entrar">
              <iswc-login id="login" compact provider="Avatar" password-toggle ?busy=${props.ocupado} error=${props.error} oniswc-login-submit=${enviar}></iswc-login>
            </iswc-tab-panel>
            <iswc-tab-panel name="como"><av-perfiles-lista></av-perfiles-lista></iswc-tab-panel>
          </iswc-tab-group>
        </iswc-card>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="marca"></av-escena>
        </aside>
      </div>
    `);
    // Provisional para las pruebas: el formulario arranca con el primer perfil que trabaja con la empresa.
    const login = root.querySelector('#login') as LoginEl;
    void perfilesPrueba().then(async (perfiles) => {
      const primera = perfiles.find((p) => p.iusuario === 'ana') ?? perfiles[0];
      await customElements.whenDefined('iswc-login');
      if (primera) rellenar(login, primera.iusuario, primera.pin);
    }).catch(() => undefined);
  },
  // Repintado parcial: ocupado/error solo tocan atributos del login (el formulario conserva lo escrito).
  (root, props) => {
    const login = root.querySelector('#login') as LoginEl | null;
    if (!login) return false;
    login.busy = props.ocupado;
    if (props.error) login.setAttribute('error', props.error);
    else login.removeAttribute('error');
    return true;
  },
);

define('av-acceso', AvAcceso);
