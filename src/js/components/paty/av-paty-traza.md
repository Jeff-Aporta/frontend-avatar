---
name: av-paty-traza
description: >-
  Cuando hay que mostrar la traza de un turno del ISS (eventos `log` del SSE o `meta.traza`) como un log legible: tiempos, nivel, etapa, mensaje y datos.
---

# `<av-paty-traza>`

Log del turno que narra el ISS. Cada fila es un paso del pipeline (bitácora, contexto, clasificador, modelo, petición al proveedor, latidos de espera, respuesta, guardado, cierre) con el tiempo desde el inicio del turno, el nivel, la etapa, el mensaje, la duración si el paso fue medido y sus datos en JSON desplegable. Le dice a QA qué hizo el ISS, cuánto tardó cada paso y dónde falló.

## Cuándo usarlo

Debajo de la respuesta del asistente, en vivo mientras el turno corre y al recargar la conversación (la traza queda en la bitácora).

## Cuándo no

No reemplaza a `<av-paty-process>` (pastillas de estado) ni al JSON completo del log de la conversación.

## Contrato de los eventos

La forma de cada evento es la del ISS: `ZEventoTraza` del pin `src/vendor/iss-patyia-staging/front.ts` (`seq`, `ts`, `ms`, `nivel` = `debug | info | warn | error`, `etapa`, `mensaje`, `dur?`, `datos?`). Una lista que no cumple el contrato se descarta entera (la traza queda vacía).

## Anatomía

```html
<section class="traza traza--ok|warn|error" part="traza" data-estado="ok|warn|error">
  <button class="cabecera" aria-expanded="true|false">… Traza del ISS · N eventos · total · avisos · errores · en vivo</button>
  <div class="barra"><div class="filtros">Todo | Info | Avisos | Errores</div><button class="copiar">JSON</button></div>
  <ol class="eventos">
    <li class="evento evento--info" data-nivel data-etapa data-ultimo>+ms · nivel · etapa · mensaje · dur · <details class="datos">…</details></li>
  </ol>
</section>
```

## Atributos observados

| Atributo | Default | Descripción |
| --- | --- | --- |
| `en-vivo` | ausente | El turno sigue en curso: la traza se abre, muestra «en vivo» y marca el último evento (`data-ultimo`). |
| `abierto` | ausente | La traza nace desplegada. Sin él, nace plegada (solo la cabecera con el resumen). |

## Props

| Propiedad | Tipo | Descripción |
| --- | --- | --- |
| `eventos` | `TEventoTraza[]` | Lista completa; se valida con `ZTraza`. Asignarla repinta. |
| `props` | `{ eventos?, filtro?, abierto? }` | Entrada del playground y de las vistas (`PatyTrazaPropsSchema` parcial). |

## Comportamiento

- Filtro `Info` oculta `debug`; `Avisos` muestra avisos y errores; `Errores`, solo errores.
- El color del borde resume la traza: con errores, rojo; con avisos, ámbar.
- `JSON` copia la traza completa al portapapeles.

## Eventos

`av-paty-traza-copiar` (`detail: { json }`) al copiar.

## Slots

No tiene slots: todo el contenido sale de `eventos`.

## Ejemplos

```html
<av-paty-traza abierto></av-paty-traza>
<script type="module">
  document.querySelector("av-paty-traza").eventos = finTurno.meta.traza;
</script>
```

En el chat, `paty-chat-message` la pinta bajo la respuesta del asistente (`en-vivo` mientras el turno corre).

## Desarrollo

Lógica en `av-paty-traza.ts`, estilos en `av-paty-traza.scss`, schemas en `consts/schemas/componentes.schemas.ts` (`PatyTrazaPropsSchema`), playground en `av-paty-traza.json` (registrado en `view/demo/manifest.json`). Las funciones puras `filtrarTraza`, `resumenTraza` y `formatoMs` se exportan para los tests.
