---
name: av-embudo-grafica
description: Traduce los clientes del resumen a barras por etapa en av-grafica, con el valor del pipeline en la cabecera.
---

# `<av-embudo-grafica>`

Contacto → propuesta → negociación → cerrado / perdido.

## Anatomía

```
<av-embudo-grafica>
  #shadow-root
    <av-grafica>
      <iswc-tag slot="acciones">pipeline</iswc-tag>
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
