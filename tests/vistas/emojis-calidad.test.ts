// emojis-calidad.test.ts — calidad de la búsqueda aplanada contra consultas marcadas a mano, sobre lo PUBLICADO.
//
//   W-SEM-04  la partición de prueba no baja de los umbrales medidos en `deno task bench:embeddings`
//   W-SEM-05  el corpus se regenera: lo publicado aplicado a vectores completos da los vectores servidos
//   W-SEM-06  lo exacto va primero y lo mal escrito se encuentra
//   W-SEM-07  el catálogo trae todo emojibase, cada emoji tiene vector y el JSON respeta su presupuesto
//
// Solo lee `dist/`, `assets/` y fixtures: sin modelo, sin red y sin paquetes npm.
import { readFileSync, statSync } from 'node:fs';
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';
import { medir, promedio } from '../../scripts/bench/metricas.ts';

/** Bajo esto la prueba falla. Medido con 1923 emojis: 0,610 / 0,791 / 0,665; el margen absorbe ruido, no retrocesos. */
const MINIMOS = { recall: 0.58, mrr: 0.76, ndcg: 0.63 };
const MAXIMO_BYTES = 450 * 1024;
const MAXIMO_CATALOGO_BYTES = 90 * 1024;
/** emojibase 18 sin componentes (tonos, pelo) ni indicadores regionales sueltos. */
const MINIMO_EMOJIS = 1900;

type Marcada = { q: string; idioma: 'es' | 'en'; tipo: string; parte: 'ajuste' | 'prueba'; muy: string; algo: string };
const leer = (ruta: string): string => readFileSync(new URL(ruta, import.meta.url), 'utf8');
const a = await import('../../dist/cdn/js/core/aplanado.js');
const s = await import('../../dist/cdn/js/core/semantica.js');
const c = await import('../../dist/cdn/js/core/calibracion.js');
const corpus = a.abrirCorpus(JSON.parse(leer('../../assets/ia/emojis.json')));
const marcadas = JSON.parse(leer('./fixtures/emojis-evaluacion.json')) as Marcada[];
const fijos = JSON.parse(leer('./fixtures/emojis-vectores.json'));
const vectores = a.desempacar(fijos.consultas, corpus.aplanado.media.length) as Float32Array[];
const orden = c.calibracionDe('emojis').orden;
const partir = (t: string): string[] => t.split(' ').filter(Boolean).map((e) => e.replace('️', ''));
const buscar = (i: number): string[] => s.ordenarAplanado(corpus, marcadas[i]!.q, vectores[i]!, orden).map((r: { item: { id: string } }) => r.item.id);
const limpio = (e: string): string => e.replace(/️/g, '');
const primero = (q: string): string => limpio(buscar(marcadas.findIndex((m) => m.q === q))[0]!);
/** El primero debe ser uno de los «muy relevantes» marcados: cuando dos nombres empatan, cualquiera vale. */
const primeroEsMuy = (q: string): boolean => partir(marcadas.find((m) => m.q === q)!.muy).includes(primero(q));

export default definirPruebas([
  {
    nombre: 'semantica W-SEM-04 la búsqueda de emojis no baja de los umbrales',
    categoria: 'what',
    correr({ expect }) {
      const medidas = marcadas.flatMap((m, i) => (m.parte === 'prueba' ? [medir({ ...m, muy: partir(m.muy), algo: partir(m.algo) }, buscar(i))] : []));
      const r = promedio(medidas);
      expect(`recall@5 ${r.recall.toFixed(3)} ≥ ${MINIMOS.recall}`, r.recall >= MINIMOS.recall);
      expect(`MRR ${r.mrr.toFixed(3)} ≥ ${MINIMOS.mrr}`, r.mrr >= MINIMOS.mrr);
      expect(`nDCG@10 ${r.ndcg.toFixed(3)} ≥ ${MINIMOS.ndcg}`, r.ndcg >= MINIMOS.ndcg);
    },
  },
  {
    nombre: 'semantica W-SEM-05 el corpus se regenera con la transformación publicada',
    categoria: 'how',
    correr({ expect }) {
      const completos = a.desempacar(fijos.corpus, corpus.aplanado.media.length) as Float32Array[];
      fijos.corpusIndices.forEach((i: number, k: number) => {
        const otra = a.aplanar(completos[k]!, corpus.aplanado);
        expect(`ítem ${i}`, s.coseno(otra, corpus.vectores[i]!) > 0.999);
      });
    },
  },
  {
    nombre: 'semantica W-SEM-06 lo exacto va primero y lo mal escrito se encuentra',
    categoria: 'what',
    correr({ eq, expect }) {
      expect(`palabra exacta (${primero('perro')})`, primeroEsMuy('perro'));
      eq('en inglés', primero('coffee'), '☕');
      eq('con error de tecleo', primero('hamburgesa'), '🍔');
      eq('por prefijo', primero('celu'), '📱');
      eq('bandera por país', primero('colombia'), '🇨🇴');
      expect(`profesión (${primero('médico')})`, primeroEsMuy('médico'));
    },
  },
  {
    nombre: 'semantica W-SEM-07 el catálogo es completo y el corpus respeta su presupuesto',
    categoria: 'how',
    correr({ expect, eq }) {
      const catalogo = JSON.parse(leer('../../assets/ia/emojis-catalogo.json')) as Record<string, { e: string; k: string }[]>;
      const todos = Object.values(catalogo).flat();
      const conVector = new Set(corpus.items.map((i: { id: string }) => i.id));
      expect(`al menos ${MINIMO_EMOJIS} emojis (${todos.length})`, todos.length >= MINIMO_EMOJIS);
      eq('sin repetidos', new Set(todos.map((x) => x.e)).size, todos.length);
      eq('todos con nombre', todos.filter((x) => !x.k).length, 0);
      eq('todos con vector', todos.filter((x) => !conVector.has(x.e)).length, 0);
      eq('las 9 categorías del selector', Object.keys(catalogo).length, 9);
      expect('peso de emojis.json', statSync(new URL('../../assets/ia/emojis.json', import.meta.url)).size <= MAXIMO_BYTES);
      expect('peso de emojis-catalogo.json', statSync(new URL('../../assets/ia/emojis-catalogo.json', import.meta.url)).size <= MAXIMO_CATALOGO_BYTES);
      expect('al menos 150 consultas marcadas', marcadas.length >= 150);
    },
  },
]);
