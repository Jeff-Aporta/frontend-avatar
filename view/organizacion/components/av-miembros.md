---
name: av-miembros
description: Lista de miembros de la empresa con rol y cargo; con permiso, quitar (popconfirm) e Invitar.
---

# `<av-miembros>`

Pestaña Miembros de la organización. Orden: propietario, admin, miembro, invitado. El propietario no se puede quitar.

## Anatomía

```
<av-miembros>
  #shadow-root
    <iswc-card part="tarjeta"><iswc-button id="invitar" slot="header-actions"><ul part="lista"><li class="fila"><iswc-person> <iswc-tag> cargo <iswc-button class="quitar"> + <iswc-popconfirm></li>…</ul> | <iswc-empty-state></iswc-card>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `items` | `Miembro[]` | `[]` | Miembros con `usuario` incluido. |
| `cargando` | `boolean` | `false` | Estado de carga. |
| `puedeGestionar` | `boolean` | `false` | Muestra Invitar y quitar. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-miembros-invitar` | `{}` | Botón Invitar. |
| `av-miembro-quitar` | `{ iusuario }` | Confirmación de quitar. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-miembros id="m"></av-miembros>
<script>m.props = { items: [{ iempresa: 1, iusuario: 'ana', rol: 'admin', cargo: 'Gestora', usuario: { iusuario: 'ana', nombre: 'Ana' } }], puedeGestionar: true };</script>
```
