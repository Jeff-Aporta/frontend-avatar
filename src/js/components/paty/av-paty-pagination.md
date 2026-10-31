---
name: av-paty-pagination
description: >-
  Pie de lista: todas las páginas en una pista horizontal sin barra. Flechas desplazan; los números cambian de página. Usar al montar o cambiar <av-paty-pagination>.
---

# `<av-paty-pagination>`

Pie de un catálogo. Pinta todos los números, de 1 a `pages`, en una pista horizontal. La barra de scroll no se ve. La página actual usa `variant` y `color` (`filled` y `brand` si no se indican). El resto usa el color de texto del tema. Las flechas recorren la pista y no cambian de página.

## Cuándo usarlo

Debajo de una lista paginada, cuando el padre fija página, total y, si quiere, el tamaño de página, y escucha `paty-page-change` y `paty-page-size-change`. `<paty-chat-sidebar-content>` lo monta con `compact` para la lista de conversaciones.

## Cuándo no

Dentro de la tabla o del ítem: este tag es solo el pie. Cuando la lista deba recortarse con puntos suspensivos: aquí se pintan todos los números y, si no caben, se desplazan.

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<nav class="paginador" aria-label="Paginación">
  <span class="paginador__meta" aria-live="polite" aria-atomic="true">Página N de M</span>
  <div class="carril">
    <iswc-button class="flecha flecha-prev" shape="pill" variant="text" color="brand" aria-label="Desplazar páginas a la izquierda">
      <iswc-icon icon="mdi:chevron-left"></iswc-icon>
    </iswc-button>
    <div class="pista" role="group">
      <iswc-button class="pagina" shape="pill" variant="filled" color="brand" aria-current="page" aria-label="Página N">N</iswc-button>
      <iswc-button class="pagina" shape="pill" variant="text" aria-label="Ir a la página N">N</iswc-button>
    </div>
    <iswc-button class="flecha flecha-next" shape="pill" variant="text" color="brand" aria-label="Desplazar páginas a la derecha">
      <iswc-icon icon="mdi:chevron-right"></iswc-icon>
    </iswc-button>
  </div>
  <iswc-select class="paginador__tamano" title="Elementos por página" aria-label="Elementos por página">
    <iswc-option value="15">15</iswc-option>
  </iswc-select>
</nav>
```

## Atributos observados

`observedAttributes`: `page`, `pages`, `page-size`, `page-size-options`, `elements-per-page`, `visible-elements-per-page`, `total`, `disabled`, `label`, `compact`, `variant`, `color`. Cualquier cambio, ya conectado, vuelve a pintar.

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `page` | entero ≥ 1 | `1` si falta, es 0 o no es número | Página actual. El setter escribe el atributo ya normalizado. Tras pintar, el chip actual se centra en la pista. |
| `pages` | entero ≥ 1 | `1` | Cuántas páginas hay. Se crean todos los botones, de 1 a `pages`. |
| `page-size` | entero ≥ 1 | la primera de `#opciones()`, o `15` si esa lista estuviera vacía | Tamaño activo. Si `#opciones()` tiene un solo número, ese manda e ignora el atributo. Si hay varios, vale el atributo solo cuando ese número está en la lista; si no, la primera opción. |
| `elements-per-page` | números > 0 separados por espacio o coma | si el atributo existe y no parsea nada, `15 30 50`; si el atributo no existe, se usa `page-size-options` y, si ese tampoco parsea, `15 30 50` | Lista del selector. El setter de `elementsPerPage` la escribe unida por espacios. |
| `page-size-options` | números > 0 separados por espacio o coma | — | Legado. `#opciones()` lo lee solo cuando no existe el atributo `elements-per-page`. El getter `pageSizeOptions` parsea este atributo y, vacío, devuelve `[]` (no el fallback 15/30/50). El setter lo escribe unido por comas. |
| `visible-elements-per-page` | texto | visible (`true` si falta) | `false`, `0` o `no` (trim, minúsculas) ocultan el selector. Cualquier otro valor lo deja visible. |
| `total` | entero ≥ 0 | ausente | Total de elementos del catálogo. Si está presente y es menor que el mínimo de `elements-per-page`, el selector no se pinta. |
| `disabled` | presencia | ausente | El getter es `hasAttribute('disabled')`. El setter hace `toggleAttribute`. Apaga números, flechas y selector. `:host([disabled])` baja la opacidad a 0.45. |
| `compact` | presencia | ausente | Baja tipografía y altura de chips/select (~0.78em). Lo usa el lateral del chat. |
| `label` | texto | ausente | `aria-label` del `<nav class="paginador">`. |
| `variant` | `filled` \| `soft` \| `outlined` \| `ghost` \| `plain` \| `text` | `filled` | Apariencia del número actual, la misma que `iswc-button`. `solid` equivale a `filled`. El resto de números sigue en `text`. |
| `color` | `brand` \| `neutral` \| `success` \| `warning` \| `danger` \| `info` \| `error`, o un color CSS | `brand` | Color del número actual y de las flechas. |

