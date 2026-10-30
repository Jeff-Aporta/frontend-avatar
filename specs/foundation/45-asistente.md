# 45 — Asistente AVO

> Alcance: la vista `asistente` (`#/asistente`): chat con el asistente AVO. Fuera: cómo AVO construye la respuesta
> (repo `api-avatar`, flujo `consultas/preguntar`).

## 1. Propósito (WHAT)

AVO responde preguntas del usuario con los datos reales de su empresa (tareas, clientes, canales, miembros) y lo guía
por la plataforma. Cada conversación queda guardada en su historial.

## 2. Requisitos WHAT

- [W-AVO-01] Al abrir la vista se carga el historial reciente del usuario (hasta 20 consultas) en orden cronológico: su pregunta y la respuesta de AVO.
- [W-AVO-02] Sin historial se ve un saludo de AVO con el nombre del usuario.
- [W-AVO-03] El usuario escribe una pregunta y la envía con Enter (Shift+Enter salto) o con el botón; vacía o de más de 2000 caracteres no se envía.
- [W-AVO-04] La pregunta aparece al instante como burbuja del usuario (derecha) y AVO muestra «está pensando…» hasta responder (izquierda, con ícono de robot).
- [W-AVO-05] La pregunta se hace sobre la empresa activa.
- [W-AVO-06] Debajo del chat hay sugerencias de preguntas (las de la última respuesta, o unas iniciales); pulsar una la envía.
- [W-AVO-07] Mientras AVO piensa no se puede enviar otra pregunta.

## 3. Guía HOW WEAK

- [HW-AVO-01] El shell guarda los turnos en `props`; cada turno es un `av-avo-mensaje`.

## 4. Contratos HOW STRONG

- [HS-AVO-01] Componentes: `av-avo-mensaje` y el shell `av-asistente` (`view/asistente/components/`).
- [HS-AVO-02] API (plugin `avatar` de DER): `POST consultas/preguntar` (`preguntar({ pregunta, iempresa })` → `{ iconsulta, pregunta, respuesta, sugerencias }`), `consultas?q=` (controller `consultas`, orden `-creado`).
- [HS-AVO-03] Lógica sin DOM en `view/asistente/utils/avo.ts`: `turnosDe`, `preguntaValida`, `SUGERENCIAS_INICIALES`, `idLocal`.

## 5. Casos borde y errores

- [W-AVO-08] Si AVO no responde (error del API), se muestra un aviso y la pregunta queda en el chat para reintentar.
- [W-AVO-09] Si el historial no carga, la vista sigue usable con el saludo.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-AVO-10] `tests/vistas/asistente`: historial → turnos en orden [W-AVO-01], consulta sin respuesta solo deja la pregunta, validación de la pregunta [W-AVO-03] y sugerencias iniciales [W-AVO-06], sin navegador.

## 7. Notas

- AVO responde por reglas sobre los datos de la empresa; un modelo de lenguaje puede reemplazarlo en el API sin cambiar este contrato.
