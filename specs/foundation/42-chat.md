# 42 — Chat en tiempo real (nivel WhatsApp / Telegram)

> Alcance: la familia de componentes `av-chat-*` (reutilizables, pensados para subir luego al kit), su núcleo sin DOM
> (`src/js/chat/`), el demo aislado `view/chat-demo/`, la integración en la vista `canales` y el contrato con `api-avatar`
> (DER + R2 + sala de tiempo real + búsqueda semántica + llamadas). Reemplaza el refresco por sondeo de la spec 40.

## 1. Propósito (WHAT)

Un chat que no le envidie nada a WhatsApp o Telegram: chats 1:1 y grupales, mensajes que llegan al instante a todos los
fronts conectados, archivos, notas de voz, reacciones, respuestas, edición y borrado, confirmaciones de entrega y
lectura, no leídos, búsqueda precisa (por texto y por significado) y llamadas de voz y video.

## 2. Requisitos WHAT

### Chats y lista
- [W-CHAT-01] La lista muestra los chats del usuario en la empresa activa: directos (1:1), grupos y canales públicos.
- [W-CHAT-02] Cada chat muestra foto o iniciales, nombre (en un directo, el de la otra persona), el último mensaje con su autor en grupos, la hora, las marcas de lectura si el último es propio y el contador de no leídos.
- [W-CHAT-03] Orden: fijados arriba; luego por actividad más reciente. Los archivados salen de la lista y van a «Archivados».
- [W-CHAT-04] Filtros rápidos: Todos, No leídos, Grupos, Directos; y una búsqueda por nombre de chat o de persona.
- [W-CHAT-05] «Nuevo chat» abre un buscador de personas de la empresa; elegir una abre (o crea) el directo con ella.
- [W-CHAT-06] «Nuevo grupo» pide integrantes (varios), nombre obligatorio, descripción y foto opcionales; quien crea queda como administrador.
- [W-CHAT-07] Cada chat se puede fijar, silenciar, archivar y marcar como no leído desde su menú.

