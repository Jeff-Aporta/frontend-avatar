---
name: av-canal-lista
description: Columna de canales con ícono por tipo, último mensaje y badge de no leídos; emite av-canal-elegido y av-canal-nuevo.
---

# `<av-canal-lista>`

La columna izquierda de la vista `canales`. Ordena con no leídos arriba.

## Anatomía

```
<av-canal-lista>
  #shadow-root
    <nav part="lista"><header><iswc-button class="nuevo"></header><ul><li part="fila" data-activo><iswc-button>…<iswc-badge slot="end"></li></ul> | <av-vacio></nav>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `canales` | `CanalMio[]` | `[]` | De `canales/mios`. |
| `activo` | `number \| null` | `null` | Canal seleccionado. |
| `cargando` | `boolean` | `false` | Esqueletos si no hay canales aún. |
| `puedeCrear` | `boolean` | `false` | Muestra «Nuevo». |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-canal-elegido` | `{ icanal }` | Clic en una fila. |
| `av-canal-nuevo` | `{}` | Clic en «Nuevo». |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-canal-lista id="l"></av-canal-lista>
<script>l.props = { canales: [{ icanal: 1, iempresa: 1, iequipo: null, nombre: 'general', tipo: 'publico', descripcion: null, sin_leer: 2, ultimo: null }], activo: 1 };</script>
```
