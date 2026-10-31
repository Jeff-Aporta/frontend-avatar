---
name: av-rrhh-tabla
description: Tabla de empleados o del historial de asistencias (buscador + iswc-data-grid); la búsqueda la resuelve el shell.
---

# `<av-rrhh-tabla>`

Tabla de empleados o del historial de asistencias (buscador + iswc-data-grid); la búsqueda la resuelve el shell.

## Anatomía

```
<av-rrhh-tabla>
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
| `entidad` | `'empleados' \| 'asistencias'` | `'empleados'` | Qué tabla pinta. |
| `filas` | `Fila[]` | `[]` | Filas planas (las arma el shell con utils). |
| `cargando` | `boolean` | `false` | Indicador de carga. |
| `texto` | `string` | `''` | Texto del buscador. |
| `puedeEscribir` | `boolean` | `false` | Reservado para acciones de fila. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-rrhh-buscar` | `{ entidad, texto }` | Al escribir en el buscador. |
| `av-rrhh-abrir` | `{ entidad, id }` | Clic en una fila. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-rrhh-tabla></av-rrhh-tabla>
```
