/**
 * servir.ts — servidor local igual a GitHub Pages: archivos tal cual y, si no existen, `404.html`, que arranca la SPA en esa
 * URL (registros como `/canales/12/`). `404.html` trae la base del sitio publicado; aquí se reescribe a la raíz local.
 *   deno task serve
 */
import { serveDir } from '@std/http/file-server';
import { URL_PUBLICA } from '../../src/js/consts/paginas.ts';

const puerto = Number(Deno.args[0] ?? 4300);
const base = new URL(URL_PUBLICA).pathname;

Deno.serve({ port: puerto, hostname: '127.0.0.1' }, async (req) => {
  const r = await serveDir(req, { fsRoot: '.', quiet: true });
  if (r.status !== 404) return r;
  const html = (await Deno.readTextFile('404.html')).replace(`<base href="${base}">`, '<base href="/">');
  return new Response(html, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
});
