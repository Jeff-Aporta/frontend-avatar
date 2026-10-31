/**
 * paty.schemas.ts — props de los componentes traídos de ISW-TestPatyIA (`av-paty-*`), en auditoría para iswc.
 */
import { z } from '../../base/zod.js';

export const PatyJsonValidacionSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()),
  normalized: z.unknown(),
});
export type PatyJsonValidacion = z.infer<typeof PatyJsonValidacionSchema>;

export const PatyJsonDialogPropsSchema = z.object({
  open: z.boolean(),
  titulo: z.string(),
  valor: z.string(),
  readonly: z.boolean(),
  validar: z.custom<(texto: string) => PatyJsonValidacion>().optional(),
});
export type PatyJsonDialogProps = z.infer<typeof PatyJsonDialogPropsSchema>;

export const PatyProcessEstadoSchema = z.enum(["pending", "done", "error"]);
export type PatyProcessEstado = z.infer<typeof PatyProcessEstadoSchema>;

export const PatyProcessPropsSchema = z.object({
  xml: z.string(),
  text: z.string(),
  step: z.string(),
  status: PatyProcessEstadoSchema,
  ts: z.string(),
});
export type PatyProcessProps = z.infer<typeof PatyProcessPropsSchema>;

export const ZNivelTraza = z.enum(['debug', 'info', 'warn', 'error']);
export const ZEventoTraza = z.object({
    seq: z.number().int().nonnegative(),
    ts: z.string(),
    ms: z.number().int().nonnegative(),
    nivel: ZNivelTraza,
    etapa: z.string().min(1),
    mensaje: z.string(),
    dur: z.number().int().nonnegative().optional(),
    datos: z.record(z.string(), z.json()).optional(),
});
export type TEventoTraza = z.infer<typeof ZEventoTraza>;
export const ZTraza = z.array(ZEventoTraza);
export type TTraza = z.infer<typeof ZTraza>;

export const PatyTrazaFiltroSchema = z.enum(["todo", "info", "warn", "error"]);
export type PatyTrazaFiltro = z.infer<typeof PatyTrazaFiltroSchema>;
export const PatyTrazaPropsSchema = z.object({
  /** `ZTraza` del pin del ISS: `<paty-traza>` la valida al asignarla. */
  eventos: z.array(z.record(z.string(), z.unknown())),
  enVivo: z.boolean(),
  abierto: z.boolean(),
  filtro: PatyTrazaFiltroSchema,
});
export type PatyTrazaProps = z.infer<typeof PatyTrazaPropsSchema>;

export const AdjuntoKindSchema = z.enum(["imagen", "audio", "documento"]);
export type AdjuntoKind = z.infer<typeof AdjuntoKindSchema>;

/** Representación serializada de un adjunto en el mensaje: `xml` o `md`. */
export const AdjuntoModoSchema = z.enum(["xml", "md"]);
export type AdjuntoModo = z.infer<typeof AdjuntoModoSchema>;

/** Nombre de variante de imagen: thumb, med u original. */
export const AdjuntoVariantNameSchema = z.enum(["thumb", "med", "original"]);
export type AdjuntoVariantName = z.infer<typeof AdjuntoVariantNameSchema>;

/** Una variante de un `jfile` (key, url, bytes, mime; todos opcionales). */
export const AdjuntoJfileVariantSchema = z.object({
  key: z.string().optional(),
  url: z.string().optional(),
  bytes: z.number().optional(),
  mime: z.string().optional(),
});
export type AdjuntoJfileVariant = z.infer<typeof AdjuntoJfileVariantSchema>;

/** Adjunto en formato `jfile` del ISS: tipo, mime, nombre, metadatos (dimensiones, duración, tamaño, conversación) y variantes; todo opcional. */
export const AdjuntoJfileSchema = z.object({
  kind: z.string().optional(),
  mime: z.string().optional(),
  filename: z.string().optional(),
  meta: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    durationSec: z.number().optional(),
    sizeBytes: z.number().optional(),
    iconversacion: z.number().optional(),
  }).optional(),
  variants: z.object({
    thumb: AdjuntoJfileVariantSchema.optional(),
    med: AdjuntoJfileVariantSchema.optional(),
    original: AdjuntoJfileVariantSchema.optional(),
  }).optional(),
});
export type AdjuntoJfile = z.infer<typeof AdjuntoJfileSchema>;

