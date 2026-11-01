/**
 * datos.ts — insumos del benchmark de búsqueda: consultas etiquetadas, catálogo con nombres de emojibase y vectores con
 * caché en disco (`.tmp/bench/`). Nada de esto se publica ni corre en el navegador.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { env, pipeline } from 'npm:@huggingface/transformers@3.7.6';
import { CATEGORIAS_EMOJI } from '../../src/js/chat/emojis.ts';
import { MODELO_LOCAL } from '../../src/js/core/ia-local.ts';

export const ROOT = join(import.meta.dirname!, '..', '..');
const BENCH = join(ROOT, '.tmp', 'bench');
env.cacheDir = join(ROOT, '.tmp', 'modelos');

export type Consulta = { q: string; idioma: 'es' | 'en'; tipo: string; parte: 'ajuste' | 'prueba'; muy: string[]; algo: string[] };
export type EmojiDatos = { id: string; k: string; grupo: string; es: string; en: string; tagsEs: string[]; tagsEn: string[] };
type Emojibase = { emoji: string; label: string; tags?: string[] };

const sinVs = (e: string): string => e.replace('️', '');

/** Las consultas marcadas a mano; las relevancias se comparan sin el selector de variación. */
export function cargarConsultas(): Consulta[] {
  const crudo = JSON.parse(readFileSync(join(ROOT, 'tests', 'vistas', 'fixtures', 'emojis-evaluacion.json'), 'utf8')) as (Omit<Consulta, 'muy' | 'algo'> & { muy: string; algo: string })[];
  const partir = (s: string): string[] => s.split(' ').filter(Boolean).map(sinVs);
  return crudo.map((c) => ({ ...c, muy: partir(c.muy), algo: partir(c.algo) }));
}

async function nombres(idioma: string): Promise<Map<string, Emojibase>> {
  mkdirSync(BENCH, { recursive: true });
  const ruta = join(BENCH, `emojibase-18-${idioma}.json`);
  if (!existsSync(ruta)) writeFileSync(ruta, await (await fetch(`https://cdn.jsdelivr.net/npm/emojibase-data@18.0.0/${idioma}/data.json`)).text());
  const lista = JSON.parse(readFileSync(ruta, 'utf8')) as Emojibase[];
  return new Map(lista.map((e) => [sinVs(e.emoji), e]));
}

/** Catálogo con todo lo que se puede embeber o comparar por palabra. */
export async function cargarEmojis(): Promise<EmojiDatos[]> {
  const [es, en] = await Promise.all([nombres('es'), nombres('en')]);
  return CATEGORIAS_EMOJI.flatMap((c) => c.emojis.map((e) => {
    const clave = sinVs(e.e);
    const a = es.get(clave);
    const b = en.get(clave);
    return { id: e.e, k: e.k, grupo: c.nombre, es: a?.label ?? '', en: b?.label ?? '', tagsEs: a?.tags ?? [], tagsEn: b?.tags ?? [] };
  }));
}

type Extractor = (t: string, o: object) => Promise<{ data: Float32Array }>;

/** Vectoriza de a uno, como el navegador, con caché por texto en un binario de Float32. */
export class Vectores {
  #ruta = join(BENCH, 'vectores');
  #mapa = new Map<string, Float32Array>();
  #extraer: Extractor | null = null;
  #nuevos = 0;
  constructor() {
    if (!existsSync(`${this.#ruta}.json`)) return;
    const textos = JSON.parse(readFileSync(`${this.#ruta}.json`, 'utf8')) as string[];
    const bytes = readFileSync(`${this.#ruta}.bin`);
    const todo = new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    textos.forEach((t, i) => this.#mapa.set(t, todo.slice(i * 384, (i + 1) * 384)));
  }
  async de(textos: string[]): Promise<Float32Array[]> {
    const faltan = [...new Set(textos)].filter((t) => !this.#mapa.has(t));
    if (faltan.length) {
      this.#extraer ??= await pipeline('feature-extraction', MODELO_LOCAL, { dtype: 'q8' }) as unknown as Extractor;
      console.error(`[bench] vectorizando ${faltan.length} textos…`);
      for (const t of faltan) {
        const r = await this.#extraer(t, { pooling: 'mean', normalize: true });
        this.#mapa.set(t, Float32Array.from(r.data));
        this.#nuevos++;
      }
    }
    return textos.map((t) => this.#mapa.get(t)!);
  }
  guardar(): void {
    if (!this.#nuevos) return;
    const textos = [...this.#mapa.keys()];
    const todo = new Float32Array(textos.length * 384);
    textos.forEach((t, i) => todo.set(this.#mapa.get(t)!, i * 384));
    writeFileSync(`${this.#ruta}.json`, JSON.stringify(textos));
    writeFileSync(`${this.#ruta}.bin`, new Uint8Array(todo.buffer));
    this.#nuevos = 0;
  }
}
