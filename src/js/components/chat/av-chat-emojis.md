---
name: av-chat-emojis
description: Selector de emojis con recientes, categorías, búsqueda en español y cuadrícula navegable con flechas.
---

# `<av-chat-emojis>`

Selector de emojis.

## Anatomía

```
<av-chat-emojis>
  #shadow-root
    <div part="selector"><iswc-input class="buscar"> <nav class="categorias"> <div class="rejilla"><section><h3> <div class="grupo"><iswc-button class="emoji">…</div></section></div></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `destino` | `string` | `''` | Se devuelve en el evento (quién lo pidió). |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-emoji` | `{ emoji, destino }` | Se eligió un emoji. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-emojis id="x"></av-chat-emojis>
<script>x.props = {"destino": "galeria"};</script>
```
