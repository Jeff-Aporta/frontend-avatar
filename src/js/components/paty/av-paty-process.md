---
name: av-paty-process
description: >-
  Cuando un paso del feed de procesos del chat debe verse como una pastilla pending, done o error.
---

# `<av-paty-process>`

Una pastilla por proceso. Muestra un título, la palabra de estado («en curso», «listo» o «error») y, si está `pending`, un `iswc-spinner`. En `done` o `error` el spinner pasa a un icono. Quien apila las pastillas decide el orden: este elemento pinta una sola.

## Cuándo usarlo

En el mensaje, por cada paso que el chat quiera mostrar como proceso en curso, terminado o fallido.

## Cuándo no

Cuando hay que abrir el stream o ordenar varios procesos. La clase no emite el cierre del paso.

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<article class="proceso proceso--pending|done|error" data-status="pending|done|error" part="proceso" title="…">
  <span class="proceso__giro" aria-hidden="true">
    <!-- pending -->
    <iswc-spinner></iswc-spinner>
    <!-- done / error -->
    <iswc-icon icon="mdi:check-circle-outline|mdi:alert-circle-outline"></iswc-icon>
  </span>
  <span class="proceso__texto">
    <span class="proceso__titulo">…</span>
  </span>
  <span class="proceso__estado">en curso|listo|error</span>
</article>
```

## Atributos observados

`observedAttributes`: `xml`, `text`, `step`, `status`, `ts`. Un cambio con el elemento conectado vuelve a pintar. Quitar `xml`, `text`, `step` o `ts` guarda `""`. Quitar `status` cae en `pending`.

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `xml` | texto | `""` | Si el valor recortado es exactamente `<av-paty-process>…</av-paty-process>` (la etiqueta no distingue mayúsculas), el interior es la descripción. Si ese interior trae `|`, lo de antes es la descripción y lo de después, en minúsculas y recortado, es un proveedor. Vacío a la izquierda del `|` usa el interior entero; proveedor vacío queda en null. Si no es ese wrapper y `text` está vacío, el XML con espacios colapsados puede ser el título. |
| `text` | texto | `""` | Título visible si el recorte tiene texto. Gana sobre la descripción sacada de `xml`. |
| `step` | texto | `""` | Id del paso. Si está vacío y `xml` trajo proveedor, el id efectivo es `{proveedor}-stream`. Entra en el `title` de la pastilla. |
| `status` | texto | `pending` | Se compara en minúsculas. Solo `done` y `error` se conservan. Cualquier otro valor, incluido vacío, queda `pending`. |
| `ts` | texto | `""` | Solo entra en el `title`. No se pinta como texto de la pastilla. |

## Props

La entrada es solo por atributo. No hay setter `props`. El objeto interno arranca en `{ xml: "", text: "", step: "", status: "pending", ts: "" }`.

## Eventos

La clase no emite eventos y no escucha eventos.

`notificarProceso`, exportada en el mismo archivo, sí emite, y esta clase no la llama. Ver Desarrollo.

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. La pastilla se renderiza internamente con `<article>`, `<iswc-spinner>`/`iswc-icon` y los spans de texto. |

## CSS Parts

| Part | Descripción |
| --- | --- |
| `proceso` | Tarjeta del estado del proceso (`pending`, `done` o `error`). |
Shadow abierto. Sin slots.

```html
<article class="proceso proceso--pending|done|error" data-status part="proceso">
  <span class="proceso__giro">…</span>
  <span class="proceso__texto"><span class="proceso__titulo">…</span></span>
  <span class="proceso__estado">…</span>
