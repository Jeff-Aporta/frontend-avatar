---
name: av-acceso
description: Shell del login: iswc-login del kit + cuentas de prueba; autentica con el plugin identity de DER y navega al panel.
---

# `<av-acceso>`

La pantalla de entrada (`#/acceso`). `<iswc-login>` no autentica: emite el envío y este shell llama al API
(`POST usuarios/login` por el plugin de identidad de DER). Con éxito, navega al panel; con error, lo muestra en el formulario.

## Anatomía

```
<av-acceso>
  #shadow-root
    <div part="pagina"><section part="panel"><iswc-login id="login"> <av-credenciales-demo id="demo"></section><aside part="lado"><img></aside></div>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `ocupado` | `boolean` | `false` | Bloquea el formulario mientras entra. |
| `error` | `string` | `''` | Mensaje de error visible. |

## Eventos

<!-- exclude: Eventos -->

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-acceso></av-acceso>
```
