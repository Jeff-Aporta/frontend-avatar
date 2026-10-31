---
name: av-vacio
description: Caja de estado vacío, cargando o error con ícono, título, texto y una acción opcional en el slot.
---

# `<av-vacio>`

Lo que se muestra cuando una lista o panel no tiene datos, está cargando o falló.

## Anatomía

```
<av-vacio>
  #shadow-root
    <div part="caja" data-estado="vacio|cargando|error">
      <iswc-icon part="icono"> | <iswc-spinner>
      <strong part="titulo"> <p part="texto"> <slot>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `icono` | `string` | `mdi:inbox-outline` | Ícono del estado vacío. |
| `titulo` | `string` | `Nada por aquí` | Título. |
| `texto` | `string` | `''` | Explicación. |
| `estado` | `vacio \| cargando \| error` | `vacio` | Qué se muestra. |
| `variante` | `caja \| tarjeta` | `caja` | `tarjeta` para una vista entera: sin sesión o sin permiso. |

## Eventos

<!-- exclude: Eventos -->

## Slots

| Slot | Uso |
| --- | --- |
| `default` | Acción (un `iswc-button`). |

## Ejemplos

```html
<av-vacio id="v"><iswc-button>Crear el primero</iswc-button></av-vacio>
<script>v.props = { titulo: 'Sin proyectos', texto: 'Crea un proyecto para empezar un tablero.' };</script>
```
