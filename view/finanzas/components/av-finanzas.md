---
name: av-finanzas
description: Shell de finanzas: KPIs del mes, gráficas, conversor de monedas, transacciones y facturas (emitir/pagar); habla con el API.
---

# `<av-finanzas>`

Shell de finanzas: KPIs del mes, gráficas, conversor de monedas, transacciones y facturas (emitir/pagar); habla con el API.

## Anatomía

```
<av-finanzas>
  #shadow-root
    <div part="pagina"><av-cabecera> <iswc-callout> (sin permiso) <av-indicadores id="kpis">
      <iswc-tab-group><iswc-tab>×3 <iswc-tab-panel name="general"><av-finanzas-grafica> <av-conversor></iswc-tab-panel>
        <iswc-tab-panel name="transacciones"><av-finanzas-tabla> <iswc-tab-panel name="facturas"><av-finanzas-tabla></iswc-tab-group>
      <av-transaccion-form> <av-factura-form></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `id` | `string \| null` | `null` | Pestaña inicial: general, transacciones o facturas. |
| `version` | `number` | `0` | Súbela para recargar. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-finanzas></av-finanzas>
```
