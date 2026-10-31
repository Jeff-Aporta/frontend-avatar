---
name: av-conversor
description: Conversor de monedas con las tasas de la empresa: monto, origen, intercambio y destino; el shell convierte con el API.
---

# `<av-conversor>`

Conversor de monedas con las tasas de la empresa: monto, origen, intercambio y destino; el shell convierte con el API.

## Anatomía

```
<av-conversor>
  #shadow-root
    <iswc-card part="tarjeta">
      <div part="fila"><iswc-input id="monto"> <iswc-select id="de"> <iswc-button class="invertir"> <iswc-select id="a"></div>
      <div part="resultado" aria-live="polite"><span part="cifra"> <span class="tasa"></div>
      <div part="tasas"><iswc-tag> 1 USD = …×N</div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tasas` | `Tasa[]` | `[]` | Tasas a COP de la empresa. |
| `monto` | `number` | `1000` | Monto inicial. |
| `de` | `string` | `'USD'` | Moneda origen. |
| `a` | `string` | `'COP'` | Moneda destino. |
| `resultado` | `Conversion \| null` | `null` | Respuesta de `tasas/convertir`. |
| `ocupado` | `boolean` | `false` | Convirtiendo. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-conversor-convertir` | `{ monto, de, a }` | Cualquier cambio de monto o monedas, o al intercambiar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-conversor></av-conversor>
```
