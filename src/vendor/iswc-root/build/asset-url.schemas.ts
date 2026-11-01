// @vendor iswc-root@6c141b86cc2dd38a7e792382ccf773b0ead4fce9 dist/cdn/build/asset-url.schemas.ts
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

