/**
 * loader.schemas.ts — lo que la app usa del loader del kit (`globalThis.iswcLoader`).
 * La forma canónica completa vive en el kit (`@iswc/loader-schemas`, pineado en deno.json);
 * aquí solo el subconjunto que la app llama, validado en runtime.
 */
import { z } from '../../base/zod.js';

const fn = <T>() => z.custom<T>((v) => typeof v === 'function');

/** Entrada del registrador: los `av-*` son módulos ES `.js`, así que van con `type: 'module'` (el loader infiere por extensión). */
export const EntradaAppSchema = z.object({ href: z.string(), type: z.enum(['module', 'classic']).optional(), css: z.string().optional() });
export type EntradaApp = z.infer<typeof EntradaAppSchema>;

export const LoaderAppSchema = z.object({
  registerApp: fn<(mapa: Record<string, string | EntradaApp>, opts?: { installSheets?: boolean }) => unknown>(),
  load: fn<(...tags: string[]) => Promise<unknown>>(),
  ensure: fn<(tag: string) => Promise<unknown>>(),
}).passthrough();
export type LoaderApp = z.infer<typeof LoaderAppSchema>;
