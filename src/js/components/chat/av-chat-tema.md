---
name: av-chat-tema
description: Elige el tema de un chat, predefinido o propio con dos colores y ángulo.
---

# `<av-chat-tema>`

Va en la info del chat. El tema es de la conversación: lo cambia cualquier integrante y lo ven todos al instante.

Emite `av-chat-tema { tema }`.

## Anatomía

```
<av-chat-tema>
  #shadow-root
    <section part="tema">
      <iswc-heading>Tema del chat
      muestras con iswc-button
      <iswc-details> dos iswc-color-picker, ángulo y Aplicar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `tema` | `TemaChat \| null` | `null` | `null` es el tema de la app. |

## Eventos

| Evento | Detalle |
| --- | --- |
| `av-chat-tema` | `{ tema }`: `null` vuelve al tema de la app. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```ts
tema.props = { tema: { id: 'propio', color1: '#2563eb', color2: '#7c3aed', angulo: 135 } };
```
