---
name: av-tablero
description: Tablero kanban (iswc-kanban) de un proyecto: columnas y tarjetas con prioridad, vencimiento y asignado; arrastrar mueve, clic abre.
---

# `<av-tablero>`

Pinta el tablero que devuelve `proyecto/{id}/tablero`. No habla con el API: emite lo que el usuario hace.

## Anatomía

```
<av-tablero>
  #shadow-root
    <iswc-kanban part="tablero">
      <iswc-kanban-column data-icolumna title accent badge><iswc-button class="nueva" slot="header-actions">
        <iswc-kanban-card data-itarea heading tag tag-color data-vencida>descripción, etiquetas, <span slot="footer">vence · <av-persona compacto></span>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tablero` | `Tablero \| null` | `null` | Columnas con tareas. |
| `cargando` | `boolean` | `false` | Estado de carga. |
| `puedeMover` | `boolean` | `false` | Habilita arrastre y «+». |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-tarea-mover` | `{ itarea, icolumna, orden }` | Tarjeta soltada en una columna (kit `iswc-kanban-move`). |
| `av-tarea-abrir` | `{ itarea }` | Clic en una tarjeta. |
| `av-tarea-nueva` | `{ icolumna }` | «+» de una columna. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-tablero id="t"></av-tablero>
<script>t.props = { tablero: { iproyecto: 1, nombre: 'Odys', columnas: [{ icolumna: 1, nombre: 'Por hacer', orden: 0, color: '#64748b', limite: null, tareas: [] }] }, puedeMover: true };</script>
```
