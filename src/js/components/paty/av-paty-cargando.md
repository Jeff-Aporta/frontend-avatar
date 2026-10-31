---
name: av-paty-cargando
description: >-
  Cuando una lista, un hilo o un diálogo espera datos y hay que mostrar el spinner con un texto.
---

# `<av-paty-cargando>`

Indicador de carga en línea: `iswc-spinner` del kit y, si llega, un texto. El host se anuncia como
estado (`role="status"`, `aria-live="polite"`). Sustituye las cajas `div.*__cargando` que cada
componente armaba a mano.

## Cuándo usarlo

Mientras una lista, un hilo o un diálogo espera la respuesta del ISS.

## Cuándo no

Para bloquear toda la vista: `iswc-loading-overlay`. Para el esqueleto de una tarjeta: `iswc-skeleton`.

## Atributos observados

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `texto` | texto | `""` | Rótulo junto al spinner. Vacío: solo spinner. |

`hidden` lo oculta (`display: none`).

## Eventos

No emite ni escucha eventos.

## Slots

No tiene slots.

## CSS Parts

| Part | Descripción |
| --- | --- |
| `spinner` | El `iswc-spinner`. |
| `texto` | El rótulo. |

## CSS custom properties

| Propiedad | Default | Uso |
| --- | --- | --- |
| `--av-paty-cargando-padding` | `2rem` | Padding vertical del host. |

Tamaño base `0.85em`; el contexto lo cambia con `font-size` (em), sin variantes de tamaño.

## Anatomía

```html
<iswc-spinner part="spinner"></iswc-spinner>
<span class="texto" part="texto">Cargando…</span>
```

## Desarrollo

- `src/js/components/paty/av-paty-cargando.{ts,scss,json,md}`; registrado en `all.ts`.
- Tags del kit: `iswc-spinner`.
- Candidato a iswc-root (`reuso` → `iswc-loading`).

## Índice

[Componentes paty](../../../skills/paty-components/SKILL.md)

## Ejemplos

```html
<av-paty-cargando texto="Recuperando mensajes del hilo…"></av-paty-cargando>
```
