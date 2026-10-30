/**
 * api.ts — el cliente DER del front: plugins `avatar` (las catorce entidades + sus paths), `identity` (login JWT,
 * usuarios) y `permissions` (roles) armados con `createClient` contra el API. El token vive en localStorage
 * (`avatar:token`) y viaja en todas las peticiones. Nada de fetch suelto: todo pasa por los controllers y las `ops`.
 */
import { avatar, type ClientController, type ClientPlugin, createClient, identity, permissions, registry } from '@avatar/vendor';
import { apiUrl } from '../consts/config.js';
import { type Perfil, PerfilSchema, type Yo, YoSchema } from '../consts/schemas/api.schemas.js';
import { estado, fijar } from './estado.js';

const CLAVE_TOKEN = 'avatar:token';

function leerToken(): string | null {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

function guardarToken(t: string | null): void {
  try {
    if (t) localStorage.setItem(CLAVE_TOKEN, t);
    else localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    /* sin almacenamiento */
  }
  fijar({ token: t });
}

let plugins: { dominio: ClientPlugin; auth: ClientPlugin; permisos: ClientPlugin } | null = null;

/** Cabeceras de toda petición: el token si lo hay. */
function cabeceras(): HeadersInit {
  const t = estado.token;
  return t ? { authorization: `Bearer ${t}` } : {};
}

/** Arma (una vez) los plugins del cliente contra la URL del API. */
export function conectar(baseUrl = apiUrl()): void {
  const token = leerToken();
  fijar({ token });
  plugins = {
    auth: createClient(identity, { baseUrl, token, onToken: guardarToken }),
    dominio: createClient(avatar, { baseUrl, headers: cabeceras }),
    permisos: createClient(permissions, { baseUrl, headers: cabeceras }),
  };
}

function armados() {
  if (!plugins) conectar();
  return plugins!;
}

/** El plugin del dominio Avatar (`controllers.tareas`, `enviar(icanal, …)`, `tablero(iproyecto)`, `yo()`…). */
export const dominio = (): ClientPlugin => armados().dominio;
/** Plugin de identidad (`controllers.usuarios`, `login`, `logout`, `changePassword`, `sessions`). */
export const auth = (): ClientPlugin => armados().auth;
/** Plugin de permisos (`profile`, `load`, `catalog`, `controllers.roles`…). */
export const permisos = (): ClientPlugin => armados().permisos;

/** ClientController de una entidad del dominio por su clave de plugin (`tareas`, `canales`, …). */
export function controller(clave: string): ClientController<any> {
  const c = armados().dominio.controllers[clave];
  if (!c) throw new Error(`No hay controller "${clave}" en el plugin avatar`);
  return c;
}

/** Entidad registrada por su plural (`tareas`, `usuarios`, `permisos/roles`), o `null`. */
export function entidad(plural: string) {
  return registry.has(plural) ? registry.entity(plural) : null;
}

/** Carga perfil (`empresas/yo`) y permisos (`GET /permisos`) al estado. Un 401 limpia la sesión. */
export async function cargarPerfil(): Promise<Yo | null> {
  if (!estado.token) return null;
  try {
    const [yo, perfil] = await Promise.all([armados().dominio['yo'](), armados().permisos['profile']()]);
    const y = YoSchema.safeParse(yo);
    const p = PerfilSchema.safeParse(perfil);
    if (!y.success) throw new Error(`Perfil inválido: ${y.error.message}`);
    fijar({ yo: y.data, perfil: p.success ? p.data : null });
    return y.data;
  } catch (err) {
    if (/401|vencido|inválido|Sesión/i.test(mensajeDe(err))) await cerrarSesion();
    throw err;
  }
}

/** Inicia sesión (POST usuarios/login vía el plugin: mismo Zod que el server) y carga el perfil. */
export async function iniciarSesion(usuario: string, password: string): Promise<Yo> {
  await armados().auth['login']({ usuario, password });
  const yo = await cargarPerfil();
  if (!yo) throw new Error('No se pudo cargar el perfil');
  return yo;
}

/** Cierra la sesión (revoca en el server si se puede) y limpia el estado. */
export async function cerrarSesion(): Promise<void> {
  try {
    await armados().auth['logout']();
  } catch {
    /* sin red o ya vencida: igual se limpia */
  } finally {
    guardarToken(null);
    fijar({ yo: null, perfil: null });
  }
}

/** Perfil de permisos refrescado (tras cambiar roles). */
export async function refrescarPermisos(): Promise<Perfil | null> {
  const p = PerfilSchema.safeParse(await armados().permisos['profile']());
  fijar({ perfil: p.success ? p.data : null });
  return estado.perfil;
}

/** Mensaje de un error cualquiera (DER lanza `HttpError`/`ValidationError` con `message`). */
export function mensajeDe(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
