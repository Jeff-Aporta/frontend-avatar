---
name: av-chat-llamada
description: Llamada de voz o video: entrante con aceptar/rechazar, saliente, y activa con mosaico, quién habla, duración y controles.
---

# `<av-chat-llamada>`

Capa de llamada (los flujos van por propiedades, no por props).

## Anatomía

```
<av-chat-llamada>
  #shadow-root
    <div part="capa" data-fase><div class="tarjeta"><div class="aviso-llamada"> <div class="mosaico"><div class="ficha"><video>…</div> <video class="propio"> <div class="controles">…</div></div></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `fase` | `'entrante' \| 'saliente' \| 'activa' \| null` | `null` | Sin fase no se ve. |
| `medio` | `'voz' \| 'video'` | `'voz'` | Tipo. |
| `chatNombre` | `string` | `''` | Chat. |
| `de` | `string` | `''` | Quién llama. |
| `iniciales, color` | `—` | `—` | Foto. |
| `participantes` | `ParticipanteVista[]` | `[]` | Fichas. |
| `inicio` | `number \| null` | `null` | Para la duración. |
| `mic, cam, pantalla, hablando` | `boolean` | `—` | Estado local. |
| `aviso` | `string` | `''` | Sin cámara, medio simulado… |
| `rev` | `number` | `0` | Súbela al cambiar los flujos. |

Propiedades `flujos: Map<front, MediaStream>`, `local` y `pantallaLocal` (MediaStream) las asigna el shell.

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-llamada-accion` | `{ accion }` | `aceptar`, `rechazar`, `colgar`, `mic`, `cam`, `pantalla`, `video`. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-llamada id="x"></av-chat-llamada>
<script>x.props = {"fase": null, "medio": "video", "chatNombre": "Equipo Odys", "de": "Beto Ruiz", "iniciales": "BR", "color": 3};</script>
```
