---
name: av-paty-chat-bubble
description: >-
  Burbuja de estado del stream: idle, respondiendo, listo o error, con markdown propio y chips de progreso. Usar al montar o cambiar <av-paty-chat-bubble>.
---

# `<av-paty-chat-bubble>`

Burbuja autónoma de Paty, distinta de `<paty-chat-message>`. Todo el estado entra por atributos. Pinta avatar «P», una pastilla de estado, el nombre «Paty», chips de progreso y el texto. El markdown lo genera ella; no usa `<iswc-md-render>`.

## Cuándo usarlo

Cuando un stream XML necesita una burbuja que reaccione a `state`, `text`, `animated` y `progress` sin el store del hilo.

## Cuándo no

Dentro de `<paty-chat-thread>`: ahí cada turno es `<paty-chat-message>`. Cuando el markdown tenga que ser el del kit: aquí el renderer es interno y escapa el HTML antes de marcar.

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<div class="bubble">
  <div class="avatar" aria-hidden="true">P</div>
  <div class="status-pill">
    <span class="dot"></span>
    <span class="status-label">idle|respondiendo|listo|error</span>
  </div>
  <div class="name">Paty</div>
  <div class="progress" hidden>
    <div class="progress-chip" data-idx="0">
      <span class="progress-ico">…</span>
      <span class="progress-txt">…</span>
      <span class="progress-blink"></span>
    </div>
  </div>
  <div class="text-host"></div>
</div>
```

## Atributos observados

`observedAttributes`: `text`, `state`, `chunks`, `animated`, `progress`. Si el valor nuevo es igual al viejo, no sincroniza. Si cambió, llama a `#sync` aunque el elemento aún no tenga hoja (el primer pintado útil es `connectedCallback`).

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `text` | texto | `''` | Cuerpo. Si crece con `state="streaming"` y `animated="true"`, entra el tipeo. Si no, se vuelca entero. |
| `state` | `idle` \| `streaming` \| `end` \| `error` \| otro | `idle` | Pastilla: `streaming` → «respondiendo», `end` → «listo», `error` → «error», cualquier otro → «idle». También elige borde, avatar y si el progreso se sella. |
| `chunks` | — | — | Está observado, así que cambiarlo dispara `#sync`. `#sync` no lee su valor. |
| `animated` | texto | apagado | Solo la cadena exacta `"true"` activa el tipeo. |
| `progress` | JSON | `''` → `[]` | Array de `{ icono, texto }`. JSON inválido o no-array → `[]`. Se queda el objeto si tiene `texto` string; `icono` ausente pasa a `''`. |

No hay propiedades JS reflejadas aparte de los atributos.

## Props

No hay objeto `props`.

## Eventos

| Evento | Detalle | Cuándo se emite |
| --- | --- | --- |
| _(ninguno)_ | — | No emite eventos de aplicación. No escucha eventos de fuera. El tipeo usa `setTimeout` + `requestAnimationFrame`. Al sellar el progreso espera 400 ms con `setTimeout` antes de poner `hidden` en `.progress`, y solo si en ese momento `state` ya no es `streaming`. |

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. La burbuja se renderiza internamente con su avatar, pastilla, nombre, progreso y texto. |

## CSS Parts

| Part | Descripción |
| --- | --- |
| _No expone parts._ | — |
Shadow `open`. El constructor inyecta esta plantilla (no usa `html` del kit):

- `div.bubble`
  - `div.avatar` (`aria-hidden="true"`) — texto «P».
  - `div.status-pill` — `span.dot` y `span.status-label`.
  - `div.name` — texto «Paty».
  - `div.progress` (`hidden` al nacer). Dentro, `div.progress-chip` (`data-idx`) con `span.progress-ico`, `span.progress-txt`, `span.progress-blink`. El último chip lleva `iswc-active`.
  - `div.text-host` — `innerHTML` del markdown.

La hoja tiene reglas para `.text`, `.text strong`, `.text code`, etc. El nodo real es `.text-host`, así que esas reglas no alcanzan el HTML inyectado. El cursor del tipeo es un `span.cursor` metido en ese HTML, y sí casa con `.cursor` del CSS.

No publica `::part`. `:host([state="…"])` cambia borde, avatar, pastilla y nombre.

## Comportamiento

