---
name: av-tareas-grafica
description: Traduce las tareas del resumen de la empresa a una dona en av-grafica.
---

# `<av-tareas-grafica>`

Abiertas / en progreso / en revisión / cerradas, en una dona del kit.

## Anatomía

```
<av-tareas-grafica>
  #shadow-root
    <av-grafica>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tareas` | `{ total, abiertas, en_progreso, en_revision, cerradas, vencidas } \| null` | `null` | Conteos del resumen. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-tareas-grafica id="g"></av-tareas-grafica>
<script>g.props = { tareas: { total: 6, abiertas: 2, en_progreso: 2, en_revision: 1, cerradas: 1, vencidas: 0 } };</script>
```
