---
name: av-movimiento-form
description: Diálogo de entrada, salida o ajuste de stock con vista previa «actual → resultante» y aviso de stock insuficiente.
---

# `<av-movimiento-form>`

Diálogo de entrada, salida o ajuste de stock con vista previa «actual → resultante» y aviso de stock insuficiente.

## Anatomía

```
<av-movimiento-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-select name="iproducto"> <iswc-select name="tipo"> <iswc-input name="cantidad"> <p class="ayuda"> <div part="previa"> <iswc-input name="motivo"> <iswc-callout></div>
      footer: Cancelar · Registrar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `productos` | `Producto[]` | `[]` | Productos activos. |
| `iproducto` | `number \| null` | `null` | Producto preseleccionado. |
| `tipo` | `'entrada' \| 'salida' \| 'ajuste'` | `'entrada'` | Tipo inicial. |
| `ocupado` | `boolean` | `false` | Registrando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-movimiento-guardar` | `{ datos: MovimientoDatos }` | Registrar con datos válidos. |
| `av-movimiento-form-error` | `{ mensaje }` | Datos inválidos o stock insuficiente. |
| `av-movimiento-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-movimiento-form></av-movimiento-form>
```
