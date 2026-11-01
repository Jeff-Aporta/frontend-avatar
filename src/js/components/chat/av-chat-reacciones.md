---
name: av-chat-reacciones
description: Reacciones de un mensaje agrupadas con conteo y quién reaccionó; tocar pone o quita la propia.
---

# `<av-chat-reacciones>`

Píldoras de reacciones.

## Anatomía

```
<av-chat-reacciones>
  #shadow-root
    <div part="reacciones"><iswc-button class="reaccion">emoji n</iswc-button>…</div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `ref` | `string` | `''` | Mensaje. |
| `reacciones` | `ReaccionVista[]` | `[]` | `{ emoji, n, nombres, mia }`. |
| `propio` | `boolean` | `false` | Alineación. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-reaccionar` | `{ imensaje, emoji \| null }` | Pone o quita. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-reacciones id="x"></av-chat-reacciones>
<script>x.props = {"ref": "m1", "reacciones": [{"emoji": "👍", "n": 3, "nombres": ["Ana", "Beto", "Carla"], "mia": true}, {"emoji": "😂", "n": 1, "nombres": ["Darío"], "mia": false}]};</script>
```
