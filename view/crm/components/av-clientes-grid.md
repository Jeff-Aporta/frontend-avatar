---
name: av-clientes-grid
description: Tabla de clientes del CRM (iswc-data-grid) con búsqueda rápida y paginación; clic en una fila emite av-cliente-abrir.
---

# `<av-clientes-grid>`

Lista los clientes filtrados. Sin filas muestra `iswc-empty-state`.

## Anatomía

```
<av-clientes-grid>
  #shadow-root
    <iswc-data-grid id="grid" part="grid" quick-filter show-toolbar pagination> | <iswc-empty-state>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `clientes` | `Cliente[]` | `[]` | Filas. |
| `cargando` | `boolean` | `false` | Indicador de carga del grid. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-cliente-abrir` | `{ icliente }` | Clic en una fila (kit `iswc-row-click`). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-clientes-grid id="g"></av-clientes-grid>
<script>g.props = { clientes: [{ icliente: 1, iempresa: 1, nombre: 'Juan Pérez', etapa: 'contacto', valor: 5200 }] };</script>
```
