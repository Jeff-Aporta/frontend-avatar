---
name: av-notificaciones
description: Tarjeta con las notificaciones del usuario y «Marcar leídas» (emite av-notificaciones-leer).
---

# `<av-notificaciones>`

Las últimas notificaciones (invitaciones, tareas movidas…), las no leídas con contador.

## Anatomía

```
<av-notificaciones>
  #shadow-root
    <iswc-card part="tarjeta"><iswc-button class="leer" slot="header-actions"><ul part="lista"><li data-leida>…</li></ul> | <av-vacio></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `Notificacion[]` | `[]` | De `notificaciones/mias`. |
| `cargando` | `boolean` | `false` | Muestra el estado de carga. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-notificaciones-leer` | `{ ids: number[] }` | «Marcar leídas» (vacío = todas). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-notificaciones id="n"></av-notificaciones>
<script>n.props = { items: [{ inotificacion: 1, iusuario: 'beto', tipo: 'tarea', titulo: 'TK-000001 → Hecho', cuerpo: 'Definir modelo', leida: false, creado: new Date().toISOString() }] };</script>
```
