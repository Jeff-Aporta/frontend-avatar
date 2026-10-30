---
name: av-crm
description: Shell del CRM: embudo por etapa, tabla de clientes y diálogo de cliente; carga y escribe con los controllers de DER.
---

# `<av-crm>`

Ruta `#/crm[/<icliente>]`. Carga `clientes` y `miembros` de la empresa activa; escribe solo con `avatar.gestionar`.

## Anatomía

```
<av-crm>
  #shadow-root
    <div part="pagina"><av-cabecera> <av-embudo id="embudo"> <av-clientes-grid id="grid"> <av-cliente-form id="form"></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Cliente a abrir al cargar. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-crm></av-crm>
```
