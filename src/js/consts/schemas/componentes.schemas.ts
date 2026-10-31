/**
 * componentes.schemas.ts — forma de las `props` de los componentes TRANSVERSALES (`src/js/components/av/`) y tipos
 * auxiliares de la base. Cada vista tiene su propio `<vista>.schemas.ts` en esta carpeta con las props de sus piezas.
 *
 * Regla: los tipos salen de `z.infer<>`; no hay `type`/`interface` sueltos fuera de `*.schemas.ts`.
 * Datos que vienen de fuera (API, URL, almacenamiento) se PARSEAN con su schema (`safeParse`), nunca se castean con `as`.
 */
import { z } from '../../base/zod.js';
import { PerfilPruebaSchema } from './api.schemas.js';

/** Ruta de la app: vista (una página real por vista) e id opcional del registro abierto (viaja en el historial). */
export const RutaSchema = z.object({ vista: z.string(), id: z.string().nullable() });
export type Ruta = z.infer<typeof RutaSchema>;

/** `<av-app>`: el shell. Recibe la ruta activa (la fija el router) y si la sesión ya se restauró. */
export const AvAppPropsSchema = z.object({
  vista: z.string().default('inicio'),
  id: z.string().nullable().default(null),
  listo: z.boolean().default(false),
  /** Sube al cambiar de empresa: remonta solo el contenido de la vista. */
  version: z.number().default(0),
});
export type AvAppProps = z.infer<typeof AvAppPropsSchema>;

/** `<av-logo>`: logo de Avatar en SVG con los tokens de la paleta; `wordmark` agrega el nombre; `animado` hace orbitar el satélite. */
export const AvLogoPropsSchema = z.object({
  wordmark: z.boolean().default(false),
  animado: z.boolean().default(false),
});
export type AvLogoProps = z.infer<typeof AvLogoPropsSchema>;

/** Un indicador (KPI) para `<iswc-stat-group>`: lo que devuelven los `indicadores*` de cada vista. */
export const IndicadorSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  helper: z.string().default(''),
  icon: z.string().default(''),
  color: z.enum(['brand', 'neutral', 'success', 'warning', 'danger']).default('brand'),
  trend: z.string().default(''),
  trendDirection: z.enum(['up', 'down', 'flat', '']).default(''),
});
export type Indicador = z.infer<typeof IndicadorSchema>;

/** `<av-escena>`: ilustración Memphis por capas (`core/escenas.ts`); `etiqueta` la vuelve informativa para lectores de pantalla. */
export const AvEscenaPropsSchema = z.object({
  escena: z.string().default('bienvenida'),
  etiqueta: z.string().default(''),
});
export type AvEscenaProps = z.infer<typeof AvEscenaPropsSchema>;

/** `<av-perfil-selector>`: cambia de perfil; sin sesión guardada para ese perfil pide su PIN. */
export const AvPerfilSelectorPropsSchema = z.object({ perfiles: z.array(PerfilPruebaSchema).default([]), activo: z.string().default('') });
export type AvPerfilSelectorProps = z.infer<typeof AvPerfilSelectorPropsSchema>;
/** `<av-perfiles-tabla>`: diálogo con usuario, nombre, rol y PIN de los perfiles de prueba. */
export const AvPerfilesTablaPropsSchema = z.object({ abierto: z.boolean().default(false), perfiles: z.array(PerfilPruebaSchema).default([]) });
export type AvPerfilesTablaProps = z.infer<typeof AvPerfilesTablaPropsSchema>;

/** Props de los transversales, por tag (lo lee `props-registro.ts`). */
export const APP_PROPS = {
  'av-app': AvAppPropsSchema,
  'av-logo': AvLogoPropsSchema,
  'av-escena': AvEscenaPropsSchema,
  'av-perfil-selector': AvPerfilSelectorPropsSchema,
  'av-perfiles-tabla': AvPerfilesTablaPropsSchema,
} as const;

/** Base (`componente.ts`): atributos e hijos del helper `el()`. */
export type Atributos = Record<string, unknown>;
export type Hijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