- `streaming`: borde `--iswc-accent` y anillo. Avatar con `paty-pulse`. Pastilla y nombre en accent. El punto parpadea.
- `end`: borde y pastilla `--iswc-color-success`. Avatar en degradado success → accent.
- `error`: borde y fondo teñidos con `--iswc-color-danger`. Pastilla y nombre en danger.
- `idle` en la hoja: `.text` (no `.text-host`) iría en `--iswc-text-soft` e itálica. El vacío de idle sí pinta, en el HTML, «(esperando turno)» en itálica y `--iswc-text-soft`.
- Texto vacío y `streaming`: tres puntos `.waiting`. Texto vacío y `error`: `<em>error sin detalle</em>`.
- Tipeo solo si `state === "streaming"`, `animated === "true"` y `text.length` supera los caracteres ya mostrados. Si el texto destino cambia a mitad, cancela el timeout. Ritmo: si quedan más de 80 caracteres, espera 6 ms; más de 20, 14 ms; si no, 30 ms. Avanza 3 caracteres si quedan más de 50; si no, 1. Mientras tanto el HTML es el markdown del recorte más `span.cursor`. Al terminar, un markdown completo del texto y del `state` de ese momento.
- Si no toca tipear, y el texto cambió o aún no se había volcado (`#renderedChars === 0`), cancela el timeout, marca todo el texto como pintado y vuelca el markdown.
- Progreso: en `end` o `error`, o si el array queda vacío, vacía los chips y a los 400 ms oculta `.progress` si el state sigue sin ser `streaming`. Si el array nuevo no empieza por los chips ya pintados (mismo `texto` e `icono`), los tira y los rehace. Si solo crece por el final, añade chips. El CSS de `end`/`error` además colapsa `.progress` (`max-height: 0`).
- Markdown, tras escapar `& < >`: títulos `#`…`######` como `<strong>` de bloque; `- ` o `* ` como `<ul>`; `1. ` como `<ol>`; `> ` como `<blockquote>`; línea vacía como `<br/>`; `` `código` ``, `**negrita**`, `*cursiva*`. Enlaces `[texto](href)` con `target="_blank"` y `rel="noopener noreferrer"`. Si el href, ya desescapado, empieza por `javascript:`, `data:` + `text/html`, `vbscript:` o `file:`, el href queda `#`.
- `prefers-reduced-motion: reduce` anula animaciones de progreso, avatar, cursor, puntos de espera y el punto de la pastilla.

## API JavaScript

| Método | Descripción |
| --- | --- |
| `static get observedAttributes(): readonly string[]` | Atributos HTML observados: `text`, `state`, `chunks`, `animated`, `progress`. |
| `connectedCallback(): void` | Adopta la hoja CSS del componente y dispara el primer `#sync`. |
| `attributeChangedCallback(name, oldVal, newVal): void` | Si el valor cambió, re-sincroniza el contenido de la burbuja. |
| `PatyProgressStep` (interface, export) | Forma del array JSON recibido por el atributo `progress`: `{ icono: string; texto: string }`. |
| `PatyChatBubble` (class, export) | La clase del custom element; puede extenderse o consultarse vía `customElements.get("av-paty-chat-bubble")`. |

## Desarrollo

- Rutas: `view/chat/components/av-paty-chat-bubble.ts`, `av-paty-chat-bubble.css`, `av-paty-chat-bubble.json`.
- Clase `PatyChatBubble`. Se registra con `customElements.define` solo si el tag no existe. Exporta la clase y la interfaz `PatyProgressStep` (`icono: string`, `texto: string`).
- No usa `crearComponente` ni `define()` de `_shared`. Sí usa `adoptCss` en `connectedCallback`.
- Tags `is-*`: ninguno.
- Tokens: `--iswc-font-body`, `--iswc-font-sans`, `--iswc-font-mono`, `--iswc-bg-elev`, `--iswc-bg`, `--iswc-border-soft`, `--iswc-border`, `--iswc-text`, `--iswc-text-soft`, `--iswc-accent`, `--iswc-color-info`, `--iswc-color-success`, `--iswc-color-danger`, `--iswc-color-warning` (solo en la regla `.text strong`, que no casa con `.text-host`).

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| `state="streaming"` | `:host([state="streaming"])` | Stream XML en curso: borde `--iswc-accent` con anillo, avatar con `paty-pulse`, pastilla y nombre en accent, punto parpadeando. Tipeo se aplica si también `animated="true"`. |
| `state="end"` | `:host([state="end"])` | Respuesta cerrada correctamente: borde y pastilla `--iswc-color-success`, avatar en degradado success → accent. |
| `state="error"` | `:host([state="error"])` | Respuesta con error: borde y fondo teñidos con `--iswc-color-danger`, pastilla y nombre en danger. |
| `state="idle"` (defecto) | `:host(:not([state])), :host([state="idle"])` | Cualquier valor ausente o fuera de `streaming`/`end`/`error`: texto en `--iswc-text-soft` e itálica, marca «(esperando turno)» si el texto está vacío. |
| `animated="true"` | `:host([animated="true"])` | Habilita el tipeo del cuerpo cuando `state="streaming"`. Solo la cadena exacta `"true"` lo activa. |

## Índice

[Componentes paty](../../../src/skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-chat-bubble></av-paty-chat-bubble>
```
