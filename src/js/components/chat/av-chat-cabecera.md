---
name: av-chat-cabecera
description: Cabecera de la conversación: foto, nombre, estado (en línea, escribiendo, últ. vez) y llamadas, búsqueda e info.
---

# `<av-chat-cabecera>`

Estado en vivo y acciones del chat abierto.

## Anatomía

```
<av-chat-cabecera>
  #shadow-root
    <header part="cabecera"><iswc-button class="volver"> <iswc-button class="quien"><iswc-avatar> nombre / estado</iswc-button> <span class="acciones">…</span></header>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Chat (sin id no pinta). |
| `tipo` | `TipoChat` | `'directo'` | Tipo. |
| `nombre` | `string` | `''` | Nombre. |
| `foto` | `string \| null` | `null` | Foto. |
| `iniciales` | `string` | `''` | Iniciales. |
| `color` | `number` | `0` | Color estable. |
| `estado` | `string` | `''` | Línea de estado. |
| `activo` | `boolean` | `false` | Estado resaltado (en línea / escribiendo). |
| `integrantes` | `number` | `0` | En grupos. |
| `puedeLlamar` | `boolean` | `true` | Muestra las llamadas. |
| `volver` | `boolean` | `false` | Botón volver (pantallas estrechas). |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-volver` | `—` | Volver a la lista. |
| `av-chat-llamar` | `{ tipo }` | `voz` o `video`. |
| `av-chat-panel` | `{ panel }` | `busqueda` o `info`. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-cabecera id="x"></av-chat-cabecera>
<script>x.props = {"id": "d1", "nombre": "Beto Ruiz", "iniciales": "BR", "color": 3, "estado": "escribiendo…", "activo": true};</script>
```
