---
name: av-cabecera
description: Cabecera de página de una vista: ícono, título, subtítulo y slot de acciones. Todas las vistas privadas la usan.
---

# `<av-cabecera>`

La fila superior de una vista: título con ícono, subtítulo y los botones de la vista a la derecha.

## Anatomía

```
<av-cabecera>
  #shadow-root
    <header part="cabecera">
      <h1 part="titulo"><iswc-icon> título</h1> <p part="subtitulo">
      <div part="acciones"><slot name="acciones"></slot></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `titulo` | `string` | `''` | Título. |
| `subtitulo` | `string` | `''` | Línea secundaria. |
| `icono` | `string` | `''` | Id Iconify (`mdi:…`). |

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Uso |
| --- | --- |
| `acciones` | Botones de la vista (`iswc-button`). |

## Ejemplos

```html
<av-cabecera id="c"><iswc-button slot="acciones">Nuevo</iswc-button></av-cabecera>
<script>c.props = { titulo: 'Proyectos', subtitulo: 'Tableros kanban', icono: 'mdi:view-column-outline' };</script>
```