### Conversación
- [W-CHAT-08] La cabecera muestra foto, nombre y el estado: «en línea», «escribiendo…», «grabando audio…» o «últ. vez hoy a las 10:42»; en grupos, quién escribe y cuántos integrantes hay.
- [W-CHAT-09] Los mensajes se agrupan por día («Hoy», «Ayer», fecha) y los consecutivos del mismo autor en menos de 5 minutos se juntan (solo el primero lleva cola y nombre).
- [W-CHAT-10] Al abrir un chat con no leídos aparece la línea «N mensajes no leídos» y la vista arranca ahí; si no, abajo.
- [W-CHAT-11] Al subir hasta el principio se cargan los mensajes anteriores sin saltar la posición de lectura.
- [W-CHAT-12] Si el usuario no está abajo y llega un mensaje, no se le mueve la vista: aparece un botón «bajar» con el número de nuevos.
- [W-CHAT-13] Actualizar la conversación nunca la repinta entera: los mensajes se agregan, cambian o quitan uno a uno (sin parpadeo).
- [W-CHAT-14] Mensajes propios a la derecha con el color de marca; ajenos a la izquierda; en grupos, nombre del autor con un color estable por persona. Los de sistema (creó el grupo, agregó a…, llamada perdida) van centrados.
- [W-CHAT-15] Formato ligero: `*negrita*`, `_cursiva_`, `~tachado~`, `` `código` ``, bloques ```` ``` ````, enlaces clicables y menciones `@nombre` resaltadas. Un mensaje de solo emojis (hasta 3) se ve grande.

### Envío
- [W-CHAT-16] Enter envía, Shift+Enter salto de línea; el redactor crece hasta 6 líneas. Vacío o más de 4000 caracteres no se envía.
- [W-CHAT-17] Lo enviado aparece al instante con un reloj (pendiente); al confirmarlo el API pasa a ✓ (enviado); cuando llega a otro front, ✓✓ gris (entregado); cuando todos lo leyeron, ✓✓ en color (leído). En grupos, «leído» exige a todos los integrantes.
- [W-CHAT-18] Un envío que falla queda marcado con «no enviado · reintentar»; nada se pierde al recargar (cola local).
- [W-CHAT-19] Selector de emojis en el redactor; responder a un mensaje muestra la cita arriba del redactor y en la burbuja; tocar la cita lleva al original y lo resalta.
- [W-CHAT-20] Adjuntos: archivo, imagen o video por botón, arrastrar y soltar o pegar. Antes de enviar se ve la vista previa con texto opcional; durante la subida, una barra de progreso cancelable. El máximo por archivo lo define Administración (30 MB de fábrica).
- [W-CHAT-21] Notas de voz: mantener o tocar el micrófono graba (con tiempo y onda), se puede cancelar; se reproduce con barra de avance y velocidad 1×/1.5×/2×.
- [W-CHAT-22] Imágenes y videos se ven en miniatura en la burbuja y a pantalla completa al tocarlos; documentos con ícono, nombre, tamaño y descarga.

### Acciones sobre un mensaje
- [W-CHAT-23] Menú contextual (clic derecho, mantener pulsado o botón en hover): responder, reaccionar, copiar, reenviar, destacar, fijar, info, editar, eliminar.
- [W-CHAT-24] Reacciones: seis rápidas (👍 ❤️ 😂 😮 😢 🙏) y más; una por persona y por mensaje (reaccionar otra la reemplaza, la misma la quita); bajo la burbuja se ven agrupadas con conteo y quién reaccionó.
- [W-CHAT-25] Editar: solo propios de texto y durante 15 minutos; queda «editado».
- [W-CHAT-26] Eliminar «para mí» lo oculta solo al usuario; «para todos» (propios, 1 hora) lo reemplaza por «Se eliminó este mensaje» en todos los fronts.
- [W-CHAT-27] Reenviar a uno o varios chats; el reenviado se marca «Reenviado».
- [W-CHAT-28] Info del mensaje: quién lo recibió y quién lo leyó, con hora.
- [W-CHAT-29] Destacados y fijados se ven en la info del chat; el fijado además en una franja arriba de la conversación.

### Tiempo real y presencia
- [W-CHAT-30] Mensajes, ediciones, borrados, reacciones, lecturas, «escribiendo» y cambios de grupo llegan a todos los fronts conectados sin recargar y en menos de un segundo.
- [W-CHAT-31] Presencia: «en línea» mientras el usuario tiene un front abierto; si no, la hora de su última conexión.
- [W-CHAT-32] Si se cae la conexión aparece «Conectando…»; al volver se piden los mensajes que faltaron y se envía la cola pendiente.

### Búsqueda
- [W-CHAT-33] Buscar dentro de un chat o en todos: modo «texto» (palabras) y modo «significado» (semántica: encuentra «reunión del lunes» aunque el mensaje diga «nos vemos el lunes a las 9»). Los resultados muestran chat, autor, fecha y el fragmento resaltado; tocar uno abre el chat en ese mensaje.

### Temas
- [W-CHAT-47] Cada chat tiene tema: doce predefinidos, uno propio con dos colores y ángulo, o el de la app. Lo cambia cualquier integrante y lo ven todos al instante.

### Grupos
- [W-CHAT-34] Info del grupo: foto, nombre, descripción, integrantes con su rol, multimedia, archivos y enlaces compartidos, destacados.
- [W-CHAT-35] Los administradores agregan y quitan integrantes, los nombran administradores y editan nombre, descripción y foto; cualquiera puede salir. Cada cambio deja un mensaje de sistema.

### Llamadas
- [W-CHAT-36] Desde la cabecera: llamada de voz o de video (1:1 y grupos de hasta 6). Quien recibe ve la llamada entrante con aceptar y rechazar, y suena.
- [W-CHAT-37] En la llamada: silenciar, apagar cámara, compartir pantalla, cambiar a video, colgar; mosaico de participantes con quién habla resaltado y la duración.
- [W-CHAT-38] Toda llamada deja un mensaje en el chat: «Llamada de voz · 3:12», «Videollamada perdida».

### Demo y accesibilidad
- [W-CHAT-39] `view/chat-demo/` monta el chat completo sin API (backend de memoria): dos pestañas del demo conversan en tiempo real entre sí, con usuarios de muestra y un selector «hablar como». Con sesión, un interruptor lo conecta al API real.
- [W-CHAT-40] Todo se usa con teclado (flechas en la lista, Esc cierra menús y cancela respuesta/edición); los mensajes nuevos se anuncian con `aria-live`; todo escala con el font-size (em) y se tiñe con la paleta activa.

### Notificaciones

Un solo sistema (`src/js/notificaciones/`), vivo mientras dure la pestaña, en cualquier vista.

- W-NOTI-01: Mensajes, menciones, reacciones, llamadas, tareas asignadas, correos y solicitudes llegan al instante en cualquier vista; navegar no los pierde.
- W-NOTI-02: Cada aviso nuevo muestra un toast con «Abrir»; lo que la persona está mirando no se repite, y lo silenciado no avisa.
- W-NOTI-03: La campana, el menú y el título de la pestaña muestran cuánto falta por leer; el centro lista todo y permite marcarlo leído.
- W-NOTI-04: Lo leído queda leído al recargar y en los demás dispositivos.
- W-NOTI-05: Al reconectar se repone lo que faltó y se resume en un solo aviso.
- W-NOTI-06: Sonido y avisos del navegador son opcionales: los activa la persona.
- W-NOTI-07: El demo conversa entre pestañas, perfiles y navegadores, conserva todo al recargar y avisa igual que la app. Es una sala pública.

## 3. Guía HOW WEAK

- [HW-CHAT-01] Componentes pequeños que solo pintan y emiten; el shell `av-chat` habla con un `ChatBackend` (interfaz), nunca con `fetch` directo.
- [HW-CHAT-02] Estado único sin DOM (`src/js/chat/estado.ts`): reductor puro `(estado, evento) → estado` que aplican por igual las respuestas del API y los eventos de la sala; las pruebas lo ejercitan sin navegador.
- [HW-CHAT-03] La lista de mensajes reconcilia por clave (`imensaje` o `clave_cliente`): agrega, actualiza o quita nodos; nunca `replaceChildren` de toda la conversación.
- [HW-CHAT-04] Nombres y textos de la interfaz en un diccionario (`textos`) para poder generalizar los componentes a otras apps.
- [HW-CHAT-05] Archivos al R2 por el API (nunca credenciales en el front); tiempo real por WebSocket abierto desde el front contra la sala; las llamadas son WebRTC entre fronts con señalización por la misma sala.

## 4. Contratos HOW STRONG

### Front
- [HS-CHAT-01] Componentes en `src/js/components/chat/`: `av-chat` (shell, `iswc-split-panel` lista | conversación | info), `av-chat-lista`, `av-chat-item`, `av-chat-cabecera`, `av-chat-mensajes`, `av-chat-burbuja`, `av-chat-reacciones`, `av-chat-emojis`, `av-chat-compositor`, `av-chat-adjunto`, `av-chat-audio`, `av-chat-visor`, `av-chat-busqueda`, `av-chat-nuevo`, `av-chat-grupo-form`, `av-chat-info`, `av-chat-reenviar`, `av-chat-llamada`. Cada uno con sus 4 archivos hermanos y su ficha en el manifest del demo.
- [HS-CHAT-02] Núcleo sin DOM en `src/js/chat/`: `tipos.ts` (contrato y Zod), `backend.ts` (interfaz `ChatBackend`), `backend-demo.ts` (memoria + `BroadcastChannel`), `backend-avatar.ts` (controllers de cliente DER + sala), `sala.ts` (cliente WebSocket con reconexión y cola), `llamadas.ts` (WebRTC en malla + tono con Web Audio), `estado.ts` (reductor y selectores), `formato.ts` (formato ligero, agrupación, marcas de lectura, emojis grandes), `textos.ts`, `cola.ts` (cola local de pendientes), `emojis.ts` (categorías del selector, carga del catálogo completo `assets/ia/emojis-catalogo.json` y recientes; ver `15-busqueda-semantica.md`). Las props de los componentes van en `src/js/consts/schemas/chat.schemas.ts` (`CHAT_PROPS`).
- [HS-CHAT-10] Registro: la familia vive en `FAMILIA_TAGS.chat` de `src/js/kit-tags.ts` (publicada en `dist/cdn/js/components/chat/`); no entra al arranque: la cargan las vistas de `VIEW_FAMILIAS` (`canales`, `chat-demo`), cuyas `VIEW_KIT_TAGS` declaran los `iswc-*` que usa (split-panel, dialog, input, textarea, tab-group, progress-bar, format-bytes, lightbox, checkbox). Barril propio `src/js/components/chat/all.ts`.
- [HS-CHAT-11] `<av-chat>`: propiedad `backend: ChatBackend` (no es prop), props `{ titulo, chat, clave, demo }` (`demo` = persona de muestra → backend de memoria si no hay backend), métodos `recargar(abrir?)` y `abrirPanel('nuevo' | 'grupo' | 'busqueda')`; emite `av-chat-abierto { icanal }` y `av-chat-error { mensaje }`.
- [HS-CHAT-03] Eventos de componentes: `av-chat-abrir { icanal, imensaje? }`, `av-chat-enviar { contenido, respuesta_a?, archivos?, nota? }`, `av-chat-accion { accion, imensaje, texto? }` (`responder`, `copiar`, `reenviar`, `destacar`, `fijar`, `desfijar`, `info`, `editar`, `editar-guardar`, `cancelar`, `eliminar-mi`, `eliminar-todos`, `reintentar`, `cancelar-subida`, `ver`, `ir`, `reaccionar-mas`), `av-chat-reaccionar { imensaje, emoji|null }`, `av-chat-escribiendo { modo }`, `av-chat-cargar-anteriores`, `av-chat-buscar { q, modo, icanal? }`, `av-chat-llamar { tipo }`; además `av-chat-menu`, `av-chat-panel`, `av-chat-panel-cerrar`, `av-chat-lista-filtro`, `av-chat-preferencias`, `av-chat-directo`, `av-chat-grupo-crear|editar`, `av-chat-miembros`, `av-chat-reenviar`, `av-chat-soltar`, `av-chat-llamada-accion` (detalle en la ficha `.md` de cada pieza).

### API (`api-avatar`, plugin `avatar` de DER; todo por `seed()`; tablas `avatar_*`)
- [HS-CHAT-04] Modelo: `canal.tipo` ∈ publico | privado | directo | grupo, con `foto` (iarchivo) y `fijado` (imensaje); `participante` + `rol` (admin|miembro), `fijado`, `silenciado`, `archivado`, `ultimo_leido`, `ultimo_entregado`, `conectado` (última vez); `mensaje` + `tipo` ∈ texto|sistema|archivo|imagen|video|audio|llamada, `iarchivo`, `reenviado`, `eliminado`, `editado_en`, `clave_cliente` (único: idempotencia), `metadatos` (JSON). Tablas nuevas: `avatar_reacciones` (imensaje, iusuario, emoji), `avatar_ocultos` (imensaje, iusuario), `avatar_destacados` (imensaje, iusuario), `avatar_archivos` (clave R2, nombre, mime, bytes, ancho, alto, duracion), `avatar_llamadas` (icanal, tipo, iniciador, estado, inicio, fin, participantes).
- [HS-CHAT-05] Ops: `canales/mios` (resumen de chats), `canal/directo {iusuario}`, `canal/grupo {nombre, descripcion?, miembros[], foto?}`, `canal/{id}/historial?antes=&limite=`, `canal/{id}/enviar` (con `clave_cliente`, `iarchivo`, `reenviado`), `canal/{id}/leido`, `canal/{id}/entregado`, `canal/{id}/lecturas`, `canal/{id}/preferencias`, `canal/{id}/miembros` (agregar/quitar/rol/salir), `canal/{id}/editar`, `mensaje/{id}/editar|eliminar|reaccionar|destacar|fijar|info`, `mensajes/buscar?q=&modo=texto|semantica&icanal=`, `archivos/subir` (cuerpo binario → R2), `archivo/{id}/url` (URL firmada de corta vida), `llamada` (registro), `rt/ticket` (ticket de la sala + servidores ICE).
- [HS-CHAT-06] R2: bucket `avatar-archivos`, binding `ARCHIVOS`; claves `empresa/{iempresa}/{yyyy}/{mm}/{uuid}-{nombre}`; descarga por `GET /api/r2/{clave}?exp=&sig=` (HMAC con el secreto del JWT).
- [HS-CHAT-07] Sala: Durable Object `SalaRT` (WebSocket con hibernación) en `wss://api-avatar…/rt/empresa-{iempresa}?ticket=`. Solo enruta: sella `de` y `ts`, difunde a todos o a `para[]`, lleva presencia. El protocolo (`mensaje.nuevo`, `mensaje.editado`, `mensaje.eliminado`, `reaccion`, `leido`, `entregado`, `escribiendo`, `presencia`, `canal.actualizado`, `fijado`, `llamada.invitar|unirse|oferta|respuesta|ice|colgar|rechazar`) lo definen los fronts: cada front, tras confirmar una escritura con el API, difunde `{ tipo, datos, para: integrantes }`. Las señales de llamada llevan `front` (pestaña emisora) y `paraFront`; la negociación es la «perfecta» del W3C (lado cortés = `front` menor).
- [HS-CHAT-08] Búsqueda semántica: Workers AI `@cf/baai/bge-m3` (multilingüe) + Vectorize `avatar-mensajes` (metadatos `icanal`, `iempresa`); cada mensaje de texto se indexa al enviarse o editarse y se borra al eliminarse; los resultados se filtran por los chats visibles del usuario.
- [HS-CHAT-09] Llamadas: STUN `stun:stun.cloudflare.com:3478`; TURN de Cloudflare Realtime si el Worker tiene `REALTIME_TURN_KEY_ID` y `REALTIME_TURN_KEY_TOKEN` (las credenciales ICE las genera `rt/ticket`). Más de 6 integrantes queda para el SFU de Cloudflare Realtime.

