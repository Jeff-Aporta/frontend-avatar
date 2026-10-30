# Vista `proyectos` — Proyectos kanban y tickets

Shell: `<av-proyectos>`. Ruta: `#/proyectos/<iproyecto>`. Página aislada: `/view/proyectos/`. Demo: `/view/proyectos/demo/`.
Spec: [`specs/foundation/50-proyectos.md`](../../specs/foundation/50-proyectos.md).

## Alcance

- Dentro: selector de proyecto, tablero kanban (`av-tablero` sobre `iswc-kanban`), crear/editar tareas (`av-tarea-form`),
  detalle con comentarios y eliminar (`av-tarea-detalle`), crear proyecto con sus 4 columnas (`av-proyecto-form`).
- Fuera: equipos y miembros (vista `organizacion`), KPIs (vista `panel`).

## Contrato

- El shell recibe `props = { id }` del router y reparte `props` a sus hijos; solo él usa `src/js/core/api.ts`.
- Los hijos pintan y emiten `av-tarea-*` / `av-proyecto-*` (ver la spec).
- Permisos: `avatar.tareas` crea, edita, mueve y comenta; `avatar.gestionar` crea proyectos y elimina tareas.
- Lógica sin DOM en `utils/tareas.ts` y `utils/formulario.ts`.

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de los tokens `--iswc-*`; `fetch` directo al API.
