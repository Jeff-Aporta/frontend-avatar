---
name: av-chat-grupo-form
description: Crear grupo (integrantes → nombre, descripción y foto), editarlo o agregar integrantes.
---

# `<av-chat-grupo-form>`

Diálogo de grupo en pasos.

## Anatomía

```
<av-chat-grupo-form>
  #shadow-root
    <iswc-dialog><div class="paso uno"><div class="fichas"> <iswc-input> <div class="personas"><label class="fila"><iswc-checkbox></div> <div class="paso dos"><label class="foto-campo"> <iswc-input class="nombre"> <iswc-textarea></div></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible. |
| `modo` | `'crear' \| 'editar' \| 'agregar'` | `'crear'` | Qué hace. |
| `personas` | `PersonaVista[]` | `[]` | Candidatos. |
| `excluir` | `string[]` | `[]` | Ya integrantes. |
| `nombre` | `string` | `''` | Al editar. |
| `descripcion` | `string` | `''` | Al editar. |
| `foto` | `string \| null` | `null` | Al editar. |
| `guardando` | `boolean` | `false` | Botón ocupado. |
| `error` | `string` | `''` | Error. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-grupo-crear` | `{ nombre, descripcion, miembros, foto }` | Crear. |
| `av-chat-grupo-editar` | `{ nombre, descripcion, foto }` | Guardar. |
| `av-chat-miembros` | `{ accion: 'agregar', usuarios }` | Agregar. |
| `av-chat-panel-cerrar` | `{ panel }` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-grupo-form id="x"></av-chat-grupo-form>
<script>x.props = {"personas": [{"id": "beto", "nombre": "Beto Ruiz", "foto": null, "detalle": "Desarrollo", "enLinea": true, "color": 3, "rol": ""}, {"id": "carla", "nombre": "Carla Gómez", "foto": null, "detalle": "Diseño", "enLinea": false, "color": 5, "rol": ""}, {"id": "dario", "nombre": "Darío Peña", "foto": null, "detalle": "Ventas", "enLinea": false, "color": 0, "rol": ""}]};</script>
```
