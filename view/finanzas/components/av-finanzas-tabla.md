---
name: av-finanzas-tabla
description: Tabla de transacciones o facturas (buscador + iswc-data-grid) con acciones Emitir y Pagar por fila; la búsqueda la resuelve el shell.
---

# `<av-finanzas-tabla>`

Tabla de transacciones o facturas (buscador + iswc-data-grid) con acciones Emitir y Pagar por fila; la búsqueda la resuelve el shell.

## Anatomía

```
<av-finanzas-tabla>
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
| `entidad` | `'transacciones' \| 'facturas'` | `'transacciones'` | Qué tabla pinta (columnas y acciones). |
| `filas` | `Fila[]` | `[]` | Filas planas (las arma el shell con utils). |
| `cargando` | `boolean` | `false` | Indicador de carga. |
| `texto` | `string` | `''` | Texto del buscador. |
| `puedeEscribir` | `boolean` | `false` | Muestra la columna de acciones. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-finanzas-buscar` | `{ entidad, texto }` | Al escribir en el buscador. |
| `av-finanzas-abrir` | `{ entidad, id }` | Clic en una fila. |
| `av-finanzas-accion` | `{ entidad, accion, id }` | Emitir o Pagar en una factura. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-finanzas-tabla></av-finanzas-tabla>
```
