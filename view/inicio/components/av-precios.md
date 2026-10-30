---
name: av-precios
description: Planes y precios de Avatar en tarjetas; el destacado resalta. «Suscribirse» lleva al acceso.
---

# `<av-precios>`

Sección «Planes y precios» de la landing (mensual, anual, 3 años).

## Anatomía

```
<av-precios>
  #shadow-root
    <section part="seccion"><h2> <div part="rejilla"><iswc-card class="plan">precio, lista, <iswc-button slot="footer"></iswc-card>×n</div></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `planes` | `{ id, titulo, precio, periodo, destacado, incluye[] }[]` | `[]` | Planes. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-inicio-ir` | `{ vista: 'acceso', plan }` | Al pulsar «Suscribirse». |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-precios id="p"></av-precios>
<script>p.props = { planes: [{ id: 'mensual', titulo: 'Mensual', precio: '$100 USD', periodo: 'por mes', destacado: false, incluye: ['Todo'] }] };</script>
```
