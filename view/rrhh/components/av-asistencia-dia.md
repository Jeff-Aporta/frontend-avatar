---
name: av-asistencia-dia
description: Control de asistencia de una fecha: contadores por estado y una fila por empleado con marcas rápidas (presente, retardo, ausente, vacaciones) y salida.
---

# `<av-asistencia-dia>`

Control de asistencia de una fecha: contadores por estado y una fila por empleado con marcas rápidas (presente, retardo, ausente, vacaciones) y salida.

## Anatomía

```
<av-asistencia-dia>
  #shadow-root
    <iswc-card part="tarjeta">
      <div part="barra"><iswc-input class="fecha" type="date"> <div part="conteo"><span class="contador" data-estado>×5</div></div>
      <div part="lista"><div part="fila" data-estado aria-busy><iswc-avatar> quien <iswc-tag> horas <div class="botones"><iswc-button>×4 [Salida]</div></div>×N</div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `fecha` | `string` | `''` | Fecha `YYYY-MM-DD` (vacío = hoy). |
| `filas` | `FilaAsistencia[]` | `[]` | Empleados vigentes con su marca. |
| `cargando` | `boolean` | `false` | Esqueletos. |
| `puedeMarcar` | `boolean` | `false` | Habilita los botones. |
| `ocupados` | `number[]` | `[]` | Empleados con una marca en curso. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-asistencia-fecha` | `{ fecha }` | Cambio de fecha. |
| `av-asistencia-marcar` | `{ iempleado, estado, fecha, entrada, salida }` | Botón de estado o Salida. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-asistencia-dia></av-asistencia-dia>
```
