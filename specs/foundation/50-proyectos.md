# 50 — Proyectos: tableros kanban y tickets

> Alcance: la vista `proyectos` (`#/proyectos/<iproyecto>`): selector de proyecto, tablero kanban, tareas, comentarios
> y creación de proyectos. Fuera: el panel, el CRM y la administración de equipos (otras specs).

## 1. Propósito (WHAT)

Cada empresa organiza su trabajo en proyectos con un tablero kanban. Las tareas (tickets con código `TK-000001`)
avanzan de columna en columna; el equipo las crea, asigna, comenta y cierra.

## 2. Requisitos WHAT

- [W-PRY-01] La vista muestra los proyectos de la empresa activa en un selector; sin proyecto en la ruta abre el primero; sin proyectos muestra un estado vacío que dice cómo crear uno.
- [W-PRY-02] El tablero muestra una columna por columna del proyecto, en su orden, con su color y el conteo de tarjetas (o `n/límite` si la columna tiene límite).
- [W-PRY-03] Cada tarjeta muestra código y título, la prioridad con color (urgente rojo, alta ámbar, media marca, baja neutra), etiquetas, la fecha de vencimiento y el asignado; una tarea vencida y no cerrada se marca en rojo.
- [W-PRY-04] Dentro de una columna las tarjetas van por su orden y, a igual orden, de más a menos urgente.
- [W-PRY-05] Arrastrar una tarjeta a otra columna (o reordenarla) la mueve en el servidor; una columna que cierra deja la tarea cerrada; si el servidor lo rechaza (límite de columna, permiso) se avisa y el tablero vuelve al estado real.
- [W-PRY-06] Quien tiene permiso de tareas crea y edita tareas (título obligatorio, descripción, prioridad, columna, asignado entre los miembros de la empresa, vencimiento y etiquetas separadas por comas).
- [W-PRY-07] Clic en una tarjeta abre su detalle con todos sus datos y los comentarios en orden; quien tiene permiso de tareas comenta; quien gestiona puede eliminarla tras confirmar.
- [W-PRY-08] Quien gestiona crea proyectos; un proyecto nuevo nace con cuatro columnas: Por hacer, En progreso, En revisión y Hecho (la última cierra).
- [W-PRY-09] Sin permiso, los botones de escritura no aparecen y el tablero no se puede arrastrar.

## 3. Guía HOW WEAK

- [HW-PRY-01] Solo el shell habla con el API; los hijos pintan y emiten eventos `av-tarea-*`/`av-proyecto-*`.
- [HW-PRY-02] La lógica sin DOM (colores, vencimiento, orden, columnas por defecto, etiquetas) vive en `view/proyectos/utils/`.

## 4. Contratos HOW STRONG

- [HS-PRY-01] Tags: `av-proyectos` (shell), `av-tablero`, `av-tarea-form`, `av-tarea-detalle`, `av-proyecto-form`.
- [HS-PRY-02] Eventos: `av-tarea-mover { itarea, icolumna, orden }`, `av-tarea-abrir { itarea }`, `av-tarea-nueva { icolumna }`, `av-tarea-guardar { datos }`, `av-tarea-comentar { itarea, contenido }`, `av-tarea-editar { itarea }`, `av-tarea-eliminar { itarea }`, `av-proyecto-guardar { datos }`, y los `*-cerrar`/`*-error` de los formularios.
- [HS-PRY-03] API: `GET proyecto/{id}/tablero`, `POST tarea/{id}/mover` (ops `tablero`, `mover` del plugin `avatar`) y los controllers DER `proyectos`, `columnas`, `tareas`, `comentarios`, `miembros`, `equipos`. Permisos: `avatar.tareas` (crear, editar, mover, comentar) y `avatar.gestionar` (proyectos, eliminar tareas).

## 5. Casos borde y errores

- [W-PRY-10] Un proyecto de la ruta que no es de la empresa activa redirige al primero de la empresa.
- [W-PRY-11] Guardar una tarea sin título no envía nada y avisa qué revisar; un error del API se muestra en el formulario sin perder lo escrito.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-PRY-12] `tests/vistas/proyectos`: color por prioridad [W-PRY-03], vencimiento [W-PRY-03], orden de tarjetas [W-PRY-04], columnas por defecto [W-PRY-08], etiquetas, posición tras mover y columna inicial.

## 7. Notas

- El API cierra la tarea al llegar a una columna con `cierra` y la reabre al salir de ella.
