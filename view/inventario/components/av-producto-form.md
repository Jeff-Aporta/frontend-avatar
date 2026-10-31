---
name: av-producto-form
description: Diálogo de producto: catálogo editable, stock con nivel y atajos Entrada/Salida/Ajuste, margen y productos relacionados (se ocultan si no hay).
---

# `<av-producto-form>`

Diálogo de producto: catálogo editable, stock con nivel y atajos Entrada/Salida/Ajuste, margen y productos relacionados (se ocultan si no hay).

## Anatomía

```
<av-producto-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><div part="stock" data-nivel> cifra <iswc-tag> <iswc-button>×3</div>
        <iswc-input name=…>×9 <iswc-select name="iproveedor"> <iswc-switch id="bactivo"> <p class="margen">
        <section part="relacionados"><iswc-button>×N</section> <iswc-callout></div>
      footer: Cancelar · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `producto` | `Producto \| null` | `null` | null = nuevo. |
| `proveedores` | `Proveedor[]` | `[]` | Opciones de proveedor. |
| `relacionados` | `Producto[]` | `[]` | Relacionados; vacío = sección oculta. |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-producto-guardar` | `{ datos: ProductoDatos }` | Guardar con datos válidos. |
| `av-producto-mover` | `{ iproducto, tipo }` | Atajo Entrada / Salida / Ajuste. |
| `av-inventario-abrir` | `{ entidad: 'productos', id }` | Clic en un relacionado. |
| `av-producto-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-producto-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-producto-form></av-producto-form>
```
