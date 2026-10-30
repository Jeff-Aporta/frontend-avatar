---
name: av-mensaje
description: Un mensaje del chat: avatar del autor, burbuja con el texto y hora relativa; propio a la derecha, sistema centrado.
---

# `<av-mensaje>`

Burbuja de conversación.

## Anatomía

```
<av-mensaje>
  #shadow-root
    <article part="mensaje" data-propio><av-persona compacto> <div part="burbuja"><p> <span class="meta"><iswc-relative-time></span></div></article>
    | <div part="sistema"><iswc-tag>texto</iswc-tag></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `mensaje` | `Mensaje \| null` | `null` | POJO del mensaje con `autor`. |
| `propio` | `boolean` | `false` | Alinea a la derecha. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-mensaje id="m"></av-mensaje>
<script>m.props = { mensaje: { imensaje: 1, icanal: 1, iusuario: 'ana', contenido: 'Hola equipo', creado: new Date().toISOString(), autor: { iusuario: 'ana', nombre: 'Ana' } } };</script>
```
