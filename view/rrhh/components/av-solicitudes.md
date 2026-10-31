---
name: av-solicitudes
description: Solicitudes de vacaciones, permisos y certificados en tarjetas, con filtro por estado y Aprobar / Rechazar (con confirmación).
---

# `<av-solicitudes>`

Solicitudes de vacaciones, permisos y certificados en tarjetas, con filtro por estado y Aprobar / Rechazar (con confirmación).

## Anatomía

```
<av-solicitudes>
  #shadow-root
    <section part="solicitudes">
      <div part="filtros"><iswc-button aria-pressed> <iswc-badge slot="end">×4</div> (no en compacto)
      <div part="lista"><article part="solicitud" data-estado><div class="icono"> cuerpo <div class="acciones"><iswc-button>Aprobar <iswc-button>Rechazar <iswc-popconfirm></div></article>×N | <av-vacio></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `solicitudes` | `SolicitudVista[] \| null` | `null` | Solicitudes con nombre del empleado; null = cargando. |
| `filtro` | `string` | `'pendiente'` | pendiente, aprobada, rechazada o todas. |
| `puedeResolver` | `boolean` | `false` | Muestra Aprobar y Rechazar. |
| `compacto` | `boolean` | `false` | Solo pendientes, sin filtros. |
| `ocupados` | `number[]` | `[]` | Solicitudes resolviéndose. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-solicitudes-filtro` | `{ filtro }` | Clic en un filtro. |
| `av-solicitud-resolver` | `{ isolicitud, accion }` | Aprobar, o Rechazar tras confirmar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-solicitudes></av-solicitudes>
```
