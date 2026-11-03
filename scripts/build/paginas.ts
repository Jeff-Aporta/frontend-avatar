/**
 * paginas.ts — genera TODAS las páginas HTML de Avatar desde la tabla `src/js/consts/paginas.ts` (lo corre
 * `deno task build` al final, o `deno task paginas`). Ninguna página se edita a mano.
 *
 *   <ruta>/index.html          → la app: `<av-app vista="…">` (rutas reales: /, /acceso/, /canales/, …)
 *   404.html                   → la app en la portada (GitHub Pages lo sirve en rutas inexistentes)
 *   view/<v>/index.html        → la vista aislada (QA): `<iswc-toast>` + el shell de la vista, con sesión
 *   view/<v>/demo/index.html   → la vista con datos de muestra (solo si la carpeta `demo/` existe)
 *   view/demo/index.html       → explorador de demos de todos los componentes (`<iswc-doc-demo>` del kit)
 *
 * Todas comparten la misma cabecera: metadatos (title, description, canonical, Open Graph, Twitter, robots, color),
 * `<base href>` a la raíz del sitio (las URLs se resuelven igual a cualquier profundidad), fuentes de Google, import
 * map del vendor del API, tema antes del primer pintado (`boot.js`), loader del kit pineado, registrador de la app y
 * el arranque común (`js/arranque.js`), todos con `?v=` del hash de contenido. Sin scripts en línea ni HTML suelto:
 * el cuerpo son solo web components.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { metasDe, type Pagina, PAGINAS, SITIO, tituloDe, URL_PUBLICA } from '../../src/js/consts/paginas.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
const deno = JSON.parse(readFileSync(join(ROOT, 'deno.json'), 'utf8')) as { imports: Record<string, string>; avatar: { vendor: string } };
const hashes = (JSON.parse(readFileSync(join(ROOT, 'dist', 'cdn', 'asset-hashes.json'), 'utf8')) as { files: Record<string, string> }).files;
const SHA = /is-webcomponents\/([0-9a-f]{40})\//.exec(deno.imports['@iswc/component-schemas'] ?? '')?.[1];
if (!SHA) throw new Error('paginas: no encuentro el SHA del kit en deno.json');
const KIT = `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@${SHA}/dist/cdn/core/loader.min.js`;
// La copia de zod del kit con el MISMO ?v= que le pone su loader: misma URL = un solo módulo en el navegador.
const HASHES_KIT = await (await fetch(KIT.replace('core/loader.min.js', 'asset-hashes.json'), { signal: AbortSignal.timeout(30000) })).json() as { files: Record<string, string> };
const VERSION_ZOD = HASHES_KIT.files['lib/zod.min.js'];
if (!VERSION_ZOD) throw new Error('paginas: el kit no publica lib/zod.min.js');
const ZOD_KIT = KIT.replace('core/loader.min.js', `lib/zod.min.js?v=${VERSION_ZOD}`);
// Primer pintado sin esperar al JS: el body sigue oculto hasta `data-app-ready`, pero se ve un armazón en CSS puro (barra y bloques).
const ESQUELETO = `<style>html{background:#f2fbfa}html[data-theme=dark]{background:#0d1a1c}html:not([data-app-ready]) body::before{content:"";visibility:visible;position:fixed;inset:0;background:linear-gradient(#14b8a61f,#14b8a61f) 0 0/100% 3.5em no-repeat,linear-gradient(#94a3b83d,#94a3b83d) 1em 6em/min(70%,32em) 2.5em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 9.5em/min(90%,44em) 1em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 11.5em/min(80%,38em) 1em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 14.5em/calc(100% - 2em) 16em no-repeat;animation:av-latido 1.4s ease-in-out infinite alternate}@keyframes av-latido{from{opacity:.55}to{opacity:1}}@media (prefers-reduced-motion:reduce){html:not([data-app-ready]) body::before{animation:none}}</style>`;
// Fuentes propias (`deno task fuentes`): @font-face en línea (sin hoja que bloquee ni orígenes ajenos) y precarga del texto base.
const CARAS = JSON.parse(readFileSync(join(ROOT, 'assets', 'fonts', 'fuentes.json'), 'utf8')) as { familia: string; peso: string; estilo: string; rango: string; archivo: string }[];
const FUENTES = [
  '<link rel="preload" href="assets/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin>',
  `<style>${CARAS.map((c) => `@font-face{font-family:'${c.familia}';font-style:${c.estilo};font-weight:${c.peso};font-display:swap;src:url(assets/fonts/${c.archivo}) format('woff2');unicode-range:${c.rango}}`).join('')}</style>`,
].join('\n');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/** Recurso del build con su hash de contenido (relativo a la raíz: lo resuelve `<base href>`). */
const recurso = (archivo: string) => {
  const h = hashes[archivo];
  if (!h) throw new Error(`paginas: ${archivo} no está en asset-hashes.json (¿corriste el build?)`);
  return `dist/cdn/${archivo}?v=${h}`;
};

