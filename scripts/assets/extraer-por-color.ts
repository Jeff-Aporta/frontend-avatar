/**
 * extraer-por-color.ts — saca los retazos de un collage de fondo claro y neutro directamente del original, cuando los
 * fragmentos que vinieron no sirven (rectángulos con fondo). El alfa sale del croma de cada píxel (el fondo, la
 * retícula y las sombras son grises; las figuras, turquesa), el color se despremultiplica contra el fondo (sin halo
 * claro) y cada figura conectada queda en su PNG con su posición, en el mismo formato de `posiciones.json`.
 *
 *   deno run -A scripts/assets/extraer-por-color.ts .fuentes/collages/2-marca
 *
 * Escribe `<carpeta>/piezas/color/figura-N.png` (N por área, de mayor a menor) y `<carpeta>/posiciones.json`.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const carpeta = Deno.args[0];
if (!carpeta) throw new Error('uso: extraer-por-color.ts <carpeta del collage>');
const AREA_MIN = 250;

const original = ['original.png', 'original.webp'].map((n) => join(carpeta, n));
let fuente = '';
for (const o of original) {
  try {
    Deno.statSync(o);
    fuente = o;
    break;
  } catch { /* siguiente */ }
}
const { data, info } = await sharp(fuente).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

// Fondo: promedio de las cuatro esquinas (10×10).
let fr = 0, fg = 0, fb = 0, fn = 0;
for (const [cx, cy] of [[0, 0], [w - 10, 0], [0, h - 10], [w - 10, h - 10]] as const) {
  for (let y = cy; y < cy + 10; y++) for (let x = cx; x < cx + 10; x++) {
    const i = (y * w + x) * 3;
    fr += data[i]!; fg += data[i + 1]!; fb += data[i + 2]!; fn++;
  }
}
const fondo = [fr / fn, fg / fn, fb / fn];

// Alfa por croma (máx − mín de RGB): gris → 0, turquesa → 1, con rampa suave entre 14 y 50.
const alfa = new Float32Array(w * h);
for (let i = 0; i < w * h; i++) {
  const r = data[i * 3]!, g = data[i * 3 + 1]!, b = data[i * 3 + 2]!;
  const croma = Math.max(r, g, b) - Math.min(r, g, b);
  alfa[i] = Math.min(1, Math.max(0, (croma - 14) / 36));
}

// Figuras: componentes 8-conexas de alfa > 0.5.
const etiqueta = new Int32Array(w * h).fill(-1);
const figuras: { n: number; x0: number; y0: number; x1: number; y1: number; area: number }[] = [];
for (let i = 0; i < w * h; i++) {
  if (alfa[i]! <= 0.5 || etiqueta[i] !== -1) continue;
  const n = figuras.length;
  const f = { n, x0: w, y0: h, x1: 0, y1: 0, area: 0 };
  const pila = [i];
  etiqueta[i] = n;
  while (pila.length) {
    const p = pila.pop()!;
    const x = p % w, y = (p - x) / w;
    f.area++;
    if (x < f.x0) f.x0 = x;
    if (y < f.y0) f.y0 = y;
    if (x > f.x1) f.x1 = x;
    if (y > f.y1) f.y1 = y;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const q = yy * w + xx;
      if (alfa[q]! > 0.5 && etiqueta[q] === -1) {
        etiqueta[q] = n;
        pila.push(q);
      }
    }
  }
  figuras.push(f);
}

const grandes = figuras.filter((f) => f.area >= AREA_MIN).sort((a, b) => b.area - a.area);
const dirSalida = join(carpeta, 'piezas', 'color');
mkdirSync(dirSalida, { recursive: true });
const piezas = [];
for (const [k, f] of grandes.entries()) {
  // Caja con 3 px de margen para el borde suave; solo píxeles de esta figura o de borde (alfa ≤ 0.5) cercanos a ella.
  const x0 = Math.max(0, f.x0 - 3), y0 = Math.max(0, f.y0 - 3), x1 = Math.min(w - 1, f.x1 + 3), y1 = Math.min(h - 1, f.y1 + 3);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = y * w + x;
    let propio = etiqueta[i] === f.n;
    if (!propio && etiqueta[i] === -1) {
      for (let dy = -3; dy <= 3 && !propio; dy++) for (let dx = -3; dx <= 3 && !propio; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && etiqueta[yy * w + xx] === f.n) propio = true;
      }
    }
    const o = ((y - y0) * cw + (x - x0)) * 4;
    const a = propio ? alfa[i]! : 0;
    for (let c = 0; c < 3; c++) {
      const v = a > 0.02 ? (data[i * 3 + c]! - (1 - a) * fondo[c]!) / a : data[i * 3 + c]!;
      out[o + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
    out[o + 3] = Math.round(a * 255);
  }
  const nombre = `color/figura-${k + 1}.png`;
  await sharp(out, { raw: { width: cw, height: ch, channels: 4 } }).png().toFile(join(carpeta, 'piezas', nombre));
  piezas.push({ pieza: nombre, x: x0, y: y0, w: cw, h: ch, escala: 1, error: 0 });
  console.log(nombre, `${cw}x${ch}`, `+${x0}+${y0}`, 'área', f.area);
}
writeFileSync(join(carpeta, 'posiciones.json'), JSON.stringify({ original: { w, h }, escala: 1, metodo: 'croma', piezas }, null, 1));
