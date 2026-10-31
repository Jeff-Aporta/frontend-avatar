---
name: av-correo-lista
description: Lista de correos de una carpeta con buscador, estado leído, etiquetas, hora relativa y estrella; refresca sin perder el foco.
---

# `<av-correo-lista>`

Lista de correos de una carpeta con buscador, estado leído, etiquetas, hora relativa y estrella; refresca sin perder el foco.

## Anatomía

```
<av-correo-lista>
  #shadow-root
    <div part="lista">
      <div part="barra"><iswc-input class="buscador" type="search"> <span part="conteo"></div>
      <div part="items" role="listbox"><div part="correo" role="option" data-leido aria-selected> <iswc-avatar> … <iswc-relative-time> <iswc-tag> <iswc-button class="estrella"></div>×N</div>
      <av-vacio class="vacio">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `correos` | `CorreoBandeja[]` | `[]` | Correos ya filtrados por la búsqueda. |
| `activo` | `number \| null` | `null` | ibuzon abierto. |
| `carpeta` | `string` | `'entrada'` | Carpeta (en enviados muestra destinatarios). |
| `nombres` | `Record<string, string>` | `{}` | Nombre por usuario. |
| `texto` | `string` | `''` | Texto del buscador. |
| `cargando` | `boolean` | `false` | Esqueletos. |
| `puedeMarcar` | `boolean` | `false` | Habilita la estrella. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-correos-buscar` | `{ texto }` | Al escribir en el buscador (el shell busca). |
| `av-correo-abrir` | `{ ibuzon }` | Clic o Enter en una fila. |
| `av-correo-marcar` | `{ ibuzon, cambios: { destacado } }` | Clic en la estrella. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-correo-lista></av-correo-lista>
```
