---
name: av-invitar-form
description: Diálogo para invitar un usuario existente a la empresa con rol y cargo; emite av-invitar-guardar.
---

# `<av-invitar-form>`

Si llegan `usuarios`, el usuario se elige de un `iswc-select`; si no (sin permiso de lectura), se escribe el id.

## Anatomía

```
<av-invitar-form>
  #shadow-root
    <iswc-dialog id="dialogo"><div part="campos"><iswc-select|iswc-input id="usuario"> <iswc-select id="rol"> <iswc-input id="cargo"> <iswc-callout id="aviso"></div><iswc-button slot="footer">Cancelar</iswc-button><iswc-button id="guardar" slot="footer">Invitar</iswc-button></iswc-dialog>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Abre o cierra. |
| `usuarios` | `UsuarioMin[]` | `[]` | Usuarios existentes para el select. |
| `ocupado` | `boolean` | `false` | Botón en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-invitar-guardar` | `{ datos: { iusuario, rol, cargo } }` | Invitar con el formulario válido. |
| `av-invitar-cerrar` | `{}` | Cancelar, Esc o clic fuera. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-invitar-form id="f"></av-invitar-form>
<script>f.props = { abierto: true, usuarios: [{ iusuario: 'dani', nombre: 'Dani' }] };</script>
```
