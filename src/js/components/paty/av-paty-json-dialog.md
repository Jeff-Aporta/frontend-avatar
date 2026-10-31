---
name: av-paty-json-dialog
description: >-
  Diálogo para ver o editar un JSON con validador externo.
  Usar al montar, revisar o cambiar <av-paty-json-dialog>.
---

# `<av-paty-json-dialog>`

Diálogo con un `iswc-code` en lenguaje `json`. Muestra el título y el texto que llegan por `props`. Si hay callback `validar`, el botón Aplicar solo se enciende cuando esa validación devuelve `ok`. Los errores de la lista salen al teclear, cuando la lista cambia.

## Cuándo usarlo

Cuando la página necesita mostrar o aplicar un bloque JSON y quiere decidir ella si el texto es válido.

## Cuándo no

Sin `validar`, Aplicar permanece apagado. El diálogo no escribe la config en ningún almacén: emite el valor normalizado y el anfitrión decide.

## Anatomía

El shadow DOM expone CSS parts para que puedas estilizar piezas individuales sin re-implementar el componente.

```html
<iswc-dialog part="dialogo" backdrop-variant="basic" label="…" ?open="…">
  <iswc-callout part="errores-callout" color="warning" role="alert">
    <ul part="errores">
      <li>…</li>
    </ul>
  </iswc-callout>
  <iswc-code part="editor" lang="json" ?readonly="…" placeholder="{}"></iswc-code>
  <iswc-button slot="footer" variant="plain">Cancelar | Cerrar</iswc-button>
  <iswc-button slot="footer" variant="filled" color="brand" ?disabled="…">Aplicar JSON</iswc-button>
</iswc-dialog>
```

## Atributos observados

No observa atributos. La entrada es la propiedad `props`.

| Atributo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| _(ninguno)_ | — | — | El componente no observa atributos HTML. |

## Props

`PatyJsonDialogProps`. El setter fusiona un `Partial<PatyJsonDialogProps> | null | undefined` y, si el elemento está conectado, pinta. Estado inicial: `{ open: false, titulo: 'JSON', valor: '{}', readonly: true }`. `validar` no está en ese objeto.

| Campo | Tipo | Por defecto | Efecto |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | `open` del `iswc-dialog`. Al pasar de cerrado a abierto (`v.open` truthy y el open anterior falso) copia `valor` al texto interno, o `'{}'` si `valor` es `null`/`undefined`, y vacía `#errores`. Si ya estaba abierto, un `valor` nuevo no pisa lo que se está editando. |
| `titulo` | `string` | `'JSON'` | `label` del diálogo. |
| `valor` | `string` | `'{}'` | Texto que se carga al abrir. El editor muestra el texto interno (`#texto`). |
| `readonly` | `boolean` | `true` | `true`: el editor es de solo lectura, el pie dice «Cerrar» y no hay botón Aplicar. `false`: el pie dice «Cancelar» y aparece «Aplicar JSON». |
| `validar` | `(texto: string) => PatyJsonValidacion` | ausente | `PatyJsonValidacion` es `{ ok: boolean; errors: string[]; normalized: unknown }`. Si falta, Aplicar queda deshabilitado. Si está, cada pintado lo llama para decidir el botón, y cada `iswc-input` lo llama y se queda con `errors`. |

## Eventos

Salen del host con `bubbles: true` y `composed: true`. Este tag no escucha eventos.

| Evento | Detalle | Cuándo se emite |
| --- | --- | --- |
| `paty-json-cerrar` | _(sin detail)_ | Clic en Cerrar o Cancelar, y también `iswc-hide` del diálogo. |
| `paty-json-aplicar` | `{ valor: validacion.normalized }` | Clic en Aplicar JSON. El botón está deshabilitado si `readonly` es true o si la validación del último pintado no tiene `ok`. |

## Slots

| Slot | Descripción |
| --- | --- |
| _(ninguno)_ | No expone slots propios. El slot `footer` del `iswc-dialog` lo ocupan los botones «Cerrar/Cancelar» y «Aplicar JSON» que el propio componente renderiza. |

## CSS Parts

