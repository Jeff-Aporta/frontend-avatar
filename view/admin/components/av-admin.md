---
name: av-admin
description: Shell de Administración: usuarios, roles y permisos (solo avatar.seguridad) y Mi cuenta (contraseña y sesiones).
---

# `<av-admin>`

Ruta `#/admin`. Sin `avatar.seguridad` solo muestra «Mi cuenta». Tras cambiar roles o acciones refresca el perfil de permisos.

## Anatomía

```
<av-admin>
  #shadow-root
    <div part="pagina"><av-cabecera> [<av-vacio id="sin-permiso">] <iswc-tab-group><iswc-tab-panel name="usuarios"><av-usuarios></iswc-tab-panel><iswc-tab-panel name="roles"><av-roles></iswc-tab-panel><iswc-tab-panel name="cuenta"><div class="cuenta">contraseña · sesiones</div></iswc-tab-panel></iswc-tab-group> <av-usuario-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Id de la ruta (sin uso por ahora). |
| `pestana` | `usuarios \| roles \| cuenta` | `usuarios` | Pestaña activa. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-admin></av-admin>
```
