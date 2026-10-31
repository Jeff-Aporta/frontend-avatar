---
name: av-panel
description: Shell del dashboard: KPIs, dona de tareas, embudo CRM y notificaciones de la empresa activa.
---

# `<av-panel>`

La primera pantalla con sesión (`#/panel`). Carga `empresa/{id}/resumen` y `notificaciones/mias` por el plugin `avatar`.

## Anatomía

```
<av-panel>
  #shadow-root
    <div part="pagina"><iswc-page-header> <av-kpis> <div part="rejilla"><av-tareas-grafica> <av-embudo-grafica> <av-notificaciones></div></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `resumen` | `Resumen \| null` | `null` | Datos cargados (null = cargando). |
| `error` | `string` | `''` | Error de carga. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-panel></av-panel>
```
