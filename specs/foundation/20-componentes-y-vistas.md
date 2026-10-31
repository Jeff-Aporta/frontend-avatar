# 20 — Componentes, vistas y kit

> Alcance: cómo se define un componente `av-*`, cómo se registra, cómo se define una vista
> y el catálogo de componentes y vistas. Fuera: build y pines (spec `10`).

## 1. Propósito (WHAT)

La app es un conjunto de páginas (una por vista, todas generadas igual) hechas de piezas con nombre propio (`<av-…>`) sobre el kit
iswc-root. Cada pieza muestra una parte concreta, recibe datos (atributos o `props`) y avisa hacia
arriba con eventos `av-…`; se ve igual en claro y oscuro; tiene una ficha (`.md`) y un
ejemplo vivo en la galería.

## 2. Requisitos WHAT

- [W-COMP-01] Toda pieza visible es un elemento `av-<algo>`; encapsula su DOM y sus estilos y nunca se ve sin estilos, ni un frame.
- [W-COMP-02] `props` mezcla lo nuevo con lo anterior; asignado antes de registrar el tag, no se pierde.
- [W-COMP-03] Una clave de `props` o un atributo que la pieza no conoce se avisa por consola con el tag y la clave; la pieza no falla.
- [W-COMP-04] Los eventos de una pieza suben por el documento atravesando el shadow DOM.
- [W-COMP-05] Todo color sale del tema activo (tokens del kit); con «reducir movimiento» nada anima.
- [W-COMP-06] Cada pieza aparece en la galería (`view/demo/`) con un ejemplo vivo y «cuándo usarla / cuándo no».
- [W-ICO-01] Todo ícono que la app pinta, y todo ícono de lo que consume (kit y otras apps), está en la propia app (`assets/`): se carga en local y se ve aunque la API de Iconify no responda.
- [W-ICO-02] El mapa de íconos dice qué hay en local y dónde está publicada la app (`host`).
- [W-ICO-03] `<iswc-icon>` carga en local lo que el mapa lista; todo lo demás (o si el archivo local falla) sale de la API de Iconify. No hay otras rutas.
- [W-VIEW-01] Cada dominio es una vista con un único shell; la app solo conoce el shell. Se abre sola (`/view/<v>/index.html`) y tiene demo (`/view/<v>/demo/`).

### Catálogo

**`<av-app vista="…">` — shell** `[W-CAT-01]`: área pública en `<iswc-app-shell>` (marca, sesión, tema, pie con paleta); área privada en `<iswc-doc-layout>` (marca, buscador global, empresa, sesión, tema; lateral `<iswc-doc-index>` con los módulos; pie con paleta). Restaura la sesión al arrancar; una vista privada sin sesión va a la página de `acceso` recordando el destino. Solo carga su vista; las demás páginas se precargan en reposo.

**Transversales** `[W-CAT-02]`: `<av-logo>` (logo SVG teñido por la paleta, con nombre y satélite en órbita), `<av-escena>` (ilustración Corporate Memphis por capas: piezas WebP + formas en colores de la paleta), `<av-buscador>` (búsqueda global Ctrl+K con orden semántico), `<av-cabecera>` (título, subtítulo, ícono y acciones de una vista), `<av-vacio>` (vacío / cargando / error), `<av-persona>` (avatar con iniciales + nombre + detalle), `<av-empresa-selector>` (empresa activa; emite `av-empresa-cambio`), `<av-indicadores>` (fila de KPIs con `iswc-stat`; esqueletos mientras carga y refresco sin repintar).

**Vistas** `[W-CAT-03]` (cada una con su spec):

