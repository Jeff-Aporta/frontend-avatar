/**
 * calibracion.ts — único lugar con los parámetros de las búsquedas aplanadas. Valores medidos con
 * `deno task bench:embeddings`; el porqué y cómo cambiarlos, en `specs/foundation/15-busqueda-semantica.md`.
 * Cambiar `aplanado` o `frases` pide volver a hornear (`deno task embeddings`); `orden` no.
 */
import type { Cuantizacion } from './aplanado.js';

/** Cómo se hornea: método, dimensiones y cuantización del corpus y de cada consulta. */
export type AjusteAplanado = { metodo: 'pca' | 'lda' | 'aleatoria' | 'truncado' | 'ninguno'; dims: number; blanqueo: number; regularizacion: number; sinteticas: boolean; bitsMatriz: 8 | 16; cuantizacion: Cuantizacion };
/** Cómo se ordena. `exacta`: qué cuenta como coincidencia que va primero; `umbral`: desvíos sobre la media para marcar `relevante`. */
export type AjusteOrden = { exacta: 'ninguna' | 'subcadena' | 'palabra' | 'palabra-clave'; minimoExacta: number; pesoLexico: number; pesoTexto: number; tipificar: boolean; umbral: number };
export type Calibracion = { aplanado: AjusteAplanado; orden: AjusteOrden };

/** Punto elegido por curva calidad/tamaño; toda tabla nueva parte de aquí. */
export const CALIBRACION: Calibracion = {
  aplanado: { metodo: 'lda', dims: 64, blanqueo: 0, regularizacion: 1, sinteticas: false, bitsMatriz: 8, cuantizacion: { tipo: 'int8' } },
  orden: { exacta: 'palabra', minimoExacta: 2, pesoLexico: 0.8, pesoTexto: 0.5, tipificar: false, umbral: 3 },
};

/** Ajustes por corpus cuando uno necesita otra cosa. */
const POR_CORPUS: Record<string, Partial<Calibracion>> = {};

export const calibracionDe = (corpus: string): Calibracion => ({ ...CALIBRACION, ...POR_CORPUS[corpus] });
