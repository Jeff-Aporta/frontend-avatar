---
name: av-factura-form
description: Diálogo de factura con ítems editables y totales en vivo; editable solo en borrador, con Emitir y Registrar pago según el estado.
---

# `<av-factura-form>`

Diálogo de factura con ítems editables y totales en vivo; editable solo en borrador, con Emitir y Registrar pago según el estado.

## Anatomía

```
<av-factura-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><div class="estado"><iswc-tag> fechas</div> <iswc-select id="cliente"> <iswc-select id="moneda"> <iswc-input id="impuesto">
        <div part="items"><div part="item"><iswc-input class="i-desc"> <iswc-input class="i-cant"> <iswc-input class="i-precio"> <iswc-button class="quitar"></div>×N</div>
        <iswc-button class="agregar"> <dl part="totales"> <iswc-textarea id="notas"> <iswc-callout></div>
      footer: Eliminar · Cerrar · Emitir · Registrar pago · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `factura` | `Factura \| null` | `null` | null = nuevo borrador. |
| `clientes` | `ClienteRef[]` | `[]` | Clientes del CRM. |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando / emitiendo / cobrando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-factura-guardar` | `{ datos: FacturaDatos }` | Guardar el borrador. |
| `av-factura-eliminar` | `{ ifactura }` | Eliminar el borrador. |
| `av-finanzas-accion` | `{ entidad: 'facturas', accion: 'emitir' \| 'pagar', id }` | Emitir o registrar pago. |
| `av-factura-form-error` | `{ mensaje }` | Ítems inválidos. |
| `av-factura-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-factura-form></av-factura-form>
```
