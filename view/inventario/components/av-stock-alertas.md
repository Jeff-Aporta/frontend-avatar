---
name: av-stock-alertas
description: Franja de alertas de stock (agotados primero) con stock, mínimo, ubicación y Reponer; sin alertas, confirmación verde.
---

# `<av-stock-alertas>`

Franja de alertas de stock (agotados primero) con stock, mínimo, ubicación y Reponer; sin alertas, confirmación verde.

## Anatomía

```
<av-stock-alertas>
  #shadow-root
    <section part="alertas"><h2 class="rotulo"> <iswc-badge>
      <div part="franja"><article part="alerta" data-agotado><iswc-tag> sku <iswc-button class="nombre"> cifras <iswc-button class="reponer"></article>×N</div></section>
    | <iswc-callout color="success"> | <iswc-skeleton>×3
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `alertas` | `AlertaStock[] \| null` | `null` | Respuesta de `productos/alertas`; null = cargando. |
| `puedeMover` | `boolean` | `false` | Muestra Reponer. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-inventario-abrir` | `{ entidad: 'productos', id }` | Clic en el nombre. |
| `av-producto-mover` | `{ iproducto, tipo: 'entrada' }` | Clic en Reponer. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-stock-alertas></av-stock-alertas>
```