## 5. Casos borde y errores

- [W-CHAT-41] Sin empresa activa o sin permiso `avatar.chat`, el chat lo explica y no consulta.
- [W-CHAT-42] Un mensaje duplicado (mismo `clave_cliente`) no se guarda dos veces.
- [W-CHAT-43] Un archivo de más de 25 MB o de tipo bloqueado se rechaza antes de subir, con el motivo.
- [W-CHAT-44] Sin micrófono o cámara (o sin permiso), el botón lo explica en lugar de fallar.
- [W-CHAT-45] Quien no es integrante de un chat privado o grupo no lo ve, no lo busca y la sala no le entrega sus eventos.

## 6. Pruebas

- [W-CHAT-46] `tests/vistas/chat.test.ts` (sin navegador): reductor (enviar optimista → confirmado → entregado → leído; reacción reemplaza; edición; borrado para todos; mensajes fuera de orden e idempotencia), formato ligero, agrupación, marcas de lectura en grupos, orden de la lista, filtros, cola local, backend demo entre dos instancias.
- [W-CHAT-47] `api-avatar/tests/chat.test.ts`: directo idempotente, grupo con roles, permisos de edición/borrado por tiempo, reacciones únicas, lecturas, búsqueda por texto, archivo de ida y vuelta (R2 simulado), ticket de sala firmado y vencido.

