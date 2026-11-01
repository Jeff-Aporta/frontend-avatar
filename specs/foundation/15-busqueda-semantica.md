# 15 — Búsqueda aplanada en el navegador

Cómo se calibró la búsqueda por embeddings de corpus fijos cuya consulta se vectoriza en el navegador. Hoy la usa el
selector de emojis; cualquier tabla del front la reutiliza igual.

## What

- [W-SEM-04] La búsqueda de emojis no baja de recall@5 0,70, MRR 0,80 y nDCG@10 0,75 sobre la partición de prueba.
- [W-SEM-05] El vector servido se regenera: la transformación publicada, aplicada al vector completo, da el vector del corpus.
- [W-SEM-06] Lo que coincide por palabra exacta va primero; los errores de tecleo y los prefijos encuentran su emoji.
- [W-SEM-07] `assets/ia/emojis.json` pesa 110 KB o menos.

## How

- [HS-SEM-01] Código: `src/js/core/aplanado.ts` (aplicar y empacar, va al navegador), `scripts/build/aplanado-ajuste.ts`
  (ajustar, solo build), `src/js/core/semantica.ts` (`ordenarAplanado`, léxico tolerante) y `src/js/core/calibracion.ts`
  (único lugar con parámetros).
- [HS-SEM-02] Corpus y consulta pasan por el mismo `aplanar`: centrar, multiplicar por la matriz publicada y cuantizar.
- [HS-SEM-03] Tabla nueva: dar frases cortas por ítem, promediarlas con `vectorDeFrases`, hornear con `ajustar` y buscar
  con `cargarAplanado` + `ordenarAplanado`. Hereda `CALIBRACION`; `POR_CORPUS` admite excepciones.

## Calibración

`deno task bench:embeddings` — 265 consultas marcadas a mano en `tests/vistas/fixtures/emojis-evaluacion.json`
(164 de ajuste, 101 de prueba; español e inglés; exactas, sinónimos, frases y errores). Corpus: 281 emojis. Modelo:
`Xenova/paraphrase-multilingual-MiniLM-L12-v2`. Todas las decisiones se tomaron con ajuste; prueba solo mide.

Partición de prueba:

| Punto | recall@5 | MRR | nDCG@10 | Acuerdo@5 | KB | KB gzip |
|---|---|---|---|---|---|---|
| Antes: PCA 10, 4 decimales, texto único | 0,455 | 0,557 | 0,481 | 0,358 | 102 | 36 |
| Antes: PCA 10, 5 decimales, texto único | 0,455 | 0,557 | 0,481 | 0,358 | 104 | 37 |
| PCA 10, 5 decimales, texto y orden nuevos | 0,585 | 0,754 | 0,655 | 0,376 | 68 | 30 |
| LDA 10 int16, texto y orden nuevos | 0,602 | 0,785 | 0,679 | 0,394 | 52 | 27 |
| **Elegido: LDA 64 int8, matriz de 8 bits** | **0,733** | **0,836** | **0,779** | 0,646 | **90** | **54** |
| Sin aplanar, 384 int8 | 0,715 | 0,826 | 0,765 | 0,727 | 175 | 116 |

Lo que decidió cada parámetro, con datos de ajuste:

- **Texto**: el centroide de frases cortas supera a cualquier texto concatenado (nDCG 0,691 frente a 0,649) sin más
  vectores. Un vector por frase no mejora y multiplica el corpus por doce.
- **Léxico**: sumarlo sube más que cualquier cambio de dimensiones (0,691 → 0,773 con 384 dims).
- **Método**: LDA regularizado (r = 1) gana a PCA en todos los tamaños. Blanqueo y consultas sintéticas no compensan su
  costo; aleatoria y truncado quedan por debajo.
- **Dimensiones**: 64 es el codo; más no mejora.
- **Decimales**: de 2 a 6 no cambian la calidad. Solo cambian el peso, por eso se guarda en int8.
- **Bits**: 384 bits sin aplanar dan 0,759 en 52 KB (26 gzip): la alternativa si el peso importa más que el primer resultado.

El acuerdo con el vector completo baja a propósito: LDA se aparta de él para acercarse a lo que una persona espera.

## Cambiar la calibración

1. Editar `src/js/core/calibracion.ts`. Para volver a 10 dimensiones y 5 decimales:
   `aplanado: { metodo: 'pca', dims: 10, blanqueo: 0, regularizacion: 0, sinteticas: false, bitsMatriz: 16, cuantizacion: { tipo: 'decimales', decimales: 5 } }`.
2. Si cambió `aplanado` o las frases: `deno task embeddings`. El bloque `orden` no pide hornear.
3. `deno task bench:embeddings` para medir y, si la decisión es deliberada, ajustar `MINIMOS` en
   `tests/vistas/emojis-calidad.test.ts`.
