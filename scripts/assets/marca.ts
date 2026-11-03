/**
 * marca.ts — todos los íconos estáticos de Avatar salen de UNA fuente: `assets/img/marca/a-cinta.svg` (la «A» de cinta,
 * la misma geometría de `<av-logo>`). Así pestaña, notificaciones, accesos directos y la vista previa en redes
 * comparten identidad.
 *
 *   deno task marca
 *
 * Genera en `assets/img/`: favicon.svg (copia de la marca), tabicon_256x256.png
 * (pestaña alterna y notificaciones), apple-touch-icon.png (180, fondo claro redondeado), icon-512.png (instalable) y
 * thumb.jpg (1200×630, Open Graph: marca + collage «módulos»; JPEG: ~4× más liviano que PNG y lo leen todas las redes).
 */
import sharp from 'sharp';
import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = join(import.meta.dirname ?? '.', '..', '..');
const IMG = join(RAIZ, 'assets/img');
const MARCA = join(IMG, 'marca/a-cinta.svg');
const svg = readFileSync(MARCA);
const FONDO = '#f2fbfa';

const marca = (lado: number) => sharp(svg, { density: 600 }).resize(lado, lado, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const placa = (lado: number, radio: number) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}"><rect width="${lado}" height="${lado}" rx="${radio}" fill="${FONDO}"/></svg>`);

copyFileSync(MARCA, join(IMG, 'favicon.svg'));
await sharp(await marca(256)).toFile(join(IMG, 'tabicon_256x256.png'));
for (const [lado, nombre] of [[180, 'apple-touch-icon.png'], [512, 'icon-512.png']] as const) {
  const m = Math.round(lado * 0.7);
  await sharp(placa(lado, Math.round(lado * 0.22))).composite([{ input: await marca(m), gravity: 'center' }]).png().toFile(join(IMG, nombre));
}

// Open Graph: fondo claro, la marca a la izquierda y el collage «módulos» (original) a la derecha.
const collage = await sharp(join(RAIZ, '.fuentes/collages/3-modulos/original.webp')).resize(560, 584, { fit: 'cover' }).png().toBuffer();
const lienzo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g" cx=".25" cy=".45" r=".7"><stop offset="0" stop-color="#d9f7f3"/><stop offset="1" stop-color="${FONDO}"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
await sharp(lienzo).composite([{ input: await marca(380), left: 110, top: 125 }, { input: collage, left: 610, top: 23 }]).jpeg({ quality: 84, mozjpeg: true }).toFile(join(IMG, 'thumb.jpg'));
console.log('[marca] favicon.svg · tabicon_256x256.png · apple-touch-icon.png · icon-512.png · thumb.jpg');
