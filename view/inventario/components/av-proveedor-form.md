---
name: av-proveedor-form
description: Diálogo para crear, editar o eliminar un proveedor; uno que surte productos no se elimina.
---

# `<av-proveedor-form>`

Diálogo para crear, editar o eliminar un proveedor; uno que surte productos no se elimina.

## Anatomía

```
<av-proveedor-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-input name="nombre"> <iswc-input name="contacto"> <iswc-input name="email"> <iswc-input name="telefono"> <p class="nota"> <iswc-callout></div>
      footer: Eliminar · Cancelar · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `proveedor` | `Proveedor \| null` | `null` | null = nuevo. |
| `productos` | `number` | `0` | Productos que surte (si > 0 no se elimina). |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-proveedor-guardar` | `{ datos: ProveedorDatos }` | Guardar con datos válidos. |
| `av-proveedor-eliminar` | `{ iproveedor }` | Confirmar eliminar. |
| `av-proveedor-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-proveedor-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-proveedor-form></av-proveedor-form>
```
