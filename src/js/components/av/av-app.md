---
name: av-app
description: Shell de Avatar: área pública en iswc-app-shell y privada en iswc-doc-layout (lateral de módulos, buscador global, empresa, sesión, tema y pie con paleta), una página real por vista.
---

# `<av-app vista="…">`

El armazón de la app: es todo el cuerpo de cada página generada (`<av-app vista="canales">` en `/canales/`). Restaura
la sesión al arrancar, decide si la vista exige sesión (si falta, va a `/acceso/` recordando el destino) y monta el
shell de la vista. Otro id dentro de la misma vista (historial) o un cambio de empresa remontan solo el contenido;
el layout no se repinta.

## Anatomía

```
<av-app vista="inicio|acceso">                 <av-app vista="panel|canales|…">
  #shadow-root                                    #shadow-root
    <iswc-app-shell toast="top-end">                <iswc-doc-layout class="privada" toc="off" hide-end>
      <av-logo slot="brand">                          <a slot="brand"><av-logo></a>
      <iswc-session-menu slot="actions">              <iswc-semantic-search slot="actions">   ← Ctrl+K
      <iswc-theme-toggle slot="actions">              <iswc-tenant-selector slot="actions">
      <main class="vista"> shell de la vista          <iswc-session-menu slot="actions">
      <footer class="pie" slot="footer">              <iswc-theme-toggle slot="actions">
                                                      <iswc-doc-index slot="start">  ← módulos
                                                      <main class="vista"> shell de la vista
                                                      <footer class="pie"> logo, lema, paleta y tema
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `vista` | `string` | `inicio` | Vista de la página (el atributo `vista` manda). |
| `id` | `string \| null` | `null` | Registro abierto (canal, proyecto…), del historial del navegador. |
| `listo` | `boolean` | `false` | Sesión restaurada: hasta entonces muestra «Cargando». |
| `version` | `number` | `0` | Sube al cambiar de empresa o con una intención en la misma vista: remonta el contenido. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-app></av-app>
```
