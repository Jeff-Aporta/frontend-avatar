---
name: av-chat-audio
description: Reproductor de notas de voz: reproducir, onda como barra de avance (también con flechas), tiempo y velocidad 1×/1.5×/2×.
---

# `<av-chat-audio>`

Reproductor de notas de voz.

## Anatomía

```
<av-chat-audio>
  #shadow-root
    <div part="audio"><iswc-button class="play"> <div class="onda" role="slider"><span class="barra">…</span></div> <span class="tiempo"> <iswc-button class="velocidad"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `url` | `string` | `''` | Audio. |
| `duracion` | `number \| null` | `null` | Segundos. |
| `onda` | `number[]` | `[]` | Alturas 0..1. |
| `propio` | `boolean` | `false` | Alineación. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-audio id="x"></av-chat-audio>
<script>x.props = {"url": "", "duracion": 12, "onda": [0.2, 0.5, 0.9, 0.4, 0.7, 0.3, 0.8, 0.6, 0.2, 0.5]};</script>
```
