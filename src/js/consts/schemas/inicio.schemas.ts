/**
 * inicio.schemas.ts — props de los componentes de la landing (`view/inicio/components/`) y el dominio de la portada.
 */
import { z } from '../../base/zod.js';

/** Tarjeta de característica de la landing (ícono, título y texto). */
export const CaracteristicaSchema = z.object({ icono: z.string(), titulo: z.string().min(1), texto: z.string().min(1) });
export type Caracteristica = z.infer<typeof CaracteristicaSchema>;

/** Pilar de «software abierto» (misma forma que una característica). */
export const PilarSchema = CaracteristicaSchema;
export type Pilar = z.infer<typeof PilarSchema>;

/** Plan de precios. */
export const PlanSchema = z.object({ id: z.string(), titulo: z.string().min(1), precio: z.string().min(1), periodo: z.string(), destacado: z.boolean().default(false), incluye: z.array(z.string()) });
export type Plan = z.infer<typeof PlanSchema>;

/** Cifra destacada de la comunidad. */
export const CifraSchema = z.object({ valor: z.string(), etiqueta: z.string() });
export type Cifra = z.infer<typeof CifraSchema>;

/** `<av-inicio>` (shell): `sesion` decide el texto del botón principal. */
export const AvInicioPropsSchema = z.object({ sesion: z.boolean().default(false) });
export type AvInicioProps = z.infer<typeof AvInicioPropsSchema>;

/** `<av-hero>`: portada con banner teñido por la paleta. */
export const AvHeroPropsSchema = z.object({ sesion: z.boolean().default(false) });
export type AvHeroProps = z.infer<typeof AvHeroPropsSchema>;

/** `<av-caracteristicas>`: sección con título y tarjetas; `variante` = tarjetas (con borde) o iconos (grandes, sin caja). */
export const AvCaracteristicasPropsSchema = z.object({
  titulo: z.string().default('Características principales'),
  subtitulo: z.string().default(''),
  items: z.array(CaracteristicaSchema).default([]),
  variante: z.enum(['tarjetas', 'iconos']).default('tarjetas'),
});
export type AvCaracteristicasProps = z.infer<typeof AvCaracteristicasPropsSchema>;

/** `<av-precios>`: planes. */
export const AvPreciosPropsSchema = z.object({ planes: z.array(PlanSchema).default([]) });
export type AvPreciosProps = z.infer<typeof AvPreciosPropsSchema>;

/** `<av-comunidad>`: franja de personas que rotan, título, texto y cifras. */
export const AvComunidadPropsSchema = z.object({
  titulo: z.string().default(''),
  texto: z.string().default(''),
  personas: z.array(z.string()).default([]),
  cifras: z.array(CifraSchema).default([]),
});
export type AvComunidadProps = z.infer<typeof AvComunidadPropsSchema>;

/** `<av-abierto>`: «software abierto» con seis pilares. */
export const AvAbiertoPropsSchema = z.object({ titulo: z.string().default(''), pilares: z.array(PilarSchema).default([]) });
export type AvAbiertoProps = z.infer<typeof AvAbiertoPropsSchema>;

/** Props de la vista, por tag. */
export const INICIO_PROPS = {
  'av-inicio': AvInicioPropsSchema,
  'av-hero': AvHeroPropsSchema,
  'av-caracteristicas': AvCaracteristicasPropsSchema,
  'av-precios': AvPreciosPropsSchema,
  'av-comunidad': AvComunidadPropsSchema,
  'av-abierto': AvAbiertoPropsSchema,
} as const;
