---
name: av-redactor
description: Caja para escribir un mensaje (iswc-textarea con autosize + botón). Enter envía, Shift+Enter salto; emite av-mensaje-enviar.
---

# `<av-redactor>`

El pie de la conversación.

## Anatomía

```
<av-redactor>
  #shadow-root
    <div part="redactor"><iswc-textarea id="area" part="area"> <iswc-button id="enviar"></div> <p class="aviso">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `deshabilitado` | `boolean` | `false` | Sin permiso de escribir. |
| `enviando` | `boolean` | `false` | Botón en carga. |
| `placeholder` | `string` | texto de ayuda | Placeholder. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-mensaje-enviar` | `{ contenido }` | Enter o botón, con texto no vacío (≤ 4000). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-redactor></av-redactor>
```
