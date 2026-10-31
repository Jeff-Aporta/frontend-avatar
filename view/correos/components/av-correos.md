---
name: av-correos
description: Shell de DUO eMail: KPIs del buzón, carpetas, lista y lector en panel dividido y redacción; habla con el API (bandeja, marcar, enviar, resumen).
---

# `<av-correos>`

Shell de DUO eMail: KPIs del buzón, carpetas, lista y lector en panel dividido y redacción; habla con el API (bandeja, marcar, enviar, resumen).

## Anatomía

```
<av-correos>
  #shadow-root
    <div part="pagina"><iswc-page-header> <iswc-callout> (sin permiso) <iswc-stat-group id="kpis">
      <section part="buzon"><av-correo-carpetas> <iswc-split-panel><av-correo-lista slot="start"> <av-correo-lector slot="end"></iswc-split-panel></section>
      <av-correo-redactar></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Carpeta inicial (entrada, enviados, archivados, papelera). |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-correos></av-correos>
```
