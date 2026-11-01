---
name: av-kpis
description: Traduce el resumen de la empresa a iswc-stat-group: miembros, mensajes, proyectos, pendientes, vencidas y pipeline.
---

# `<av-kpis>`

Las seis cifras de arriba del panel. Sin resumen pinta esqueletos.

## Anatomía

```
<av-kpis>
  #shadow-root
    <iswc-stat-group part="grupo" esqueletos="6">
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
