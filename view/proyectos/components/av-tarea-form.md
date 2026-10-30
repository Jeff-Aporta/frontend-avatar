---
name: av-tarea-form
description: Diálogo para crear o editar una tarea (título, descripción, prioridad, columna, asignado, vencimiento, etiquetas); emite av-tarea-guardar.
---

# `<av-tarea-form>`

Formulario de tarea dentro de un `iswc-dialog`. Valida con Zod (`TareaDatosSchema`) y emite; no escribe en el API.

## Anatomía

```
<av-tarea-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos"><iswc-input name="titulo"> <iswc-textarea name="descripcion"> <iswc-select name="prioridad"> <iswc-select name="icolumna"> <iswc-select name="asignado_a"> <iswc-input name="fvence" type="date"> <iswc-input name="etiquetas"></div><iswc-button slot="footer">Cancelar</iswc-button><iswc-button id="guardar" slot="footer"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre o cierra el diálogo. |
| `tarea` | `TareaTablero \| null` | `null` | Tarea a editar (null = crear). |
| `iproyecto` | `number \| null` | `null` | Proyecto de la tarea nueva. |
| `icolumna` | `number \| null` | `null` | Columna preseleccionada. |
| `columnas` | `Columna[]` | `[]` | Opciones de columna. |
| `miembros` | `Miembro[]` | `[]` | Opciones de asignado. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-tarea-guardar` | `{ datos: TareaDatos }` | Guardar con datos válidos. |
| `av-tarea-form-error` | `{ mensaje }` | Guardar con datos inválidos. |
| `av-tarea-form-cerrar` | `{}` | Cancelar, Esc o cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-tarea-form id="f"></av-tarea-form>
<script>f.props = { abierto: true, iproyecto: 1, columnas: [{ icolumna: 1, nombre: 'Por hacer' }], miembros: [] };</script>
```
