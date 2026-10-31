/**
 * admin.schemas.ts — props de los componentes de la vista `admin` (`view/admin/components/`) y la forma de lo que
 * llega de los plugins de identidad y permisos de DER (usuarios, roles, acciones, catálogo, sesiones). Lo externo se
 * parsea con `safeParse`; el mapa `ADMIN_PROPS` (tag → schema) lo lee `props-registro.ts`.
 */
import { z } from '../../base/zod.js';

/** Usuario del plugin de identidad (POJO plano, sin hash). */
export const UsuarioSchema = z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), email: z.string().nullable().optional(), bactivo: z.boolean().nullable().optional(), creado: z.union([z.string(), z.date()]).nullable().optional() });
export type Usuario = z.infer<typeof UsuarioSchema>;

/** Rol del plugin de permisos. */
export const RolSchema = z.object({ irol: z.string(), igrupo: z.string(), nombre: z.string().nullable().optional(), bactivo: z.boolean().nullable().optional() });
export type Rol = z.infer<typeof RolSchema>;

/** Rol asignado a un usuario. */
export const RolUsuarioSchema = z.object({ iusuario: z.string(), irol: z.string(), bprincipal: z.boolean().nullable().optional(), finicial: z.union([z.string(), z.date()]).nullable().optional(), ffinal: z.union([z.string(), z.date()]).nullable().optional() });
export type RolUsuario = z.infer<typeof RolUsuarioSchema>;

/** Acción de un rol (valor JSON: true/false/objeto por verbo). */
export const AccionRolSchema = z.object({ irol: z.string(), iaccion: z.string(), valor: z.unknown().optional() });
export type AccionRol = z.infer<typeof AccionRolSchema>;

/** Entrada del catálogo de acciones (`GET /permisos?catalogo=1`). */
export const CatalogoEntradaSchema = z.object({ id: z.string(), routes: z.array(z.object({ id: z.string().optional(), method: z.string().optional(), path: z.string().optional() })).default([]) });
export type CatalogoEntrada = z.infer<typeof CatalogoEntradaSchema>;

/** Sesión vigente (`GET usuario/sessions`). */
export const SesionSchema = z.object({ jti: z.string().optional(), id: z.string().optional(), ip: z.string().nullable().optional(), dispositivo: z.string().nullable().optional(), so: z.string().nullable().optional(), navegador: z.string().nullable().optional(), ultimo_acceso: z.union([z.string(), z.date()]).nullable().optional(), emitido: z.union([z.string(), z.date()]).nullable().optional(), expira: z.union([z.string(), z.date()]).nullable().optional(), actual: z.boolean().nullable().optional() });
export type Sesion = z.infer<typeof SesionSchema>;

/** Datos del formulario de usuario. */
export const UsuarioFormSchema = z.object({ nuevo: z.boolean().default(true), iusuario: z.string().default(''), nombre: z.string().default(''), email: z.string().default(''), password: z.string().default(''), bactivo: z.boolean().default(true) });
export type UsuarioForm = z.infer<typeof UsuarioFormSchema>;

/** `<av-admin>` (shell): id de la ruta, pestaña y versión para recargar. */
export const AvAdminPropsSchema = z.object({ id: z.string().nullable().default(null), pestana: z.enum(['usuarios', 'roles', 'almacenamiento', 'cuenta']).default('usuarios'), version: z.number().default(0) });
export type AvAdminProps = z.infer<typeof AvAdminPropsSchema>;

/** `<av-usuario-form>`: diálogo crear/editar usuario. Emite `av-usuario-guardar { datos }` y `av-usuario-cerrar`. */
export const AvUsuarioFormPropsSchema = z.object({ abierto: z.boolean().default(false), datos: UsuarioFormSchema.default({ nuevo: true, iusuario: '', nombre: '', email: '', password: '', bactivo: true }), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvUsuarioFormProps = z.infer<typeof AvUsuarioFormPropsSchema>;

/** `<av-usuarios>`: lista de usuarios con su rol principal. Emite `av-usuario-nuevo`, `av-usuario-editar`, `av-usuario-eliminar`, `av-usuario-rol`. */
export const AvUsuariosPropsSchema = z.object({ items: z.array(UsuarioSchema).default([]), roles: z.array(RolSchema).default([]), asignaciones: z.array(RolUsuarioSchema).default([]), cargando: z.boolean().default(false) });
export type AvUsuariosProps = z.infer<typeof AvUsuariosPropsSchema>;

/** `<av-roles>`: roles con sus acciones y catálogo. Emite `av-rol-crear`, `av-accion-poner`, `av-accion-quitar`. */
export const AvRolesPropsSchema = z.object({ roles: z.array(RolSchema).default([]), acciones: z.array(AccionRolSchema).default([]), catalogo: z.array(CatalogoEntradaSchema).default([]), cargando: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvRolesProps = z.infer<typeof AvRolesPropsSchema>;

/** Props de la vista, por tag. */
/** `<av-almacenamiento>`: límite por archivo y uso del almacenamiento; emite `av-almacenamiento-guardar { max_mb }`. */
export const AvAlmacenamientoPropsSchema = z.object({ maxMb: z.number().default(30), topeMb: z.number().default(95), archivos: z.number().nullable().default(null), bytes: z.number().nullable().default(null), ocupado: z.boolean().default(false) });
export type AvAlmacenamientoProps = z.infer<typeof AvAlmacenamientoPropsSchema>;

export const ADMIN_PROPS = {
  'av-almacenamiento': AvAlmacenamientoPropsSchema,
  'av-admin': AvAdminPropsSchema,
  'av-usuario-form': AvUsuarioFormPropsSchema,
  'av-usuarios': AvUsuariosPropsSchema,
  'av-roles': AvRolesPropsSchema,
} as const;