</article>
```

`data-status` repite `pending`, `done` o `error`. En `pending` el giro es `iswc-spinner`. En `done` y `error` es `iswc-icon`.

La hoja define `.proceso__desc` y este render no crea ese nodo.

Clases de estado: `proceso--pending`, `proceso--done`, `proceso--error`. El host es `block`.

## Comportamiento

- `status` acepta `pending`, `done` y `error`. El título visible es, en este orden: `text` recortado, la descripción extraída de `xml`, el XML crudo si no era el wrapper, o la etiqueta del paso.
- Etiquetas cuando el id efectivo coincide: `classifier-wait` → «Clasificador»; `llm-stream` y `minimax-stream` → «Modelo»; `openai-stream` → «OpenAI»; `tool-call` → «Herramienta»; `file-search` → «Búsqueda docs»; `mcp-poll` → «MCP ContaPyme». Si el id no está en esa lista, la etiqueta de respaldo es el propio id o, si no hay id, «Proceso». Esos iconos de paso (`mdi:tag-outline`, `mdi:creation`, `simple-icons:openai`, `mdi:tools`, `mdi:file-search-outline`, `mdi:cloud-sync-outline`, `mdi:cog-outline`) no se pintan.
- `pending`: `iswc-spinner` y el texto «en curso». `done`: `mdi:check-circle-outline` y «listo». `error`: `mdi:alert-circle-outline` y «error». El icono `mdi:progress-clock` del mapa de `pending` no se usa.
- El `title` junta título, id efectivo, etiqueta de estado y `ts`, separados por ` · `, y omite los vacíos.
- El acento sale del kit: la pastilla base usa `--iswc-color-warning`; `proceso--done` lo cambia a `--iswc-color-success`; `proceso--error` a `--iswc-color-danger`. El fondo es un degradado del acento hacia transparente, sobre `--iswc-bg-elev`. El título usa `--iswc-text`.
- En `pending` se suma un segundo degradado y la animación `proceso-brillo` (1.6 s, ease-in-out, infinita) recorre ese brillo. Con `prefers-reduced-motion: reduce` la animación se apaga y el fondo queda en el degradado fijo (acento al 26 % que se desvanece al 62 %, más el fondo `--iswc-bg-elev` mezclado al 10 %).

## API JavaScript

| Método | Descripción |
| --- | --- |
| `static get observedAttributes(): readonly string[]` | Atributos HTML observados: `xml`, `text`, `step`, `status`, `ts`. |
| `connectedCallback(): void` | Dispara el primer render de la pastilla. |
| `attributeChangedCallback(name, oldV, newV): void` | Actualiza la prop correspondiente (`xml`, `text`, `step`, `status`, `ts`) y re-renderiza si el elemento está conectado; normaliza `status` a `pending` / `done` / `error`. |
| `notificarProceso(target: HTMLElement, status: "pending" \| "done" \| "error"): void` (export) | Helper: emite `av-paty-process-status` con `{ id, status }` (`bubbles` + `composed`) en el host indicado. |

## Desarrollo

- Clase `PatyProcess`, registrada con `define("av-paty-process", …)`.
- `src/js/components/paty/av-paty-process.ts`
- `src/js/components/paty/av-paty-process.css`
- `src/js/components/paty/av-paty-process.json`
- Tags del kit: `iswc-spinner`, `iswc-icon`.
- Exporta `notificarProceso(target, status)`. Emite en ese nodo `av-paty-process-status` con `{ id, status }`, `bubbles: true` y `composed: true`. `id` es `target.getAttribute("data-step")` o `""`. La pastilla que pinta esta clase lleva `data-status`, no `data-step`. `unwrapPatyProcessSelfRef` es privada.
- Tokens: `--iswc-color-warning`, `--iswc-color-success`, `--iswc-color-danger`, `--iswc-bg-elev`, `--iswc-text`, `--iswc-icon-size`. Variable local: `--proceso-acento`. `--iswc-text-soft` solo aparece en `.proceso__desc`, que el render no crea.
- La hoja también asigna en `:host iswc-switch` y `:host iswc-checkbox` `--iswc-switch-accent`, `--iswc-switch-thumb`, `--iswc-checkbox-accent`, `--iswc-checkbox-fill`, `--iswc-checkbox-bg`, `--iswc-checkbox-border` y `--iswc-checkbox-on-accent`. Este tag no monta esos controles.

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| `status="pending"` | `:host([status="pending"])` | Defecto (atributo ausente, vacío o cualquier valor fuera de `done`/`error`). Pastilla con `--iswc-color-warning`, `iswc-spinner`, texto «en curso» y animación `proceso-brillo`. |
| `status="done"` | `:host([status="done"])` | Paso cerrado con éxito. Acento `--iswc-color-success`, icono `mdi:check-circle-outline`, texto «listo`. |
| `status="error"` | `:host([status="error"])` | Paso cerrado con fallo. Acento `--iswc-color-danger`, icono `mdi:alert-circle-outline`, texto «error». |

> `data-status` repite el estado en el `<article>` interno (`proceso--pending|done|error`).

## Índice

[Componentes paty](../../../skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-process></av-paty-process>
```
