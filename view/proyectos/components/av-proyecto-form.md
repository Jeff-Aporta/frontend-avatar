---
name: av-proyecto-form
description: Diálogo para crear un proyecto (nombre, descripción, estado, fechas, equipo); emite av-proyecto-guardar.
---

# `<av-proyecto-form>`

Formulario de proyecto nuevo. El shell crea el proyecto y sus cuatro columnas por defecto.

## Anatomía

```
<av-proyecto-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos">nombre, descripcion, estado, iequipo, finicio, ffin</div><iswc-button slot="footer">Cancelar</iswc-button><iswc-button id="guardar" slot="footer"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre/cierra. |
| `equipos` | `{ iequipo, nombre }[]` | `[]` | Opciones de equipo. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-proyecto-guardar` | `{ datos: ProyectoDatos }` | Crear con datos válidos. |
| `av-proyecto-form-error` | `{ mensaje }` | Nombre vacío. |
| `av-proyecto-form-cerrar` | `{}` | Cancelar o cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-proyecto-form id="f"></av-proyecto-form>
<script>f.props = { abierto: true, equipos: [{ iequipo: 1, nombre: 'Desarrollo' }] };</script>
```
