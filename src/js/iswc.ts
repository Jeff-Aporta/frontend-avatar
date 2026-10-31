/**
 * iswc.ts — pin canónico del kit: SOLO la URL del loader.
 *
 * Un único SHA de 40 hex ya publicado en jsDelivr, igual en todos los HTML (el build lo homogeneiza
 * y `deno task pin` lo audita). Prohibido `@main`, `@latest`, SHA corto o GitHub Pages, y prohibido
 * reconstruir CDN/REPO/PIN en la app: el loader expone `L.host`, `L.repo`, `L.shaDefault`.
 */
export const ISWC_LOADER_HREF = 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@ea5555d26eb7bd431eac0c00e21cb685560feedc/dist/cdn/core/loader.min.js';
