---
name: av-tareas-grafica
description: Tarjeta con la dona de tareas por estado (iswc-doughnut-chart) del resumen de la empresa.
---

# `<av-tareas-grafica>`

Abiertas / en progreso / en revisión / cerradas, en una dona del kit.

## Anatomía

```
<av-tareas-grafica>
  #shadow-root
    <iswc-card part="tarjeta"><iswc-doughnut-chart part="grafica"><script type="application/json"> | <av-vacio></iswc-card>
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
