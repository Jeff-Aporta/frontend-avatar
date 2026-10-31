---
name: av-chat-lista
description: Columna de chats con buscador, filtros rápidos, archivados y filas reconciliadas por id (sin parpadeo).
---

# `<av-chat-lista>`

Lista con filtros Todos, No leídos, Grupos y Directos; flechas para recorrerla.

## Anatomía

```
<av-chat-lista>
  #shadow-root
    <nav part="lista"><header part="cabeza"> <div class="conexion"> <iswc-input class="buscador"> <div class="filtros"> <button class="archivados"> <div part="filas" role="listbox"><av-chat-item>…</div></nav>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `chats` | `ItemChat[]` | `[]` | Filas ya ordenadas y filtradas. |
| `activo` | `string \| null` | `null` | Chat abierto. |
| `filtro` | `'todos' \| 'noleidos' \| 'grupos' \| 'directos'` | `'todos'` | Filtro activo. |
| `q` | `string` | `''` | Búsqueda. |
| `archivados` | `boolean` | `false` | Muestra los archivados. |
| `cantidadArchivados` | `number` | `0` | Contador de «Archivados». |
| `conexion` | `'conectado' \| 'conectando' \| 'desconectado'` | `'conectado'` | Aviso de conexión. |
| `titulo` | `string` | `''` | Título. |
| `cargando` | `boolean` | `false` | Esqueletos. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-chat-lista-filtro` | `{ filtro?, q?, archivados? }` | Cambió un filtro. |
| `av-chat-panel` | `{ panel }` | `nuevo`, `grupo` o `busqueda`. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-chat-lista id="x"></av-chat-lista>
<script>x.props = {"chats": [{"id": "g1", "tipo": "grupo", "nombre": "Equipo Odys", "foto": null, "iniciales": "EO", "color": 4, "ultimo": "¿Alguien tiene el presupuesto?", "autorUltimo": "Ana", "hora": "10:42", "marca": null, "noLeidos": 3, "fijado": true, "silenciado": false, "archivado": false, "marcadoNoLeido": false, "escribiendo": "", "enLinea": false}, {"id": "d1", "tipo": "directo", "nombre": "Beto Ruiz", ";</script>
```
