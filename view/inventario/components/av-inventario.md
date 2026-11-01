---
name: av-inventario
description: Shell de inventario: KPIs, alertas de stock, productos, kardex, pedidos y proveedores con sus diálogos; habla con el API.
---

# `<av-inventario>`

Shell de inventario: KPIs, alertas de stock, productos, kardex, pedidos y proveedores con sus diálogos; habla con el API.

## Anatomía

```
<av-inventario>
  #shadow-root
    <div part="pagina"><iswc-page-header> <iswc-callout> (sin permiso) <iswc-stat-group id="kpis"> <av-stock-alertas id="alertas">
      <iswc-tab-group><iswc-tab>×4 <iswc-tab-panel><av-tabla>×4</iswc-tab-group>
      <av-producto-form> <av-movimiento-form> <av-pedido-form> <av-proveedor-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Pestaña inicial: productos, movimientos, pedidos o proveedores. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-inventario></av-inventario>
```
