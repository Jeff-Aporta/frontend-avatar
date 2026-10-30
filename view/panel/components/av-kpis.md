---
name: av-kpis
description: Rejilla de tarjetas KPI (iswc-stat) del resumen de la empresa: miembros, mensajes, proyectos, pendientes, vencidas y pipeline.
---

# `<av-kpis>`

Las seis cifras de arriba del panel. Sin resumen pinta esqueletos.

## Anatomía

```
<av-kpis>
  #shadow-root
    <div part="rejilla"><iswc-stat data-id="miembros">…×6</div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `resumen` | `Resumen \| null` | `null` | Respuesta de `empresa/{id}/resumen`. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-kpis id="k"></av-kpis>
```
