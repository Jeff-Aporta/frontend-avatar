---
name: av-almacenamiento
description: Límite de tamaño por archivo y uso del almacenamiento en R2.
---

# `<av-almacenamiento>`

Pestaña de Administración. El límite se guarda en `avatar_ajustes` y aplica a la siguiente subida.

Emite `av-almacenamiento-guardar { max_mb }`.

## Anatomía

```
<av-almacenamiento>
  #shadow-root
    <iswc-card part="tarjeta">
      <iswc-input id="limite"> tamaño máximo por archivo
      uso actual con iswc-format-bytes
      <iswc-button> Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Defecto |
| --- | --- | --- |
| `maxMb` | `number` | `30` |
| `topeMb` | `number` | `95` |
| `archivos` | `number \| null` | `null` |
| `bytes` | `number \| null` | `null` |
| `ocupado` | `boolean` | `false` |

## Eventos

| Evento | Detalle |
| --- | --- |
| `av-almacenamiento-guardar` | `{ max_mb }` |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```ts
almacenamiento.props = { maxMb: 30, archivos: 120, bytes: 52428800 };
```
