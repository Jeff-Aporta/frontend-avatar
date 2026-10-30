// @vendor iswc-root@a1df39adb9e421de874dd624901b72daa9e25e5c dist/cdn/build/asset-url.schemas.ts
// No editar: se cambia en el kit y se descarga con `deno task vendor:iswc`.
/**
 * asset-url.ts — Zod schemas para los tipos extraídos de este módulo.
 *
 * Generado por `scripts/migrate-zod.py`. Refinar manualmente las
 * entradas marcadas con TODO cuando se quiera validación runtime.
 */
import { z } from "zod";

export const LoaderGlobalSchema = z.object({
  iswcLoader: z.object({
  assetUrl: z.function({ input: [z.string()], output: z.string() }).optional(),
}).optional(),
});
export type LoaderGlobal = z.infer<typeof LoaderGlobalSchema>;

