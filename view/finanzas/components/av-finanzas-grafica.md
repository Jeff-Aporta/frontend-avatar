---
name: av-finanzas-grafica
description: Barras del mes anterior contra el actual (ingresos, gastos, beneficio) y dona de gastos por categoría; refresca sin repintar.
---

# `<av-finanzas-grafica>`

Barras del mes anterior contra el actual (ingresos, gastos, beneficio) y dona de gastos por categoría; refresca sin repintar.

## Anatomía

```
<av-finanzas-grafica>
  #shadow-root
    <div part="rejilla">
      <iswc-card part="tarjeta"><strong slot="header"> <iswc-bar-chart id="barras"> | <av-vacio></iswc-card>
      <iswc-card part="tarjeta"><strong slot="header"> <iswc-doughnut-chart id="dona"> | <av-vacio></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `resumen` | `ResumenFinanzas \| null` | `null` | Resumen del mes (`transacciones/resumen`); null = cargando. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-finanzas-grafica></av-finanzas-grafica>
```
