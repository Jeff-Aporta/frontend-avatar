/**
 * semantica.ts — búsqueda por significado en el front, SIN modelos en el navegador (sin DOM).
 *
 *   - Los vectores del contenido fijo de la app (módulos, comandos, ayuda de AVO…) se hornean en el build con
 *     transformers.js y el modelo BAAI bge-m3 (`scripts/build/embeddings.ts` → `assets/ia/<corpus>.json`), cuantizados
 *     a int8 y normalizados: el front solo los lee, nunca los recalcula.
 *   - La consulta del usuario la vectoriza el API (`ia/embeber`, Workers AI con el MISMO modelo) a través de un
 *     vectorizador que se inyecta con `usarVectorizador`; con caché por texto.
 *   - Sin vectorizador o sin red, la búsqueda cae a coincidencia léxica (acentos y mayúsculas no importan); con
 *     vector, el puntaje mezcla similitud coseno y un empujón léxico para que una palabra exacta siempre suba.
 */

/** Un corpus horneado: textos con metadatos y sus vectores int8 (base64) con la escala de cuantización. */
export type CorpusHorneado<M = Record<string, unknown>> = { modelo: string; dims: number; escala: number; items: (M & { id: string; texto: string })[]; vectores: string };
/** Corpus listo para buscar: vectores ya decodificados a Float32. */
export type Corpus<M = Record<string, unknown>> = { modelo: string; dims: number; items: (M & { id: string; texto: string })[]; vectores: Float32Array[] };
/** Un resultado: el ítem, su puntaje total y de dónde salió. */
export type Resultado<M> = { item: M & { id: string; texto: string }; puntaje: number; semantico: number; lexico: number };
/** Vectoriza textos (el API); debe devolver vectores L2-normalizados del mismo modelo del corpus. */
export type Vectorizador = (textos: string[]) => Promise<number[][]>;

/** Base64 → int8 → Float32 por ítem (multiplica por la escala). */
export function decodificar<M>(c: CorpusHorneado<M>): Corpus<M> {
  const bin = atob(c.vectores);
  const vectores: Float32Array[] = [];
  for (let i = 0; i < c.items.length; i++) {
    const v = new Float32Array(c.dims);
    for (let d = 0; d < c.dims; d++) {
      const b = bin.charCodeAt(i * c.dims + d);
      v[d] = (b > 127 ? b - 256 : b) * c.escala;
    }
    vectores.push(v);
  }
  return { modelo: c.modelo, dims: c.dims, items: c.items, vectores };
}

/** Float32 normalizados → int8 base64 (lo usa el build; aquí para que codificar y decodificar vivan juntos). */
export function codificar(vectores: number[][]): { escala: number; vectores: string } {
  const max = Math.max(1e-9, ...vectores.flatMap((v) => v.map((x) => Math.abs(x))));
  const escala = max / 127;
  let bin = '';
  for (const v of vectores) for (const x of v) bin += String.fromCharCode((Math.round(x / escala) + 256) % 256);
  return { escala, vectores: btoa(bin) };
}

/** Similitud coseno (los vectores vienen normalizados: es el producto punto, renormalizado por la cuantización). */
export function coseno(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let p = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    p += x * y;
    na += x * x;
    nb += y * y;
  }
  return na && nb ? p / Math.sqrt(na * nb) : 0;
}

/** Texto sin acentos, en minúsculas y con espacios simples. */
export const normalizar = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Palabras vacías del español que no deben pesar en la coincidencia léxica. */
const VACIAS = new Set('a al con de del el en es la las lo los me mi mis para por que se su sus te tu un una uno y o ir quiero hay como mas muy'.split(' '));

/** Raíz simple: las primeras 5 letras de una palabra larga (oscuro ≈ oscura, factura ≈ facturar). */
const raiz = (w: string): string => (w.length > 5 ? w.slice(0, 5) : w);

/** Puntaje léxico 0..1: fracción de palabras útiles de la consulta presentes (por raíz o prefijo) en el texto. */
export function lexico(consulta: string, texto: string): number {
  const palabras = normalizar(consulta).split(/[^a-z0-9ñ]+/).filter((p) => p.length > 1 && !VACIAS.has(p));
  if (!palabras.length) return 0;
  const t = normalizar(texto).split(/[^a-z0-9ñ]+/).filter(Boolean);
  const hits = palabras.filter((p) => t.some((w) => w.startsWith(p) || (p.length > 5 && raiz(w) === raiz(p)))).length;
  return hits / palabras.length;
}

let vectorizador: Vectorizador | null = null;
const cache = new Map<string, Promise<number[] | null>>();

/** Inyecta el vectorizador de consultas (el API). `null` lo quita (todo vuelve a léxico). */
export function usarVectorizador(v: Vectorizador | null): void {
  vectorizador = v;
  cache.clear();
}

/** Vector de una consulta (con caché); null sin vectorizador o si el API falla. */
export function vectorDe(consulta: string): Promise<number[] | null> {
  const clave = normalizar(consulta);
  if (!vectorizador || !clave) return Promise.resolve(null);
  if (!cache.has(clave)) cache.set(clave, vectorizador([consulta]).then((v) => v[0] ?? null).catch(() => null));
  return cache.get(clave)!;
}

/** Ordena un corpus contra un vector de consulta ya calculado (puro: lo usan las pruebas). */
export function ordenar<M>(corpus: Corpus<M>, consulta: string, vector: ArrayLike<number> | null, limite = 8, umbral = 0.55): Resultado<M>[] {
  const out: Resultado<M>[] = corpus.items.map((item, i) => {
    const lx = lexico(consulta, item.texto);
    const sm = vector ? coseno(vector, corpus.vectores[i]!) : 0;
    return { item, semantico: sm, lexico: lx, puntaje: vector ? 0.85 * sm + 0.15 * lx : lx };
  });
  return out.filter((r) => r.lexico > 0 || (vector != null && r.semantico >= umbral)).sort((a, b) => b.puntaje - a.puntaje).slice(0, limite);
}

/** Busca en un corpus: vectoriza la consulta por el API si se puede; si no, léxico. */
export async function buscar<M>(corpus: Corpus<M>, consulta: string, limite = 8): Promise<Resultado<M>[]> {
  return ordenar(corpus, consulta, await vectorDe(consulta), limite);
}

const corpora = new Map<string, Promise<Corpus>>();
/** Carga (una vez) un corpus horneado de `assets/ia/<nombre>.json` relativo a la raíz del sitio. */
export function cargarCorpus<M = Record<string, unknown>>(nombre: string, base: string): Promise<Corpus<M>> {
  if (!corpora.has(nombre)) {
    corpora.set(nombre, fetch(new URL(`assets/ia/${nombre}.json`, base)).then((r) => {
      if (!r.ok) throw new Error(`corpus ${nombre}: ${r.status}`);
      return r.json();
    }).then((c: CorpusHorneado) => decodificar(c)));
  }
  return corpora.get(nombre)! as Promise<Corpus<M>>;
}
