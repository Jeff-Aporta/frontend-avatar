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

import { abrirCorpus, aplanar, type CorpusAplanado, type CorpusAplanadoJson, type ItemBuscable } from './aplanado.js';
import type { AjusteOrden } from './calibracion.js';

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

/** Palabras sin peso en español e inglés: solo cuentan si la consulta no trae otras. */
const VACIAS_TOLERANTE = new Set(`${[...VACIAS].join(' ')} estoy tengo tienes este esta esto eso ese ser son fue algo the a an of to for on in at is are am i my your you and or it so very we`.split(' '));

export const palabrasDe = (s: string): string[] => normalizar(s).split(/[^a-z0-9ñ]+/).filter(Boolean);

/** Palabras útiles de una consulta. */
export function palabrasConsulta(q: string): string[] {
  const todas = palabrasDe(q);
  const utiles = todas.filter((p) => !VACIAS_TOLERANTE.has(p));
  return utiles.length ? utiles : todas;
}

/** Distancia de edición con transposición, cortada en `tope`. */
function distancia(a: string, b: string, tope: number): number {
  if (Math.abs(a.length - b.length) > tope) return tope + 1;
  let previa2: number[] = [];
  let previa = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const fila = [i];
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(previa[j]! + 1, fila[j - 1]! + 1, previa[j - 1]! + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, previa2[j - 2]! + 1);
      fila.push(d);
    }
    previa2 = previa;
    previa = fila;
  }
  return previa[b.length]!;
}

/** Cuánto se parece una palabra de la consulta a una del ítem: igual, prefijo, raíz o error de tecleo. */
function parecido(q: string, w: string): number {
  if (q === w) return 1;
  if (q.length >= 3 && w.startsWith(q)) return 0.85;
  if (q.length > 5 && w.length > 5 && q.slice(0, 5) === w.slice(0, 5)) return 0.75;
  if (q.length < 4 || w.length < 4) return 0;
  const tope = q.length >= 7 ? 2 : 1;
  const d = distancia(q, w, tope);
  return d > tope ? 0 : 1 - 0.2 * d;
}

/** El vocabulario se repite entre ítems: cada par se compara una vez. Con tope, para que escribir no lo haga crecer sin fin. */
const parecidos = new Map<string, number>();
function parecidoRecordado(q: string, w: string): number {
  const clave = `${q}\0${w}`;
  const ya = parecidos.get(clave);
  if (ya !== undefined) return ya;
  if (parecidos.size > 200_000) parecidos.clear();
  const p = parecido(q, w);
  parecidos.set(clave, p);
  return p;
}

const mejor = (q: string, palabras: string[]): number => palabras.reduce((m, w) => Math.max(m, parecidoRecordado(q, w)), 0);

/** Puntaje léxico 0..1 que aguanta errores: `clave` pesa 1 y el resto `pesoTexto`. */
export function lexicoTolerante(consulta: string[], clave: string[], texto: string[], pesoTexto: number): number {
  if (!consulta.length) return 0;
  return consulta.reduce((s, q) => s + Math.max(mejor(q, clave), pesoTexto * mejor(q, texto)), 0) / consulta.length;
}

/** Palabras de cada ítem, calculadas una vez por corpus. */
export type IndiceItem = { clave: string[]; texto: string[]; plano: string };
const indices = new WeakMap<object, IndiceItem[]>();
export function indiceDe(items: ItemBuscable[]): IndiceItem[] {
  if (!indices.has(items)) indices.set(items, items.map((i) => ({ clave: palabrasDe(i.clave), texto: palabrasDe(i.texto), plano: normalizar(`${i.clave} ${i.texto}`) })));
  return indices.get(items)!;
}

/** ¿La consulta aparece tal cual en el ítem? Lo exacto va primero, según `AjusteOrden.exacta`. */
export function esExacta(consulta: string[], crudo: string, i: IndiceItem, modo: AjusteOrden['exacta'], minimo: number): boolean {
  if (modo === 'ninguna' || crudo.length < minimo) return false;
  if (modo === 'subcadena') return i.plano.includes(crudo);
  const donde = modo === 'palabra-clave' ? i.clave : [...i.clave, ...i.texto];
  return consulta.length > 0 && consulta.every((p) => donde.includes(p));
}

