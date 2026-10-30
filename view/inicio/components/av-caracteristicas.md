---
name: av-caracteristicas
description: Rejilla de tarjetas con las características principales de Avatar (ícono, título, texto).
---

# `<av-caracteristicas>`

Sección «Características principales» de la landing.

## Anatomía

```
<av-caracteristicas>
  #shadow-root
    <section part="seccion"><h2> <div part="rejilla"><iswc-card>…×n</div></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `{ icono, titulo, texto }[]` | `[]` | Tarjetas. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-caracteristicas id="c"></av-caracteristicas>
<script>c.props = { items: [{ icono: 'mdi:forum-outline', titulo: 'Canales', texto: 'Conversación por equipos.' }] };</script>
```
