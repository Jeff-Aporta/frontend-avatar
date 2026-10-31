---
name: av-equipos
description: Tarjetas de equipos con color, descripción e integrantes; con permiso crea, edita, elimina y agrega/quita integrantes.
---

# `<av-equipos>`

Pestaña Equipos de la organización. El diálogo de crear/editar equipo vive dentro (es solo de esta pieza).

## Anatomía

```
<av-equipos>
  #shadow-root
    <section part="equipos"><div class="barra"><iswc-button id="nuevo"></div><div part="rejilla"><iswc-card class="equipo">header, descripción, <ul class="integrantes"><li><iswc-person> <iswc-tag> <iswc-button class="quitar"></li></ul>, footer: <iswc-select id="cand-i"> <iswc-select id="rolc-i"> <iswc-button></iswc-card>…</div><iswc-dialog id="form">…</iswc-dialog></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `Equipo[]` (con `integrantes`) | `[]` | Equipos de la empresa. |
| `miembros` | `Miembro[]` | `[]` | Para el select de agregar integrante. |
| `cargando` | `boolean` | `false` | Estado de carga. |
| `puedeGestionar` | `boolean` | `false` | Habilita escrituras. |
| `ocupado` | `boolean` | `false` | Botón Guardar en carga. |
| `error` | `string` | `''` | Error del API. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-equipo-guardar` | `{ iequipo \| null, nombre, descripcion, color }` | Guardar en el diálogo. |
| `av-equipo-eliminar` | `{ iequipo }` | Confirmar eliminar. |
| `av-integrante-agregar` | `{ iequipo, iusuario, rol }` | Botón + del pie. |
| `av-integrante-quitar` | `{ iequipo, iusuario }` | × junto al integrante. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-equipos id="e"></av-equipos>
<script>e.props = { items: [{ iequipo: 1, iempresa: 1, nombre: 'Desarrollo', color: '#2563eb', integrantes: [] }], puedeGestionar: true };</script>
```
