---
name: av-chat-info
description: Panel de info: foto, nombre, descripción, silenciar/fijar/archivar, multimedia, archivos, enlaces, destacados e integrantes con roles; o la info de lectura de un mensaje.
---

# `<av-chat-info>`

Panel lateral de información.

## Anatomía

```
<av-chat-info>
  #shadow-root
    <aside part="info"><header> <section class="heroe"> <section class="interruptores"> <iswc-tab-group class="pestanas"> <section class="integrantes"><ul class="gente">…</ul></section></aside>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `abierto` | `boolean` | `false` | Visible. |
| `modo` | `'chat' \| 'mensaje'` | `'chat'` | Qué muestra. |
| `id … estado` | `…` | `—` | Datos del chat (ver schema). |
| `soyAdmin` | `boolean` | `false` | Habilita la gestión. |
| `miembros` | `PersonaVista[]` | `[]` | Con `rol`. |
| `multimedia, archivos, enlaces, destacados` | `ElementoInfo[]` | `[]` | Pestañas. |
| `mensaje` | `{ texto, ts, filas } \| null` | `null` | Info de lectura. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-panel-cerrar` | `{ panel }` | Cerrar. |
| `av-chat-preferencias` | `{ icanal, … }` | Silenciar, fijar, archivar. |
| `av-chat-miembros` | `{ accion, usuarios }` | Gestión. |
| `av-chat-panel` | `{ panel }` | `grupo-editar` o `grupo-agregar`. |
| `av-chat-directo` | `{ iusuario }` | Escribirle a un integrante. |
| `av-chat-accion` | `{ accion: 'ver', imensaje }` | Abrir medio. |
| `av-chat-abrir` | `{ icanal, imensaje }` | Ir a un destacado. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-info id="x"></av-chat-info>
<script>x.props = {"abierto": true, "id": "g1", "tipo": "grupo", "nombre": "Equipo Odys", "descripcion": "Coordinación del proyecto", "iniciales": "EO", "color": 4, "yo": "ana", "soyAdmin": true, "miembros": [{"id": "beto", "nombre": "Beto Ruiz", "foto": null, "detalle": "Desarrollo", "enLinea": true, "color": 3, "rol": "admin"}, {"id": "carla", "nombre": "Carla Gómez", "foto": null, "detalle": "Diseño", "enLinea":;</script>
```
