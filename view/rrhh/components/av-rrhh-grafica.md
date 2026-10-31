---
name: av-rrhh-grafica
description: Dona de la asistencia de hoy y barras de la plantilla por departamento; refresca sin repintar.
---

# `<av-rrhh-grafica>`

Dona de la asistencia de hoy y barras de la plantilla por departamento; refresca sin repintar.

## Anatomía

```
<av-rrhh-grafica>
  #shadow-root
    <div part="rejilla">
      <iswc-card part="tarjeta"><iswc-doughnut-chart id="asistencia"> | <iswc-empty-state></iswc-card>
      <iswc-card part="tarjeta"><iswc-bar-chart id="departamentos"> | <iswc-empty-state></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `resumen` | `ResumenRrhh \| null` | `null` | Resumen (`empleados/resumen`); null = cargando. |
| `departamentos` | `{ nombre, cantidad }[]` | `[]` | Plantilla vigente por departamento. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-rrhh-grafica></av-rrhh-grafica>
```
