/**
 * organizacion.schemas.ts — props de los componentes de la vista `organizacion` (`view/organizacion/components/`) y
 * la forma de lo que llega del API para esta vista (empresa, miembro, equipo, integrante, usuario). Lo externo se
 * parsea con `safeParse`; el mapa `ORGANIZACION_PROPS` (tag → schema) lo lee `props-registro.ts`.
 */
import { z } from '../../base/zod.js';

/** Roles de un miembro dentro de la empresa (los del DER). */
export const ROLES_EMPRESA = ['propietario', 'admin', 'miembro', 'invitado'] as const;
/** Roles dentro de un equipo. */
export const ROLES_EQUIPO = ['lider', 'integrante'] as const;

/** Usuario mínimo (de la relación `usuario` o de `identity.usuarios`). */
export const UsuarioMinSchema = z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), email: z.string().nullable().optional(), bactivo: z.boolean().nullable().optional() });
export type UsuarioMin = z.infer<typeof UsuarioMinSchema>;

/** Empresa (POJO plano). */
export const EmpresaSchema = z.object({ iempresa: z.number(), nombre: z.string(), nit: z.string().nullable().optional(), sector: z.string().nullable().optional(), descripcion: z.string().nullable().optional(), logo: z.string().nullable().optional(), bactivo: z.boolean().nullable().optional(), creado: z.union([z.string(), z.date()]).nullable().optional() });
export type Empresa = z.infer<typeof EmpresaSchema>;

/** Miembro con su usuario incluido. */
export const MiembroSchema = z.object({ iempresa: z.number(), iusuario: z.string(), rol: z.string(), cargo: z.string().nullable().optional(), creado: z.union([z.string(), z.date()]).nullable().optional(), usuario: UsuarioMinSchema.nullable().optional() });
export type Miembro = z.infer<typeof MiembroSchema>;

/** Integrante de un equipo con su usuario. */
export const IntegranteSchema = z.object({ iequipo: z.number(), iusuario: z.string(), rol: z.string(), usuario: UsuarioMinSchema.nullable().optional() });
export type Integrante = z.infer<typeof IntegranteSchema>;

/** Equipo (POJO plano) más sus integrantes ya cargados. */
export const EquipoSchema = z.object({ iequipo: z.number(), iempresa: z.number(), nombre: z.string(), descripcion: z.string().nullable().optional(), color: z.string().nullable().optional(), integrantes: z.array(IntegranteSchema).default([]) });
export type Equipo = z.infer<typeof EquipoSchema>;

/** Datos del formulario de empresa. */
export const EmpresaFormSchema = z.object({ iempresa: z.number().nullable().default(null), nombre: z.string().default(''), nit: z.string().default(''), sector: z.string().default(''), descripcion: z.string().default('') });
export type EmpresaForm = z.infer<typeof EmpresaFormSchema>;

/** Datos del formulario de invitación. */
export const InvitarFormSchema = z.object({ iusuario: z.string().default(''), rol: z.enum(ROLES_EMPRESA).default('miembro'), cargo: z.string().default('') });
export type InvitarForm = z.infer<typeof InvitarFormSchema>;

/** `<av-organizacion>` (shell): id de la ruta, pestaña activa y versión para recargar. */
export const AvOrganizacionPropsSchema = z.object({ id: z.string().nullable().default(null), pestana: z.enum(['empresa', 'miembros', 'equipos']).default('empresa'), version: z.number().default(0) });
export type AvOrganizacionProps = z.infer<typeof AvOrganizacionPropsSchema>;

/** `<av-empresa-form>`: diálogo crear/editar empresa. Emite `av-empresa-guardar { datos }` y `av-empresa-cerrar`. */
export const AvEmpresaFormPropsSchema = z.object({ abierto: z.boolean().default(false), datos: EmpresaFormSchema.default({ iempresa: null, nombre: '', nit: '', sector: '', descripcion: '' }), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvEmpresaFormProps = z.infer<typeof AvEmpresaFormPropsSchema>;

/** `<av-invitar-form>`: diálogo invitar miembro. Emite `av-invitar-guardar { datos }` y `av-invitar-cerrar`. */
export const AvInvitarFormPropsSchema = z.object({ abierto: z.boolean().default(false), usuarios: z.array(UsuarioMinSchema).default([]), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvInvitarFormProps = z.infer<typeof AvInvitarFormPropsSchema>;

/** `<av-miembros>`: lista de miembros. Emite `av-miembro-quitar { iusuario }` y `av-miembros-invitar`. */
export const AvMiembrosPropsSchema = z.object({ items: z.array(MiembroSchema).default([]), cargando: z.boolean().default(false), puedeGestionar: z.boolean().default(false) });
export type AvMiembrosProps = z.infer<typeof AvMiembrosPropsSchema>;

/** `<av-equipos>`: tarjetas de equipos con integrantes. Emite `av-equipo-guardar`, `av-equipo-eliminar`, `av-integrante-agregar`, `av-integrante-quitar`. */
export const AvEquiposPropsSchema = z.object({ items: z.array(EquipoSchema).default([]), miembros: z.array(MiembroSchema).default([]), cargando: z.boolean().default(false), puedeGestionar: z.boolean().default(false), ocupado: z.boolean().default(false), error: z.string().default('') });
export type AvEquiposProps = z.infer<typeof AvEquiposPropsSchema>;

/** Props de la vista, por tag. */
export const ORGANIZACION_PROPS = {
  'av-organizacion': AvOrganizacionPropsSchema,
  'av-empresa-form': AvEmpresaFormPropsSchema,
  'av-invitar-form': AvInvitarFormPropsSchema,
  'av-miembros': AvMiembrosPropsSchema,
  'av-equipos': AvEquiposPropsSchema,
} as const;
