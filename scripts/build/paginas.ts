/**
 * paginas.ts — genera TODAS las páginas HTML de Avatar desde la tabla `src/js/consts/paginas.ts` (lo corre
 * `deno task build` al final, o `deno task paginas`). Ninguna página se edita a mano.
 *
 *   <ruta>/index.html          → la app: `<av-app vista="…">` (rutas reales: /, /acceso/, /canales/, …)
 *   404.html                   → la app en la portada (GitHub Pages lo sirve en rutas inexistentes)
 *   view/<v>/index.html        → la vista aislada (QA): `<iswc-toast>` + el shell de la vista, con sesión
 *   view/<v>/demo/index.html   → la vista con datos de muestra (solo si la carpeta `demo/` existe)
 *
 * Todas comparten la misma cabecera: metadatos (title, description, canonical, Open Graph, Twitter, robots, color),
 * `<base href>` a la raíz del sitio (las URLs se resuelven igual a cualquier profundidad), fuentes de Google, import
 * map del vendor del API, tema antes del primer pintado (`boot.js`), loader del kit pineado, registrador de la app y
 * el arranque común (`js/arranque.js`), todos con `?v=` del hash de contenido. Sin scripts en línea ni HTML suelto:
 * el cuerpo son solo web components.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { type Pagina, PAGINAS, SITIO, tituloDe, URL_PUBLICA } from '../../src/js/consts/paginas.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
const deno = JSON.parse(readFileSync(join(ROOT, 'deno.json'), 'utf8')) as { imports: Record<string, string>; avatar: { vendor: string } };
const hashes = (JSON.parse(readFileSync(join(ROOT, 'dist', 'cdn', 'asset-hashes.json'), 'utf8')) as { files: Record<string, string> }).files;
const SHA = /is-webcomponents\/([0-9a-f]{40})\//.exec(deno.imports['@iswc/component-schemas'] ?? '')?.[1];
if (!SHA) throw new Error('paginas: no encuentro el SHA del kit en deno.json');
const KIT = `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@${SHA}/dist/cdn/core/loader.min.js`;
const FUENTES = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@500;600;700;800&family=Orbitron:wght@500;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/** Recurso del build con su hash de contenido (relativo a la raíz: lo resuelve `<base href>`). */
const recurso = (archivo: string) => {
  const h = hashes[archivo];
  if (!h) throw new Error(`paginas: ${archivo} no está en asset-hashes.json (¿corriste el build?)`);
  return `dist/cdn/${archivo}?v=${h}`;
};

type Opciones = { base: string; vista: string; titulo: string; descripcion: string; canonical: string | null; indexable: boolean; cuerpo: string; atributos?: string };

function documento(o: Opciones): string {
  const robots = o.indexable ? 'index, follow' : 'noindex, nofollow';
  const og = o.canonical
    ? `
<link rel="canonical" href="${o.canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITIO}">
<meta property="og:locale" content="es_CO">
<meta property="og:title" content="${esc(o.titulo)}">
<meta property="og:description" content="${esc(o.descripcion)}">
<meta property="og:url" content="${o.canonical}">
<meta property="og:image" content="${URL_PUBLICA}assets/img/thumb.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.titulo)}">
<meta name="twitter:description" content="${esc(o.descripcion)}">`
    : '';
  return `<!doctype html>
<!-- Generado por scripts/build/paginas.ts desde src/js/consts/paginas.ts. No editar a mano. -->
<html lang="es" data-theme="light" data-palette="turquesa" data-vista="${o.vista}"${o.atributos ?? ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<base href="${o.base}">
<title>${esc(o.titulo)}</title>
<meta name="description" content="${esc(o.descripcion)}">
<meta name="robots" content="${robots}">
<meta name="application-name" content="${SITIO}">${og}
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<link rel="alternate icon" href="assets/img/tabicon_256x256.png">
<meta name="theme-color" content="#0a6cff">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://api-avatar.jeffaporta.workers.dev" crossorigin>
<link rel="stylesheet" href="${FUENTES}">
<script type="importmap">{ "imports": { "@avatar/vendor": "${deno.avatar.vendor}" } }</script>
<script src="${recurso('boot.js')}"></script>
<link rel="stylesheet" href="${recurso('styles/app.css')}">
<script type="module" src="${KIT}"></script>
<script type="module" src="${recurso('avLoader.min.js')}"></script>
<script type="module" src="${recurso('js/arranque.js')}"></script>
</head>
<body>
${o.cuerpo}
</body>
</html>
`;
}

const escribir = (rel: string, html: string) => {
  const destino = join(ROOT, rel);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html);
  return rel;
};
const profundidad = (rel: string) => rel.split('/').length - 1;
const baseDe = (rel: string) => '../'.repeat(profundidad(rel)) || './';
const app = (p: Pagina) => `<av-app vista="${p.vista}"></av-app>`;

const hechas: string[] = [];
for (const p of PAGINAS) {
  const rel = `${p.ruta}index.html`;
  hechas.push(escribir(rel, documento({ base: baseDe(rel), vista: p.vista, titulo: tituloDe(p), descripcion: p.descripcion, canonical: URL_PUBLICA + p.ruta, indexable: p.indexable, cuerpo: app(p) })));
}

// 404: GitHub Pages lo sirve en cualquier profundidad, así que su base es absoluta (la del sitio publicado).
const portada = PAGINAS[0]!;
hechas.push(escribir('404.html', documento({ base: URL_PUBLICA, vista: portada.vista, titulo: `Página no encontrada · ${SITIO}`, descripcion: portada.descripcion, canonical: null, indexable: false, cuerpo: app(portada) })));

for (const p of PAGINAS) {
  if (!p.shell || !existsSync(join(ROOT, 'view', p.vista))) continue;
  const cuerpo = `<iswc-toast placement="bottom-end"></iswc-toast>\n<${p.shell}></${p.shell}>`;
  const qa = `view/${p.vista}/index.html`;
  hechas.push(escribir(qa, documento({ base: baseDe(qa), vista: p.vista, titulo: `${p.titulo} (vista aislada) · ${SITIO}`, descripcion: p.descripcion, canonical: null, indexable: false, cuerpo, atributos: ' data-aislada' })));
  if (existsSync(join(ROOT, 'view', p.vista, 'demo'))) {
    const demo = `view/${p.vista}/demo/index.html`;
    hechas.push(escribir(demo, documento({ base: baseDe(demo), vista: p.vista, titulo: `${p.titulo} (demo) · ${SITIO}`, descripcion: p.descripcion, canonical: null, indexable: false, cuerpo, atributos: ' data-demo' })));
  }
}

// Mapa del sitio con las rutas indexables.
const indexables = PAGINAS.filter((p) => p.indexable).map((p) => `  <url><loc>${URL_PUBLICA}${p.ruta}</loc></url>`).join('\n');
hechas.push(escribir('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexables}\n</urlset>\n`));

console.log(`[paginas] ${hechas.length} archivos: ${hechas.join(', ')}`);
