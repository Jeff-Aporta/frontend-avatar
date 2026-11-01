/** metricas.ts — recall@5, MRR y nDCG@10 con relevancia graduada, más acuerdo con el vector completo. */
import type { Consulta } from './datos.ts';

export type Metricas = { recall: number; mrr: number; ndcg: number };
const sinVs = (e: string): string => e.replace('️', '');
const GANANCIA = { muy: 3, algo: 1 };

/** `ranking`: ids de mejor a peor. El recall se divide por min(5, relevantes) para que 5/5 sea alcanzable. */
export function medir(c: Consulta, ranking: string[]): Metricas {
  const ids = ranking.map(sinVs);
  const rel = new Map<string, number>([...c.algo.map((e) => [e, GANANCIA.algo] as const), ...c.muy.map((e) => [e, GANANCIA.muy] as const)]);
  const hits = ids.slice(0, 5).filter((e) => rel.has(e)).length;
  const primero = ids.findIndex((e) => rel.has(e));
  const dcg = ids.slice(0, 10).reduce((s, e, i) => s + (rel.get(e) ?? 0) / Math.log2(i + 2), 0);
  const ideal = [...rel.values()].sort((a, b) => b - a).slice(0, 10).reduce((s, g, i) => s + g / Math.log2(i + 2), 0);
  return { recall: hits / Math.min(5, rel.size), mrr: primero < 0 ? 0 : 1 / (primero + 1), ndcg: dcg / ideal };
}

export function promedio(m: Metricas[]): Metricas {
  const s = (k: keyof Metricas): number => m.reduce((t, x) => t + x[k], 0) / m.length;
  return { recall: s('recall'), mrr: s('mrr'), ndcg: s('ndcg') };
}

/** Fracción del top `n` de referencia que sigue en el top `n` del candidato. */
export function acuerdo(a: string[], b: string[], n = 5): number {
  const r = new Set(a.slice(0, n));
  return b.slice(0, n).filter((x) => r.has(x)).length / n;
}
