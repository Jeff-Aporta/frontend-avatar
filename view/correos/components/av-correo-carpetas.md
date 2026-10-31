---
name: av-correo-carpetas
description: Navegación de carpetas del buzón (entrada, enviados, archivados, papelera) con conteos; clic emite av-correos-carpeta.
---

# `<av-correo-carpetas>`

Navegación de carpetas del buzón (entrada, enviados, archivados, papelera) con conteos; clic emite av-correos-carpeta.

## Anatomía

```
<av-correo-carpetas>
  #shadow-root
    <nav part="carpetas">
      <iswc-button class="carpeta" data-carpeta aria-current> <iswc-icon slot="start"> nombre <iswc-badge slot="end"> | total </iswc-button>×4
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `carpetas` | `{ carpeta, label, icono, total, noLeidos }[]` | `[]` | Carpetas en orden con su conteo. |
| `activa` | `string` | `'entrada'` | Carpeta abierta. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-correos-carpeta` | `{ carpeta }` | Clic en una carpeta. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-correo-carpetas></av-correo-carpetas>
```
