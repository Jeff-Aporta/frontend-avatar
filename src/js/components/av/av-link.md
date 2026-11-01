---
name: av-link
description: Enlace interno sin recarga: href real, precarga al pasar por encima y estado activo.
---

# `<av-link>`

Enlace interno sin recarga: href real, precarga al pasar por encima y estado activo.

## Anatomía

```
<av-link>
  #shadow-root
    <a part="enlace" href><slot></a>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `vista` | `string` | `''` | Vista de la tabla de rutas (también por atributo). |
| `registro` | `string \| null` | `null` | Parte o registro. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-link></av-link>
```