Propiedades JS reflejadas: `page`, `pages`, `pageSize`, `elementsPerPage`, `visibleElementsPerPage`, `pageSizeOptions`, `total`, `disabled`.

`parseSizes` parte por espacios o comas, se queda con enteros finitos `> 0` y quita duplicados. Cadena vacía o solo basura → `[]`.

El selector se pinta solo si `visibleElementsPerPage` es verdadero, hay al menos dos opciones y, si hay `total`, ese total es ≥ al mínimo de esas opciones. Con una sola opción el tamaño queda fijo y el `<iswc-select>` no se monta.

## Props

No hay objeto `props`. La entrada es por atributo. Las propiedades JS reflejadas son `page`, `pages`, `pageSize`, `elementsPerPage`, `visibleElementsPerPage`, `pageSizeOptions`, `total` y `disabled`.

## Eventos

| Evento | Dirección | Cuándo | `detail` |
| --- | --- | --- | --- |
| `paty-page-change` | emitido | El usuario pulsa un número distinto de la página actual, dentro de 1…`pages`, y el control no está `disabled`. Antes asigna `page`. | `{ page: number }` |
| `paty-page-size-change` | emitido | El `<iswc-select>` cambia a un número finito `> 0`. Antes asigna `pageSize`. | `{ pageSize: number }` |

Las flechas no emiten `paty-page-change` y no escriben `page`. No escucha eventos de fuera. Dentro de la pista escucha `scroll`, `wheel`, `pointerdown`, `pointermove`, `pointerup` y `pointercancel`.

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. La pista, las flechas y el selector se renderizan internamente. |

## CSS Parts

| Part | Descripción |
| --- | --- |
| _No expone parts._ | — |
Shadow `open`. Cada pintado hace `replaceChildren` y adopta la hoja.

- `nav.paginador` (`aria-label` = `label`)
  - `span.paginador__meta` — «Página N de M», `aria-live="polite"`. En CSS está recortado a 1px (solo lector de pantalla).
  - `div.carril`
    - `iswc-button.flecha.flecha-prev` — `shape="pill"` `variant="text"` `color="brand"`, icono `mdi:chevron-left`, `aria-label="Desplazar páginas a la izquierda"`.
    - `div.pista` (`role="group"`) — un `iswc-button.pagina` por número.
    - `iswc-button.flecha.flecha-next` — `mdi:chevron-right`, `aria-label="Desplazar páginas a la derecha"`.
  - `iswc-select.paginador__tamano` con `iswc-option` por cada tamaño, solo si el selector se muestra. `aria-label` y `title`: «Elementos por página».

La página actual: `variant` y `color` del host (`filled` y `brand` si faltan), `aria-current="page"` `aria-label="Página N"`, sin `oniswc-click`. Las demás: `variant="text"` `aria-label="Ir a la página N"`. Tras pintar, a esas se les quita el atributo `color`. Las flechas usan el mismo `color` y `variant="text"`.

El CSS estira `::part(button)` de flechas y páginas (alto `2.15em`, pill) y `::part(base)` del select (round-rect ~0.35em, más compacto). Este host no publica `::part`.

## Comportamiento

- La pista es scroll horizontal (`overflow-x: auto`). La barra no se ve: `scrollbar-width: none` y `::-webkit-scrollbar { display: none }`.
- Se pintan todos los números. No hay elipsis.
- Las flechas llaman a `#mover`: `scrollBy({ left: dirección * max(clientWidth * 0.85, 1), behavior: 'smooth' })`. No cambian `page`.
- Si un lado no desborda (`scrollLeft <= 1` a la izquierda, o el borde derecho ya alcanzó el contenido), esa flecha se queda en el layout con la clase `oculta`: `visibility: hidden` y `pointer-events: none`. También `aria-hidden` y `disabled`. Así los números no saltan. Si las dos caben, las dos quedan invisibles y reservan su hueco.
- La página actual usa `variant` y `color` del host. Las demás quedan sin `color`; el CSS les pone `color: var(--iswc-text)` y fondo transparente. Las flechas llevan el mismo `color`.
- Tras pintar, un `requestAnimationFrame` centra el chip `[aria-current="page"]` en la pista y luego recalcula las flechas. Un `ResizeObserver` sobre el host vuelve a calcularlas.
- Rueda: solo si va `shiftKey` o `|deltaX| > |deltaY|`. Entonces `preventDefault` y suma ese delta a `scrollLeft`. La rueda vertical sola no mueve la pista.
- Arrastre: `pointerdown` de ratón se ignora; también si `disabled`. En táctil el dedo mueve `scrollLeft`. Al soltar, si `|velocidad| >= 0.04` hay una inercia que decae a 0.92 por frame hasta bajar de 0.4. Si el dedo se movió más de 6px, el siguiente `click` en la pista se corta (`stopPropagation` + `preventDefault`) para no pulsar el número.
- `disabled` corta `#mover`, el arrastre táctil, el clic de número y el selector.
- El `<iswc-select>` puede bajar de renglón (`flex-wrap` en `.paginador`). Carril y números siguen en una fila (`flex` nowrap en `.pista`).
- El tamaño visual sale del `font-size` del contexto (`:host { font-size: 1em }`).

