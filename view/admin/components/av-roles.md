---
name: av-roles
description: Roles del grupo AVATAR con sus acciones; crear rol y dar/negar/quitar una acción del catálogo.
---

# `<av-roles>`

Pestaña «Roles y permisos». Cada rol escribe solo sus diferencias con el rol base (`USR`); `ADMIN` tiene `*`.

## Anatomía

```
<av-roles>
  #shadow-root
    <section part="roles"><div class="formularios"><iswc-card>nuevo rol</iswc-card><iswc-card>dar/negar acción</iswc-card></div><div part="rejilla"><iswc-card class="rol"><ul class="acciones"><li><code> <iswc-tag> <iswc-button class="quitar"></li></ul></iswc-card>…</div></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `roles` | `Rol[]` | `[]` | Roles del grupo. |
| `acciones` | `AccionRol[]` | `[]` | Acciones de todos los roles. |
| `catalogo` | `CatalogoEntrada[]` | `[]` | Acciones evaluables. |
| `cargando` | `boolean` | `false` | Esqueleto. |
| `ocupado` | `boolean` | `false` | Botones en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-rol-crear` | `{ irol, nombre }` | Crear rol. |
| `av-accion-poner` | `{ irol, iaccion, valor }` | Aplicar acción (valor `true`/`false`). |
| `av-accion-quitar` | `{ irol, iaccion }` | × junto a la acción. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-roles id="r"></av-roles>
<script>r.props = { roles: [{ irol: 'GESTOR', igrupo: 'AVATAR' }], acciones: [{ irol: 'GESTOR', iaccion: 'avatar.gestionar', valor: true }] };</script>
```
