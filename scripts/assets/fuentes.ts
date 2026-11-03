/**
 * fuentes.ts — tipografías propias (self-host): baja de Google Fonts solo los pesos que usa la app y solo los subconjuntos
 * latin y latin-ext, a `assets/fonts/`. Así la página no espera a dos orígenes ajenos (googleapis + gstatic) ni a una hoja
 * que bloquea el render: `scripts/build/paginas.ts` pone los `@font-face` en línea y precarga el texto base.
 *
 *   deno task fuentes
 *
 * Pesos: Poppins 400–700 (texto; estático, un archivo por peso), Exo 2 500–800 y Orbitron 400–900 (variables: un archivo
 * por subconjunto cubre todo el rango). Escribe `assets/fonts/fuentes.json` con las caras que lee `paginas.ts`.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = join(import.meta.dirname ?? '.', '..', '..');
const DESTINO = join(RAIZ, 'assets/fonts');
const CSS = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@500..800&family=Orbitron:wght@400..900&family=Poppins:wght@400;500;600;700&display=swap';
// con un agente moderno Google sirve woff2 y separa por subconjunto
const AGENTE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const SUBCONJUNTOS = new Set(['latin', 'latin-ext']);

const css = await (await fetch(CSS, { headers: { 'user-agent': AGENTE }, signal: AbortSignal.timeout(20000) })).text();
const bloques = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
if (!bloques.length) throw new Error('fuentes: Google no devolvió @font-face');
mkdirSync(DESTINO, { recursive: true });
for (const f of readdirSync(DESTINO)) rmSync(join(DESTINO, f));
const caras = [];
for (const [, subconjunto, cuerpo] of bloques) {
  if (!SUBCONJUNTOS.has(subconjunto!)) continue;
  const prop = (k: string) => new RegExp(`${k}:\\s*([^;]+);`).exec(cuerpo!)?.[1]?.trim() ?? '';
  const familia = prop('font-family').replace(/['"]/g, '');
  const peso = prop('font-weight');
  const url = /url\(([^)]+)\)/.exec(prop('src'))?.[1];
  if (!url) continue;
  const archivo = `${familia.toLowerCase().replace(/\s+/g, '-')}-${peso.replace(/\s+/g, '-')}-${subconjunto}.woff2`;
  const datos = new Uint8Array(await (await fetch(url, { signal: AbortSignal.timeout(20000) })).arrayBuffer());
  writeFileSync(join(DESTINO, archivo), datos);
  caras.push({ familia, peso, estilo: prop('font-style') || 'normal', rango: prop('unicode-range'), archivo });
}
writeFileSync(join(DESTINO, 'fuentes.json'), JSON.stringify(caras, null, 2) + '\n');
console.log(`[fuentes] ${caras.length} caras → assets/fonts/`);
