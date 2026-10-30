---
name: av-app
description: Shell de Avatar sobre iswc-app-shell: barra con marca, navegación por permisos, selector de empresa, sesión y la vista activa enrutada por hash.
---

# `<av-app>`

El armazón de la app: una sola vez en `index.html`. Restaura la sesión al arrancar, resuelve la ruta del hash
(`#/<vista>/<id>`) y monta el shell de la vista. Sin sesión solo ofrece Inicio y Entrar (y el acceso desde la barra).

## Anatomía

```
<av-app>
  #shadow-root
    <iswc-app-shell brand="Avatar" toast="top-end">
      <iswc-app-nav slot="nav">           ← pestañas según sesión y permisos
      <av-empresa-selector slot="actions"> ← solo con sesión
      <iswc-session-menu slot="actions">   ← entrar / cerrar sesión
      <iswc-theme-toggle slot="actions">
      <main class="vista" part="vista">    ← shell de la vista activa (av-inicio, av-panel, …)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `vista` | `string` | `inicio` | Vista activa (la fija el router). |
| `id` | `string \| null` | `null` | Id de la ruta (`#/canales/12`). |
| `listo` | `boolean` | `false` | Sesión restaurada: hasta entonces muestra «Cargando». |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-app></av-app>
```
