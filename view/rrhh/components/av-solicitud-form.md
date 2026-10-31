---
name: av-solicitud-form
description: Diálogo para registrar una solicitud (vacaciones, permiso o certificado) de un empleado, con conteo de días.
---

# `<av-solicitud-form>`

Diálogo para registrar una solicitud (vacaciones, permiso o certificado) de un empleado, con conteo de días.

## Anatomía

```
<av-solicitud-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-select name="iempleado"> <iswc-select name="tipo"> <iswc-input name="desde"> <iswc-input name="hasta"> <p class="dias"> <iswc-textarea name="motivo"> <iswc-callout></div>
      footer: Cancelar · Registrar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `empleados` | `Empleado[]` | `[]` | Empleados (sin retirados). |
| `iempleado` | `number \| null` | `null` | Empleado preseleccionado. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-solicitud-guardar` | `{ datos: SolicitudDatos }` | Registrar con datos válidos. |
| `av-solicitud-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-solicitud-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-solicitud-form></av-solicitud-form>
```
