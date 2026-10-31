---
name: av-proyectos
description: Shell de proyectos: selector de proyecto, tablero kanban, formularios de tarea/proyecto y detalle con comentarios; el único que habla con el API.
---

# `<av-proyectos>`

Ruta `#/proyectos/<iproyecto>`. Sin id, navega al primer proyecto de la empresa activa. Carga proyectos, miembros y
equipos, pide el tablero (`proyecto/{id}/tablero`), mueve tareas (`tarea/{id}/mover`) y escribe con los controllers de
DER (`tareas`, `comentarios`, `proyectos`, `columnas`).

## Anatomía

```
<av-proyectos>
  #shadow-root
    <div part="pagina"><iswc-page-header><iswc-select id="selector" slot="acciones"> botones</iswc-page-header> <iswc-empty-state id="sin-proyectos"> <av-tablero id="tablero"> <av-tarea-form> <av-tarea-detalle> <av-proyecto-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Proyecto de la ruta. |
| `version` | `number` | `0` | Súbela para recargar todo. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-proyectos></av-proyectos>
```
