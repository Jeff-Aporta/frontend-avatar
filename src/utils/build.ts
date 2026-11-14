/**
 * build.ts — `deno task build` (después de `build:scss`): genera las páginas (`scripts/build/paginas.ts`) y corre el
 * conversor del kit `construirApp`, al MISMO SHA que el pin (`deno task pin` mueve esta URL con el resto): `src/js/**` y
 * `view/**` → `.min.mjs` con splitting en `dist/cdn/` (chunks en `dist/cdn/_chunks/`), `boot.ts` en IIFE, `?v=`, `deps.json`,
 * el lote del armazón (`kit-lote.min.mjs`, SHELL_KIT_TAGS desde el pin), el registrador `avLoader.min.mjs` y el bloque
 * `<!-- iswc:precarga -->` de cada página (cierre del kit de la vista y de sus componentes).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { stop } from 'esbuild';
import { construirApp, vigilarApp } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@904b3a574fc7c05f4297b0d991cdd93c5afdce40/dist/cdn/build/construir-app.ts';
import { APP_TAGS, mapaRutas, PREFIJO, SHELL_KIT_TAGS, tagsDeVista, VIEW_KIT_TAGS } from '../js/kit-tags.ts';
import { generarPaginas } from '../../scripts/build/paginas.ts';

const raiz = join(import.meta.dirname!, '..', '..');
const vendor = (JSON.parse(readFileSync(join(raiz, 'deno.json'), 'utf8')) as { avatar: { vendor: string } }).avatar.vendor;
const fuente = (rel: string) => (rel.startsWith('js/') ? `src/${rel}` : rel).replace(/\.js$/, '.ts');
const html = () => generarPaginas().map((p) => p.explorador
  ? { archivo: p.archivo, app: ['view/demo/components/av-galeria.ts'] }
  : { archivo: p.archivo, kit: [...(VIEW_KIT_TAGS[p.vista] ?? [])], app: ['src/js/arranque.ts', ...APP_TAGS, ...tagsDeVista(p.vista).filter((t) => t.startsWith(`${PREFIJO}-`))] });
const opts = {
  raiz,
  prefijo: PREFIJO,
  planos: ['src/js/boot.ts'],
  externos: ['@avatar/vendor'],
  importMap: { '@avatar/vendor': vendor },
  precargas: [vendor],
  lote: { tags: [...SHELL_KIT_TAGS] },
  tags: Object.fromEntries(Object.entries(mapaRutas()).map(([t, r]) => [t, fuente(r)])),
  html: html(),
};
await construirApp(opts);
if (Deno.args.includes('--watch')) await vigilarApp(opts, async () => { await new Deno.Command(Deno.execPath(), { args: ['task', 'build:scss'], cwd: raiz }).output(); opts.html = html(); });
else await stop();
