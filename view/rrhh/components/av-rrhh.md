---
name: av-rrhh
description: Shell de RRHH: KPIs, gráficas, empleados, control de asistencia con historial y solicitudes con aprobar/rechazar; habla con el API.
---

# `<av-rrhh>`

Shell de RRHH: KPIs, gráficas, empleados, control de asistencia con historial y solicitudes con aprobar/rechazar; habla con el API.

## Anatomía

```
<av-rrhh>
  #shadow-root
    <div part="pagina"><iswc-page-header> <iswc-callout> (sin permiso) <iswc-stat-group id="kpis">
      <iswc-tab-group><iswc-tab>×4
        general: <av-rrhh-grafica> <av-solicitudes compacto> · empleados: <av-tabla>
        asistencia: <av-asistencia-dia> <av-tabla> · solicitudes: <av-solicitudes></iswc-tab-group>
      <av-empleado-form> <av-solicitud-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Pestaña inicial: general, empleados, asistencia o solicitudes. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-rrhh></av-rrhh>
```
