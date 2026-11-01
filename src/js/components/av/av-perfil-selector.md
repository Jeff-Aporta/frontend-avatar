---
name: av-perfil-selector
description: Cambia de perfil de prueba; con sesión guardada es directo y sin ella pide el PIN de 4 dígitos.
---

# `<av-perfil-selector>`

Menú de la barra con los perfiles de `perfiles/lista`. El ícono dice si es el activo, si ya tiene sesión guardada o si
pedirá PIN. Tras entrar, el JWT queda en la bóveda de `core/cuentas.ts` y el próximo cambio es directo.

Sin sesión no pinta botón (los perfiles están en «Entrar como…»), pero sigue resolviendo los pedidos: el clic entra con el
PIN público y, si falla, abre el diálogo. Cualquier componente pide un cambio con `av-perfil-elegir { usuario, fin? }` en
`window`.

## Anatomía

```
<av-perfil-selector>
  #shadow-root
    <iswc-dropdown> botón y perfiles (solo con sesión)
    <iswc-dialog id="dialogo"> PIN de 4 dígitos y Entrar
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Defecto | Notas |
| --- | --- | --- | --- |
| `perfiles` | `PerfilPrueba[]` | `[]` | Vacío: los pide al API. |
| `activo` | `string` | `''` | Usuario de la sesión de esta pestaña. |

## Eventos

| Evento | Dónde | Detalle |
| --- | --- | --- |
| `av-perfil-elegir` | se escucha en `window` | `{ usuario, fin? }`: pide cambiar de perfil. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-perfil-selector></av-perfil-selector>
<script type="module">
  dispatchEvent(new CustomEvent('av-perfil-elegir', { detail: { usuario: 'ana' } }));
</script>
```
