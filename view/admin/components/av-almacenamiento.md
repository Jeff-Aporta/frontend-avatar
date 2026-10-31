---
name: av-almacenamiento
description: Límite de tamaño por archivo y uso del almacenamiento en R2.
---

# `<av-almacenamiento>`

Pestaña de Administración. El límite se guarda en `avatar_ajustes` y aplica a la siguiente subida.

| Prop | Tipo | Defecto |
| --- | --- | --- |
| `maxMb` | `number` | `30` |
| `topeMb` | `number` | `95` |
| `archivos` | `number \| null` | `null` |
| `bytes` | `number \| null` | `null` |
| `ocupado` | `boolean` | `false` |

Emite `av-almacenamiento-guardar { max_mb }`.
