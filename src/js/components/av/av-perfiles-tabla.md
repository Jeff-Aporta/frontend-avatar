---
name: av-perfiles-tabla
description: Diálogo con usuario, nombre, rol y PIN sin hash de los perfiles de prueba.
---

# `<av-perfiles-tabla>`

Se abre desde el pie. Los PIN son públicos a propósito hasta tener MVP.

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `perfiles` | `PerfilPrueba[]` | `[]` | Filas de la tabla. |

Emite `av-perfil-usar { usuario }` y `av-perfiles-cerrar`.
