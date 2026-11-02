---
name: av-campana
description: Campana con contador y centro de notificaciones (chats sin leer y avisos del API), marcar leídas, sonido y permiso del navegador.
---

# `<av-campana>`

Barra de la app: contador de lo que falta por leer y, al pulsarla, el cajón con el centro de notificaciones. No guarda estado: lo pinta de `notificaciones/centro.ts`. Se oculta mientras no hay fuente (sin sesión y sin demo).

## Anatomía

```
<av-campana>
  #shadow-root
    <iswc-button class="campana"> <span class="cifra">
    <iswc-drawer class="cajon">
      <div part="panel"> .acciones · ul.lista · <iswc-empty-state> · .ajustes
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

No recibe props.

## Eventos

No emite eventos: abrir, leer y las preferencias van directo al centro.

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-campana slot="actions"></av-campana>
```
