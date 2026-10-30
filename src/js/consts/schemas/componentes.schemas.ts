/**
 * componentes.schemas.ts — forma de las `props` de los componentes TRANSVERSALES (`src/js/components/av/`) y tipos
 * auxiliares de la base. Cada vista tiene su propio `<vista>.schemas.ts` en esta carpeta con las props de sus piezas.
 *
 * Regla: los tipos salen de `z.infer<>`; no hay `type`/`interface` sueltos fuera de `*.schemas.ts`.
 * Datos que vienen de fuera (API, URL, almacenamiento) se PARSEAN con su schema (`safeParse`), nunca se castean con `as`.
 */
import { z } from '../../base/zod.js';

/** Ruta de la app: vista e id opcional (`#/canales/12`). */
export const RutaSchema = z.object({ vista: z.string(), id: z.string().nullable() });
export type Ruta = z.infer<typeof RutaSchema>;

/** `<av-app>`: el shell. Recibe la ruta activa (la fija el router) y si la sesión ya se restauró. */
export const AvAppPropsSchema = z.object({
  vista: z.string().default('inicio'),
  id: z.string().nullable().default(null),
  listo: z.boolean().default(false),
});
export type AvAppProps = z.infer<typeof AvAppPropsSchema>;

/** `<av-cabecera>`: título de página, subtítulo e ícono; las acciones van en el slot `acciones`. */
export const AvCabeceraPropsSchema = z.object({
  titulo: z.string().default(''),
  subtitulo: z.string().default(''),
  icono: z.string().default(''),
});
export type AvCabeceraProps = z.infer<typeof AvCabeceraPropsSchema>;

/** `<av-vacio>`: estado vacío / cargando / error con ícono, título y texto; acción en el slot. */
export const AvVacioPropsSchema = z.object({
  icono: z.string().default('mdi:inbox-outline'),
  titulo: z.string().default('Nada por aquí'),
  texto: z.string().default(''),
  estado: z.enum(['vacio', 'cargando', 'error']).default('vacio'),
});
export type AvVacioProps = z.infer<typeof AvVacioPropsSchema>;

/** `<av-persona>`: avatar con iniciales + nombre (o id) de un usuario; `compacto` oculta el nombre. */
export const AvPersonaPropsSchema = z.object({
  iusuario: z.string().default(''),
  nombre: z.string().nullable().default(null),
  detalle: z.string().default(''),
  compacto: z.boolean().default(false),
});
export type AvPersonaProps = z.infer<typeof AvPersonaPropsSchema>;

/** `<av-empresa-selector>`: empresas del usuario y la activa. Emite `av-empresa-cambio { iempresa }`. */
export const AvEmpresaSelectorPropsSchema = z.object({
  empresas: z.array(z.object({ iempresa: z.number(), nombre: z.string(), rol: z.string() })).default([]),
  activa: z.number().nullable().default(null),
});
export type AvEmpresaSelectorProps = z.infer<typeof AvEmpresaSelectorPropsSchema>;

/** Módulo del menú lateral. */
export const ItemMenuSchema = z.object({ id: z.string(), label: z.string(), icon: z.string(), grupo: z.string(), contador: z.number().default(0) });
export type ItemMenu = z.infer<typeof ItemMenuSchema>;

/** `<av-menu>`: menú lateral colapsable del área privada. */
export const AvMenuPropsSchema = z.object({ items: z.array(ItemMenuSchema).default([]), activo: z.string().default(''), plegado: z.boolean().default(false) });
export type AvMenuProps = z.infer<typeof AvMenuPropsSchema>;

/** Props de los transversales, por tag (lo lee `props-registro.ts`). */
export const APP_PROPS = {
  'av-app': AvAppPropsSchema,
  'av-cabecera': AvCabeceraPropsSchema,
  'av-vacio': AvVacioPropsSchema,
  'av-persona': AvPersonaPropsSchema,
  'av-empresa-selector': AvEmpresaSelectorPropsSchema,
  'av-menu': AvMenuPropsSchema,
} as const;

/** Base (`componente.ts`): atributos e hijos del helper `el()`. */
export type Atributos = Record<string, unknown>;
export type Hijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
