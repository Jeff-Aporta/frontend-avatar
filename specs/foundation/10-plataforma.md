# 10 — Plataforma, build y pines

> Alcance: qué es Avatar, cómo arranca la página, las tareas de Deno, el build a `dist/cdn/` y los
> pines del kit. Fuera: el comportamiento de cada vista (specs `30+`) y las pruebas (spec `70`).

## 1. Propósito (WHAT)

Avatar es una aplicación estática (HTML + módulos ES servidos tal cual, sin framework) construida
con el kit iswc-root (`iswc-*`) y componentes propios `av-*`.

## 2. Requisitos WHAT

- [W-PLAT-01] Cada vista es una ruta real con su propio HTML (`/`, `/acceso/`, `/panel/`, `/canales/`, `/correos/`, `/proyectos/`, `/crm/`, `/finanzas/`, `/inventario/`, `/rrhh/`, `/organizacion/`, `/asistente/`, `/admin/`), idioma `es`, con título, descripción, canonical, Open Graph y robots propios. Ninguna URL de la app usa `#` ni parámetros (`?s=`); el registro abierto (canal, proyecto, cliente…) viaja en el historial del navegador y sobrevive a recargar y a atrás/adelante.
- [W-PLAT-13] Las páginas no tienen HTML suelto ni scripts en línea: el cuerpo es solo web components (`<av-app vista="…">` en la app; el shell de la vista en las páginas aisladas) y todas comparten la misma cabecera generada.
- [W-PLAT-14] Navegar entre vistas funde una página con la siguiente (transición de documento) y las demás páginas se precargan en reposo: el cambio de ruta se siente instantáneo.
- [W-PLAT-15] Búsqueda global (Ctrl+K) en el área privada: encuentra módulos y acciones por lo que el usuario quiere decir, no solo por las palabras exactas («cobrarle a un cliente» → Emitir factura).
- [W-PLAT-02] El tema inicial (claro/oscuro) y la paleta se aplican antes del primer pintado: nunca hay un destello del tema equivocado.
- [W-PLAT-03] La página permanece oculta hasta que el arranque termina; si tarda más de 6 s se revela igual, con aviso en consola.
- [W-PLAT-04] La app funciona servida desde la raíz del host o desde cualquier sub-ruta.
- [W-PLAT-05] Un solo comando produce todos los artefactos servibles; otro lo hace en modo vigilancia.
- [W-PLAT-06] Cada módulo propio se sirve con una URL que cambia si y solo si cambia su contenido, y la misma en toda la app.
- [W-PLAT-07] El kit se usa siempre en la misma versión congelada en toda la app (página, vistas aisladas, demos).

## 3. Guía HOW WEAK

- [HW-PLAT-01] Separar el loader del kit (externo, CDN) del registrador de la app (propio, generado por el build): el registrador solo mapea tag → URL y falla explícito si el loader no está.
- [HW-PLAT-02] La lista de tags (kit, transversales, por vista) es una única fuente que consumen el build, el arranque y la galería.

## 4. Contratos HOW STRONG

