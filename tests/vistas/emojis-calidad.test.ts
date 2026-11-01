// emojis-calidad.test.ts — calidad de la búsqueda aplanada contra consultas marcadas a mano, sobre lo PUBLICADO.
//
//   W-SEM-04  la partición de prueba no baja de los umbrales medidos en `deno task bench:embeddings`
//   W-SEM-05  el corpus se regenera: lo publicado aplicado a vectores completos da los vectores servidos
//   W-SEM-06  lo exacto va primero y lo mal escrito se encuentra
//   W-SEM-07  el JSON servido respeta su presupuesto de tamaño
import { readFileSync, statSync } from 'node:fs';
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';
import { medir, promedio } from '../../scripts/bench/metricas.ts';

/** Bajo esto la prueba falla. Medido: 0,733 / 0,836 / 0,779; el margen absorbe cambios del catálogo, no retrocesos. */
const MINIMOS = { recall: 0.7, mrr: 0.8, ndcg: 0.75 };
const MAXIMO_BYTES = 110 * 1024;

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
const primero = (q: string): string => buscar(marcadas.findIndex((m) => m.q === q))[0]!.replace('️', '');

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
    correr({ eq }) {
      eq('palabra exacta', primero('perro'), '🐶');
      eq('en inglés', primero('coffee'), '☕');
      eq('con error de tecleo', primero('hamburgesa'), '🍔');
      eq('por prefijo', primero('celu'), '📱');
    },
  },
  {
    nombre: 'semantica W-SEM-07 el corpus servido respeta su presupuesto',
    categoria: 'how',
    correr({ expect }) {
      expect('peso de emojis.json', statSync(new URL('../../assets/ia/emojis.json', import.meta.url)).size <= MAXIMO_BYTES);
      expect('al menos 150 consultas marcadas', marcadas.length >= 150);
    },
  },
]);
