---
name: av-indicadores
description: Fila de KPIs (iswc-stat en iswc-grid-layout) con esqueletos mientras carga; refresca sin repintar.
---

# `<av-indicadores>`

Cifras de cabecera de las vistas de negocio (correos, finanzas, inventario, recursos humanos).

## Anatomía

```
<av-indicadores>
  #shadow-root
    <iswc-grid-layout part="rejilla" cells="repeat(auto-fit, …)">
      <iswc-stat part="kpi" data-id label value helper icon color trend trend-direction>×N | <iswc-skeleton>×esqueletos
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `Indicador[] \| null` | `null` | `{ id, label, value, helper, icon, color, trend, trendDirection }`; `null` = cargando. |
| `esqueletos` | `number` | `4` | Esqueletos mientras carga. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-indicadores id="k"></av-indicadores>
<script>k.props = { items: [{ id: 'ing', label: 'Ingresos', value: '$ 31.780.000', trend: '+29,6 %', icon: 'mdi:trending-up', color: 'success' }] };</script>
```
