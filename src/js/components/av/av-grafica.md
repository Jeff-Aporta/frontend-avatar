---
name: av-grafica
description: Tarjeta con una gráfica de barras o dona del kit, su título y sus estados de carga y vacío. Los componentes de vista solo traducen datos a `config`.
---

# `<av-grafica>`

La tarjeta que comparten el panel, finanzas y RRHH. No sabe de dominio: recibe la `config` del kit ya armada. Un
refresco con el mismo título y tipo reasigna `config` sin rehacer la gráfica.

La vista que la usa declara `iswc-bar-chart` o `iswc-doughnut-chart` en `VIEW_KIT_TAGS`.

## Anatomía

```
<av-grafica>
  #shadow-root
    <iswc-card part="tarjeta">
      <strong slot="header">ícono, título y detalle</strong>
      <slot name="acciones" slot="header-actions">
      <iswc-bar-chart part="grafica"> o <iswc-doughnut-chart part="grafica"> o <iswc-empty-state>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `tipo` | `'barras' \| 'dona'` | `'barras'` | Gráfica del kit que pinta. |
| `titulo` | `string` | `''` | Título de la tarjeta. |
| `icono` | `string` | `'mdi:chart-bar'` | Ícono del título. |
| `detalle` | `string` | `''` | Texto corto a la derecha del título, en una línea. |
| `etiqueta` | `string` | `''` | Texto accesible de la gráfica; sin él, el título. |
| `leyenda` | `boolean` | `true` | Leyenda debajo de la gráfica. |
| `config` | `object \| null` | `null` | `config` de la gráfica; `null` pinta el estado de abajo. |
| `cargando` | `boolean` | `false` | Sin `config`: carga en vez de vacío. |
| `vacio` | `{ icono, titulo, texto }` | `Sin datos` | Estado vacío. |

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Qué va |
| --- | --- |
| `acciones` | Tag o botón a la derecha de la cabecera. |

## Ejemplos

```ts
grafica.props = {
  tipo: 'dona',
  titulo: 'Tareas por estado',
  icono: 'mdi:chart-donut',
  config: { data: { labels: ['Abiertas', 'Cerradas'], datasets: [{ label: 'Tareas', data: [4, 9] }] } },
};
```