## API JavaScript

| Método | Descripción |
| --- | --- |
| `static get observedAttributes(): readonly string[]` | Atributos HTML observados: `page`, `pages`, `page-size`, `page-size-options`, `elements-per-page`, `visible-elements-per-page`, `total`, `disabled`, `label`, `compact`, `variant`, `color`. |
| `connectedCallback(): void` | Pinta el paginador y crea un `ResizeObserver` sobre el host para recalcular las flechas. |
| `disconnectedCallback(): void` | Aborta el `AbortSignal` interno (listeners de la pista) y desconecta el `ResizeObserver`. |
| `attributeChangedCallback(): void` | Si el elemento está conectado, re-pinta el paginador. |
| `get page(): number` | Página actual normalizada a entero ≥ 1. |
| `set page(v: number)` | Asigna `page` en el atributo (ya normalizado). |
| `get pages(): number` | Total de páginas (≥ 1). |
| `set pages(v: number)` | Asigna `pages`. |
| `get pageSize(): number` | Tamaño efectivo: si `#opciones()` tiene un único valor, ese; si no, el atributo `page-size` si está en la lista, si no la primera opción, si no `15`. |
| `set pageSize(v: number)` | Asigna `page-size` (normalizado a ≥ 1 o `15`). |
| `get elementsPerPage(): number[]` | Lista de tamaños disponibles (parseada de `elements-per-page` o `page-size-options`, con fallback `[15, 30, 50]`). |
| `set elementsPerPage(v: number[] \| string)` | Filtra los números > 0 y los une por espacios en el atributo `elements-per-page`. |
| `get visibleElementsPerPage(): boolean` | `true` salvo que el atributo diga `false`/`0`/`no`. |
| `set visibleElementsPerPage(v: boolean)` | Asigna el atributo `visible-elements-per-page`. |
| `get total(): number \| null` | Total del catálogo o `null` si no está / no es válido. |
| `set total(v: number \| null)` | Asigna `total` (o lo quita si es inválido). |
| `get pageSizeOptions(): number[]` | Lista parseada del atributo legado `page-size-options` (vacío si no hay valores). |
| `set pageSizeOptions(v: number[] \| string)` | Asigna `page-size-options` (unido por comas). |
| `get disabled(): boolean` | `hasAttribute("disabled")`. |
| `set disabled(v: boolean)` | Alterna el atributo `disabled`. |
| `get variant(): "filled" \| "soft" \| "outlined" \| "ghost" \| "plain" \| "text"` | Variante del chip actual (default `filled`; `solid` se trata como `filled`). |
| `set variant(v: string)` | Asigna `variant` (si es vacío/`filled`/`solid`, quita el atributo). |
| `get color(): string` | Color del chip actual y de las flechas (`brand` por defecto, o cualquier color CSS). |
| `set color(v: string)` | Asigna `color`. |

## Desarrollo

- Rutas: `view/chat/components/av-paty-pagination.ts`, `av-paty-pagination.css`, `av-paty-pagination.json`.
- Clase `PatyPagination`. `define('av-paty-pagination', …)`. No se exporta. `precargarCss` al cargar el módulo.
- Tags `is-*`: `iswc-button`, `iswc-icon`, `iswc-select`, `iswc-option`.
- Helpers exportados: ninguno. `parseSizes` y `DEFAULT_SIZES` (`[15, 30, 50]`) son privados del módulo.
- Tokens: `--iswc-color-brand`, `--iswc-text`, `--iswc-bg`.

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| `disabled` (presencia) | `:host([disabled])` | Atributo presente: números, flechas y selector quedan deshabilitados. El CSS baja la opacidad del host a 0.45. |
| `compact` (presencia) | `:host([compact])` | Atributo presente: baja tipografía y altura de chips/select a ~0.78em (uso típico en el lateral del chat). |
| `variant="…"` | `:host([variant="…"])` | Atributo válido (`filled`/`soft`/`outlined`/`ghost`/`plain`/`text`; `solid` ≡ `filled`): apariencia del número actual en el `<iswc-button>`. Vacío: `filled`. |
| `color="…"` | `:host([color="…"])` | Atributo válido (`brand`/`neutral`/`success`/`warning`/`danger`/`info`/`error`, o cualquier color CSS): color del número actual y de las flechas. Vacío: `brand`. |
| `visible-elements-per-page="false"` | `:host([visible-elements-per-page="false"])` | Oculta el selector de tamaño. Cualquier otro valor (`true` por defecto) lo deja visible. |

## Índice

[Componentes paty](../../../src/skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-pagination></av-paty-pagination>
```
