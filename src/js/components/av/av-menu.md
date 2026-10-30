---
name: av-menu
description: Menú lateral colapsable del área privada (como el MenuCollapsed del React): módulos agrupados con ícono, contador y tooltip al plegar.
---

# `<av-menu>`

Barra lateral con fondo de marca. Plegada muestra solo íconos; desplegada, ícono, nombre y contador. Va en el slot `sidebar` de `<iswc-app-shell>` (en móvil el kit la pasa a un cajón). Todas las medidas en `em`: escala con el `font-size` del contexto.

## Anatomía

```
<av-menu>
  #shadow-root
    <nav part="menu" data-plegado>
      <button part="plegar">  ← «Menú»
      <div class="grupo"> <a part="item" aria-current> <span class="icono"> <span class="etiqueta"> <iswc-badge class="contador"> …
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `{ id, label, icon, grupo, contador }[]` | `[]` | Módulos (agrupados por `grupo`, en orden). |
| `activo` | `string` | `''` | Id del módulo de la ruta actual. |
| `plegado` | `boolean` | `false` | Solo íconos. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-menu-ir` | `{ id }` | Al elegir un módulo. |
| `av-menu-plegar` | `{ plegado }` | Al pulsar «Menú». |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-menu id="m"></av-menu>
<script>m.props = { items: [{ id: 'panel', label: 'Panel', icon: 'mdi:view-dashboard-outline', grupo: 'Trabajo' }], activo: 'panel' };</script>
```
