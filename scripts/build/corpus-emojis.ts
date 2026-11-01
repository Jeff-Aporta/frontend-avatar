/**
 * corpus-emojis.ts — de un emoji a lo que se hornea: las frases que se promedian en su vector y las palabras por las que
 * se encuentra. Otro corpus solo tiene que dar sus frases: `vectorDeFrases` no sabe de emojis.
 */

export type EmojiFuente = { k: string; grupo: string; es: string; en: string; tagsEs: string[]; tagsEn: string[] };

const unicas = (l: string[]): string[] => [...new Set(l.map((x) => x.trim()).filter(Boolean))];

/** Una frase por nombre o etiqueta, en ambos idiomas: la mezcla que mejor rindió en el benchmark. */
export const frasesDe = (e: EmojiFuente): string[] => unicas([e.k, e.es, ...e.tagsEs, e.en, ...e.tagsEn]);

/** Nombres: lo que pesa más al comparar por palabra. */
export const nombreDe = (e: EmojiFuente): string => unicas([e.k, e.es, e.en]).join(' ');

/** El resto de palabras, sin repetir lo que ya está en el nombre. */
export const palabrasDe = (e: EmojiFuente): string => {
  const ya = new Set(nombreDe(e).toLowerCase().split(/\s+/));
  return unicas([...e.tagsEs, ...e.tagsEn].flatMap((t) => t.toLowerCase().split(/\s+/))).filter((w) => !ya.has(w)).join(' ');
};

/** Texto único anterior al benchmark: queda como referencia de comparación. */
export const textoActual = (e: EmojiFuente): string => [e.k, [e.es, ...e.tagsEs].join(', '), [e.en, ...e.tagsEn].join(', '), e.grupo].filter(Boolean).join('. ');

/** Centroide normalizado de los vectores de las frases de un ítem. */
export function vectorDeFrases(vectores: ArrayLike<number>[]): Float32Array {
  const suma = new Float64Array(vectores[0]!.length);
  for (const v of vectores) for (let i = 0; i < suma.length; i++) suma[i]! += v[i]!;
  const norma = Math.sqrt(suma.reduce((s, x) => s + x * x, 0)) || 1;
  return Float32Array.from(suma, (x) => x / norma);
}
