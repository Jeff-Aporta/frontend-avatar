---
name: av-embudo-grafica
description: Tarjeta con barras de clientes por etapa del CRM (iswc-bar-chart) y el valor del pipeline.
---

# `<av-embudo-grafica>`

Contacto → propuesta → negociación → cerrado / perdido.

## Anatomía

```
<av-embudo-grafica>
  #shadow-root
    <iswc-card part="tarjeta"><iswc-tag slot="header-actions">pipeline</iswc-tag><iswc-bar-chart part="grafica"> | <iswc-empty-state></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `clientes` | `{ total, por_etapa, valor_pipeline } \| null` | `null` | Del resumen. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-embudo-grafica id="e"></av-embudo-grafica>
<script>e.props = { clientes: { total: 4, por_etapa: { contacto: 1, propuesta: 2, cerrado: 1 }, valor_pipeline: 20100 } };</script>
```
