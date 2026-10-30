---
name: av-empresa-form
description: Diálogo para crear o editar una empresa (nombre, NIT, sector, descripción); valida y emite av-empresa-guardar.
---

# `<av-empresa-form>`

Formulario de empresa en un `iswc-dialog`. No llama al API: el shell `av-organizacion` recibe `av-empresa-guardar` y hace post/put.

## Anatomía

```
<av-empresa-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos"><iswc-input id="nombre"> <iswc-input id="nit"> <iswc-input id="sector"> <iswc-textarea id="descripcion"> <iswc-callout id="aviso"></div><iswc-button slot="footer">Cancelar</iswc-button><iswc-button id="guardar" slot="footer"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre o cierra el diálogo. |
| `datos` | `EmpresaForm` | vacío | Valores iniciales (`iempresa: null` = nueva). |
| `ocupado` | `boolean` | `false` | Botón Guardar en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-empresa-guardar` | `{ datos }` | Guardar con el formulario válido. |
| `av-empresa-cerrar` | `{}` | Cancelar, Esc o clic fuera. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-empresa-form id="f"></av-empresa-form>
<script>f.props = { abierto: true, datos: { iempresa: null, nombre: '', nit: '', sector: '', descripcion: '' } };</script>
```
