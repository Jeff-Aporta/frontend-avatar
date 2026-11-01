/**
 * embeddings.ts — hornea los vectores de los corpus fijos del front (`deno task embeddings`). Usa transformers.js con
 * el modelo BAAI bge-m3 (`Xenova/bge-m3`, q8, pooling CLS, normalizado): el MISMO modelo que el API usa en Workers AI
 * (`@cf/baai/bge-m3`) para vectorizar las consultas, así ambos viven en el mismo espacio.
 *
 *   corpus `comandos` (src/js/consts/comandos.ts) → assets/ia/comandos.json
 *   consultas de prueba                             → tests/vistas/fixtures/consultas-comandos.json
 *
 * Los vectores se cuantizan a int8 (`codificar` de `core/semantica.ts`) y se versionan en `assets/ia/`: ni el build
 * normal ni GitHub Pages necesitan el modelo. Los corpus cuya consulta se vectoriza en el navegador (`emojis`) usan el
 * modelo de `core/ia-local.ts` y salen aplanados según `core/calibracion.ts`. Caché por texto en
 * `.tmp/embeddings-cache.json` y `.tmp/bench/`: solo se calculan los textos nuevos o cambiados. El modelo se descarga
 * una vez a `.tmp/modelos/`.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { env, pipeline } from 'npm:@huggingface/transformers@3.7.6';
import { COMANDOS, textoDe } from '../../src/js/consts/comandos.ts';
import { aplanar, desempacarAplanado, empacar, empacarAplanado, empacarVectores } from '../../src/js/core/aplanado.ts';
import { calibracionDe } from '../../src/js/core/calibracion.ts';
import { MODELO_LOCAL } from '../../src/js/core/ia-local.ts';
import { codificar } from '../../src/js/core/semantica.ts';
import { cargarConsultas, cargarEmojis, Vectores } from '../bench/datos.ts';
import { ajustar, type Receta } from './aplanado-ajuste.ts';
import { frasesDe, nombreDe, palabrasDe, vectorDeFrases } from './corpus-emojis.ts';

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

// Corpus de consulta en el navegador: su vector es el centroide de frases cortas y viaja aplanado con la transformación.
const emojis = await cargarEmojis();
const local = new Vectores();
const frases: Float32Array[][] = [];
for (const e of emojis) frases.push(await local.de(frasesDe(e)));
const centroides = frases.map(vectorDeFrases);
const consultasEmojis = cargarConsultas();
const vectoresConsulta = await local.de(consultasEmojis.map((c) => c.q));
local.guardar();
const { aplanado: ajusteEmojis } = calibracionDe('emojis');
const receta: Receta = { metodo: ajusteEmojis.metodo, dims: ajusteEmojis.dims, blanqueo: ajusteEmojis.blanqueo, regularizacion: ajusteEmojis.regularizacion, cuantizacion: ajusteEmojis.cuantizacion };
const reduccion = ajustar({ base: centroides, extra: ajusteEmojis.sinteticas ? frases.flat() : undefined, clases: frases }, receta);
const aplanadoJson = empacarAplanado(reduccion, ajusteEmojis.bitsMatriz);
// La matriz que se aplica es la que viaja: sin esto el corpus y la consulta del navegador no caerían en la misma rejilla.
const servido = desempacarAplanado(aplanadoJson);
const vectoresEmojis = empacarVectores(centroides.map((v) => aplanar(v, servido)), servido);
const itemsEmojis = emojis.map((e) => ({ id: e.id, clave: nombreDe(e), texto: palabrasDe(e) }));
writeFileSync(join(ROOT, 'assets', 'ia', 'emojis.json'), JSON.stringify({ modelo: MODELO_LOCAL, aplanado: aplanadoJson, items: itemsEmojis, vectores: vectoresEmojis }));
console.log(`[embeddings] emojis: ${emojis.length} ítems, ${ajusteEmojis.metodo} ${ajusteEmojis.dims} dims, ${ajusteEmojis.cuantizacion.tipo} → assets/ia/emojis.json`);
// Vectores completos para la prueba de calidad y para comprobar que el corpus se puede regenerar con lo publicado.
writeFileSync(join(ROOT, 'tests', 'vistas', 'fixtures', 'emojis-vectores.json'), JSON.stringify({
  consultas: empacar(vectoresConsulta, 16, true),
  corpus: empacar(centroides.filter((_, i) => i % 40 === 0), 16, true),
  corpusIndices: centroides.flatMap((_, i) => (i % 40 === 0 ? [i] : [])),
}));

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
