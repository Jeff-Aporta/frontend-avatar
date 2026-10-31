---
name: av-chat-visor
description: Imágenes y videos a pantalla completa sobre iswc-lightbox: anterior/siguiente, autor y fecha, descarga y cerrar.
---

# `<av-chat-visor>`

Visor de medios del chat.

## Anatomía

```
<av-chat-visor>
  #shadow-root
    <iswc-lightbox><div part="medio"><img|video></div><div slot="toolbar" class="barra">…</div></iswc-lightbox>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible. |
| `items` | `ItemVisor[]` | `[]` | `{ ref, url, tipo, nombre, autor, ts }`. |
| `indice` | `number` | `0` | Cuál se ve. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-visor-cerrar` | `—` | Se cerró. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-visor id="x"></av-chat-visor>
<script>x.props = {"abierto": false, "items": []};</script>
```
