/**
 * paginas.ts — genera TODAS las páginas HTML de Avatar desde la tabla `src/js/consts/paginas.ts` (lo llama
 * `src/utils/build.ts` ANTES del conversor del kit, o `deno task paginas` + `deno task build`). Ninguna página se edita a mano.
 *
 *   <ruta>/index.html          → la app: `<av-app vista="…">` (rutas reales: /, /acceso/, /canales/, …)
 *   404.html                   → la app en la portada (GitHub Pages lo sirve en rutas inexistentes)
 *   view/<v>/index.html        → la vista aislada (QA): `<iswc-toast>` + el shell de la vista, con sesión
 *   view/<v>/demo/index.html   → la vista con datos de muestra (solo si la carpeta `demo/` existe)
 *   view/demo/index.html       → explorador de demos de todos los componentes (`<iswc-doc-demo>` del kit)
 *
 * Todas comparten la misma cabecera: metadatos (title, description, canonical, Open Graph, Twitter, robots, color),
 * `<base href>` a la raíz del sitio (las URLs se resuelven igual a cualquier profundidad), fuentes propias, tema antes del
 * primer pintado (`boot.js`), la hoja de la app, el bloque `<!-- iswc:precarga -->` y el arranque común
 * (`js/arranque.min.mjs`). El bloque (import map, precarga del kit y de la vista, lote del armazón, hojas base, loader del
 * kit y registrador) y el `?v=` de las referencias a `dist/cdn/` los escribe `construirApp` del kit con la lista que
 * devuelve `generarPaginas()`. Sin scripts en línea ni HTML suelto: el cuerpo son solo web components.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { metasDe, type Pagina, PAGINAS, SITIO, URL_PUBLICA } from '../../src/js/consts/paginas.ts';
import { ISWC_LOADER_HREF } from '../../src/js/iswc.ts';

const ROOT = join(import.meta.dirname!, '..', '..');
// Pin canónico: la URL del loader de `src/js/iswc.ts` (un SHA de 40 hex; `deno task pin` lo mueve en todo).
if (!/@[0-9a-f]{40}\/dist\/cdn\/core\/loader\.min\.mjs$/.test(ISWC_LOADER_HREF)) throw new Error('paginas: src/js/iswc.ts no pinea core/loader.min.mjs a un SHA de 40 hex');
/** `dist/cdn/` del kit al pin (inmutable): el explorador pide `preview/doc-demo-host` sin `?v=`. */
const CDN_KIT = ISWC_LOADER_HREF.replace(/core\/loader\.min\.mjs$/, '');
// Primer pintado sin esperar al JS: el body sigue oculto hasta `data-app-ready`, pero se ve un armazón en CSS puro (barra y bloques).
const ESQUELETO = `<style>html{background:#f2fbfa}html[data-theme=dark]{background:#0d1a1c}html:not([data-app-ready]) body::before{content:"";visibility:visible;position:fixed;inset:0;background:linear-gradient(#14b8a61f,#14b8a61f) 0 0/100% 3.5em no-repeat,linear-gradient(#94a3b83d,#94a3b83d) 1em 6em/min(70%,32em) 2.5em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 9.5em/min(90%,44em) 1em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 11.5em/min(80%,38em) 1em no-repeat,linear-gradient(#94a3b82e,#94a3b82e) 1em 14.5em/calc(100% - 2em) 16em no-repeat;animation:av-latido 1.4s ease-in-out infinite alternate}@keyframes av-latido{from{opacity:.55}to{opacity:1}}@media (prefers-reduced-motion:reduce){html:not([data-app-ready]) body::before{animation:none}}</style>`;
// Fuentes propias (`deno task fuentes`): @font-face en línea (sin hoja que bloquee ni orígenes ajenos) y precarga del texto base.
const CARAS = JSON.parse(readFileSync(join(ROOT, 'assets', 'fonts', 'fuentes.json'), 'utf8')) as { familia: string; peso: string; estilo: string; rango: string; archivo: string }[];
const FUENTES = [
  '<link rel="preload" href="assets/fonts/poppins-400-latin.woff2" as="font" type="font/woff2" crossorigin>',
  `<style>${CARAS.map((c) => `@font-face{font-family:'${c.familia}';font-style:${c.estilo};font-weight:${c.peso};font-display:swap;src:url(assets/fonts/${c.archivo}) format('woff2');unicode-range:${c.rango}}`).join('')}</style>`,
].join('\n');
const BLOQUE = '<!-- iswc:precarga:inicio -->\n<!-- iswc:precarga:fin -->';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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
<script src="dist/cdn/boot.js"></script>${o.explorador ? '' : `
<link rel="stylesheet" href="dist/cdn/styles/app.css">`}
${BLOQUE}
${o.explorador
    ? `<script type="module" src="${CDN_KIT}preview/doc-demo-host.min.mjs"></script>
<script type="module" src="dist/cdn/view/demo/components/av-galeria.min.mjs"></script>`
    : `<script type="module" src="dist/cdn/js/arranque.min.mjs"></script>`}
