---
name: av-credenciales-demo
description: Tarjeta con las cuentas de prueba; «Usar» rellena el login (emite av-credencial-elegida).
---

# `<av-credenciales-demo>`

Ayuda para entrar a la demo: lista de usuarios con su rol y un botón «Usar» por fila.

## Anatomía

```
<av-credenciales-demo>
  #shadow-root
    <iswc-card part="tarjeta"><ul part="lista"><li><av-persona> descripción <iswc-button class="usar"></li>…</ul><p class="nota"></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `{ usuario, password, rol, descripcion }[]` | `[]` | Cuentas. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-credencial-elegida` | `{ usuario, password }` | Al pulsar «Usar». |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-credenciales-demo id="d"></av-credenciales-demo>
<script>d.props = { items: [{ usuario: 'ana', password: 'avatar-demo-2026', rol: 'Gestora', descripcion: 'Administra.' }] };</script>
```
