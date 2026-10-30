---
name: av-empresa-selector
description: Selector de la empresa activa del usuario (iswc-select con sus empresas). Escribe el estado y emite av-empresa-cambio.
---

# `<av-empresa-selector>`

Vive en la barra (`slot="actions"` del shell). Un usuario con varias empresas elige con cuál trabaja; las vistas
privadas filtran por la empresa activa.

## Anatomía

```
<av-empresa-selector>
  #shadow-root
    <iswc-select part="selector"><iswc-option>…</iswc-select>   | <iswc-tag>Sin empresa</iswc-tag>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `empresas` | `{ iempresa, nombre, rol }[]` | `[]` | Empresas del usuario (de `empresas/yo`). |
| `activa` | `number \| null` | `null` | La seleccionada. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-empresa-cambio` | `{ iempresa }` | Al elegir otra empresa (también escribe `estado.empresa`). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-empresa-selector id="s"></av-empresa-selector>
<script>s.props = { empresas: [{ iempresa: 1, nombre: 'Avatar Demo', rol: 'admin' }], activa: 1 };</script>
```
