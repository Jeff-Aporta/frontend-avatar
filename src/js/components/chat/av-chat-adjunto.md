---
name: av-chat-adjunto
description: Archivo adjunto: imagen o video en miniatura (abre el visor) o documento con ícono, nombre, tamaño y descarga; en previa, quitar y motivo.
---

# `<av-chat-adjunto>`

Adjunto de un mensaje o en vista previa.

## Anatomía

```
<av-chat-adjunto>
  #shadow-root
    <div part="adjunto"><button class="miniatura"><img|video></button> | <div part="documento"><iswc-icon> nombre <iswc-format-bytes> <iswc-button descargar></div> <iswc-button class="quitar"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `adjunto` | `Adjunto \| null` | `null` | El archivo. |
| `modo` | `'burbuja' \| 'previa'` | `'burbuja'` | Dónde se ve. |
| `progreso` | `number \| null` | `null` | 0..1 en previa. |
| `propio` | `boolean` | `false` | Alineación. |
| `error` | `string` | `''` | Motivo de rechazo. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-adjunto-ver` | `{ id }` | Abrir a pantalla completa. |
| `av-chat-adjunto-quitar` | `{ id }` | Quitar de la previa. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-adjunto id="x"></av-chat-adjunto>
<script>x.props = {"adjunto": {"id": "a1", "nombre": "propuesta-odys.pdf", "mime": "application/pdf", "bytes": 482133, "url": "data:application/pdf;base64,JVBERi0=", "ancho": null, "alto": null, "duracion": null, "onda": []}};</script>
```
