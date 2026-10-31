---
name: av-chat-compositor
description: Redactor: Enter envía, crece hasta 6 líneas, emojis, cita o edición, adjuntos (botón, pegar, soltar) con vista previa y nota de voz con onda.
---

# `<av-chat-compositor>`

Escribe, adjunta o graba una nota de voz.

## Anatomía

```
<av-chat-compositor>
  #shadow-root
    <div part="compositor"><div class="panel-emojis"><av-chat-emojis></div> <div class="contexto"> <div class="adjuntos"><av-chat-adjunto modo=previa>…</div> <div class="barra"><iswc-button emoji/adjuntar> <iswc-textarea> <iswc-button enviar|micrófono></div> <div class="grabacion"><canvas></div></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `chat` | `string \| null` | `null` | Chat (guarda un borrador por chat). |
| `respuesta` | `CitaVista \| null` | `null` | Cita arriba. |
| `edicion` | `{ ref, texto } \| null` | `null` | Editando. |
| `deshabilitado` | `boolean` | `false` | Sin escribir. |
| `motivo` | `string` | `''` | Por qué está deshabilitado. |

Métodos en el host: `agregar(files)` (adjuntar desde fuera) y `enfocar()`.

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-enviar` | `{ contenido, respuesta_a, archivos, nota? }` | Enviar. |
| `av-chat-escribiendo` | `{ modo }` | `texto`, `audio` o `null`. |
| `av-chat-accion` | `{ accion, imensaje?, texto? }` | `editar-guardar` o `cancelar`. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-compositor id="x"></av-chat-compositor>
<script>x.props = {"chat": "g1", "respuesta": {"ref": "m2", "autor": "Ana Torres", "color": 1, "texto": "El lunes arrancamos la fase 2", "miniatura": null}};</script>
```
