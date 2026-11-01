---
name: av-finanzas-hoja
description: Hoja de cuadre con iswc-spreadsheet: vuelca las transacciones y totaliza por moneda con fórmulas.
---

# `<av-finanzas-hoja>`

Hoja de cuadre con `iswc-spreadsheet`: vuelca las transacciones y totaliza por moneda con fórmulas. Es un borrador: lo que se edite no toca los libros ni se guarda.

## Anatomía

```
<av-finanzas-hoja>
  #shadow-root
    <p class="nota">
    <iswc-spreadsheet part="hoja">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `transacciones` | `Transaccion[]` | `[]` | Filas que se vuelcan en la hoja. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-finanzas-hoja></av-finanzas-hoja>
```
