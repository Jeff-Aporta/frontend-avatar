---
name: av-chat
description: Chat completo nivel WhatsApp/Telegram: lista, conversación, panel lateral, diálogos, visor y llamadas; habla con un ChatBackend.
---

# `<av-chat>`

Shell del chat: con `demo` usa el backend de memoria (abre otra pestaña de la galería y habla como otra persona).

## Anatomía

```
<av-chat>
  #shadow-root
    <div part="chat">
      <iswc-split-panel class="exterior">
        <av-chat-lista slot="start">
        <iswc-split-panel slot="end" class="interior">
          <div slot="start" part="centro"><av-chat-cabecera> <av-chat-mensajes> <av-chat-compositor></div>
          <div slot="end" part="lateral"><av-chat-info> <av-chat-busqueda></div>
      <av-chat-nuevo> <av-chat-grupo-form> <av-chat-reenviar> <av-chat-visor> <av-chat-llamada> <iswc-dialog id="reaccion">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `titulo` | `string` | `''` | Título de la lista. |
| `chat` | `string \| null` | `null` | Abre ese chat (la ruta del host). |
| `clave` | `string` | `'av-chat'` | Prefijo de lo recordado (tamaños de paneles). |
| `demo` | `string` | `''` | Sin `backend`: backend de memoria hablando como esa persona. |

Propiedad `backend: ChatBackend` (no va en `props`): el backend con el que habla. Método `recargar(abrir?)`.

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-abierto` | `{ icanal }` | Se abrió (o cerró, `null`) un chat. |
| `av-chat-error` | `{ mensaje }` | Falló la carga inicial. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat id="x"></av-chat>
<script>x.props = {"demo": "ana", "titulo": "Chats", "clave": "galeria-av-chat"};</script>
```
