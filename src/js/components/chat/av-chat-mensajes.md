---
name: av-chat-mensajes
description: La conversación: días, ráfagas, línea de no leídos, carga de anteriores sin saltar, «bajar» con contador, fijado y menú contextual; reconcilia por clave.
---

# `<av-chat-mensajes>`

Mensajes agrupados con burbujas reconciliadas (sin parpadeo).

## Anatomía

```
<av-chat-mensajes>
  #shadow-root
    <section part="conversacion"><iswc-button class="fijado"> <div part="scroll"><div class="items" role="log"><div class="dia"> <div class="noleidos"> <av-chat-burbuja>…</div></div> <iswc-button class="bajar"> <div class="anuncio" aria-live> <iswc-dropdown class="menu"></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `chat` | `Chat \| null` | `null` | Chat abierto. |
| `mensajes` | `MensajeChat[]` | `[]` | Del más viejo al más nuevo. |
| `yo` | `string` | `''` | Usuario de la sesión. |
| `autores` | `Record<id, { nombre, color }>` | `{}` | Nombres y colores. |
| `primerNoLeido` | `string \| null` | `null` | Clave del primero sin leer. |
| `hayMas` | `boolean` | `false` | Hay anteriores. |
| `cargandoAnteriores` | `boolean` | `false` | Spinner arriba. |
| `resaltar` | `string \| null` | `null` | Lleva a ese mensaje y lo resalta. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-accion` | `{ accion, imensaje }` | Del menú o de una burbuja. |
| `av-chat-reaccionar` | `{ imensaje, emoji }` | Reacción rápida. |
| `av-chat-cargar-anteriores` | `{ icanal }` | Llegó arriba. |
| `av-chat-al-fondo` | `—` | Volvió abajo. |
| `av-chat-soltar` | `{ archivos }` | Soltó archivos encima. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-mensajes id="x"></av-chat-mensajes>
<script>x.props = {"chat": {"id": "g1", "tipo": "grupo", "nombre": "Equipo Odys", "descripcion": "Coordinación", "foto": null, "miembros": [{"id": "ana", "rol": "admin"}, {"id": "beto", "rol": "miembro"}, {"id": "carla", "rol": "miembro"}], "fijado": false, "silenciado": false, "archivado": false, "marcadoNoLeido": false, "noLeidos": 0, "mensajeFijado": "m2", "actividad": "2026-10-30T15:00:00.000Z", "creado": "2026;</script>
```
