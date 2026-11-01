/**
 * ia-local.ts — puente con la IA del kit: los vectores de consultas en el navegador vienen de `lib/ai/vector-local.min.js`,
 * con la regla de descarga y el modelo estándar del kit. Sin él (o con un pin que aún no lo publica) devuelve null y la búsqueda
 * sigue por palabra. `MODELO_LOCAL` queda aquí porque los scripts de horneado corren sin navegador: debe ser el del kit.
 */
import type { IaKit, LoaderIa } from '../consts/schemas/demo.schemas.js';

export const MODELO_LOCAL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

let kit: Promise<IaKit> | null = null;

/** Fuera de los barriles: la URL sale del loader, con el sello que usa el resto del kit. */
function cargar(): Promise<IaKit> {
  const L = (globalThis as { iswcLoader?: LoaderIa }).iswcLoader;
  if (!L) return Promise.reject(new Error('sin iswcLoader'));
  return import(L.assetUrl(new URL('../lib/ai/vector-local.min.js', L.selfBase).href));
}

/** Vector normalizado de una consulta; null si el modelo no está. */
export async function vectorLocal(texto: string): Promise<Float32Array | null> {
  kit ??= cargar();
  return kit.then((m) => m.vectorLocal(texto)).catch(() => null);
}
