---
name: av-empleado-form
description: Diálogo para crear, editar o eliminar un empleado (datos, salario, estado, ingreso y usuario vinculado) y pedir una solicitud para él.
---

# `<av-empleado-form>`

Diálogo para crear, editar o eliminar un empleado (datos, salario, estado, ingreso y usuario vinculado) y pedir una solicitud para él.

## Anatomía

```
<av-empleado-form>
  #shadow-root
    <iswc-dialog id="dialogo">
      <div part="campos"><iswc-input name=…>×7 <iswc-select name="estado"> <iswc-select name="iusuario"> <iswc-callout></div>
      footer: Eliminar · Solicitud · Cancelar · Guardar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `empleado` | `Empleado \| null` | `null` | null = nuevo. |
| `miembros` | `MiembroRrhh[]` | `[]` | Usuarios de la empresa para vincular. |
| `puedeEscribir` | `boolean` | `false` | Sin permiso: solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-empleado-guardar` | `{ datos: EmpleadoDatos }` | Guardar con datos válidos. |
| `av-empleado-eliminar` | `{ iempleado }` | Confirmar eliminar. |
| `av-solicitud-nueva` | `{ iempleado }` | Botón Solicitud. |
| `av-empleado-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-empleado-form-cerrar` | `{}` | Cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-empleado-form></av-empleado-form>
```
