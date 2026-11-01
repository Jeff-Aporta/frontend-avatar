---
name: av-perfiles-lista
description: Lista única de perfiles de prueba; el clic entra con ese perfil.
---

# `<av-perfiles-lista>`

Una fila por perfil de `perfiles/lista`: nombre, rol y PIN público. El clic emite `av-perfil-elegir { usuario, fin }` en
`window` y `<av-perfil-selector>` resuelve la entrada. Se usa en la barra, en `/acceso/` y en el diálogo del pie.

## Anatomía

```
<av-perfiles-lista>
  #shadow-root
    <div part="lista">
      <iswc-button part="fila"><iswc-person> y <code slot="end"> con el PIN … una por perfil
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `perfiles` | `PerfilPrueba[]` | `[]` | Vacío: los pide al API. |
| `activo` | `string` | `''` | Perfil en uso: su fila queda deshabilitada. |
| `ocupado` | `string` | `''` | Perfil entrando: fila con spinner y el resto deshabilitado. |
| `error` | `string` | `''` | Fallo al pedir la lista. |

## Eventos

| Evento | Dónde | Detalle |
| --- | --- | --- |
| `av-perfil-usar` | en el host | `{ usuario }` |
| `av-perfil-elegir` | en `window` | `{ usuario, fin }`: `fin` quita el estado ocupado. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-perfiles-lista id="lista"></av-perfiles-lista>
```
