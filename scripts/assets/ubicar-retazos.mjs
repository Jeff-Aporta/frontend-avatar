// Ubica cada retazo (PNG con alfa) dentro de su imagen original por búsqueda de plantilla con máscara.
// 1) escala global: prueba escalas con las 3 piezas más grandes a 1/6; 2) cada pieza a esa escala (±4 %) a 1/3;
// 3) refinamiento a resolución completa en ±6 px. Salida JSON: {pieza, x, y, w, h, escala, error} en px del original.
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const [carpeta, original, salida] = process.argv.slice(2);
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.png') ? [p] : []; });

async function rgba(src, w, h) {
  const { data, info } = await sharp(src).ensureAlpha().resize(w, h, { fit: 'fill', kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

const meta = await sharp(original).metadata();
const OW = meta.width, OH = meta.height;
const cacheO = new Map();
async function orig(f) {
  if (!cacheO.has(f)) cacheO.set(f, await rgba(original, Math.round(OW * f), Math.round(OH * f)));
  return cacheO.get(f);
}

// Píxeles de la pieza con alfa alto, submuestreados a `max`.
function muestras(p, max) {
  const out = [];
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const i = (y * p.w + x) * 4;
    if (p.data[i + 3] > 200) out.push([x, y, p.data[i], p.data[i + 1], p.data[i + 2]]);
  }
  if (out.length <= max) return out;
  const paso = out.length / max;
  return Array.from({ length: max }, (_, k) => out[Math.floor(k * paso)]);
}

function buscar(o, p, m, x0 = 0, x1 = o.w - p.w, y0 = 0, y1 = o.h - p.h) {
  let mejor = { e: Infinity, x: 0, y: 0 };
  for (let y = Math.max(0, y0); y <= Math.min(y1, o.h - p.h); y++) for (let x = Math.max(0, x0); x <= Math.min(x1, o.w - p.w); x++) {
    let e = 0;
    for (const [px, py, r, g, b] of m) {
      const i = ((y + py) * o.w + (x + px)) * 4;
      const dr = o.data[i] - r, dg = o.data[i + 1] - g, db = o.data[i + 2] - b;
      e += dr * dr + dg * dg + db * db;
      if (e > mejor.e * m.length) break;
    }
    e /= m.length;
    if (e < mejor.e) mejor = { e, x, y };
  }
  return mejor;
}

const piezas = [];
for (const f of walk(carpeta)) {
  const m = await sharp(f).metadata();
  piezas.push({ f, nombre: relative(carpeta, f).split(sep).join('/'), w: m.width, h: m.height });
}

// Escala global (pieza → original): factor k tal que tamaño_en_original = tamaño_pieza * k.
const grandes = [...piezas].sort((a, b) => b.w * b.h - a.w * a.h).filter((p) => p.w < OW * 1.6).slice(0, 3);
const F1 = 1 / 6;
let kMejor = 1, eMejor = Infinity;
for (let k = 0.55; k <= 1.05; k += 0.01) {
  let e = 0;
  for (const g of grandes) {
    const w = Math.max(4, Math.round(g.w * k * F1)), h = Math.max(4, Math.round(g.h * k * F1));
    const o = await orig(F1);
    if (w >= o.w || h >= o.h) { e += 1e9; continue; }
    const p = await rgba(g.f, w, h);
    e += buscar(o, p, muestras(p, 250)).e;
  }
  if (e < eMejor) { eMejor = e; kMejor = k; }
}
console.error('escala', kMejor.toFixed(3), 'con', grandes.map((g) => g.nombre).join(', '));

const res = [];
for (const pz of piezas) {
  let mejor = null;
  for (const dk of [-0.03, -0.015, 0, 0.015, 0.03]) {
    const k = kMejor + dk;
    const F = pz.w * k < 40 ? 1 : 1 / 3;
    const w = Math.max(3, Math.round(pz.w * k * F)), h = Math.max(3, Math.round(pz.h * k * F));
    const o = await orig(F);
    if (w >= o.w || h >= o.h) continue;
    const p = await rgba(pz.f, w, h);
    const m = muestras(p, 300);
    if (!m.length) continue;
    const r = buscar(o, p, m);
    if (!mejor || r.e < mejor.e) mejor = { ...r, k, F };
  }
  if (!mejor) { res.push({ pieza: pz.nombre, error: 'sin ubicar' }); continue; }
  // Refinamiento a resolución completa.
  const W = Math.round(pz.w * mejor.k), H = Math.round(pz.h * mejor.k);
  const o = await orig(1);
  const p = await rgba(pz.f, W, H);
  const cx = Math.round(mejor.x / mejor.F), cy = Math.round(mejor.y / mejor.F);
  const r = buscar(o, p, muestras(p, 900), cx - 6, cx + 6, cy - 6, cy + 6);
  res.push({ pieza: pz.nombre, x: r.x, y: r.y, w: W, h: H, escala: +mejor.k.toFixed(3), error: Math.round(Math.sqrt(r.e)) });
  console.error(pz.nombre, r.x, r.y, W, H, Math.round(Math.sqrt(r.e)));
}
writeFileSync(salida, JSON.stringify({ original: { w: OW, h: OH }, escala: kMejor, piezas: res }, null, 1));
