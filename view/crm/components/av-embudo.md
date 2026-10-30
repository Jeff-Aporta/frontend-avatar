---
name: av-embudo
description: Embudo CRM en tarjetas por etapa (conteo y valor); clic filtra la tabla (emite av-crm-filtrar).
---

# `<av-embudo>`

Contacto · Propuesta · Negociación · Cerrado · Perdido, cada una con su cantidad y suma de valor.

## Anatomía

```
<av-embudo>
  #shadow-root
    <div part="fila"><iswc-button class="etapa" data-etapa aria-pressed>label, cantidad, valor</iswc-button>×5</div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `etapas` | `{ etapa, label, cantidad, valor }[]` | `[]` | Totales por etapa. |
| `activa` | `string \| null` | `null` | Etapa filtrada. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-crm-filtrar` | `{ etapa: string \| null }` | Clic en una etapa (en la activa: `null`). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-embudo id="e"></av-embudo>
<script>e.props = { etapas: [{ etapa: 'contacto', label: 'Contacto', cantidad: 2, valor: 9000 }] };</script>
```
