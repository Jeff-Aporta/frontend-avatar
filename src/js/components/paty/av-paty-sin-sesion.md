---
name: av-paty-sin-sesion
description: >-
  Cuando una vista exige sesión y hay que mostrar el cartel centrado de icono, título y texto.
---

# `<av-paty-sin-sesion>`

Cartel de una sola tarjeta con icono, título y párrafo. Ocupa el alto del hueco y centra el contenido. No comprueba la sesión: pinta los atributos o, si faltan o están vacíos, los textos fijos del componente.

## Cuándo usarlo

En una vista que exige JWT, para explicar que hay que entrar antes de usar esa pantalla.

## Cuándo no

Cuando hay que iniciar sesión o abrir el formulario. Este tag no tiene botón, no llama a `Session` y no escucha el evento de autenticación.

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<iswc-card class="tarjeta">
  <iswc-icon class="icono" icon="solar:chat-round-line-bold-duotone"></iswc-icon>
  <h2 class="titulo">Inicia sesión para conversar con PatyIA</h2>
  <p class="texto">Con tu cuenta ContaPyme puedes consultar al asistente, revisar tus conversaciones y seguir la trazabilidad de cada respuesta.</p>
</iswc-card>
```

## Atributos observados

`observedAttributes`: `icon`, `titulo`, `texto`. Cualquier cambio, con el elemento conectado, vuelve a pintar. Los lee con `getAttribute` en cada pintado.

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `icon` | texto (nombre de icono) | `solar:chat-round-line-bold-duotone` | Icono de `iswc-icon`. Si el atributo falta o es `""`, se usa ese nombre. |
| `titulo` | texto | `Inicia sesión para conversar con PatyIA` | Texto del `<h2>`. Vacío cae en ese título. |
| `texto` | texto | `Con tu cuenta ContaPyme puedes consultar al asistente, revisar tus conversaciones y seguir la trazabilidad de cada respuesta.` | Párrafo bajo el título. Vacío cae en ese texto. |

## Eventos

| Evento | Detalle | Cuándo se emite |
| --- | --- | --- |
| _(ninguno)_ | — | El componente no emite eventos. |

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. Icono, título y texto se renderizan internamente dentro del `iswc-card`. |

## Props

La entrada es solo por atributo. No hay setter `props`.

## Eventos

No emite eventos. No escucha eventos.

## CSS Parts

| Part | Descripción |
| --- | --- |
| _No expone parts._ | — |
Shadow abierto. Sin `part` propio y sin slots.

```html
<iswc-card class="tarjeta">
  <iswc-icon class="icono"></iswc-icon>
  <h2 class="titulo">…</h2>
  <p class="texto">…</p>
</iswc-card>
```

El host es una rejilla que centra, con `height: 100%`, `min-height: 18rem`, `flex: 1 1 auto` y padding `2rem 1rem`. La tarjeta limita el ancho a `28rem`, texto centrado, radio 14px.

## Comportamiento

- Los tres defectos están fijos en el fuente (`TITULO`, `TEXTO` y el icono en el `||` de `icon`). Un atributo presente y no vacío los sustituye tal cual, sin recortar.
- La tarjeta usa borde `--iswc-border-soft`, fondo `--iswc-bg-elev` y una sombra que mezcla `--iswc-text` al 6 %.
- El icono usa `--iswc-accent` a `2.75em`. El párrafo usa `color-mix` de `--iswc-text` al 68 %, no un token de texto suave.

## API JavaScript

| Método | Descripción |
| --- | --- |
| `static get observedAttributes(): string[]` | Atributos HTML observados: `icon`, `titulo`, `texto`. |
| `connectedCallback(): void` | Pinta la tarjeta con los atributos actuales o los valores por defecto. |
| `attributeChangedCallback(): void` | Vuelve a pintar la tarjeta cuando el elemento está conectado y alguno de los atributos observados cambia. |

## Desarrollo

- Clase `PatySinSesion`, registrada con `define("av-paty-sin-sesion", …)`. Precarga la hoja con `precargarCss`.
- `src/js/components/paty/av-paty-sin-sesion.ts`
- `src/js/components/paty/av-paty-sin-sesion.css`
- `src/js/components/paty/av-paty-sin-sesion.json`
- Tags del kit: `iswc-card`, `iswc-icon`.
- No exporta helpers.
- Tokens: `--iswc-border-soft`, `--iswc-bg-elev`, `--iswc-text`, `--iswc-accent`.
- La hoja también asigna en `:host iswc-switch` y `:host iswc-checkbox` `--iswc-switch-accent`, `--iswc-switch-thumb`, `--iswc-checkbox-accent`, `--iswc-checkbox-fill`, `--iswc-checkbox-bg`, `--iswc-checkbox-border` y `--iswc-checkbox-on-accent`. Este tag no monta esos controles.

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| `icon="…"` | `:host([icon])` | Atributo `icon` presente y no vacío: nombre de icono (`iswc-icon`) del cartel. Vacío o ausente: `solar:chat-round-line-bold-duotone`. |
| `titulo="…"` | `:host([titulo])` | Texto del `<h2>` del cartel. Vacío o ausente: «Inicia sesión para conversar con PatyIA». |
| `texto="…"` | `:host([texto])` | Párrafo del cartel. Vacío o ausente: «Con tu cuenta ContaPyme puedes consultar al asistente…». |

> `icon`, `titulo` y `texto` son atributos reflejados (string); no hay estado binario. El render usa los tres como configuración declarativa del cartel.

## Índice

[Componentes paty](../../../skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-sin-sesion></av-paty-sin-sesion>
```