/** Un resultado de la búsqueda aplanada. `relevante`: pasa el umbral o coincide por palabra. */
export type ResultadoAplanado<M> = { item: ItemBuscable<M>; exacta: boolean; lexico: number; sentido: number; puntaje: number; relevante: boolean };

/** Une señales ya calculadas: exactas primero, luego coseno (tipificado por consulta si se pide) + empujón léxico. */
export function combinar(sentido: ArrayLike<number>, lexicos: ArrayLike<number>, exactas: boolean[], a: AjusteOrden): { puntaje: number; relevante: boolean }[] {
  const n = sentido.length;
  let media = 0;
  for (let i = 0; i < n; i++) media += sentido[i]! / n;
  let varianza = 0;
  for (let i = 0; i < n; i++) varianza += (sentido[i]! - media) ** 2 / n;
  const desvio = Math.sqrt(varianza) || 1;
  return Array.from({ length: n }, (_, i) => {
    const z = (sentido[i]! - media) / desvio;
    const base = a.tipificar ? z : sentido[i]!;
    return { puntaje: (exactas[i] ? 1e3 : 0) + base + a.pesoLexico * lexicos[i]!, relevante: exactas[i]! || lexicos[i]! >= 0.75 || z >= a.umbral };
  });
}

/** Busca en un corpus aplanado. `vector` es el de la consulta, completo; sin él ordena solo por palabra. Ordena, no oculta. */
export function ordenarAplanado<M>(corpus: CorpusAplanado<M>, consulta: string, vector: ArrayLike<number> | null, a: AjusteOrden): ResultadoAplanado<M>[] {
  const crudo = normalizar(consulta);
  const palabras = palabrasConsulta(consulta);
  const indice = indiceDe(corpus.items as ItemBuscable[]);
  const plano = vector ? aplanar(vector, corpus.aplanado) : null;
  const sentido = corpus.items.map((_, i) => (plano ? coseno(plano, corpus.vectores[i]!) : 0));
  const lexicos = indice.map((x) => lexicoTolerante(palabras, x.clave, x.texto, a.pesoTexto));
  const exactas = indice.map((x) => esExacta(palabras, crudo, x, a.exacta, a.minimoExacta));
  const unidos = combinar(sentido, lexicos, exactas, a);
  return corpus.items
    .map((item, i) => ({ item, exacta: exactas[i]!, lexico: lexicos[i]!, sentido: sentido[i]!, ...unidos[i]! }))
    .sort((x, y) => y.puntaje - x.puntaje);
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
const aplanados = new Map<string, Promise<CorpusAplanado>>();
/** Carga (una vez) un corpus aplanado de `assets/ia/<nombre>.json` relativo a la raíz del sitio. */
export function cargarAplanado<M = Record<string, unknown>>(nombre: string, base: string): Promise<CorpusAplanado<M>> {
  if (!aplanados.has(nombre)) {
    aplanados.set(nombre, fetch(new URL(`assets/ia/${nombre}.json`, base), { signal: AbortSignal.timeout(20000) }).then((r) => {
      if (!r.ok) throw new Error(`corpus ${nombre}: ${r.status}`);
      return r.json();
    }).then((j: CorpusAplanadoJson) => abrirCorpus(j)).catch((e) => {
      aplanados.delete(nombre); // falla o timeout: el siguiente intento vuelve a pedirlo
      throw e;
    }));
  }
  return aplanados.get(nombre)! as Promise<CorpusAplanado<M>>;
}

/** Carga (una vez) un corpus horneado de `assets/ia/<nombre>.json` relativo a la raíz del sitio. */
export function cargarCorpus<M = Record<string, unknown>>(nombre: string, base: string): Promise<Corpus<M>> {
  if (!corpora.has(nombre)) {
    corpora.set(nombre, fetch(new URL(`assets/ia/${nombre}.json`, base), { signal: AbortSignal.timeout(20000) }).then((r) => {
      if (!r.ok) throw new Error(`corpus ${nombre}: ${r.status}`);
      return r.json();
    }).then((c: CorpusHorneado) => decodificar(c)).catch((e) => {
      corpora.delete(nombre); // falla o timeout: el siguiente intento vuelve a pedirlo
      throw e;
    }));
  }
  return corpora.get(nombre)! as Promise<Corpus<M>>;
}
