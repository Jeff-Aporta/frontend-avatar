# 15 — Búsqueda aplanada en el navegador

Cómo se calibró la búsqueda por embeddings de corpus fijos cuya consulta se vectoriza en el navegador. Hoy la usa el
selector de emojis sobre todo emojibase; cualquier tabla del front la reutiliza igual.

## What

- [W-SEM-04] La búsqueda de emojis no baja de recall@5 0,58, MRR 0,76 y nDCG@10 0,63 sobre la partición de prueba.
- [W-SEM-05] El vector servido se regenera: la transformación publicada, aplicada al vector completo, da el vector del corpus.
- [W-SEM-06] Lo que coincide por palabra exacta va primero; los errores de tecleo, los prefijos, los países y las
  profesiones encuentran su emoji.
- [W-SEM-07] El selector trae todo emojibase 18 (1900 emojis o más, sin variantes de tono), cada uno con nombre y vector,
  en las 9 categorías. `assets/ia/emojis.json` pesa 450 KB o menos; `assets/ia/emojis-catalogo.json`, 90 KB o menos.

## How

- [HS-SEM-01] Código: `src/js/core/aplanado.ts` (aplicar y empacar, va al navegador), `scripts/build/aplanado-ajuste.ts`
  (ajustar, solo build), `src/js/core/semantica.ts` (`ordenarAplanado`, léxico tolerante) y `src/js/core/calibracion.ts`
  (único lugar con parámetros).
- [HS-SEM-02] Corpus y consulta pasan por el mismo `aplanar`: centrar, multiplicar por la matriz publicada y cuantizar.
- [HS-SEM-03] Tabla nueva: dar frases cortas por ítem, promediarlas con `vectorDeFrases`, hornear con `ajustar` y buscar
  con `cargarAplanado` + `ordenarAplanado`. Hereda `CALIBRACION`; `POR_CORPUS` admite excepciones.
- [HS-SEM-04] Catálogo de emojis: `scripts/build/catalogo-emojis.ts` reparte emojibase (`es` y `en`) en las categorías de
  `CATEGORIAS_EMOJI`; los curados de `scripts/build/emojis-curados.ts` encabezan la suya con sus palabras clave. Banderas
  van en Símbolos. `deno task embeddings` escribe `assets/ia/emojis-catalogo.json` (solo emoji y nombre, por categoría),
  que `chat/emojis.ts` carga una vez al abrir el selector: el módulo no lleva emojis.

## Calibración

`deno task bench:embeddings` — 295 consultas marcadas a mano en `tests/vistas/fixtures/emojis-evaluacion.json`
(182 de ajuste, 113 de prueba; español e inglés; exactas, sinónimos, frases, errores y lo nuevo del catálogo: banderas,
profesiones, animales). Corpus: 1923 emojis. Modelo: `Xenova/paraphrase-multilingual-MiniLM-L12-v2`. Las decisiones se
tomaron con ajuste; prueba solo mide. El bench puede correr por fases (`--fases=2,3`) y con `BENCH_DIMS` /
`BENCH_FAMILIAS` para acotar la malla.

Partición de prueba, catálogo completo:

| Punto | recall@5 | MRR | nDCG@10 | Acuerdo@5 | KB | KB gzip |
|---|---|---|---|---|---|---|
| Antes: PCA 10, 4 decimales, texto único | 0,346 | 0,450 | 0,354 | 0,241 | 471 | 134 |
| Antes: PCA 10, 5 decimales, texto único | 0,344 | 0,450 | 0,353 | 0,241 | 490 | 144 |
| PCA 10, 5 decimales, texto y orden nuevos | 0,519 | 0,711 | 0,564 | 0,273 | 382 | 121 |
| LDA 10 int16, texto y orden nuevos | 0,517 | 0,724 | 0,578 | 0,265 | 272 | 104 |
| **Elegido: LDA 64 int8, matriz de 8 bits** | **0,610** | **0,791** | **0,665** | 0,632 | **404** | **194** |
| Sin aplanar, 384 int8 | 0,605 | 0,817 | 0,672 | 0,768 | 1173 | 738 |

Con los 281 emojis curados de antes, el mismo punto daba 0,733 / 0,836 / 0,779: el catálogo completo hace la búsqueda
más difícil (siete veces más candidatos) y la mejora frente a 10/5 se mantiene (+0,10 de nDCG; +0,31 frente al pipeline
original).

Lo que decidió cada parámetro, con datos de ajuste del catálogo completo:

- **Texto**: el centroide de frases cortas sigue siendo lo mejor (nDCG 0,586 frente a 0,515 del texto concatenado).
- **Léxico**: sumarlo sube más que cualquier cambio de dimensiones (0,586 → 0,674 con 384 dims).
- **Método**: LDA regularizado (r = 1) gana a PCA entre 16 y 96 dims; de 128 en adelante todo converge al vector completo.
  Blanqueo empeora; consultas sintéticas y aleatoria no compensan; truncado queda por debajo.
- **Dimensiones**: 64 es el codo (0,667); 128 da 0,680 por 193 KB más; 48 da 0,657 por 48 KB menos.
- **Cuantización**: int8 iguala a 5 decimales con un tercio del peso; bits pierde 0,03.
- **Peso**: de los 404 KB, 160 son vectores, 139 son los textos para el léxico (clave 60 + tags 79), 32 la matriz.

El acuerdo con el vector completo baja a propósito: LDA se aparta de él para acercarse a lo que una persona espera.

## Cambiar la calibración

1. Editar `src/js/core/calibracion.ts`. Para volver a 10 dimensiones y 5 decimales:
   `aplanado: { metodo: 'pca', dims: 10, blanqueo: 0, regularizacion: 0, sinteticas: false, bitsMatriz: 16, cuantizacion: { tipo: 'decimales', decimales: 5 } }`.
2. Si cambió `aplanado` o las frases: `deno task embeddings`. El bloque `orden` no pide hornear.
3. `deno task bench:embeddings` para medir y, si la decisión es deliberada, ajustar `MINIMOS` en
   `tests/vistas/emojis-calidad.test.ts`.
