---
name: av-paty-adjunto
description: >-
  Preview de un adjunto del chat (imagen thumb, audio o documento) a 1em de alto.
---

# `<av-paty-adjunto>`

Preview compacto. El alto es siempre `1em` del host: el padre agranda con `font-size`.

Mocks de playground: `public/mocks/adjuntos/` (thumb/med/original.svg, `nota.webm`, `contrato.pdf`, `ventas.csv`, `notas.txt`). El build los espeja en `/mocks/adjuntos/`.

`kind`: `imagen` | `audio` | `documento` (`file`/`doc` caen a documento). `mode="md"` aplana a una línea de texto.

## Fuentes de datos

En este orden se unifican:

1. Atributo `jfile` = JSON de `patyia_files_storage` (`kind`, `mime`, `filename`, `meta`, `variants.thumb|med|original`).
2. Hijos XML del plan ISS: `<meta …/>` + `<variants><variant name url bytes/></variants>`.
3. Atributos planos: `src`, `src-thumb`, `src-med`, `src-original`, `mime`, `filename`, `width`, `height`, `durationSec`, `transcripcion`.

URLs:

| Uso | Orden |
| --- | --- |
| Preview imagen | thumb → med → original → `src` |
| Apertura / audio / doc | original → med → thumb → `src` |

## Cuándo usarlo

En el HTML del mensaje cuando ya hay `ifile`/`kind` (tag portable o expandido).

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<!-- imagen -->
<a part="adjunto" class="adjunto adjunto--imagen">
  <img class="adjunto__preview" />
</a>
<!-- audio -->
<article part="adjunto" class="adjunto adjunto--audio">
  <iswc-icon class="adjunto__icono" />
  <audio class="adjunto__audio" controls></audio>
  <span class="adjunto__meta">30s</span>
</article>
<!-- documento -->
<a part="adjunto" class="adjunto adjunto--documento">
  <iswc-icon class="adjunto__icono" />
  <span class="adjunto__nombre">…</span>
  <span class="adjunto__ext">PDF</span>
</a>
<!-- modo md -->
<span part="md" class="md">[Imagen #N]</span>
```

## Atributos observados

`observedAttributes`: `ifile`, `kind`, `src`, `src-thumb`, `src-med`, `src-original`, `mime`, `filename`, `iconversacion`, `width`, `height`, `durationSec`, `transcripcion`, `mode`, `jfile`.

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `ifile` | texto | `""` | Id; en `md` entra en la línea. |
| `kind` | texto | `imagen` | `audio` / `documento` (también `file`/`doc`). Resto = imagen. |
| `jfile` | texto (JSON) | — | JSON completo del storage. |
| `src` / `src-thumb` / `src-med` / `src-original` | texto (URL) | — | URLs; ganan sobre el jfile si vienen. |
| `mime` / `filename` | texto | — | Documento (icono/extensión) y labels. |
| `iconversacion` | texto | — | Id de conversación asociado. |
| `width` / `height` | número | — | Aspect del thumb de imagen. |
| `durationSec` | número | — | Chip de audio. |
| `transcripcion` | texto | — | Solo `md` de audio. |
| `mode` | texto | `xml` | Solo `md` aplana a texto. |

## Props

Sin objeto de props: toda la configuracion entra por atributos (ver **Atributos observados**) y por los helpers de `API JavaScript`.

## Eventos

Emite desde el host con `bubbles: true` y `composed: true` cuando se invoca el helper `reproducirAdjuntoAudio`.

| Evento | Detalle | Cuándo se emite |
| --- | --- | --- |
| `av-paty-adjunto-play` | `{ ifile: string }` | Llamada externa a `reproducirAdjuntoAudio(el)`. Sirve para que el padre sepa que el usuario quiere reproducir el audio. |

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. El preview se pinta internamente con `<img>`, `<audio>`, `iswc-icon` o `<span>` según el `kind`. |

## CSS Parts

| Part | Descripción |
| --- | --- |
| `md` | Línea de texto plano cuando `mode="md"` aplana la preview. |
| `adjunto` | Caja del adjunto (imagen `<a>`, audio `<article>` o documento `<a>`) con alto fijo de `1em`. |
Shadow abierto. `part="adjunto"` (xml) o `part="md"`.

| kind | DOM |
| --- | --- |
| imagen | `<a.adjunto--imagen>` + `<img.adjunto__preview>` (o placeholder). |
| audio | `<article.adjunto--audio>` + icono + `<audio controls>`. |
| documento | `<a.adjunto--documento>` + icono por mime/ext + nombre + badge ext. |

Iconos doc: pdf → `mdi:file-pdf-box`; xls/csv → `mdi:file-excel-box`; doc → `mdi:file-word-box`; txt/md → `mdi:file-document-outline`; else `mdi:paperclip`.

## Helpers

- `upgradePatyAdjuntosEnHtml(html, adjuntos, mode?)` — enriquece tags por `ifile`; para imagen prefiere thumb; propaga variantes y `jfile` si viene.
- `reproducirAdjuntoAudio(el)` — emite `av-paty-adjunto-play` `{ ifile }`.

## API JavaScript

| Método | Descripción |
| --- | --- |
| `static get observedAttributes(): readonly string[]` | Atributos HTML que disparan `attributeChangedCallback`: `ifile`, `kind`, `src`, `src-thumb`, `src-med`, `src-original`, `mime`, `filename`, `iconversacion`, `width`, `height`, `durationSec`, `transcripcion`, `mode`, `jfile`. |
| `connectedCallback(): void` | Inicializa el `MutationObserver` sobre los hijos para reaccionar a inserciones externas y dispara el primer render. |
| `disconnectedCallback(): void` | Desconecta y libera el `MutationObserver` para evitar fugas al desmontar el componente. |
| `attributeChangedCallback(name, oldV, newV): void` | Si el atributo cambió y el elemento está conectado, vuelve a renderizar el Shadow DOM. |
| `upgradePatyAdjuntosEnHtml(contenidoHTML, adjuntos, mode?): string` (export) | Helper: reescribe los `<av-paty-adjunto>` del HTML enriqueciendo `src`/`mime`/`filename` desde la lista canónica de adjuntos (thumb preferido para imagen). |
| `reproducirAdjuntoAudio(target: HTMLElement): void` (export) | Helper: emite el evento `av-paty-adjunto-play` con `{ ifile }` desde el host recibido. |

## Desarrollo

- `src/js/components/paty/av-paty-adjunto.ts|css|json|md`
- Tags kit: `iswc-icon`

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| `kind="imagen"` | `:host([kind="imagen"])` | Defecto (`kind` ausente, vacío o cualquier valor fuera de `audio`/`documento`/`file`/`doc`). Pinta el preview con thumb/med/original. |
| `kind="audio"` | `:host([kind="audio"])` | Pinta el bloque con icono de micrófono y `<audio controls>`. |
| `kind="documento"` | `:host([kind="documento"])` | Alias de `file`/`doc`. Pinta el enlace con icono por mime/ext y badge de tipo. |
| `mode="md"` | `:host([mode="md"])` | Aplana el adjunto a una sola línea de texto plano (sin shadow DOM expandido). |

## Índice

[Componentes paty](../../../skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-adjunto></av-paty-adjunto>
```
