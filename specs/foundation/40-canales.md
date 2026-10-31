# 40 — Canales de comunicación

> Alcance: la vista `canales` (`/canales/` (id `icanal` en el historial)): lista de canales visibles, conversación, envío, no leídos y creación
> de canales. Fuera: permisos y roles (spec de admin), el API (repo `api-avatar`).

## 1. Propósito (WHAT)

Los miembros de una empresa conversan en canales (públicos, privados o directos), al estilo Teams/Slack. Cada usuario ve
los canales de su empresa activa, sabe cuántos mensajes no ha leído, abre uno y escribe; quien gestiona crea canales.

## 2. Requisitos WHAT

- [W-CAN-01] La vista muestra los canales visibles para el usuario en la empresa activa: todos los públicos y los privados o directos donde participa.
- [W-CAN-02] Cada canal muestra su tipo (ícono), nombre, el último mensaje (autor y texto) y un contador de no leídos si los hay.
- [W-CAN-03] Los canales con no leídos aparecen primero (más no leídos arriba); luego los de actividad más reciente; luego por nombre.
- [W-CAN-04] Al abrir un canal se ve su conversación y el canal queda leído para el usuario (el contador desaparece).
- [W-CAN-05] Los mensajes se ven en orden cronológico, agrupados por día con un separador «Hoy», «Ayer» o la fecha.
- [W-CAN-06] Los mensajes propios se alinean a la derecha con el color de marca; los ajenos a la izquierda con el avatar del autor. Los de sistema van centrados.
- [W-CAN-07] Cada mensaje muestra hace cuánto se envió; uno editado lo dice.
- [W-CAN-08] Enter envía el mensaje; Shift+Enter hace un salto de línea; un mensaje vacío o de más de 4000 caracteres no se envía.
- [W-CAN-09] Tras enviar, el mensaje aparece en la conversación sin recargar la página.
- [W-CAN-10] La conversación y la lista se actualizan solas cada 8 segundos mientras la vista está abierta, y con el botón «Actualizar».
- [W-CAN-11] Sin permiso de chat (`avatar.chat`) el redactor está deshabilitado y lo explica.
- [W-CAN-12] Con permiso de gestión (`avatar.gestionar`) aparece «Nuevo», que abre un diálogo con nombre (obligatorio), tipo, equipo opcional y descripción; al crear, el canal aparece en la lista y queda abierto.
- [W-CAN-13] En pantallas estrechas se ve una sola columna: la lista sin canal en la ruta, la conversación con canal (con botón «volver»).

## 3. Guía HOW WEAK

- [HW-CAN-01] Los hijos solo pintan y emiten; el shell es el único que habla con el API.
- [HW-CAN-02] El refresco periódico no muestra el estado de carga (silencioso) para no parpadear.

## 4. Contratos HOW STRONG

- [HS-CAN-01] Componentes: `av-canal-lista`, `av-mensaje`, `av-redactor`, `av-conversacion`, `av-canal-form`, shell `av-canales` (`view/canales/components/`).
- [HS-CAN-02] Eventos: `av-canal-elegido { icanal }`, `av-canal-nuevo`, `av-mensaje-enviar { contenido }`, `av-conversacion-refrescar`, `av-conversacion-volver`, `av-canal-crear { nombre, tipo, descripcion, iequipo }`, `av-canal-form-cerrar`.
- [HS-CAN-03] API (plugin `avatar` de DER): `canales/mios?iempresa=` (`mios`), `canal/{icanal}/enviar` (`enviar`), `canal/{icanal}/leido` (`leido`), `mensajes?q=` (controller `mensajes`, `include: { autor }`), `POST canal` (controller `canales`), `equipos?q=`.
- [HS-CAN-04] Lógica sin DOM en `view/canales/utils/chat.ts`: `ordenarCanales`, `totalSinLeer`, `agruparPorDia`, `rotuloDia`, `claveDia`, `esPropio`, `textoParaEnviar`, `canalActivo`.

## 5. Casos borde y errores

- [W-CAN-14] Sin empresa activa, la vista lo dice y no consulta canales.
- [W-CAN-15] Sin canales visibles: estado vacío (con invitación a crear si se puede).
- [W-CAN-16] Un error del API se muestra en un aviso; el refresco silencioso no lo repite.
- [W-CAN-17] Un id de ruta que no corresponde a un canal visible abre el primero de la lista.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-CAN-18] `tests/vistas/canales`: orden de canales [W-CAN-03], total de no leídos, agrupación por día y rótulos [W-CAN-05], propio/ajeno [W-CAN-06], validación del texto [W-CAN-08] y canal activo [W-CAN-17], sin navegador.

## 7. Notas

- El refresco es por sondeo (8 s); el API no expone SSE de mensajes todavía.
