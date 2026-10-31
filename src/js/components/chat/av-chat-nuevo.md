---
name: av-chat-nuevo
description: Diálogo «Nuevo chat»: buscador de personas; elegir una abre o crea el directo; acceso a «Nuevo grupo».
---

# `<av-chat-nuevo>`

Diálogo para empezar un chat.

## Anatomía

```
<av-chat-nuevo>
  #shadow-root
    <iswc-dialog><iswc-input class="q"> <button class="fila grupo"> <div class="personas"><button class="fila">…</div></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible. |
| `personas` | `PersonaVista[]` | `[]` | Personas de la empresa. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-directo` | `{ iusuario }` | Abrir directo. |
| `av-chat-panel` | `{ panel }` | `grupo`. |
| `av-chat-panel-cerrar` | `{ panel }` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-nuevo id="x"></av-chat-nuevo>
<script>x.props = {"personas": [{"id": "beto", "nombre": "Beto Ruiz", "foto": null, "detalle": "Desarrollo", "enLinea": true, "color": 3, "rol": ""}, {"id": "carla", "nombre": "Carla Gómez", "foto": null, "detalle": "Diseño", "enLinea": false, "color": 5, "rol": ""}, {"id": "dario", "nombre": "Darío Peña", "foto": null, "detalle": "Ventas", "enLinea": false, "color": 0, "rol": ""}]};</script>
```
