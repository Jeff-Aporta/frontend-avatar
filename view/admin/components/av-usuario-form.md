---
name: av-usuario-form
description: Diálogo para crear o editar un usuario (identidad DER); valida y emite av-usuario-guardar.
---

# `<av-usuario-form>`

Al crear pide usuario y contraseña (mín. 8); al editar la contraseña es opcional y el id no cambia.

## Anatomía

```
<av-usuario-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos"><iswc-input id="iusuario"> <iswc-input id="nombre"> <iswc-input id="email"> <iswc-input id="password"> <iswc-switch id="bactivo"> <iswc-callout id="aviso"></div><iswc-button slot="footer">Cancelar</iswc-button><iswc-button id="guardar" slot="footer"></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre o cierra. |
| `datos` | `UsuarioForm` | nuevo vacío | Valores iniciales (`nuevo` decide el modo). |
| `ocupado` | `boolean` | `false` | Botón en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-usuario-guardar` | `{ datos }` | Guardar con el formulario válido. |
| `av-usuario-cerrar` | `{}` | Cancelar, Esc o clic fuera. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-usuario-form id="f"></av-usuario-form>
<script>f.props = { abierto: true };</script>
```
