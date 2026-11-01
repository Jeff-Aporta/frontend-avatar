/**
 * embeddings-bench.ts — calibra la búsqueda por embeddings contra consultas marcadas a mano (`deno task bench:embeddings`).
 *
 *   Fases sobre la partición de AJUSTE: 1 texto a embeber · 2 orden (exactas, léxico, sensibilidad) · 3 método y dims ·
 *   4 cuantización. La fase 5 mide en PRUEBA, una vez, solo los puntos finales: lo que se reporte de ahí no se reajusta.
 *
 * Deja el detalle en `.tmp/bench/resultado.json`. `--fases=2,3` corre solo esas (por defecto todas); la 1 es rápida y
 * siempre se muestra. `BENCH_FAMILIAS` (JSON) cambia los candidatos de la fase 4.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { aplanar, type Cuantizacion, desempacarAplanado, empacarAplanado, empacarVectores } from '../../src/js/core/aplanado.ts';
import { type AjusteOrden, CALIBRACION } from '../../src/js/core/calibracion.ts';
import { combinar, coseno, esExacta, indiceDe, lexicoTolerante, normalizar, palabrasConsulta } from '../../src/js/core/semantica.ts';
import { ajustar, type Muestras, type Receta } from '../build/aplanado-ajuste.ts';
import { frasesDe, nombreDe, palabrasDe as palabrasEmoji, textoActual, vectorDeFrases } from '../build/corpus-emojis.ts';
import { cargarConsultas, cargarEmojis, type Consulta, ROOT, Vectores } from './datos.ts';
import { acuerdo, medir, type Metricas, promedio } from './metricas.ts';

const pedidas = Deno.args.find((a) => a.startsWith('--fases='))?.slice(8).split(',') ?? ['2', '3', '4', '4b', '5'];
const fase = (f: string): boolean => pedidas.includes(f);
const todas = cargarConsultas();
const ajuste = todas.filter((c) => c.parte === 'ajuste');
const prueba = todas.filter((c) => c.parte === 'prueba');
const emojis = await cargarEmojis();
const ids = emojis.map((e) => e.id);
const vec = new Vectores();
const resultado: Record<string, unknown> = { consultas: { ajuste: ajuste.length, prueba: prueba.length }, corpus: ids.length };

const fmt = (m: Metricas): string => `${m.recall.toFixed(3)} | ${m.mrr.toFixed(3)} | ${m.ndcg.toFixed(3)}`;
const tabla = (titulo: string, cabecera: string, filas: string[]): void => {
  console.log(`\n### ${titulo}\n\n| ${cabecera} |\n|${cabecera.split('|').map(() => '---').join('|')}|`);
  for (const f of filas) console.log(`| ${f} |`);
  (resultado[titulo] = filas);
};

// ---- vectores -------------------------------------------------------------------------------------------------
const unir = (l: string[], sep = '. '): string => l.filter(Boolean).join(sep);
const textos: Record<string, (e: typeof emojis[0]) => string> = {
  'palabras clave': (e) => e.k,
  'nombre es': (e) => e.es,
  'nombre en': (e) => e.en,
  'clave + nombres': (e) => unir([e.k, e.es, e.en]),
  'es + tags': (e) => [e.es, ...e.tagsEs].join(', '),
  'en + tags': (e) => [e.en, ...e.tagsEn].join(', '),
  'es + en + tags': (e) => unir([[e.es, ...e.tagsEs].join(', '), [e.en, ...e.tagsEn].join(', ')]),
  'anterior (clave, es, en, grupo)': textoActual,
};
const representaciones: Record<string, ArrayLike<number>[][]> = {};
for (const [n, f] of Object.entries(textos)) representaciones[n] = (await vec.de(emojis.map(f))).map((v) => [v]);
const frases: Float32Array[][] = [];
for (const e of emojis) frases.push(await vec.de(frasesDe(e)));
const centroides = frases.map(vectorDeFrases);
const es = await vec.de(emojis.map((e) => unir([e.k, [e.es, ...e.tagsEs].join(', ')])));
const en = await vec.de(emojis.map((e) => [e.en, ...e.tagsEn].filter(Boolean).join(', ')));
const parEsEn = es.map((a, i) => vectorDeFrases([a, en[i]!]));
representaciones['promedio de vector es y en'] = parEsEn.map((v) => [v]);
representaciones['un vector por idioma (máximo)'] = es.map((a, i) => [a, en[i]!]);
representaciones['centroide de frases (es y en)'] = centroides.map((v) => [v]);
representaciones['un vector por frase (máximo)'] = frases;
const vectoresConsulta = new Map<string, Float32Array>();
(await vec.de(todas.map((c) => c.q))).forEach((v, i) => vectoresConsulta.set(todas[i]!.q, v));
vec.guardar();
const vc = (c: Consulta): Float32Array => vectoresConsulta.get(c.q)!;

const rankear = (puntos: ArrayLike<number>): string[] => Array.from({ length: ids.length }, (_, i) => i).sort((a, b) => puntos[b]! - puntos[a]!).map((i) => ids[i]!);
const evaluar = (cs: Consulta[], rank: (c: Consulta) => string[]): Metricas => promedio(cs.map((c) => medir(c, rank(c))));

// ---- fase 1: texto -----------------------------------------------------------------------------------------------
const filas1 = Object.entries(representaciones).map(([n, r]) => {
  const m = evaluar(ajuste, (c) => rankear(r.map((vs) => Math.max(...vs.map((v) => coseno(vc(c), v))))));
  return [n, fmt(m), r.reduce((s, x) => s + x.length, 0)] as const;
});
tabla('Fase 1: texto a embeber (384 dims, solo coseno, ajuste)', 'texto | recall@5 | MRR | nDCG@10 | vectores', filas1.map((f) => `${f[0]} | ${f[1]} | ${f[2]}`));

// ---- señales de orden ---------------------------------------------------------------------------------------------
const items = emojis.map((e) => ({ id: e.id, clave: nombreDe(e), texto: palabrasEmoji(e) }));
const indice = indiceDe(items);
const memoLex = new Map<string, Float64Array>();
const memoExa = new Map<string, boolean[]>();
const lexDe = (c: Consulta, pesoTexto: number): Float64Array => {
  const k = `${c.q}|${pesoTexto}`;
  if (!memoLex.has(k)) {
    const p = palabrasConsulta(c.q);
    memoLex.set(k, Float64Array.from(indice, (x) => lexicoTolerante(p, x.clave, x.texto, pesoTexto)));
  }
  return memoLex.get(k)!;
};
const exaDe = (c: Consulta, a: AjusteOrden): boolean[] => {
  const k = `${c.q}|${a.exacta}|${a.minimoExacta}`;
  if (!memoExa.has(k)) memoExa.set(k, indice.map((x) => esExacta(palabrasConsulta(c.q), normalizar(c.q), x, a.exacta, a.minimoExacta)));
  return memoExa.get(k)!;
};
const conOrden = (c: Consulta, sentido: ArrayLike<number>, a: AjusteOrden): string[] => rankear(combinar(sentido, lexDe(c, a.pesoTexto), exaDe(c, a), a).map((r) => r.puntaje));
const memoFull = new Map<string, Float64Array>();
const sentidoFull = (c: Consulta): Float64Array => {
  if (!memoFull.has(c.q)) memoFull.set(c.q, Float64Array.from(centroides, (v) => coseno(vc(c), v)));
  return memoFull.get(c.q)!;
};
const SOLO_COSENO: AjusteOrden = { exacta: 'ninguna', minimoExacta: 2, pesoLexico: 0, pesoTexto: 1, tipificar: false, umbral: 2 };

// ---- fase 2: orden --------------------------------------------------------------------------------------------------
if (fase('2')) {
  const filas: [string, Metricas][] = [];
  for (const exacta of ['ninguna', 'subcadena', 'palabra', 'palabra-clave'] as const) {
    for (const minimoExacta of exacta === 'ninguna' ? [2] : [2, 3, 4]) {
      for (const tipificar of [false, true]) {
        for (const pesoLexico of tipificar ? [0, 0.5, 1, 1.5, 2, 3, 4] : [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1, 1.5]) {
          for (const pesoTexto of [0.5, 0.7, 1]) {
            const a: AjusteOrden = { exacta, minimoExacta, pesoLexico, pesoTexto, tipificar, umbral: 2 };
            filas.push([`${exacta} min${minimoExacta} ${tipificar ? 'z' : 'cos'} w${pesoLexico} t${pesoTexto}`, evaluar(ajuste, (c) => conOrden(c, sentidoFull(c), a))]);
          }
        }
      }
    }
  }
  filas.sort((a, b) => b[1].ndcg - a[1].ndcg);
  const ref = filas.find((f) => f[0] === 'ninguna min2 cos w0 t1');
  const sub = filas.find((f) => f[0].startsWith('subcadena min2 cos w0 '));
  tabla('Fase 2: orden (384 dims, centroide, ajuste, 12 mejores de ' + filas.length + ')', 'orden | recall@5 | MRR | nDCG@10', [...filas.slice(0, 12), ref!, sub!].map(([n, m]) => `${n} | ${fmt(m)}`));
  const umbrales = [1, 1.5, 2, 2.5, 3, 3.5, 4].map((umbral) => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    for (const c of ajuste) {
      const r = new Set([...c.muy, ...c.algo]);
      const marcas = combinar(sentidoFull(c), lexDe(c, CALIBRACION.orden.pesoTexto), exaDe(c, CALIBRACION.orden), { ...CALIBRACION.orden, umbral });
      marcas.forEach((x, i) => {
        const es = r.has(ids[i]!.replace('️', ''));
        if (x.relevante && es) tp++;
        else if (x.relevante) fp++;
        else if (es) fn++;
      });
    }
    const p = tp / (tp + fp);
    const rr = tp / (tp + fn);
    return `${umbral} | ${p.toFixed(3)} | ${rr.toFixed(3)} | ${(2 * p * rr / (p + rr)).toFixed(3)}`;
  });
  tabla('Fase 2b: umbral de relevancia (desvíos sobre la media, ajuste)', 'umbral | precisión | recall | F1', umbrales);
}

// ---- fases 3 y 4: método, dims, cuantización ------------------------------------------------------------------------
const sinteticas = frases.flat();
const muestras: Muestras = { base: centroides, clases: frases };
const conSinteticas: Muestras = { base: centroides, extra: sinteticas, clases: frases };
const contenido = { items: items.map((i) => ({ id: i.id, clave: i.clave, texto: i.texto })) };
const SIN_CUANTIZAR: Cuantizacion = { tipo: 'decimales', decimales: 12 };

type Punto = { nombre: string; receta: Receta; muestras: Muestras; bitsMatriz: 8 | 16; sinMatriz?: boolean };
type Medida = { nombre: string; m: Metricas; mOrden: Metricas; acuerdo: number; bytes: number; gzip: number; bytesMatriz: number; msAjuste: number; msConsulta: number };

function medirPunto(p: Punto, cs: Consulta[], orden: AjusteOrden): Medida {
  const t0 = performance.now();
  const a = ajustar(p.muestras, p.receta);
  const msAjuste = performance.now() - t0;
  const json = empacarAplanado(a, p.bitsMatriz);
  const redondo = desempacarAplanado(json);
  const planos = centroides.map((v) => aplanar(v, redondo));
  const vectores = empacarVectores(planos, redondo);
  const corpus = JSON.stringify({ modelo: 'x', aplanado: p.sinMatriz ? { ...json, matriz: null } : json, ...contenido, vectores });
  const t1 = performance.now();
  const planoC = cs.map((c) => aplanar(vc(c), redondo));
  const sentidos = planoC.map((q) => Float64Array.from(planos, (v) => coseno(q, v)));
  const msConsulta = (performance.now() - t1) / cs.length;
  const pares = cs.map((c, i) => ({ c, s: sentidos[i]! }));
  const m = promedio(pares.map(({ c, s }) => medir(c, rankear(s))));
  const mOrden = promedio(pares.map(({ c, s }) => medir(c, conOrden(c, s, orden))));
  const ac = pares.reduce((t, { c, s }) => t + acuerdo(rankear(sentidoFull(c)), rankear(s)), 0) / cs.length;
  return { nombre: p.nombre, m, mOrden, acuerdo: ac, bytes: new TextEncoder().encode(corpus).length, gzip: gzipSync(corpus).length, bytesMatriz: p.sinMatriz ? 0 : (json.matriz?.datos.length ?? 0), msAjuste, msConsulta };
}

const verMedida = (x: Medida): string => `${x.nombre} | ${fmt(x.m)} | ${fmt(x.mOrden)} | ${x.acuerdo.toFixed(3)} | ${(x.bytes / 1024).toFixed(0)} | ${(x.gzip / 1024).toFixed(0)} | ${x.msAjuste.toFixed(0)} | ${x.msConsulta.toFixed(2)}`;
const CAB = 'punto | rec | mrr | ndcg (coseno) | rec | mrr | ndcg (con léxico) | acuerdo@5 | KB | KB gzip | ms ajuste | ms consulta';

if (fase('3')) {
  const familias: [string, (d: number) => Receta, Muestras, boolean?][] = [
    ['pca', (dims) => ({ metodo: 'pca', dims, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['pca blanqueo 0.5', (dims) => ({ metodo: 'pca', dims, blanqueo: 0.5, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['pca blanqueado', (dims) => ({ metodo: 'pca', dims, blanqueo: 1, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['pca + sintéticas', (dims) => ({ metodo: 'pca', dims, cuantizacion: SIN_CUANTIZAR }), conSinteticas],
    ['pca blanqueo 0.5 + sintéticas', (dims) => ({ metodo: 'pca', dims, blanqueo: 0.5, cuantizacion: SIN_CUANTIZAR }), conSinteticas],
    ['lda r0.01', (dims) => ({ metodo: 'lda', dims, regularizacion: 0.01, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['lda r0.1', (dims) => ({ metodo: 'lda', dims, regularizacion: 0.1, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['lda r1', (dims) => ({ metodo: 'lda', dims, regularizacion: 1, cuantizacion: SIN_CUANTIZAR }), muestras],
    ['aleatoria', (dims) => ({ metodo: 'aleatoria', dims, semilla: 7, cuantizacion: SIN_CUANTIZAR }), muestras, true],
    ['truncado', (dims) => ({ metodo: 'truncado', dims, cuantizacion: SIN_CUANTIZAR }), muestras, true],
  ];
  const filas: Medida[] = [];
  for (const [f, receta, mu, sinMatriz] of familias) {
    for (const d of [8, 10, 12, 16, 24, 32, 48, 64, 96, 128, 192]) {
      filas.push(medirPunto({ nombre: `${f} ${d}`, receta: receta(d), muestras: mu, bitsMatriz: 16, sinMatriz }, ajuste, CALIBRACION.orden));
    }
    console.error(`[bench] ${f} listo`);
  }
  filas.push(medirPunto({ nombre: 'sin aplanar 384', receta: { metodo: 'ninguno', dims: 384, cuantizacion: SIN_CUANTIZAR }, muestras, bitsMatriz: 16 }, ajuste, CALIBRACION.orden));
  tabla('Fase 3: método y dimensiones (sin cuantizar, ajuste)', CAB, filas.map(verMedida));
}

if (fase('4')) {
  const cuantos: [string, Cuantizacion][] = [
    ['dec2', { tipo: 'decimales', decimales: 2 }],
    ['dec3', { tipo: 'decimales', decimales: 3 }],
    ['dec4', { tipo: 'decimales', decimales: 4 }],
    ['dec5', { tipo: 'decimales', decimales: 5 }],
    ['dec6', { tipo: 'decimales', decimales: 6 }],
    ['int16', { tipo: 'int16' }],
    ['int8', { tipo: 'int8' }],
    ['bits', { tipo: 'bits' }],
  ];
  const elegido = JSON.parse(Deno.env.get('BENCH_FAMILIAS') ?? '[]') as { nombre: string; receta: Omit<Receta, 'cuantizacion'>; sinteticas?: boolean }[];
  const bases = elegido.length ? elegido : [{ nombre: 'pca', receta: { metodo: 'pca', dims: 32 } as Omit<Receta, 'cuantizacion'> }];
  const filas: Medida[] = [];
  for (const b of bases) {
    for (const [n, cuantizacion] of cuantos) {
      for (const bitsMatriz of [16, 8] as const) {
        filas.push(medirPunto({ nombre: `${b.nombre} ${n} m${bitsMatriz}`, receta: { ...b.receta, cuantizacion }, muestras: b.sinteticas ? conSinteticas : muestras, bitsMatriz }, ajuste, CALIBRACION.orden));
      }
    }
  }
  filas.push(medirPunto({ nombre: 'sin aplanar int8', receta: { metodo: 'ninguno', dims: 384, cuantizacion: { tipo: 'int8' } }, muestras, bitsMatriz: 16 }, ajuste, CALIBRACION.orden));
  filas.push(medirPunto({ nombre: 'sin aplanar bits', receta: { metodo: 'ninguno', dims: 384, cuantizacion: { tipo: 'bits' } }, muestras, bitsMatriz: 16 }, ajuste, CALIBRACION.orden));
  tabla('Fase 4: cuantización (ajuste)', CAB, filas.map(verMedida));
}

const a = CALIBRACION.aplanado;
const recetaElegida: Punto = {
  nombre: `elegido: ${a.metodo} ${a.dims} ${a.cuantizacion.tipo}`,
  receta: { metodo: a.metodo, dims: a.dims, blanqueo: a.blanqueo, regularizacion: a.regularizacion, cuantizacion: a.cuantizacion },
  muestras: a.sinteticas ? conSinteticas : muestras,
  bitsMatriz: a.bitsMatriz,
};

if (fase('4b')) {
  const servido = desempacarAplanado(empacarAplanado(ajustar(recetaElegida.muestras, recetaElegida.receta), recetaElegida.bitsMatriz));
  const planos = centroides.map((v) => aplanar(v, servido));
  const sentidos = new Map(ajuste.map((c) => {
    const q = aplanar(vc(c), servido);
    return [c.q, Float64Array.from(planos, (v) => coseno(q, v))] as const;
  }));
  const filas: [string, Metricas][] = [];
  for (const exacta of ['ninguna', 'subcadena', 'palabra', 'palabra-clave'] as const) {
    for (const tipificar of [false, true]) {
      for (const pesoLexico of tipificar ? [0.5, 1, 1.5, 2, 3, 4, 6] : [0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1, 1.5]) {
        for (const pesoTexto of [0.5, 0.7, 1]) {
          const o: AjusteOrden = { exacta, minimoExacta: 2, pesoLexico, pesoTexto, tipificar, umbral: 3 };
          filas.push([`${exacta} ${tipificar ? 'z' : 'cos'} w${pesoLexico} t${pesoTexto}`, evaluar(ajuste, (c) => conOrden(c, sentidos.get(c.q)!, o))]);
        }
      }
    }
  }
  filas.sort((x, y) => y[1].ndcg - x[1].ndcg);
  tabla('Fase 4b: orden sobre el punto elegido (ajuste, 10 mejores)', 'orden | recall@5 | MRR | nDCG@10', filas.slice(0, 10).map(([n, m]) => `${n} | ${fmt(m)}`));
}

if (fase('5')) {
  // El pipeline de antes, tal como estaba: texto único, PCA, decimales en JSON, exacta por subcadena y solo coseno.
  const anterior = await vec.de(emojis.map(textoActual));
  const baseAnterior = (decimales: number): { nombre: string; m: Metricas; acuerdo: number; bytes: number; gzip: number } => {
    const r = ajustar({ base: anterior }, { metodo: 'pca', dims: 10, cuantizacion: { tipo: 'decimales', decimales } });
    const redondo = (x: number): number => Number(x.toFixed(6));
    const json = JSON.stringify({ modelo: 'x', dims: 10, reduccion: { media: Array.from(r.media!, redondo), componentes: r.matriz!.map((f) => Array.from(f, redondo)), decimales }, items: emojis.map((e) => ({ id: e.id, texto: textoActual(e) })), vectores: empacarVectores(anterior.map((v) => aplanar(v, r)), r) });
    const planos = anterior.map((v) => aplanar(v, r));
    const textosPlanos = emojis.map((e) => normalizar(textoActual(e)));
    const rank = (c: Consulta): string[] => {
      const q = aplanar(vc(c), r);
      const t = normalizar(c.q);
      return rankear(planos.map((v, i) => coseno(q, v) + (textosPlanos[i]!.includes(t) ? 1e3 : 0)));
    };
    const ac = prueba.reduce((s, c) => s + acuerdo(rankear(anterior.map((v) => coseno(vc(c), v))), rank(c)), 0) / prueba.length;
    return { nombre: `antes: pca 10, ${decimales} decimales`, m: evaluar(prueba, rank), acuerdo: ac, bytes: new TextEncoder().encode(json).length, gzip: gzipSync(json).length };
  };
  const filas = [baseAnterior(4), baseAnterior(5)].map((x) => `${x.nombre} | ${fmt(x.m)} | ${x.acuerdo.toFixed(3)} | ${(x.bytes / 1024).toFixed(0)} | ${(x.gzip / 1024).toFixed(0)}`);
  const puntos: Punto[] = [
    { nombre: 'pca 10, 5 decimales + texto y orden nuevos', receta: { metodo: 'pca', dims: 10, cuantizacion: { tipo: 'decimales', decimales: 5 } }, muestras, bitsMatriz: 16 },
    { nombre: 'lda 10 int16 + texto y orden nuevos', receta: { metodo: 'lda', dims: 10, regularizacion: 1, cuantizacion: { tipo: 'int16' } }, muestras, bitsMatriz: 16 },
    recetaElegida,
    { nombre: 'sin aplanar 384 int8', receta: { metodo: 'ninguno', dims: 384, cuantizacion: { tipo: 'int8' } }, muestras, bitsMatriz: 16 },
  ];
  const medidos = puntos.map((p) => medirPunto(p, prueba, CALIBRACION.orden));
  tabla(`Fase 5: PRUEBA (${prueba.length} consultas no usadas para ajustar)`, 'punto | recall@5 | MRR | nDCG@10 | acuerdo@5 | KB | KB gzip', [...filas, ...medidos.map((x) => `${x.nombre} | ${fmt(x.mOrden)} | ${x.acuerdo.toFixed(3)} | ${(x.bytes / 1024).toFixed(0)} | ${(x.gzip / 1024).toFixed(0)}`)]);
  const servido = desempacarAplanado(empacarAplanado(ajustar(recetaElegida.muestras, recetaElegida.receta), recetaElegida.bitsMatriz));
  const planos = centroides.map((v) => aplanar(v, servido));
  const porTipo = [...Map.groupBy(prueba, (c) => `${c.idioma}/${c.tipo}`)].map(([g, cs]) => {
    const m = evaluar(cs, (c) => {
      const q = aplanar(vc(c), servido);
      return conOrden(c, Float64Array.from(planos, (v) => coseno(q, v)), CALIBRACION.orden);
    });
    return `${g} (${cs.length}) | ${fmt(m)}`;
  });
  tabla('Fase 5b: elegido por tipo de consulta (prueba)', 'tipo | recall@5 | MRR | nDCG@10', porTipo);
}

writeFileSync(join(ROOT, '.tmp', 'bench', 'resultado.json'), JSON.stringify(resultado, null, 1));
