/**
 * collages.ts — de los retazos de cada collage (`.fuentes/collages/<fuente>/piezas`) a lo que sirve el front.
 *
 *   deno task collages
 *
 * Por cada escena de `collages.json`:
 *   - cada pieza sale en WebP con alfa en varios anchos (natural, ½ y ¼; nunca bajo 24 px):
 *     `assets/img/collage/<escena>/<id>-<ancho>.webp`. El front elige con `srcset`/`sizes`, así cada pantalla baja
 *     solo el tamaño que va a pintar.
 *   - la pieza `base` pierde la silueta de las piezas de `cortar`: con parallax cada capa se mueve sola y debajo no
 *     queda una copia que se vea doble.
 *   - bordes pulidos (`pulir`): las máscaras de los retazos del zip vienen dentadas y con halo blanco del fondo original;
 *     las fuentes limpias (`metodo` en posiciones.json: fondo+sam, croma) solo se suavizan.
 *     se encoge el alfa 1 px, se suaviza y el color del borde se toma de su interior (sin franja clara).
 *   - `src/js/consts/collages.ts`: lienzo (proporción) y, por pieza, posición y ancho en % del lienzo + anchos
 *     disponibles. Las coordenadas salen de `posiciones.json` (búsqueda de plantilla sobre el original,
 *     `ubicar-retazos.mjs`), en px del original; aquí se pasan a % del recorte.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type PiezaCfg = { id: string; src: string; base?: boolean; cortar?: string[] };
type EscenaCfg = { fuente: string; recorte: [number, number, number, number]; piezas: PiezaCfg[] };
type Posicion = { pieza: string; x: number; y: number; w: number; h: number };

/**
 * Bordes limpios: erosiona el alfa 1 px (quita la franja mezclada con el fondo blanco del original), lo suaviza con
 * un desenfoque corto (sin escalones) y tiñe los píxeles del borde con el promedio de sus vecinos opacos.
 */
async function pulir(png: Buffer, erosionar = true): Promise<Buffer> {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const a0 = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a0[i] = data[i * 4 + 3]!;
  const er = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let m = 255;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = y + dy, xx = x + dx;
      const v = yy < 0 || xx < 0 || yy >= h || xx >= w ? 0 : a0[yy * w + xx]!;
      if (v < m) m = v;
    }
    er[y * w + x] = erosionar ? m : a0[y * w + x]!;
  }
  const suave = await sharp(Buffer.from(er), { raw: { width: w, height: h, channels: 1 } }).blur(0.9).extractChannel(0).raw().toBuffer();
  const out = Buffer.from(data);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    out[i * 4 + 3] = suave[i]!;
    if (a0[i]! >= 245 || suave[i]! === 0) continue;
    let r = 0, g = 0, b = 0, n = 0;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || xx < 0 || yy >= h || xx >= w) continue;
      const j = yy * w + xx;
      if (a0[j]! < 245) continue;
      r += data[j * 4]!; g += data[j * 4 + 1]!; b += data[j * 4 + 2]!; n++;
    }
    if (n) { out[i * 4] = r / n; out[i * 4 + 1] = g / n; out[i * 4 + 2] = b / n; }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

const RAIZ = join(import.meta.dirname ?? '.', '..', '..');
const cfg = JSON.parse(readFileSync(join(RAIZ, 'scripts/assets/collages.json'), 'utf8')) as Record<string, EscenaCfg | string>;
const redondo = (n: number) => Math.round(n * 100) / 100;
const salidaTs: string[] = [];

