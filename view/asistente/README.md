# Vista `asistente` — Asistente AVO

Shell: `<av-asistente>`. Ruta: `#/asistente`. Página aislada: `/view/asistente/`. Demo: `/view/asistente/demo/`.
Spec: [`specs/foundation/45-asistente.md`](../../specs/foundation/45-asistente.md).

## Alcance

- Dentro: historial reciente, preguntas libres (Enter), sugerencias como chips, respuesta sobre la empresa activa.
- Fuera: cómo AVO arma la respuesta (API `consultas/preguntar`), borrar el historial.

## Piezas

| Tag | Qué hace |
| --- | --- |
| `av-avo-mensaje` | Burbuja del usuario o de AVO. |
| `av-asistente` | Shell: historial, envío y sugerencias. |

## Contrato

- Datos: `dominio()['preguntar']({ pregunta, iempresa })` y `controller('consultas').query(...)` de `src/js/core/api.ts`.
- Lógica sin DOM: `utils/avo.ts` (probada en `tests/vistas/asistente.test.ts`).

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de los tokens `--iswc-*`; `fetch` directo al API.
