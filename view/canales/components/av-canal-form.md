---
name: av-canal-form
description: Diálogo para crear un canal (nombre, tipo, equipo, descripción); emite av-canal-crear y av-canal-form-cerrar.
---

# `<av-canal-form>`

Solo lo ve quien puede gestionar (`avatar.gestionar`). No llama al API: el shell crea el canal.

## Anatomía

```
<av-canal-form>
  #shadow-root
    <iswc-dialog id="dialogo" label="Nuevo canal"><div part="campos"><iswc-input id="nombre"> <iswc-select id="tipo"> <iswc-select id="equipo"> <iswc-textarea id="descripcion"></div><iswc-button slot="footer" id="guardar"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre el diálogo. |
| `equipos` | `{ iequipo, nombre }[]` | `[]` | Opciones del selector de equipo. |
| `guardando` | `boolean` | `false` | Botón en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-canal-crear` | `{ nombre, tipo, descripcion, iequipo }` | «Crear canal» con nombre válido. |
| `av-canal-form-cerrar` | `{}` | Cancelar, Esc o cierre del diálogo. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-canal-form id="f"></av-canal-form>
<script>f.props = { abierto: true, equipos: [{ iequipo: 1, nombre: 'Desarrollo' }] };</script>
```
