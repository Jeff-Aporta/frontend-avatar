---
name: av-pedido-form
description: Diálogo de pedido a proveedor o de cliente con estado, fechas, ítems (producto, cantidad, precio) y total en vivo.
---

# `<av-pedido-form>`

Diálogo de pedido a proveedor o de cliente con estado, fechas, ítems (producto, cantidad, precio) y total en vivo.

## Anatomía

```
<av-pedido-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-select id="tipo"> <iswc-select id="estado"> <iswc-select id="iproveedor"> | <iswc-select id="icliente"> <iswc-input type="date">×3
        <div part="items"><div part="item"><iswc-select class="i-prod"> <iswc-input class="i-cant"> <iswc-input class="i-precio"> <iswc-button></div>×N</div>
        <div class="pie"> <strong part="total"> <iswc-textarea id="notas"> <iswc-callout></div>
      footer: Eliminar · Cancelar · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `pedido` | `Pedido \| null` | `null` | null = nuevo. |
| `items` | `ItemPedido[]` | `[]` | Ítems del pedido abierto. |
| `productos` | `Producto[]` | `[]` | Productos. |
| `proveedores` | `Proveedor[]` | `[]` | Proveedores. |
| `clientes` | `ClientePedido[]` | `[]` | Clientes del CRM. |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-pedido-guardar` | `{ datos: PedidoDatos }` | Guardar con datos válidos. |
| `av-pedido-eliminar` | `{ ipedido }` | Confirmar eliminar. |
| `av-pedido-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-pedido-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-pedido-form></av-pedido-form>
```
