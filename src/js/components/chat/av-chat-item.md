---
name: av-chat-item
description: Una fila de la lista: foto con presencia, nombre, hora, marcas, vista previa, no leídos y menú (fijar, silenciar, archivar, no leído).
---

# `<av-chat-item>`

Fila de chat con su menú de preferencias.

## Anatomía

```
<av-chat-item>
  #shadow-root
    <div part="fila"><span class="foto"><iswc-avatar> <span class="presencia"></span> <span class="cuerpo">nombre · hora / previa · contador</span> <iswc-dropdown class="menu"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `chat` | `ItemChat \| null` | `null` | La fila. |
| `activo` | `boolean` | `false` | Resaltada. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-abrir` | `{ icanal }` | Se tocó la fila. |
| `av-chat-preferencias` | `{ icanal, fijado? silenciado? archivado? marcadoNoLeido? }` | Desde su menú. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-item id="x"></av-chat-item>
<script>x.props = {"chat": {"id": "d1", "tipo": "directo", "nombre": "Beto Ruiz", "foto": null, "iniciales": "BR", "color": 2, "ultimo": "Nos vemos el lunes", "autorUltimo": "Tú", "hora": "10:42", "marca": "entregado", "noLeidos": 2, "fijado": false, "silenciado": false, "archivado": false, "marcadoNoLeido": false, "escribiendo": "", "enLinea": true}};</script>
```
