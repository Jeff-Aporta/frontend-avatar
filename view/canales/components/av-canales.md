---
name: av-canales
description: Shell de la vista canales: lista de canales de la empresa activa y conversación del canal abierto; envía, marca leído y refresca cada 8 s.
---

# `<av-canales>`

Ruta `#/canales/<icanal>`. Dos columnas en escritorio; en móvil la lista o la conversación según haya canal en la ruta.

## Anatomía

```
<av-canales>
  #shadow-root
    <div part="pagina" data-abierto><av-cabecera> <div part="columnas"><av-canal-lista id="lista"> <av-conversacion id="conversacion"></div> <av-canal-form id="formulario"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | icanal de la ruta. |
| `version` | `number` | `0` | Súbela para recargar. |
| `canales` | `CanalMio[]` | `[]` | Cargados de `canales/mios`. |
| `cargando` | `boolean` | `true` | Carga inicial. |
| `error` | `string` | `''` | Último error. |
| `formulario` | `boolean` | `false` | Diálogo de canal nuevo abierto. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-canales></av-canales>
```
