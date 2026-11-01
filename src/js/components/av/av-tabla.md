---
name: av-tabla
description: Tabla de catálogo reutilizable (buscador, grid del kit y estado vacío) configurada por props; la búsqueda la resuelve el shell.
---

# `<av-tabla>`

Tabla de catálogo de las vistas de negocio. No conoce ningún dominio: cada vista declara su configuración en `utils`
(`tablaRrhh`, `tablaFinanzas`, `tablaInventario`, `tablaClientes`). El grid se nombra una sola vez, en `GRID_TAG` de
`src/js/kit-tags.ts`; toda vista que use `av-tabla` lo declara en `VIEW_KIT_TAGS`.

## Anatomía

```
<av-tabla>
  #shadow-root
    <div part="barra"><iswc-input class="buscador" type="search"> <span part="conteo"></div>
    <GRID_TAG part="grid" pagination>
    <iswc-empty-state class="vacio">
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

| Prop | Tipo | Default | Qué hace |
| --- | --- | --- | --- |
| `prefijo` | `string` | `'av-tabla'` | Prefijo de los eventos que emite. |
| `entidad` | `string` | `''` | Qué tabla es; viaja en cada evento. |
| `columnas` | `ColumnaTabla[]` | `[]` | Contrato de columnas del grid; `acciones` añade botones por fila. |
| `idCampo` | `string` | `'id'` | Campo que identifica la fila. |
| `buscador` | `string` | `'Buscar…'` | Texto de ayuda del buscador. |
| `vacio` | `{ icono, titulo, texto }` | `Nada por aquí` | Estado sin filas (con texto buscado, «Sin resultados»). |
| `porPagina` | `number` | `10` | Filas por página. |
| `filas` | `FilaTabla[]` | `[]` | Filas planas (las arma el shell con utils). |
| `cargando` | `boolean` | `false` | Indicador de carga. |
| `texto` | `string` | `''` | Texto del buscador. |
| `puedeEscribir` | `boolean` | `false` | Muestra las columnas con `acciones`. |

## Eventos

| Evento | detail | Cuándo |
| --- | --- | --- |
| `<prefijo>-buscar` | `{ entidad, texto }` | Al escribir en el buscador. |
| `<prefijo>-abrir` | `{ entidad, id }` | Clic en una fila. |
| `<prefijo>-accion` | `{ entidad, accion, id }` | Botón de acción de una fila. |

## Slots

<!-- exclude: Slots -->

## Ejemplos

```html
<av-tabla id="t"></av-tabla>
<script>t.props = { prefijo: 'av-rrhh', entidad: 'empleados', idCampo: 'iempleado', columnas: [{ field: 'nombre', headerName: 'Nombre' }], filas: [{ iempleado: 1, nombre: 'María' }] };</script>
```
