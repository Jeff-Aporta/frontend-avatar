---
name: av-tarea-detalle
description: Cajón lateral con una tarea completa y sus comentarios; permite comentar, editar y eliminar (emite eventos av-tarea-*).
---

# `<av-tarea-detalle>`

Detalle de una tarjeta del tablero en un `iswc-drawer`.

## Anatomía

```
<av-tarea-detalle>
  #shadow-root
    <iswc-drawer id="cajon"><article part="tarea">título, chips, <dl>, descripción, <ul part="comentarios"><li>…</li></ul>, <iswc-textarea id="comentario"></article>
      <iswc-button slot="footer">Editar</iswc-button> <iswc-button id="eliminar"> + <iswc-popconfirm for="eliminar">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre/cierra el cajón. |
| `tarea` | `TareaTablero \| null` | `null` | La tarea. |
| `comentarios` | `Comentario[]` | `[]` | Sus comentarios. |
| `puedeComentar` | `boolean` | `false` | Muestra la caja de comentar. |
| `puedeEditar` | `boolean` | `false` | Botón Editar. |
| `puedeEliminar` | `boolean` | `false` | Botón Eliminar. |
| `ocupado` | `boolean` | `false` | Enviando comentario. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-tarea-comentar` | `{ itarea, contenido }` | «Comentar» con texto. |
| `av-tarea-editar` | `{ itarea }` | «Editar». |
| `av-tarea-eliminar` | `{ itarea }` | Confirmar en el popconfirm. |
| `av-tarea-detalle-cerrar` | `{}` | Cerrar el cajón. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-tarea-detalle id="d"></av-tarea-detalle>
<script>d.props = { abierto: true, tarea: { itarea: 1, codigo: 'TK-000001', iproyecto: 1, icolumna: 1, titulo: 'Login', prioridad: 'alta', estado: 'abierta' }, puedeComentar: true };</script>
```
