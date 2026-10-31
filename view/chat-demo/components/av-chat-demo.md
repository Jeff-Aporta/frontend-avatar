---
name: av-chat-demo
description: Shell de la vista chat-demo: el chat con el backend de memoria, «hablar como», otra pestaña, reiniciar y (con sesión) API real.
---

# `<av-chat-demo>`

El demo en vivo del chat (abre otra pestaña para conversar en tiempo real).

## Anatomía

```
<av-chat-demo>
  #shadow-root
    <div part="demo"><header part="barra"><av-logo> <iswc-select class="como"> <iswc-button class="otra"> <iswc-button class="reiniciar"> <iswc-switch class="api"> <iswc-theme-toggle></header><av-chat></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `como` | `string \| null` | `null` | Persona (`?como=`); sin valor, la primera libre. |
| `id` | `string \| null` | `null` | Chat a abrir (lo da el router). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-demo id="x"></av-chat-demo>
<script>x.props = {"como": "ana"};</script>
```
