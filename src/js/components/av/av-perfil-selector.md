---
name: av-perfil-selector
description: Cambia de perfil de prueba; con sesión guardada es directo y sin ella pide el PIN de 4 dígitos.
---

# `<av-perfil-selector>`

Menú de la barra con los perfiles de `perfiles/lista`. El ícono dice si es el activo, si ya tiene sesión guardada o si
pedirá PIN. Tras entrar, el JWT queda en la bóveda de `core/cuentas.ts` y el próximo cambio es directo.

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `perfiles` | `PerfilPrueba[]` | `[]` | Vacío: los pide al API. |
| `activo` | `string` | `''` | Usuario de la sesión de esta pestaña. |

Otro componente pide un cambio con el evento `av-perfil-pedir { usuario }` sobre el selector.
