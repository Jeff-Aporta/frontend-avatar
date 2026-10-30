# Vista `asistente` — Asistente AVO

Shell: `<av-asistente>`. Ruta: `#/asistente`. Página aislada: `/view/asistente/`. Demo: `/view/asistente/demo/`.

## Alcance

- Dentro: lo que describe la spec `specs/foundation/` de esta vista.
- Fuera: lo que pertenece a otras vistas (una vista no importa componentes de otra; lo compartido sube a `src/js/`).

## Contrato

- El shell recibe `props = { id }` del router (`#/asistente/<id>`) y reparte `props` a sus hijos.
- Los hijos no hablan con el API ni con el estado: pintan y emiten eventos `av-…`; el shell los escucha una vez.
- Datos: `src/js/core/api.ts` (controllers de cliente de DER y `ops` del plugin `avatar`); permisos con `puede()`.

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de los tokens `--iswc-*`; `fetch` directo al API.
