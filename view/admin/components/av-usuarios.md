---
name: av-usuarios
description: Tabla de usuarios (iswc-ag-grid) con acciones sobre la fila elegida: editar, eliminar y asignar rol principal.
---

# `<av-usuarios>`

Pestaña Usuarios de la administración. Clic en una fila la selecciona y muestra sus acciones.

## Anatomía

```
<av-usuarios>
  #shadow-root
    <section part="usuarios"><div class="barra"><iswc-button id="nuevo"></div><div id="seleccion" part="seleccion"><iswc-select id="sel-rol"> Editar <iswc-button id="eliminar"> <iswc-popconfirm></div><iswc-data-grid id="grid" part="grid"></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `Usuario[]` | `[]` | Usuarios. |
| `roles` | `Rol[]` | `[]` | Roles asignables. |
| `asignaciones` | `RolUsuario[]` | `[]` | Roles por usuario. |
| `cargando` | `boolean` | `false` | Tabla en carga. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-usuario-nuevo` | `{}` | Nuevo usuario. |
| `av-usuario-editar` | `{ iusuario }` | Editar la fila elegida. |
| `av-usuario-eliminar` | `{ iusuario }` | Confirmar eliminar. |
| `av-usuario-rol` | `{ iusuario, irol }` | Cambiar rol principal (`''` = rol base). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-usuarios id="u"></av-usuarios>
<script>u.props = { items: [{ iusuario: 'ana', nombre: 'Ana', bactivo: true }], roles: [{ irol: 'GESTOR', igrupo: 'AVATAR' }] };</script>
```
