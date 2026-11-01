---
name: av-logo
description: Logo de Avatar en SVG en línea, teñido con los tokens de la paleta, con nombre opcional y satélite en órbita.
---

# `<av-logo>`

Hexágono de neón con un monograma «A» cuya barra es un nodo de red y una órbita con un satélite (el asistente AVO).
Los colores salen de `--iswc-color-brand-stronger`, `--iswc-color-contrast` y `--iswc-accent`: cambia con la paleta.
Todas las medidas en em: escala con el font-size del contexto.

## Anatomía

```
<av-logo>
  #shadow-root
    <span part="logo" role="img" aria-label="Avatar">
      <svg part="marca"> hexágono · monograma · órbita · satélite
      <span part="nombre">Avatar</span>   (con wordmark)
```

## Atributos observados

<!-- exclude: Atributos observados -->

`wordmark` y `animado` como atributos booleanos equivalen a las props.

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `wordmark` | `boolean` | `false` | Agrega el nombre «Avatar» en Orbitron. |
| `animado` | `boolean` | `false` | El satélite orbita (respeta `prefers-reduced-motion`). |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-logo wordmark animado></av-logo>
```
