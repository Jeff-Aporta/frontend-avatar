/**
 * <av-admin> — shell de Administración: pestañas Usuarios | Roles y permisos | Mi cuenta. Solo con `avatar.seguridad`
 * (si no, «Sin permiso»; Mi cuenta sí la ve cualquiera). Habla con los plugins de identidad (`auth()`) y permisos
 * (`permisos()`) de DER y reparte props; los hijos solo pintan y emiten `av-*`.
 */
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { z } from '../../../src/js/base/zod.js';
import type { AvAdminProps, Rol, RolUsuario, Usuario, UsuarioForm } from '../../../src/js/consts/schemas/admin.schemas.js';
import { AccionRolSchema, CatalogoEntradaSchema, RolSchema, RolUsuarioSchema, SesionSchema, UsuarioSchema } from '../../../src/js/consts/schemas/admin.schemas.js';
import { auth, cerrarSesion, mensajeDe, permisos, refrescarPermisos } from '../../../src/js/core/api.js';
import { estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { ir } from '../../../src/js/core/router.js';
import { cuerpoUsuario, GRUPO } from '../utils/admin.js';
import './av-usuario-form.js';
import './av-usuarios.js';
import './av-roles.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Host = HTMLElement & { props: Partial<AvAdminProps> };
type Campo = HTMLElement & { value: string };

const plano = (p: unknown): unknown => (p && typeof p === 'object' && 'toJSON' in p && typeof (p as { toJSON: unknown }).toJSON === 'function' ? (p as { toJSON(): unknown }).toJSON() : p);
const planos = (lista: unknown): unknown[] => (Array.isArray(lista) ? lista.map(plano) : []);
const fecha = (v: unknown): string => (v instanceof Date ? v.toISOString() : typeof v === 'string' ? v : '');

const AvAdmin = crearComponente<AvAdminProps>(import.meta.url, 'av-admin', { id: null, pestana: 'usuarios', version: 0 }, (root, props, host) => {
  const h = host as Host;
  const admin = puede(estado.perfil, ACCION.seguridad, 'PUT');
  const q = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T | null;
  const fallo = (err: unknown) => avisar(mensajeDe(err), 'danger');
  const ctl = (plugin: 'auth' | 'permisos', clave: string) => {
    const c = (plugin === 'auth' ? auth() : permisos()).controllers[clave];
    if (!c) throw new Error(`No hay controller ${clave}`);
    return c;
  };

  // ---- usuarios
  let usuarios: Usuario[] = [];
  let roles: Rol[] = [];
  let asignaciones: RolUsuario[] = [];
  const cargarUsuarios = async () => {
    const u = q<ConProps>('#usuarios');
    if (!u) return;
    u.props = { cargando: true };
    try {
      const [lu, lr, la] = await Promise.all([ctl('auth', 'usuarios').list(), ctl('permisos', 'roles').query({ where: { igrupo: GRUPO } }), ctl('permisos', 'rolesUsuario').list()]);
      const ru = z.array(UsuarioSchema).safeParse(planos(lu));
      const rr = z.array(RolSchema).safeParse(planos(lr));
      const ra = z.array(RolUsuarioSchema).safeParse(planos(la));
      usuarios = ru.success ? ru.data : [];
      roles = rr.success ? rr.data : [];
      asignaciones = ra.success ? ra.data : [];
    } catch (err) {
      fallo(err);
    }
    u.props = { items: usuarios, roles, asignaciones, cargando: false };
  };
  const abrirUsuario = (datos: UsuarioForm) => (q<ConProps>('#usuario-form')!.props = { abierto: true, datos, error: '', ocupado: false });
  const guardarUsuario = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: UsuarioForm }>).detail;
    const form = q<ConProps>('#usuario-form')!;
    form.props = { ocupado: true, error: '' };
    try {
      const c = ctl('auth', 'usuarios');
      if (datos.nuevo) await c.post(c.pojo(cuerpoUsuario(datos)));
      else await c.put(c.pojo(cuerpoUsuario(datos)));
      form.props = { abierto: false, ocupado: false };
      avisar(datos.nuevo ? `Usuario ${datos.iusuario} creado` : 'Usuario actualizado', 'success');
      await cargarUsuarios();
    } catch (err) {
      form.props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const editarUsuario = (e: Event) => {
    const { iusuario } = (e as CustomEvent<{ iusuario: string }>).detail;
    const u = usuarios.find((x) => x.iusuario === iusuario);
    if (u) abrirUsuario({ nuevo: false, iusuario: u.iusuario, nombre: u.nombre ?? '', email: u.email ?? '', password: '', bactivo: u.bactivo !== false });
  };
  const eliminarUsuario = async (e: Event) => {
    const { iusuario } = (e as CustomEvent<{ iusuario: string }>).detail;
    if (iusuario === estado.yo?.iusuario) return avisar('No puedes eliminar tu propio usuario', 'warning');
    try {
      const c = ctl('auth', 'usuarios');
      await c.delete(c.pojo({ iusuario }));
      avisar(`Usuario ${iusuario} eliminado`, 'neutral');
      await cargarUsuarios();
    } catch (err) {
      fallo(err);
    }
  };
  const cambiarRol = async (e: Event) => {
    const { iusuario, irol } = (e as CustomEvent<{ iusuario: string; irol: string }>).detail;
    try {
      const c = ctl('permisos', 'rolesUsuario');
      for (const a of asignaciones.filter((x) => x.iusuario === iusuario && x.irol !== irol)) await c.delete(c.pojo({ iusuario, irol: a.irol }));
      if (irol && !asignaciones.some((x) => x.iusuario === iusuario && x.irol === irol)) await c.post(c.pojo({ iusuario, irol, bprincipal: true }));
      avisar(`Rol de ${iusuario} actualizado`, 'success');
      await refrescarPermisos();
      await cargarUsuarios();
    } catch (err) {
      fallo(err);
    }
  };

  // ---- roles
  const cargarRoles = async () => {
    const r = q<ConProps>('#roles');
    if (!r) return;
    r.props = { cargando: true, error: '' };
    try {
      const [lr, la, cat] = await Promise.all([ctl('permisos', 'roles').query({ where: { igrupo: GRUPO } }), ctl('permisos', 'acciones').list(), permisos()['catalog']()]);
      const rr = z.array(RolSchema).safeParse(planos(lr));
      const ra = z.array(AccionRolSchema).safeParse(planos(la));
      const rc = z.array(CatalogoEntradaSchema).safeParse(cat);
      const ids = new Set((rr.success ? rr.data : []).map((x) => x.irol));
      r.props = { roles: rr.success ? rr.data : [], acciones: ra.success ? ra.data.filter((a) => ids.has(a.irol)) : [], catalogo: rc.success ? rc.data : [], cargando: false };
    } catch (err) {
      r.props = { cargando: false, error: mensajeDe(err) };
    }
  };
  const conRoles = async (fn: () => Promise<unknown>, ok: string) => {
    const r = q<ConProps>('#roles')!;
    r.props = { ocupado: true, error: '' };
    try {
      await fn();
      avisar(ok, 'success');
      await refrescarPermisos();
      r.props = { ocupado: false };
      await cargarRoles();
    } catch (err) {
      r.props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const crearRol = (e: Event) => {
    const { irol, nombre } = (e as CustomEvent<{ irol: string; nombre: string }>).detail;
    const c = ctl('permisos', 'roles');
    void conRoles(() => c.post(c.pojo({ irol, igrupo: GRUPO, nombre, bactivo: true })), `Rol ${irol} creado`);
  };
  const ponerAccion = (e: Event) => {
    const { irol, iaccion, valor } = (e as CustomEvent<{ irol: string; iaccion: string; valor: boolean }>).detail;
    void conRoles(() => permisos()['load']({ acciones: [{ irol, iaccion, valor }] }), `${iaccion} → ${irol}`);
  };
  const quitarAccion = (e: Event) => {
    const { irol, iaccion } = (e as CustomEvent<{ irol: string; iaccion: string }>).detail;
    const c = ctl('permisos', 'acciones');
    void conRoles(() => c.delete(c.pojo({ irol, iaccion })), `Acción ${iaccion} quitada de ${irol}`);
  };

  // ---- mi cuenta
  const cargarSesiones = async () => {
    const lista = q<HTMLElement>('#sesiones');
    if (!lista) return;
    try {
      const r = z.array(SesionSchema).safeParse(await auth()['sessions']());
      const sesiones = r.success ? r.data : [];
      lista.replaceChildren(html`${sesiones.map((s) => html`
        <li class="sesion" data-actual=${s.actual ? '1' : '0'}>
          <iswc-icon icon=${/m[oó]vil|android|iphone/i.test(s.dispositivo ?? '') ? 'mdi:cellphone' : 'mdi:monitor'}></iswc-icon>
          <span class="texto"><strong>${s.navegador ?? 'Navegador'} · ${s.so ?? 'SO'}</strong><span>${s.ip ?? ''}${s.actual ? ' · esta sesión' : ''}</span></span>
          ${fecha(s.ultimo_acceso ?? s.emitido) ? html`<iswc-relative-time date=${fecha(s.ultimo_acceso ?? s.emitido)} format="short"></iswc-relative-time>` : html`<span></span>`}
        </li>`)}`);
    } catch (err) {
      fallo(err);
    }
  };
  const cambiarClave = async () => {
    const actual = q<Campo>('#c-actual')!.value;
    const nueva = q<Campo>('#c-nueva')!.value;
    const repetir = q<Campo>('#c-repetir')!.value;
    if (nueva.length < 8) return avisar('La nueva contraseña debe tener al menos 8 caracteres', 'warning');
    if (nueva !== repetir) return avisar('Las contraseñas no coinciden', 'warning');
    try {
      await auth()['changePassword']({ actual, nueva });
      for (const id of ['#c-actual', '#c-nueva', '#c-repetir']) q<Campo>(id)!.value = '';
      avisar('Contraseña actualizada; las demás sesiones se cerraron', 'success');
      await cargarSesiones();
    } catch (err) {
      fallo(err);
    }
  };
  const cerrarTodas = async () => {
    try {
      await auth()['logoutAll']();
    } catch (err) {
      fallo(err);
    }
    await cerrarSesion();
    ir('acceso');
  };

  const cambiarPestana = (e: Event) => {
    const { name } = (e as CustomEvent<{ name: string }>).detail;
    if (name === 'usuarios' || name === 'roles' || name === 'cuenta') h.props.pestana = name;
  };
  const pestanaInicial = admin ? props.pestana : 'cuenta';

  root.append(html`
    <div class="pagina" part="pagina"
      onav-usuario-nuevo=${() => abrirUsuario({ nuevo: true, iusuario: '', nombre: '', email: '', password: '', bactivo: true })}
      onav-usuario-editar=${editarUsuario} onav-usuario-eliminar=${eliminarUsuario} onav-usuario-rol=${cambiarRol}
      onav-usuario-guardar=${guardarUsuario} onav-usuario-cerrar=${() => (q<ConProps>('#usuario-form')!.props = { abierto: false })}
      onav-rol-crear=${crearRol} onav-accion-poner=${ponerAccion} onav-accion-quitar=${quitarAccion}>
      <av-cabecera id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${() => (h.props = { version: (props.version ?? 0) + 1 })}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
      </av-cabecera>
      ${admin ? null : html`<av-vacio id="sin-permiso"></av-vacio>`}
      <iswc-tab-group active=${pestanaInicial} oniswc-tab-show=${cambiarPestana}>
        ${admin ? html`<iswc-tab slot="nav" panel="usuarios"><iswc-icon slot="start" icon="mdi:account-multiple-outline"></iswc-icon>Usuarios</iswc-tab>
          <iswc-tab slot="nav" panel="roles"><iswc-icon slot="start" icon="mdi:shield-key-outline"></iswc-icon>Roles y permisos</iswc-tab>` : null}
        <iswc-tab slot="nav" panel="cuenta"><iswc-icon slot="start" icon="mdi:account-cog-outline"></iswc-icon>Mi cuenta</iswc-tab>
        ${admin ? html`<iswc-tab-panel name="usuarios"><av-usuarios id="usuarios"></av-usuarios></iswc-tab-panel>
          <iswc-tab-panel name="roles"><av-roles id="roles"></av-roles></iswc-tab-panel>` : null}
        <iswc-tab-panel name="cuenta">
          <div class="cuenta">
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:lock-reset"></iswc-icon> Cambiar contraseña</strong>
              <div class="campos">
                <iswc-input id="c-actual" type="password" label="Contraseña actual" password-toggle autocomplete="current-password"></iswc-input>
                <iswc-input id="c-nueva" type="password" label="Nueva contraseña" password-toggle autocomplete="new-password" hint="Mínimo 8 caracteres"></iswc-input>
                <iswc-input id="c-repetir" type="password" label="Repetir nueva" password-toggle autocomplete="new-password"></iswc-input>
              </div>
              <iswc-button slot="footer" id="cambiar-clave" color="brand" oniswc-click=${cambiarClave}>Cambiar contraseña</iswc-button>
            </iswc-card>
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:devices"></iswc-icon> Sesiones activas</strong>
              <iswc-button slot="header-actions" variant="plain" color="neutral" oniswc-click=${cargarSesiones}><iswc-icon icon="mdi:refresh"></iswc-icon></iswc-button>
              <ul id="sesiones" class="sesiones"></ul>
              <iswc-button slot="footer" id="cerrar-todas" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:logout"></iswc-icon>Cerrar todas las sesiones</iswc-button>
              <iswc-popconfirm for="cerrar-todas" message="Se cerrará tu sesión en todos los dispositivos, también en este." oniswc-popconfirm-confirm=${cerrarTodas}>
                <iswc-button slot="confirm" color="danger">Cerrar todas</iswc-button>
                <iswc-button slot="cancel" variant="outlined" color="neutral">Cancelar</iswc-button>
              </iswc-popconfirm>
            </iswc-card>
          </div>
        </iswc-tab-panel>
      </iswc-tab-group>
      <av-usuario-form id="usuario-form"></av-usuario-form>
    </div>
  `);
  q<ConProps>('#cabecera')!.props = { titulo: 'Administración', subtitulo: admin ? 'Usuarios, roles y permisos de Avatar' : 'Tu cuenta y tus sesiones', icono: 'mdi:shield-account-outline' };
  const sinPermiso = q<ConProps>('#sin-permiso');
  if (sinPermiso) sinPermiso.props = { icono: 'mdi:shield-lock-outline', titulo: 'Sin permiso de administración', texto: 'Solo un administrador gestiona usuarios y roles. Aquí puedes administrar tu cuenta.' };
  void cargarSesiones();
  if (!admin) return;
  void cargarUsuarios();
  void cargarRoles();
});

define('av-admin', AvAdmin);
