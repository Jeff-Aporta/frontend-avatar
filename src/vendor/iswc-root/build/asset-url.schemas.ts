// @vendor iswc-root@42322344cbaa25967d44361c99b78c963d0f8543 dist/cdn/build/asset-url.schemas.ts
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