- [HS-PLAT-01] Runtime Deno; dependencias de build en `deno.json` `imports`: `esbuild@0.28.1`, `sass@^1.105.0`, `zod@4.4.3`, `jsdom@29.1.1`, `@browserbasehq/stagehand@4.1.0`; schemas del kit (`@iswc/component-schemas`, `@iswc/loader-schemas`) por SHA de 40 hex.
- [HS-PLAT-02] Tareas: `build:scss`, `build`, `paginas`, `embeddings`, `bench:embeddings` (ver `15-busqueda-semantica.md`), `dev`, `serve`, `check`, `pin`, `vendor:iswc`, `test`, `test:health`, `test:e2e`, `test:all`, `test:all:halt`, `sync:entregable`.
- [HS-PLAT-03] Build: `src/js/<x>.ts` → `dist/cdn/js/<x>.js`, `view/<v>/<x>.ts` → `dist/cdn/view/<v>/<x>.js` (sin bundle); bundles solo para `js/base/zod.ts` y los barriles `all.ts`; `js/boot.ts` → `dist/cdn/boot.js` (IIFE). Hojas `.scss` → `.css` hermana del módulo.
- [HS-PLAT-04] Cache busting `?v=<6 caracteres del hash de contenido>` con `stampDirectory` del kit; `dist/cdn/asset-hashes.json`; `dist/cdn/avLoader.min.js` llama `L.registerApp({tag: url?v=…}, { installSheets: false })`; `dist/cdn/build-stamp.json`.
- [HS-PLAT-05] Pin único: `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@<sha40>/dist/cdn/core/loader.min.js` (`src/js/iswc.ts`). Prohibido `@main`, `@latest`, SHA corto, GitHub Pages o ramas en raw. `deno task pin` audita; `--nuevo=<sha40|ultimo>` actualiza tras verificar en jsDelivr; luego `deno task vendor:iswc` al mismo SHA.
- [HS-PLAT-06] Páginas: la tabla única `src/js/consts/paginas.ts` (vista, ruta, shell, título, descripción, privada, indexable) genera con `scripts/build/paginas.ts` (al final de `deno task build`, o `deno task paginas`) cada `<ruta>/index.html`, `404.html` (base absoluta), `view/<v>/index.html` (aislada, `data-aislada`), `view/<v>/demo/index.html` y `sitemap.xml`. Cabecera común: `<base href>` a la raíz del sitio, metadatos, fuentes de Google, import map del vendor del API, `boot.js` → `styles/app.css` → loader del kit → `avLoader.min.js` → `js/arranque.js` (lee `<html data-vista>`, carga `SHELL_KIT_TAGS + APP_TAGS + tagsDeVista(vista)`, inyecta Speculation Rules de prefetch y marca `data-app-ready`). `@view-transition { navigation: auto }` en `app.scss`.
- [HS-PLAT-07] Router (`src/js/core/router.ts`): `rutaActual()` (vista de `<av-app vista>`/ruta; id de `history.state`), `ir(vista, id?, intencion?)` (otra vista → `location.assign` a su página con el id por `sessionStorage`; misma vista → `pushState` + evento `av-ruta`), `tomarIntencion(vista)`, `recordarDestino`/`destinoTrasAcceso`, `urlDe`/`vistaDeUrl` puras.
- [HS-PLAT-08] Búsqueda semántica (`src/js/core/semantica.ts`): vectores BAAI bge-m3 horneados en el build con transformers.js (`deno task embeddings` → `assets/ia/<corpus>.json`, int8 + escala), consulta vectorizada por el API (`usarVectorizador`), puntaje 0,85·coseno + 0,15·léxico con umbral 0,55; sin vectorizador, léxico. Corpus `comandos` = `src/js/consts/comandos.ts`; la paleta es `<iswc-semantic-search>` sobre `<iswc-command-palette>`.

## 5. Casos borde y errores

- [W-PLAT-08] Loader del kit ausente (CDN caído): el registrador lanza un error claro y el watchdog revela la página.
- [W-PLAT-09] Pin del kit no publicado en jsDelivr: el cambio de pin se rechaza sin tocar archivos.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-PLAT-10] Tras el build existen `boot.js`, `avLoader.min.js`, `asset-hashes.json`, `build-stamp.json` y `all.min.js`.
- [W-PLAT-11] Un solo SHA de 40 hex del kit en todo HTML/TS y cero referencias mutables (`deno task pin` en exit 0).
- [W-PLAT-12] E2E: la página arranca sin errores de consola y queda marcada como lista.
- [W-PLAT-16] `tests/vistas/plataforma.test.ts`: ida y vuelta URL ↔ vista en todas las páginas, sin `#` ni `?`. `tests/vistas/semantica.test.ts`: cuantización, consultas horneadas que deben traer su comando primero y caída léxica.

## 7. Notas

Sin notas.
