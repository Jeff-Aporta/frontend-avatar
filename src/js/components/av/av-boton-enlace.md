---
name: av-boton-enlace
description: Botón del kit que navega con URL real y sin recarga.
---

# `<av-boton-enlace>`

Botón del kit que navega con URL real y sin recarga.

## Anatomía

```
<av-boton-enlace>
  #shadow-root
    <iswc-button part="boton" href><slot></iswc-button>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `vista` | `string` | `''` | Vista de destino. |
| `registro` | `string \| null` | `null` | Parte o registro. |
| `variant` | `string` | `'outlined compact'` | Variante del botón. |
| `color` | `string` | `'brand'` | Color del botón. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-boton-enlace></av-boton-enlace>
```
