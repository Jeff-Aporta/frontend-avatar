# Vista `canales` — Canales de comunicación

Shell: `<av-canales>`. Ruta: `#/canales/<icanal>`. Página aislada: `/view/canales/`. Demo: `/view/canales/demo/`.
Spec: [`specs/foundation/40-canales.md`](../../specs/foundation/40-canales.md).

## Alcance

- Dentro: lista de canales visibles con no leídos, conversación agrupada por día, envío (Enter), marcar leído al abrir,
  refresco cada 8 s, crear canal (con `avatar.gestionar`), una columna en móvil.
- Fuera: editar o archivar canales, participantes de canales privados, adjuntos, menciones (pendiente en el API).

## Piezas

| Tag | Qué hace |
| --- | --- |
| `av-canal-lista` | Columna de canales; emite `av-canal-elegido`, `av-canal-nuevo`. |
| `av-conversacion` | Cabecera + mensajes por día + redactor; emite `av-conversacion-refrescar`, `av-conversacion-volver`. |
| `av-mensaje` | Burbuja (propia/ajena/sistema). |
| `av-redactor` | Escribir; emite `av-mensaje-enviar`. |
| `av-canal-form` | Diálogo de canal nuevo; emite `av-canal-crear`, `av-canal-form-cerrar`. |
| `av-canales` | Shell: escucha todo y habla con el API. |

## Contrato

- El shell recibe `props = { id }` del router y reparte `props` a sus hijos.
- Los hijos no hablan con el API ni con el estado: pintan y emiten eventos `av-…`; el shell los escucha una vez.
- Datos: `src/js/core/api.ts` (`dominio()['mios'|'enviar'|'leido']`, `controller('mensajes'|'canales'|'equipos')`).
- Lógica sin DOM: `utils/chat.ts` (probada en `tests/vistas/canales.test.ts`).

## Qué no hacer

- HTML suelto fuera de un componente; colores fuera de los tokens `--iswc-*`; `fetch` directo al API.
