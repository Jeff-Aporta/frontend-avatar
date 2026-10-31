---
name: av-correo-redactar
description: Diálogo para redactar, responder o reenviar un correo interno (destinatarios, CC, asunto, etiquetas, mensaje) validado con Zod.
---

# `<av-correo-redactar>`

Diálogo para redactar, responder o reenviar un correo interno (destinatarios, CC, asunto, etiquetas, mensaje) validado con Zod.

## Anatomía

```
<av-correo-redactar>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-select id="para" multiple> <iswc-select id="cc" multiple> <iswc-input id="asunto"> <iswc-input id="etiquetas"> <iswc-textarea id="cuerpo"> <iswc-callout></div>
      <iswc-button slot="footer">Cancelar · Enviar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `borrador` | `{ destinatarios, cc, asunto, cuerpo, etiquetas, respuesta_a }` | `vacío` | Valores iniciales. |
| `miembros` | `MiembroCorreo[]` | `[]` | Destinatarios posibles. |
| `yo` | `string` | `''` | Usuario actual (no se ofrece como destinatario). |
| `ocupado` | `boolean` | `false` | Botón Enviar cargando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-correo-enviar` | `{ datos: CorreoDatos }` | Enviar con campos válidos. |
| `av-correo-redactar-error` | `{ mensaje }` | Faltan campos. |
| `av-correo-redactar-cerrar` | `{}` | Cancelar o cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-correo-redactar></av-correo-redactar>
```
