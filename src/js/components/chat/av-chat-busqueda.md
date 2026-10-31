---
name: av-chat-busqueda
description: Búsqueda de mensajes en un chat o en todos, por texto o por significado, con resultados resaltados que abren el mensaje.
---

# `<av-chat-busqueda>`

Panel de búsqueda de mensajes.

## Anatomía

```
<av-chat-busqueda>
  #shadow-root
    <aside part="busqueda"><header> <iswc-input class="q"> <div class="opciones">modo · alcance</div> <ol class="resultados"><button class="resultado">…</ol></aside>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible (enfoca). |
| `chat` | `string \| null` | `null` | Chat actual (alcance). |
| `chatNombre` | `string` | `''` | Nombre del chat actual. |
| `resultados` | `ResultadoVista[]` | `[]` | Con `fragmento` HTML saneado. |
| `cargando` | `boolean` | `false` | Buscando. |
| `buscado` | `string` | `''` | Última consulta. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-buscar` | `{ q, modo, icanal }` | Consulta. |
| `av-chat-abrir` | `{ icanal, imensaje }` | Abrir resultado. |
| `av-chat-panel-cerrar` | `{ panel }` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-busqueda id="x"></av-chat-busqueda>
<script>x.props = {"abierto": true, "chat": "g1", "chatNombre": "Equipo Odys", "buscado": "lunes", "resultados": [{"chat": "g1", "chatNombre": "Equipo Odys", "ref": "m2", "autor": "Ana Torres", "color": 1, "ts": "2026-10-30T15:00:00.000Z", "fragmento": "Nos vemos el <mark>lunes</mark> a las 9"}]};</script>
```
