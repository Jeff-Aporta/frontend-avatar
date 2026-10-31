---
name: av-asistente
description: Shell del chat con el asistente AVO: historial, preguntas libres, sugerencias como chips y respuesta con datos de la empresa activa.
---

# `<av-asistente>`

Ruta `#/asistente`. Habla con `POST consultas/preguntar` (plugin `avatar` de DER) y carga el historial de `consultas`.

## Anatomía

```
<av-asistente>
  #shadow-root
    <div part="pagina"><iswc-page-header> <section part="chat"><div part="turnos"><av-avo-mensaje>…</div><div part="sugerencias"><iswc-button pill>…</div><div part="redactor"><iswc-textarea id="pregunta"> <iswc-button id="enviar"></div></section></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Id de la ruta (sin uso). |
| `version` | `number` | `0` | Súbela para recargar. |
| `turnos` | `Turno[]` | `[]` | Conversación. |
| `sugerencias` | `string[]` | `[]` | De la última respuesta (vacío = iniciales). |
| `pensando` | `boolean` | `false` | Esperando respuesta. |
| `cargando` | `boolean` | `true` | Cargando el historial. |
| `error` | `string` | `''` | Error de la última pregunta. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-asistente></av-asistente>
```
