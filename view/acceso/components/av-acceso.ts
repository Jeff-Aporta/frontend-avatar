/**
 * <av-acceso> — shell del login: `<iswc-login>` del kit (no autentica: emite `iswc-login-submit`) + las cuentas de prueba.
 * Al enviar llama `iniciarSesion` (POST usuarios/login vía el plugin identity de DER) y navega al panel.
 * «Usar» en las credenciales demo rellena el formulario del kit a través de sus campos (`iswc-input` internos).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvAccesoProps } from '../../../src/js/consts/schemas/acceso.schemas.js';
import { iniciarSesion, mensajeDe } from '../../../src/js/core/api.js';
import { ir, VISTA_SESION } from '../../../src/js/core/router.js';
import { credencialesDemo, mensajeAcceso } from '../utils/demo.js';
import './av-credenciales-demo.js';

type LoginEl = HTMLElement & { busy: boolean; reset(): void; focus(): void };
type Host = HTMLElement & { props: Partial<AvAccesoProps> };
type ConProps = HTMLElement & { props: Record<string, unknown> };

/** Escribe usuario y contraseña en los campos internos del `<iswc-login>` (misma técnica que un gestor de contraseñas). */
export function rellenar(login: HTMLElement, usuario: string, password: string): void {
  const campos = login.shadowRoot?.querySelectorAll<HTMLElement & { value: string }>('iswc-input') ?? [];
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
    const usar = (e: Event) => {
      const { usuario, password } = (e as CustomEvent<{ usuario: string; password: string }>).detail;
      const login = root.querySelector('#login') as LoginEl | null;
      if (login) {
        rellenar(login, usuario, password);
        login.focus();
      }
    };
    root.append(html`
      <div class="pagina" part="pagina">
        <section class="panel" part="panel">
          <iswc-login id="login" heading="Entrar a Avatar" subtitle="Tu equipo, tus canales y tus proyectos en un solo lugar" provider="Avatar" password-toggle ?busy=${props.ocupado} error=${props.error} oniswc-login-submit=${enviar}></iswc-login>
          <av-credenciales-demo id="demo" onav-credencial-elegida=${usar}></av-credenciales-demo>
        </section>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="acceso"></av-escena>
        </aside>
      </div>
    `);
    (root.querySelector('#demo') as ConProps).props = { items: credencialesDemo() };
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
