---
name: av-conversacion
description: Conversación de un canal: cabecera, mensajes agrupados por día (av-mensaje) y redactor; emite refrescar y volver.
---

# `<av-conversacion>`

La columna derecha de la vista `canales`.

## Anatomía

```
<av-conversacion>
  #shadow-root
    <section part="conversacion"><header part="cabeza">volver · ícono · nombre · tipo · refrescar</header>
      <div part="mensajes"><div class="dia"><iswc-tag>Hoy</iswc-tag><av-mensaje>…</div></div>
      <av-redactor id="redactor"></section>
    | <av-vacio>
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `canal` | `CanalMio \| null` | `null` | Canal abierto. |
| `mensajes` | `Mensaje[]` | `[]` | Mensajes (cualquier orden; se agrupan por día). |
| `yo` | `string` | `''` | iusuario de la sesión (para alinear los propios). |
| `cargando` | `boolean` | `false` | Carga en curso. |
| `enviando` | `boolean` | `false` | Envío en curso. |
| `puedeEscribir` | `boolean` | `false` | Habilita el redactor. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `av-conversacion-refrescar` | `{}` | Botón actualizar. |
| `av-conversacion-volver` | `{}` | Botón volver (móvil). |
| `av-mensaje-enviar` | `{ contenido }` | Sube desde `av-redactor`. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-conversacion id="c"></av-conversacion>
```
