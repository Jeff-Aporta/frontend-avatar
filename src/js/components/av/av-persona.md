---
name: av-persona
description: Un usuario en línea: avatar con iniciales, nombre (o id) y un detalle. Para mensajes, miembros, tareas y comentarios.
---

# `<av-persona>`

Identidad visual de un usuario. Sin imagen: iniciales del nombre (o del id) en un `iswc-avatar`.

## Anatomía

```
<av-persona>
  #shadow-root
    <span part="persona"><iswc-avatar part="avatar"> <span part="nombre"> <span part="detalle"></span>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `iusuario` | `string` | `''` | Id del usuario (respaldo del nombre). |
| `nombre` | `string \| null` | `null` | Nombre visible. |
| `detalle` | `string` | `''` | Rol, cargo u hora. |
| `compacto` | `boolean` | `false` | Solo el avatar (el nombre va en `title`). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-persona id="p"></av-persona>
<script>p.props = { iusuario: 'ana', nombre: 'Ana Gestora', detalle: 'Gestora' };</script>
```
