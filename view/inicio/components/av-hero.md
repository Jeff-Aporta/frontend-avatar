---
name: av-hero
description: Portada de la landing: lema, texto, botones «Empieza ahora»/«Ir al panel» y «Conoce a AVO», e ilustración.
---

# `<av-hero>`

La primera pantalla de la landing pública.

## Anatomía

```
<av-hero>
  #shadow-root
    <section part="hero"><div class="texto"><h1 part="titulo"> <p> <iswc-button id="empezar"> …</div><img part="ilustracion"></section>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `sesion` | `boolean` | `false` | Con sesión el botón principal dice «Ir al panel». |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-inicio-ir` | `{ vista }` | Al pulsar un botón (`acceso`, `panel`, `asistente`). |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-hero></av-hero>
```