type Opciones = { jsonLd?: Record<string, unknown> | null; base: string; vista: string; titulo: string; descripcion: string; canonical: string | null; indexable: boolean; cuerpo: string; atributos?: string; explorador?: boolean };

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
<meta property="og:image" content="${URL_PUBLICA}assets/img/thumb.jpg">
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
<meta name="application-name" content="${SITIO}">${og}${o.jsonLd ? `
<script type="application/ld+json">${JSON.stringify(o.jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<link rel="alternate icon" href="assets/img/tabicon_256x256.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<meta name="theme-color" content="#14b8a6">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://api-avatar.jeffaporta.workers.dev" crossorigin>
${FUENTES}
${o.explorador ? '' : ESQUELETO}${o.vista === 'inicio' ? '<link rel="preload" href="assets/img/bgbanner.svg" as="image" fetchpriority="high">' : ''}
<script type="importmap">{ "imports": { "@avatar/vendor": "${deno.avatar.vendor}", "zod": "${ZOD_KIT}" } }</script>
<script src="${recurso('boot.js')}"></script>${o.explorador ? '' : `
<link rel="stylesheet" href="${recurso('styles/app.css')}">`}
<script type="module" src="${KIT}"></script>
<script type="module" src="${recurso('avLoader.min.js')}"></script>
${o.explorador
    ? `<script type="module" src="${KIT.replace('core/loader.min.js', 'preview/doc-demo-host.min.js')}"></script>
<script type="module" src="${recurso('view/demo/components/av-galeria.js')}"></script>`
    : `<script type="module" src="${recurso('js/arranque.js')}"></script>`}
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
/** Página de una URL declarada, con los metadatos de `metasDe`. */
const paginaDeUrl = (p: Pagina, id: string | null) => {
  const m = metasDe(p.vista, id)!;
  const rel = `${m.ruta}index.html`;
  return escribir(rel, documento({ base: baseDe(rel), vista: p.vista, titulo: m.titulo, descripcion: m.descripcion, canonical: URL_PUBLICA + m.ruta, indexable: m.indexable, cuerpo: app(p), jsonLd: m.jsonLd }));
};

const hechas: string[] = [];
for (const p of PAGINAS) {
  hechas.push(paginaDeUrl(p, null));
  for (const x of p.partes ?? []) hechas.push(paginaDeUrl(p, x.id));
}

// 404: GitHub Pages lo sirve en cualquier profundidad, así que su base es absoluta (la del sitio publicado).
const portada = PAGINAS[0]!;
hechas.push(escribir('404.html', documento({ base: new URL(URL_PUBLICA).pathname, vista: portada.vista, titulo: `Página no encontrada · ${SITIO}`, descripcion: portada.descripcion, canonical: null, indexable: false, cuerpo: app(portada) })));

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

// Explorador de demos: el shell del kit con todos los playground (`view/demo/manifest.json`).
const explorador = 'view/demo/index.html';
hechas.push(escribir(explorador, documento({ base: baseDe(explorador), vista: 'demo', titulo: `Demos · ${SITIO}`, descripcion: 'Explorador de los componentes de Avatar.', canonical: null, indexable: false, explorador: true, cuerpo: `<iswc-doc-demo brand="${SITIO}" brand-icon="mdi:hexagon-outline" brand-href="./" nav-label="Componentes" sheets-cache="avatar-demos" storage-key-nav="avatar-demos-nav"></iswc-doc-demo>` })));

// Mapa del sitio con las rutas indexables.
const urls = PAGINAS.flatMap((p) => [null, ...(p.partes ?? []).map((x) => x.id)].map((id) => metasDe(p.vista, id)!));
const indexables = urls.filter((m) => m.indexable).map((m) => `  <url><loc>${URL_PUBLICA}${m.ruta}</loc></url>`).join('\n');
hechas.push(escribir('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexables}\n</urlset>\n`));

console.log(`[paginas] ${hechas.length} archivos: ${hechas.join(', ')}`);