| Part | Descripción |
| --- | --- |
| _No expone parts._ | — |
Shadow abierto. El host no declara `part`. Cada pintado hace `replaceChildren` del shadow.

- `iswc-dialog.dialogo`: `backdrop-variant="basic"`, `label` = `titulo`.
  - Si `#errores` tiene elementos: `iswc-callout` `color="warning"` `role="alert"` con `ul.errores` y un `li` por mensaje.
  - `iswc-code.editor`: `lang="json"`, `readonly` según la prop, `placeholder="{}"`. El texto entra por la propiedad `value` después de montar, solo si difiere de `#texto`.
  - `iswc-button` `slot="footer"` `variant="plain"`: «Cerrar» o «Cancelar».
  - Si `readonly` es falso: `iswc-button` `slot="footer"` `variant="filled"` `color="brand"` con el texto «Aplicar JSON».

## Comportamiento

- En cada `iswc-input` guarda `value` en `#texto`, ejecuta `validar` y se queda con `resultado.errors`, o `[]` si no vienen. Solo vuelve a pintar si la lista unida por `|` cambió. Así el editor no se recrea en cada tecla.
- El pintado llama a `validar(#texto)` para `puedeAplicar` (`!readonly && validacion.ok`) y no escribe esa llamada en `#errores`. Al abrir, la lista de errores está vacía hasta el próximo input que cambie la cadena unida.
- Aplicar usa el `normalized` capturado en el último pintado, no una llamada nueva en el clic. Si esa validación no trae `normalized`, `detail.valor` queda `undefined`.
- Cerrar no pone `open` en false: emite y el anfitrión cierra.
- El comentario de la clase habla de copiar al portapapeles. El pintado no tiene botón de copiar.

## API JavaScript

| Método | Descripción |
| --- | --- |
| `set props(v: Partial<PatyJsonDialogProps> \| null \| undefined)` | Fusiona `open` / `titulo` / `valor` / `readonly` / `validar`. Al pasar de cerrado a abierto (`abriendo`), copia `valor` a `#texto` y vacía `#errores` para no pisar la edición; si el elemento está conectado, dispara el render. |
| `get props(): PatyJsonDialogProps` | Devuelve las props acumuladas. |
| `connectedCallback(): void` | Pinta el `<iswc-dialog>` con el editor `<iswc-code>` y los botones del footer (Cerrar/Cancelar y, si no es `readonly`, Aplicar JSON, deshabilitado hasta que `validar` devuelva `ok`). |

## Desarrollo

- `class PatyJsonDialog extends HTMLElement`. `define('av-paty-json-dialog', PatyJsonDialog)`. La clase no se exporta. No hay helpers exportados. `#texto` y `#errores` son estado interno.
- Shadow en el constructor (`mode: 'open'`). `precargarCss` al cargar el módulo y `adoptCss` al pintar, hoja `av-paty-json-dialog`.
- Tags `is-*`: `iswc-dialog`, `iswc-callout`, `iswc-code`, `iswc-button`.
- Rutas: `view/sistema/components/av-paty-json-dialog.ts`, `.css`, `.json`. Demo: `view/demo/index.html`.
- Tipos: `PatyJsonDialogProps` y `PatyJsonValidacion` en `src/js/consts/types/componentes.ts`.

## Custom States

| State | Selector | Cuándo se aplica |
| --- | --- | --- |
| _(ninguno)_ | — | Sin atributos reflejados. `?open=${open}` en el `<iswc-dialog>`, `?readonly=${readonly}` en el `<iswc-code>` (también fija `aria-readonly` por el kit), `?disabled=${!puedeAplicar}` en «Aplicar JSON». El callout de errores se muestra con `iswc-callout color="warning"` solo cuando `validar(texto)` devuelve `errors.length > 0`. La rama «Aplicar JSON» solo aparece si `readonly` es falso. |

## Índice

[Componentes paty](../../../src/skills/paty-components/SKILL.md)

## Ejemplos

Uso minimo (el host registra el tag via el loader del kit):

```html
<av-paty-json-dialog></av-paty-json-dialog>
```