| Vista | Ruta | Shell | Spec |
| --- | --- | --- | --- |
| inicio | `/` | `av-inicio` | `30-publico.md` |
| acceso | `/acceso/` | `av-acceso` | `30-publico.md` |
| panel | `/panel/` | `av-panel` | `35-panel.md` |
| canales | `/canales/` | `av-canales` | `40-canales.md` |
| asistente | `/asistente/` | `av-asistente` | `45-asistente.md` |
| proyectos | `/proyectos/` | `av-proyectos` | `50-proyectos.md` |
| crm | `/crm/` | `av-crm` | `55-crm.md` |
| correos | `/correos/` (id = carpeta) | `av-correos` | `66-correos.md` |
| finanzas | `/finanzas/` (id = pestaña) | `av-finanzas` | `67-finanzas.md` |
| inventario | `/inventario/` (id = pestaña) | `av-inventario` | `68-inventario.md` |
| rrhh | `/rrhh/` (id = pestaña) | `av-rrhh` | `69-rrhh.md` |
| organizacion | `/organizacion/` | `av-organizacion` | `60-organizacion.md` |
| admin | `/admin/` | `av-admin` | `65-admin.md` |

## 3. Guía HOW WEAK

- [HW-COMP-01] El componente solo pinta y emite; la lógica vive en `utils/` (vista) o `src/js/` (compartida).
- [HW-COMP-02] Nada se repinta entero si no cambió: la base salta props iguales y los refrescos actualizan nodos por clave (sin parpadeo); el repintado parcial (`parcial` de `crearComponente`) cuida foco y scroll.

## 4. Contratos HOW STRONG

- [HS-COMP-01] Cuatro archivos hermanos por componente: `<tag>.ts`, `<tag>.scss`, `<tag>.md` (H2 exactos: Anatomía, Atributos observados, Props, Eventos, Slots, Ejemplos; excluir con `<!-- exclude: X -->`, Anatomía nunca), `<tag>.json` (`iswc-preview/v1`).
- [HS-COMP-02] Registro: el tag se declara una vez en `src/js/kit-tags.ts` (`APP_TAGS` transversales en `src/js/components/av/`; `VIEW_TAGS.<vista>` en `view/<vista>/components/`), su línea en `view/demo/manifest.json` y, si tiene `props`, su schema Zod en `componentes.schemas.ts` registrado en `props-registro.ts`.
- [HS-COMP-03] Base: `crearComponente`/`define`/`emitir`/`html`/`adoptCss`/`precargarCss`/`adoptarPropsTardias` de `src/js/base/componente.ts`.
- [HS-ICO-01] Íconos: ids Iconify literales `set:nombre` en el código (`icon="mdi:home"`, `icono: 'mdi:home'`); un id armado en ejecución va en `extra` de `assets/dl.js`. `deno task icons` (dentro de `build`) baja a `assets/iconify/<set>/<nombre>.svg` los íconos de la app (sin mapa; los que pintan por dentro los componentes del kit van en `extra`). El registrador del build declara `<html data-icons>` = `deno.json` → `iswc.host` + `assets/iconify/` (URL absoluta): `<iswc-icon>` resuelve localStorage → esa base → API, y si un ícono no estaba publicado avisa `[iswc-icon] falta en local: <id>`. `assets/dl.js` solo lleva rutas e importa la herramienta online del kit (@main).
- [HS-VIEW-01] Vista: `index.html`, `README.md`, `demo/index.html`, `components/` (+ `all.ts`), `utils/`.

## 5. Casos borde y errores

- [W-ICO-05] Sin red al construir, `deno task icons` no rompe el build: conserva los íconos que ya están y avisa. Un id que no existe en Iconify se reporta y no entra al mapa.

- [W-COMP-07] Un componente sin hoja o fuera del registro no se carga: los guardianes lo detectan antes de publicar.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-COMP-08] Cada componente registrado tiene sus 4 archivos, su `.md` declara las 6 secciones y su `.json` valida contra `iswc-preview/v1`.
- [W-COMP-09] El dominio de cada vista se prueba sin navegador sobre `dist/cdn` (`tests/vistas/<vista>`).
- [W-ICO-04] Los íconos de la app están en `assets/iconify/` [W-ICO-01], `deno.json` declara `iswc.host` [W-ICO-02] y el registrador declara `<html data-icons>` (`tests/iconos`).
- [W-COMP-10] E2E: la app arranca en la landing (lema, 4 características, 3 planes) y una vista privada sin sesión muestra el login del kit (`tests/e2e/00.inicio`).

## 7. Notas

Sin notas.
