# Vista `crm` — CRM

Shell: `<av-crm>`. Ruta: `#/crm[/<icliente>]`. Página aislada: `/view/crm/`. Demo: `/view/crm/demo/`.
Spec: [`specs/foundation/55-crm.md`](../../specs/foundation/55-crm.md).

## Alcance

- Dentro: embudo por etapa (`av-embudo`), tabla de clientes (`av-clientes-grid` sobre `iswc-data-grid`) y diálogo de
  cliente (`av-cliente-form`: crear, editar, eliminar; solo lectura sin permiso).
- Fuera: la gráfica del embudo del panel; los usuarios de la plataforma (vista `admin`).

## Contrato

- El shell recibe `props = { id }` del router y es el único que usa `src/js/core/api.ts` (controllers `clientes`, `miembros`).
- Los hijos pintan y emiten `av-crm-filtrar`, `av-cliente-*` (ver la spec). Escritura con `avatar.gestionar`.
- Lógica sin DOM en `utils/crm.ts` y `utils/formulario.ts`.

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de los tokens `--iswc-*`; `fetch` directo al API.
