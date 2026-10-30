---
name: av-comunidad
description: «Únete a nuestra comunidad»: constelación de personas que aparecen por turnos, título, texto y cifras.
---

# `<av-comunidad>`

«Únete a nuestra comunidad»: constelación de personas que aparecen por turnos, título, texto y cifras.

## Anatomía

Shadow DOM con piezas del kit (`iswc-*`); hoja hermana `av-comunidad.css`. Todas las medidas en `em`: escala con el `font-size` del contexto.

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Qué hace |
| --- | --- | --- |
| `titulo` | `string` | Título. |
| `texto` | `string` | Texto. |
| `personas` | `string[]` | URLs de fotos (carga perezosa). |
| `cifras` | `{ valor, etiqueta }[]` | Cifras destacadas. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-comunidad id="x"></av-comunidad>
```
