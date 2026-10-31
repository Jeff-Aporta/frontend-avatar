---
name: av-organizacion
description: Shell de Organización: pestañas Empresa, Miembros y Equipos de la empresa activa; habla con el API y reparte props a sus hijos.
---

# `<av-organizacion>`

Ruta `#/organizacion`. Ficha de la empresa activa (editar), miembros (invitar, quitar) y equipos (crear, editar,
eliminar, integrantes). Las escrituras solo aparecen con `avatar.gestionar`; «Nueva empresa» crea la empresa, agrega al
usuario como propietario y la deja activa.

## Anatomía

```
<av-organizacion>
  #shadow-root
    <div part="pagina"><iswc-page-header> <iswc-tab-group><iswc-tab-panel name="empresa"><iswc-card id="ficha"><dl class="datos"></iswc-card></iswc-tab-panel><iswc-tab-panel name="miembros"><av-miembros></iswc-tab-panel><iswc-tab-panel name="equipos"><av-equipos></iswc-tab-panel></iswc-tab-group> <av-empresa-form> <av-invitar-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Id de la ruta (sin uso por ahora). |
| `pestana` | `empresa \| miembros \| equipos` | `empresa` | Pestaña activa. |
| `version` | `number` | `0` | Súbela para recargar todo. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-organizacion></av-organizacion>
```