for (const [escena, e] of Object.entries(cfg)) {
  if (typeof e === 'string') continue;
  const dirFuente = join(RAIZ, '.fuentes/collages', e.fuente);
  const pos = JSON.parse(readFileSync(join(dirFuente, 'posiciones.json'), 'utf8')) as { metodo?: string; piezas: Posicion[] };
  // Recortes limpios (SAM, inundación, croma) ya traen borde suave: solo se suavizan, sin erosionar (si no, queda una
  // ranura entre la pieza y su hueco en el fondo). Los retazos del zip sí se erosionan.
  const limpio = !!pos.metodo;
  const dirSalida = join(RAIZ, 'assets/img/collage', escena);
  if (existsSync(dirSalida)) rmSync(dirSalida, { recursive: true });
  mkdirSync(dirSalida, { recursive: true });
  const [rx, ry, rw, rh] = e.recorte;
  const dePos = (src: string) => {
    const p = pos.piezas.find((q) => q.pieza === src);
    if (!p) throw new Error(`${escena}: ${src} sin posición`);
    return p;
  };
  const filas: string[] = [];
  for (const pz of e.piezas) {
    const p = dePos(pz.src);
    const archivo = join(dirFuente, 'piezas', pz.src);
    const meta = await sharp(archivo).metadata();
    let img = sharp(archivo).ensureAlpha();
    if (pz.base && pz.cortar?.length) {
      // Escala de la pieza respecto al original: las demás se colocan con la misma escala sobre ella.
      const s = meta.width! / p.w;
      const huecos = [];
      for (const id of pz.cortar) {
        const otra = e.piezas.find((q) => q.id === id);
        if (!otra) throw new Error(`${escena}: cortar ${id} no existe`);
        const q = dePos(otra.src);
        const w = Math.round(q.w * s), h = Math.round(q.h * s);
        const left = Math.round((q.x - p.x) * s), top = Math.round((q.y - p.y) * s);
        if (left < 0 || top < 0 || left + w > meta.width! || top + h > meta.height!) continue;
        huecos.push({ input: await sharp(join(dirFuente, 'piezas', otra.src)).resize(w, h, { fit: 'fill' }).png().toBuffer(), left, top, blend: 'dest-out' as const });
      }
      img = sharp(await img.composite(huecos).png().toBuffer());
    }
    const buf = await pulir(await img.png().toBuffer(), !limpio);
    const anchos = [meta.width!, Math.round(meta.width! / 2), Math.round(meta.width! / 4)].filter((w, i) => i === 0 || w >= 24);
    for (const w of anchos) await sharp(buf).resize({ width: w }).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(join(dirSalida, `${pz.id}-${w}.webp`));
    filas.push(`    { id: '${pz.id}', x: ${redondo(((p.x - rx) / rw) * 100)}, y: ${redondo(((p.y - ry) / rh) * 100)}, ancho: ${redondo((p.w / rw) * 100)}, alto: ${redondo((p.h / rh) * 100)}, anchos: [${anchos.join(', ')}] },`);
  }
  salidaTs.push(`  ${/^[a-zA-Z_$][\w$]*$/.test(escena) ? escena : `'${escena}'`}: {\n    proporcion: ${redondo(rh / rw)},\n    recorte: [${e.recorte.join(', ')}],\n    piezas: [\n${filas.map((f) => `  ${f}`).join('\n')}\n    ],\n  },`);
  console.log(`[collages] ${escena}: ${e.piezas.length} piezas · ${readdirSync(dirSalida).length} webp`);
}

writeFileSync(join(RAIZ, 'src/js/consts/collages.ts'), `/**
 * collages.ts — GENERADO por \`deno task collages\` (scripts/assets/collages.ts). No editar a mano.
 *
 * Por escena: \`proporcion\` (alto / ancho del lienzo), \`recorte\` (px del original) y sus retazos con posición
 * (x, y de la esquina superior izquierda) y tamaño en % del lienzo. \`anchos\`: variantes WebP disponibles en
 * \`assets/img/collage/<escena>/<id>-<ancho>.webp\`, de mayor a menor.
 */
export type Retazo = { id: string; x: number; y: number; ancho: number; alto: number; anchos: number[] };
export type Collage = { proporcion: number; recorte: [number, number, number, number]; piezas: Retazo[] };

export const COLLAGES: Record<string, Collage> = {
${salidaTs.join('\n')}
};
`);
