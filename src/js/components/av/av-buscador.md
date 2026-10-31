---
name: av-buscador
description: Búsqueda global del área privada (Ctrl+K) sobre iswc-command-palette con orden por significado (embeddings horneados + consulta vectorizada por el API).
---

# `<av-buscador>`

Botón «Buscar o ir a… Ctrl K» que abre `<iswc-command-palette>` del kit con los comandos de `consts/comandos.ts`
(un «Ir a» por módulo y acciones frecuentes). El orden es semántico: los vectores de los comandos se hornean en el
build con bge-m3 (`assets/ia/comandos.json`) y la consulta la vectoriza el API; sin API, el orden es léxico.

## Anatomía

```
<av-buscador>
  #shadow-root
    <iswc-button part="abrir"> … <kbd>Ctrl K</kbd>
    <iswc-command-palette> (comandos en <script type="application/json">)
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `permitidos` | `string[]` | `[]` | Vistas a las que el usuario puede ir; vacío = todas. |

## Eventos

| Evento | Detalle | Cuándo |
| --- | --- | --- |
| `av-buscador-global` | `{ accion: 'tema' \| 'paleta' \| 'salir' }` | Se eligió una acción que resuelve el shell. |