</head>
<body>
${o.cuerpo}
</body>
</html>
`;
}

/** Una página escrita: su archivo (relativo a la raíz), su vista y si es el explorador de demos. */
export type PaginaEscrita = { archivo: string; vista: string; explorador: boolean };

/** Escribe todas las páginas y el sitemap; devuelve las páginas para el bloque de precarga de `construirApp`. */
export function generarPaginas(): PaginaEscrita[] {
  const hechas: PaginaEscrita[] = [];
  const escribir = (rel: string, html: string) => {
    const destino = join(ROOT, rel);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, html);
  };
  const pagina = (rel: string, o: Opciones) => {
    escribir(rel, documento(o));
    hechas.push({ archivo: rel, vista: o.vista, explorador: !!o.explorador });
  };
  const profundidad = (rel: string) => rel.split('/').length - 1;
  const baseDe = (rel: string) => '../'.repeat(profundidad(rel)) || './';
  const app = (p: Pagina) => `<av-app vista="${p.vista}"></av-app>`;
  /** Página de una URL declarada, con los metadatos de `metasDe`. */
  const paginaDeUrl = (p: Pagina, id: string | null) => {
    const m = metasDe(p.vista, id)!;
    const rel = `${m.ruta}index.html`;
    pagina(rel, { base: baseDe(rel), vista: p.vista, titulo: m.titulo, descripcion: m.descripcion, canonical: URL_PUBLICA + m.ruta, indexable: m.indexable, cuerpo: app(p), jsonLd: m.jsonLd });
  };

  for (const p of PAGINAS) {
    paginaDeUrl(p, null);
    for (const x of p.partes ?? []) paginaDeUrl(p, x.id);
  }

  // 404: GitHub Pages lo sirve en cualquier profundidad, así que su base es absoluta (la del sitio publicado).
  const portada = PAGINAS[0]!;
  pagina('404.html', { base: new URL(URL_PUBLICA).pathname, vista: portada.vista, titulo: `Página no encontrada · ${SITIO}`, descripcion: portada.descripcion, canonical: null, indexable: false, cuerpo: app(portada) });

  for (const p of PAGINAS) {
    if (!p.shell || !existsSync(join(ROOT, 'view', p.vista))) continue;
    const cuerpo = `<iswc-toast placement="bottom-end"></iswc-toast>\n<${p.shell}></${p.shell}>`;
    const qa = `view/${p.vista}/index.html`;
    pagina(qa, { base: baseDe(qa), vista: p.vista, titulo: `${p.titulo} (vista aislada) · ${SITIO}`, descripcion: p.descripcion, canonical: null, indexable: false, cuerpo, atributos: ' data-aislada' });
    if (existsSync(join(ROOT, 'view', p.vista, 'demo'))) {
      const demo = `view/${p.vista}/demo/index.html`;
      pagina(demo, { base: baseDe(demo), vista: p.vista, titulo: `${p.titulo} (demo) · ${SITIO}`, descripcion: p.descripcion, canonical: null, indexable: false, cuerpo, atributos: ' data-demo' });
    }
  }

  // Explorador de demos: el shell del kit con todos los playground (`view/demo/manifest.json`).
  const explorador = 'view/demo/index.html';
  pagina(explorador, { base: baseDe(explorador), vista: 'demo', titulo: `Demos · ${SITIO}`, descripcion: 'Explorador de los componentes de Avatar.', canonical: null, indexable: false, explorador: true, cuerpo: `<iswc-doc-demo brand="${SITIO}" brand-icon="mdi:hexagon-outline" brand-href="./" nav-label="Componentes" sheets-cache="avatar-demos" storage-key-nav="avatar-demos-nav"></iswc-doc-demo>` });

  // Mapa del sitio con las rutas indexables.
  const urls = PAGINAS.flatMap((p) => [null, ...(p.partes ?? []).map((x) => x.id)].map((id) => metasDe(p.vista, id)!));
  const indexables = urls.filter((m) => m.indexable).map((m) => `  <url><loc>${URL_PUBLICA}${m.ruta}</loc></url>`).join('\n');
  writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexables}\n</urlset>\n`);
  console.log(`[paginas] ${hechas.length} páginas + sitemap.xml`);
  return hechas;
}

if (import.meta.main) generarPaginas();
