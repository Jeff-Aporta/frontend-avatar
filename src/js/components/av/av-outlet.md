---
name: av-outlet
description: Punto de montaje de la vista de la ruta actual.
---

# `<av-outlet>`

Punto de montaje de la vista de la ruta actual.

## Anatomía

```
<av-outlet>
  #shadow-root
    <slot> (el shell de la vista)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `vista` | `string` | `''` | Vista a montar. |
| `id` | `string \| null` | `null` | Parte o registro. |
| `sesion` | `boolean` | `false` | Hay sesión. |
| `version` | `number` | `0` | Subirla remonta la vista. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-outlet></av-outlet>
```
