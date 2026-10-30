---
name: av-avo-mensaje
description: Burbuja del chat con AVO: el usuario a la derecha con su avatar, AVO a la izquierda con ícono de robot.
---

# `<av-avo-mensaje>`

Un turno de la conversación con el asistente.

## Anatomía

```
<av-avo-mensaje>
  #shadow-root
    <article part="turno" data-quien="yo|avo"><span part="avatar"> | <av-persona> <div part="burbuja"><p> <iswc-relative-time></div></article>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `turno` | `{ id, quien, texto, creado } \| null` | `null` | El turno a pintar. |
| `nombre` | `string` | `''` | Nombre del usuario (para su avatar). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-avo-mensaje id="t"></av-avo-mensaje>
<script>t.props = { turno: { id: 'r-1', quien: 'avo', texto: 'Hola, soy AVO.', creado: null } };</script>
```
