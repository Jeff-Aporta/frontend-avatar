---
name: av-correo-lector
description: Panel de lectura de un correo con acciones (responder, reenviar, destacar, no leído, archivar, papelera) y relacionados que se ocultan si no hay.
---

# `<av-correo-lector>`

Panel de lectura de un correo con acciones (responder, reenviar, destacar, no leído, archivar, papelera) y relacionados que se ocultan si no hay.

## Anatomía

```
<av-correo-lector>
  #shadow-root
    <article part="lector">
      <header part="cabeza"><div part="barra" role="toolbar"><iswc-button>…</div> <h2 part="asunto"> <iswc-tag>… <div part="meta"><iswc-person> <iswc-relative-time></div> <dl class="para"></header>
      <div part="cuerpo"> <section part="relacionados"> (si hay) <iswc-callout> (sin permiso)
    | <iswc-empty-state> (sin correo)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `correo` | `CorreoBandeja \| null` | `null` | Correo abierto. |
| `nombres` | `Record<string, string>` | `{}` | Nombre por usuario. |
| `puedeMarcar` | `boolean` | `false` | Habilita responder y ordenar. |
| `relacionados` | `{ ibuzon, asunto, remitente, creado }[]` | `[]` | Misma conversación o parecidos; vacío = sección oculta. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-correo-responder` | `{ ibuzon, todos }` | Responder / a todos. |
| `av-correo-reenviar` | `{ ibuzon }` | Reenviar. |
| `av-correo-marcar` | `{ ibuzon, cambios }` | Destacar, no leído o mover de carpeta. |
| `av-correo-abrir` | `{ ibuzon }` | Clic en un relacionado. |
| `av-correo-cerrar` | `{}` | Volver a la lista (pantallas angostas). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-correo-lector></av-correo-lector>
```