## 7. Notas

- Cobertura automática (`tests/vistas/chat.test.ts`, `tests/vistas/canales.test.ts`, guardián `tests/vistas/registro.test.ts`): W-CHAT-03, 04, 08, 09, 10, 15, 16, 17, 18, 24, 25, 26, 30, 32, 33, 38, 39, 41, 42, 43, 45.
- Verificados en el navegador con el demo en dos pestañas (claro, oscuro y 375 px) y pendientes de prueba e2e (Stagehand): W-CHAT-01, 02, 05, 06, 07, 11, 12, 13, 14, 19, 20, 21 (sin micrófono en el panel de pruebas: se comprobó el aviso de W-CHAT-44), 22, 23, 27, 28, 29, 31, 34, 35, 36, 37 (videollamada real entre pestañas con medio simulado), 40.
- W-CHAT-47 es del repo `api-avatar`.
- Notificaciones: `centro.ts` es dueño del backend de la sesión y del único socket de la pestaña; `<av-chat>` lo toma prestado. Los mensajes no crean filas (cada chat con no leídos es una entrada); el resto son filas de `avatar_notificaciones`, que además son la cola de lo ocurrido sin conexión.
- Demo: la sala pública `/rt/demo` guarda operaciones numeradas y es la fuente de verdad; `BroadcastChannel` y `localStorage` quedan como entrega inmediata y caché. Un adjunto de más de 40 KB no cruza navegadores (el evento de la sala tope 64 KB): viaja solo entre pestañas del mismo navegador.
- La búsqueda «por significado» del demo es léxica (raíces + sinónimos); la semántica real es del API (bge-m3 + Vectorize). El front no carga modelos.
- Sin cámara o micrófono, el demo usa un medio simulado (lienzo animado + pista muda) para poder probar llamadas entre pestañas; con el API real el botón lo explica.
- Una pestaña en segundo plano aplica los eventos al estado pero no pinta (requestAnimationFrame en pausa) ni marca leído: al volver al frente pinta y lee.
- `backend-avatar.ts` está escrito contra este contrato (nombres de ops en `OPS`); mientras el API no publique `historial`, `ticket` y `enviar`, `canales` cae al demo local y lo avisa.
