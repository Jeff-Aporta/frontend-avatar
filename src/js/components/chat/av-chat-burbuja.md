---
name: av-chat-burbuja
description: Un mensaje: cola, autor con color, reenviado, cita, adjunto, formato ligero, emojis grandes, editado, hora, ✓/✓✓, progreso, reintentar y reacciones.
---

# `<av-chat-burbuja>`

Burbuja de mensaje (propia o ajena).

## Anatomía

```
<av-chat-burbuja>
  #shadow-root
    <div part="fila"><div part="burbuja"><span class="autor"> <button class="cita"> <av-chat-adjunto|av-chat-audio> <div class="texto">…<span part="meta"></span></div></div> <av-chat-reacciones></div>
    | <div part="sistema"><span class="pildora"></span></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `mensaje` | `MensajeChat \| null` | `null` | El mensaje. |
| `propio` | `boolean` | `false` | A la derecha con el color de marca. |
| `primero` | `boolean` | `true` | Abre ráfaga (cola y nombre). |
| `ultimo` | `boolean` | `true` | Cierra ráfaga. |
| `autor` | `{ nombre, color } \| null` | `null` | Nombre en grupos. |
| `marca` | `'pendiente'…'leido' \| null` | `null` | Marca de envío. |
| `cita` | `CitaVista \| null` | `null` | Mensaje respondido. |
| `menciones` | `string[]` | `[]` | Nombres resaltables. |
| `reacciones` | `ReaccionVista[]` | `[]` | Agrupadas. |
| `resaltado` | `boolean` | `false` | Destello al llegar desde una cita o búsqueda. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-menu` | `{ imensaje, x, y }` | Pide el menú contextual. |
| `av-chat-accion` | `{ accion, imensaje }` | `ir`, `reintentar`, `cancelar-subida`, `ver`. |
| `av-chat-reaccionar` | `{ imensaje, emoji }` | Desde sus reacciones. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-burbuja id="x"></av-chat-burbuja>
<script>x.props = {"mensaje": {"clave": "m2", "id": "m2", "chat": "g1", "autor": "ana", "tipo": "texto", "texto": "El *lunes* arrancamos la fase 2. Revisen https://avatar.odys.co", "ts": "2026-10-30T14:32:00Z", "editado": null, "eliminado": false, "reenviado": false, "respuestaA": null, "adjunto": null, "reacciones": [{"usuario": "beto", "emoji": "👍"}, {"usuario": "carla", "emoji": "❤️"}], "estado": "enviado", "pro;</script>
```
