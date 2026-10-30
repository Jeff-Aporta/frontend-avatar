# Vista `organizacion` — Empresa, miembros y equipos

Shell: `<av-organizacion>`. Ruta: `#/organizacion`. Página aislada: `/view/organizacion/`. Demo: `/view/organizacion/demo/`. Spec: `specs/foundation/60-organizacion.md`.

## Alcance

- Dentro: ficha de la empresa activa (crear/editar), miembros (invitar con rol y cargo, quitar), equipos (crear, editar, eliminar, integrantes líder/integrante).
- Fuera: usuarios y roles de seguridad (vista `admin`), canales y proyectos.

## Contrato

- Hijos: `av-empresa-form`, `av-invitar-form`, `av-miembros`, `av-equipos`; solo pintan y emiten `av-*`. El shell escucha y llama al API.
- Escrituras solo con `avatar.gestionar` (`puede()`); el server decide.
- Dominio sin DOM en `utils/organizacion.ts`.

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de `--iswc-*`; `fetch` directo al API.
