/**
 * embeddings.ts — hornea los vectores de los corpus fijos del front (`deno task embeddings`). Usa transformers.js con
 * el modelo BAAI bge-m3 (`Xenova/bge-m3`, q8, pooling CLS, normalizado): el MISMO modelo que el API usa en Workers AI
 * (`@cf/baai/bge-m3`) para vectorizar las consultas, así ambos viven en el mismo espacio.
 *
 *   corpus `comandos` (src/js/consts/comandos.ts) → assets/ia/comandos.json
 *   consultas de prueba                             → tests/vistas/fixtures/consultas-comandos.json
 *
 * Los vectores se cuantizan a int8 (`codificar` de `core/semantica.ts`) y se versionan en `assets/ia/`: ni el build
 * normal ni GitHub Pages necesitan el modelo. Caché por texto en `.tmp/embeddings-cache.json`: solo se calculan los
 * textos nuevos o cambiados. El modelo se descarga una vez a `.tmp/modelos/`.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { env, pipeline } from 'npm:@huggingface/transformers@3.7.6';
import { COMANDOS, textoDe } from '../../src/js/consts/comandos.ts';
import { codificar } from '../../src/js/core/semantica.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
const MODELO = 'Xenova/bge-m3';
const CACHE = join(ROOT, '.tmp', 'embeddings-cache.json');
env.cacheDir = join(ROOT, '.tmp', 'modelos');

type Item = { id: string; texto: string } & Record<string, unknown>;
const CORPUS: Record<string, Item[]> = {
  comandos: COMANDOS.map((c) => ({ ...c, texto: textoDe(c) })),
};

/** Consultas de prueba con el comando que deberían traer primero: se hornean para `tests/vistas/semantica.test.ts`. */
const CONSULTAS: { texto: string; espera: string }[] = [
  { texto: 'cobrarle a un cliente', espera: 'factura-nueva' },
  { texto: 'me quiero ir de vacaciones', espera: 'solicitud' },
  { texto: 'hablar en privado con Ana', espera: 'chat-nuevo' },
  { texto: 'poner la pantalla oscura', espera: 'tema' },
  { texto: 'llegaron cajas a la bodega', espera: 'movimiento' },
  { texto: 'cuánto vale un dólar en pesos', espera: 'conversor' },
  { texto: 'reportar un error del sistema', espera: 'tarea-nueva' },
  { texto: 'agregar un compañero nuevo a la empresa', espera: 'invitar' },
];

const cache: Record<string, number[]> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const faltan = [...new Set([...Object.values(CORPUS).flat().map((i) => i.texto), ...CONSULTAS.map((c) => c.texto)])].filter((t) => !cache[t]);
if (faltan.length) {
  console.log(`[embeddings] ${faltan.length} textos nuevos con ${MODELO}…`);
  const extraer = await pipeline('feature-extraction', MODELO, { dtype: 'q8' });
  for (let i = 0; i < faltan.length; i += 16) {
    const lote = faltan.slice(i, i + 16);
    const v = (await extraer(lote, { pooling: 'cls', normalize: true })).tolist() as number[][];
    lote.forEach((t, k) => (cache[t] = v[k]!.map((x) => Math.round(x * 1e6) / 1e6)));
  }
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(cache));
}

for (const [nombre, items] of Object.entries(CORPUS)) {
  const vecs = items.map((i) => cache[i.texto]!);
  const { escala, vectores } = codificar(vecs);
  const salida = join(ROOT, 'assets', 'ia', `${nombre}.json`);
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, JSON.stringify({ modelo: 'bge-m3', dims: vecs[0]!.length, escala, items, vectores }));
  console.log(`[embeddings] ${nombre}: ${items.length} ítems → assets/ia/${nombre}.json`);
}

const fixture = join(ROOT, 'tests', 'vistas', 'fixtures', 'consultas-comandos.json');
mkdirSync(dirname(fixture), { recursive: true });
writeFileSync(fixture, JSON.stringify(CONSULTAS.map((c) => ({ ...c, vector: cache[c.texto] }))));
console.log(`[embeddings] ${CONSULTAS.length} consultas de prueba → tests/vistas/fixtures/consultas-comandos.json`);
