---
name: av-cliente-form
description: Diálogo de cliente del CRM (crear, ver/editar, eliminar); de solo lectura sin permiso de gestión.
---

# `<av-cliente-form>`

Formulario de cliente en un `iswc-dialog`. Valida con Zod (`ClienteDatosSchema`) y emite; el shell escribe.

## Anatomía

```
<av-cliente-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos">nombre, organizacion, email, telefono, etapa, valor, responsable, notas</div>
      <iswc-button id="eliminar" slot="footer"> + <iswc-popconfirm> · Cancelar · <iswc-button id="guardar" slot="footer"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre/cierra. |
| `cliente` | `Cliente \| null` | `null` | Cliente a editar (null = crear). |
| `miembros` | `{ iusuario, usuario }[]` | `[]` | Opciones de responsable. |
| `puedeEscribir` | `boolean` | `false` | Sin él, solo lectura. |
| `ocupado` | `boolean` | `false` | Guardando. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-cliente-guardar` | `{ datos: ClienteDatos }` | Guardar con datos válidos. |
| `av-cliente-eliminar` | `{ icliente }` | Confirmar eliminación. |
| `av-cliente-form-error` | `{ mensaje }` | Datos inválidos. |
| `av-cliente-form-cerrar` | `{}` | Cancelar o cerrar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-cliente-form id="f"></av-cliente-form>
<script>f.props = { abierto: true, puedeEscribir: true };</script>
```
