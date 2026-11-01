---
name: av-escena
description: Ilustración Corporate Memphis compuesta por capas (personajes WebP + formas en colores de la paleta) con halo de neón y movimiento suave.
---

# `<av-escena>`

Compone una escena de `src/js/core/escenas.ts`: piezas WebP transparentes de `assets/img/memphis/` (de la hoja de vida
y generadas para Avatar) y formas geométricas pintadas con CSS en los colores de la paleta activa, sobre un halo de neón.
Las piezas flotan, se mecen, giran o laten; con `prefers-reduced-motion` quedan quietas.

## Anatomía

```
<av-escena escena="bienvenida">
  #shadow-root
    <figure part="lienzo">
      <span part="halo">
      <img class="pieza"> … <span class="forma">
```

## Atributos observados

<!-- exclude: Atributos observados -->

`escena` y `etiqueta` como atributos equivalen a las props.

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `escena` | `string` | `bienvenida` | bienvenida, acceso, chat, canales, asistente, proyectos, crm, finanzas, inventario, rrhh, correos, organizacion, logros, vacio. |
| `etiqueta` | `string` | `''` | Texto alternativo; vacía, la escena es decorativa. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-escena escena="acceso" etiqueta="Persona entrando a la app"></av-escena>
```
