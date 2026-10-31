---
name: av-inventario-tabla
description: Tabla de productos, movimientos, pedidos o proveedores (buscador + iswc-data-grid) con Entrada/Salida por producto; la búsqueda la resuelve el shell.
---

# `<av-inventario-tabla>`

Tabla de productos, movimientos, pedidos o proveedores (buscador + iswc-data-grid) con Entrada/Salida por producto; la búsqueda la resuelve el shell.

## Anatomía

```
<av-inventario-tabla>
  #shadow-root
    <div part="barra"><iswc-input class="buscador" type="search"> <span part="conteo"></div>
    <iswc-data-grid part="grid" pagination>
    <av-vacio class="vacio">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `entidad` | `'productos' \| 'movimientos' \| 'pedidos' \| 'proveedores'` | `'productos'` | Qué tabla pinta. |
| `filas` | `Fila[]` | `[]` | Filas planas (las arma el shell con utils). |
| `cargando` | `boolean` | `false` | Indicador de carga. |
| `texto` | `string` | `''` | Texto del buscador. |
| `puedeEscribir` | `boolean` | `false` | Muestra las acciones de fila. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-inventario-buscar` | `{ entidad, texto }` | Al escribir en el buscador. |
| `av-inventario-abrir` | `{ entidad, id }` | Clic en una fila. |
| `av-inventario-accion` | `{ entidad, accion, id }` | Entrada o Salida de un producto. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-inventario-tabla></av-inventario-tabla>
```
