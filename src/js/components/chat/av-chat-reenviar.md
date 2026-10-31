---
name: av-chat-reenviar
description: Diálogo para reenviar un mensaje a uno o varios chats.
---

# `<av-chat-reenviar>`

Reenviar a varios chats.

## Anatomía

```
<av-chat-reenviar>
  #shadow-root
    <iswc-dialog><iswc-input class="q"> <div class="chats"><label class="fila"><iswc-checkbox></label>…</div> <iswc-button slot="footer" class="enviar"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible. |
| `ref` | `string \| null` | `null` | Mensaje a reenviar. |
| `chats` | `ItemChat[]` | `[]` | Destinos posibles. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-reenviar` | `{ imensaje, chats }` | Reenviar. |
| `av-chat-panel-cerrar` | `{ panel }` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-reenviar id="x"></av-chat-reenviar>
<script>x.props = {"ref": "m1", "chats": [{"id": "d1", "tipo": "directo", "nombre": "Beto Ruiz", "foto": null, "iniciales": "BR", "color": 2, "ultimo": "Nos vemos el lunes", "autorUltimo": "", "hora": "10:42", "marca": null, "noLeidos": 0, "fijado": false, "silenciado": false, "archivado": false, "marcadoNoLeido": false, "escribiendo": "", "enLinea": false}, {"id": "g1", "tipo": "grupo", "nombre": "Equipo Odys", "f;</script>
```
