---
name: av-inicio
description: Shell de la landing pública: hero, características, precios y pie; enruta los botones de sus hijos.
---

# `<av-inicio>`

La página pública (`#/`). Sus hijos emiten `av-inicio-ir { vista }` y este shell navega.

## Anatomía

```
<av-inicio>
  #shadow-root
    <div part="pagina"><av-hero> <av-caracteristicas> <av-precios> <footer part="pie"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `sesion` | `boolean` | `false` | Con sesión, el hero ofrece «Ir al panel». |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-inicio></av-inicio>
```
