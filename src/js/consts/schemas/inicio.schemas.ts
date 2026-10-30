/**
 * inicio.schemas.ts — props de los componentes de la landing (`view/inicio/components/`) y el dominio de la portada.
 */
import { z } from '../../base/zod.js';

/** Tarjeta de característica de la landing. */
export const CaracteristicaSchema = z.object({ icono: z.string(), titulo: z.string().min(1), texto: z.string().min(1) });
export type Caracteristica = z.infer<typeof CaracteristicaSchema>;

/** Plan de precios. */
export const PlanSchema = z.object({ id: z.string(), titulo: z.string().min(1), precio: z.string().min(1), periodo: z.string(), destacado: z.boolean().default(false), incluye: z.array(z.string()) });
export type Plan = z.infer<typeof PlanSchema>;

/** `<av-inicio>` (shell): nada que configurar; `sesion` decide el texto del botón principal. */
export const AvInicioPropsSchema = z.object({ sesion: z.boolean().default(false) });
export type AvInicioProps = z.infer<typeof AvInicioPropsSchema>;

/** `<av-hero>`: portada. */
export const AvHeroPropsSchema = z.object({ sesion: z.boolean().default(false) });
export type AvHeroProps = z.infer<typeof AvHeroPropsSchema>;

/** `<av-caracteristicas>`: tarjetas. */
export const AvCaracteristicasPropsSchema = z.object({ items: z.array(CaracteristicaSchema).default([]) });
export type AvCaracteristicasProps = z.infer<typeof AvCaracteristicasPropsSchema>;

/** `<av-precios>`: planes. */
export const AvPreciosPropsSchema = z.object({ planes: z.array(PlanSchema).default([]) });
export type AvPreciosProps = z.infer<typeof AvPreciosPropsSchema>;

/** Props de la vista, por tag. */
export const INICIO_PROPS = {
  'av-inicio': AvInicioPropsSchema,
  'av-hero': AvHeroPropsSchema,
  'av-caracteristicas': AvCaracteristicasPropsSchema,
  'av-precios': AvPreciosPropsSchema,
} as const;
