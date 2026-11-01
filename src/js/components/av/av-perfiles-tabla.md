---
name: av-perfiles-tabla
description: Diálogo con usuario, nombre, rol y PIN sin hash de los perfiles de prueba.
---

# `<av-perfiles-tabla>`

Se abre desde el pie. Los PIN son públicos a propósito hasta tener MVP.

Muestra `<av-perfiles-lista>` (una sola lista en toda la app, sin grilla). Emite `av-perfiles-cerrar`.

## Anatomía

```
<av-perfiles-tabla>
  #shadow-root
    <iswc-dialog>
      <av-perfiles-lista>
      <iswc-button slot="footer">Cerrar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |

## Eventos

| Evento | Detalle |
| --- | --- |
| `av-perfiles-cerrar` | `{}` |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```ts
tabla.props = { abierto: true };
```
