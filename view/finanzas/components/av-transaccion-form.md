---
name: av-transaccion-form
description: Diálogo para registrar, editar o eliminar una transacción (tipo, categoría, monto, moneda, fecha, estado); solo lectura sin permiso.
---

# `<av-transaccion-form>`

Diálogo para registrar, editar o eliminar una transacción (tipo, categoría, monto, moneda, fecha, estado); solo lectura sin permiso.

## Anatomía

```
<av-transaccion-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-select name="tipo"> <iswc-input name="categoria"> <iswc-input name="descripcion"> <iswc-input name="monto"> <iswc-select name="moneda"> <iswc-input name="fecha" type="date"> <iswc-select name="estado"> <iswc-callout></div>
      footer: Eliminar (+iswc-popconfirm) · Cancelar · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `transaccion` | `Transaccion \| null` | `null` | null = nueva. |
| `categorias` | `string[]` | `[]` | Categorías usadas (sugerencia). |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-transaccion-guardar` | `{ datos: TransaccionDatos }` | Guardar con datos válidos. |
| `av-transaccion-eliminar` | `{ itransaccion }` | Confirmar eliminar. |
| `av-transaccion-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-transaccion-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-transaccion-form></av-transaccion-form>
```
