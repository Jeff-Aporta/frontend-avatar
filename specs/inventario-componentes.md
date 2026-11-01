# Inventario de componentes de Avatar

Generado de los `.json` de demos. Total: 84.

| Tag | Para qué | Props principales | Archivo |
| --- | --- | --- | --- |
| `av-acceso` | Login con el kit y cuentas de prueba. | ocupado, error | `view/acceso/components/av-acceso.json` |
| `av-admin` | Usuarios, roles y Mi cuenta (necesita sesión de administrador para cargar datos). | pestana | `view/admin/components/av-admin.json` |
| `av-almacenamiento` | Límite por archivo y uso de R2. | maxMb, archivos, bytes | `view/admin/components/av-almacenamiento.json` |
| `av-roles` | Roles y sus acciones. | cargando, error | `view/admin/components/av-roles.json` |
| `av-usuario-form` | Diálogo de usuario. | abierto, error | `view/admin/components/av-usuario-form.json` |
| `av-usuarios` | Usuarios con rol principal. | cargando | `view/admin/components/av-usuarios.json` |
| `av-asistente` | Chat con AVO (necesita sesión para preguntar de verdad). | pensando | `view/asistente/components/av-asistente.json` |
| `av-avo-mensaje` | Burbuja del chat con AVO. | turno | `view/asistente/components/av-avo-mensaje.json` |
| `av-canal-form` | Diálogo de canal nuevo (ábrelo con el control). | abierto, guardando | `view/canales/components/av-canal-form.json` |
| `av-canales` | La vista completa. Sin sesión y empresa activa muestra su estado vacío; el chat con datos de ejemplo está en C | formulario | `view/canales/components/av-canales.json` |
| `av-chat-tema` | Colores, degradados y temas por chat. | tema | `src/js/components/chat/av-chat-tema.json` |
| `av-chat-demo` | El demo en vivo del chat (abre otra pestaña para conversar en tiempo real). | como | `view/chat-demo/components/av-chat-demo.json` |
| `av-correo-carpetas` | Carpetas del buzón con conteo. | activa | `view/correos/components/av-correo-carpetas.json` |
| `av-correo-lector` | Lectura de un correo. | puedeMarcar | `view/correos/components/av-correo-lector.json` |
| `av-correo-lista` | Correos de una carpeta. | cargando, puedeMarcar | `view/correos/components/av-correo-lista.json` |
| `av-correo-redactar` | Redacción de un correo. | abierto | `view/correos/components/av-correo-redactar.json` |
| `av-correos` | La vista de correo completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos d | id, cargando, puedeMarcar | `view/correos/components/av-correos.json` |
| `av-cliente-form` | Diálogo de cliente. | abierto, puedeEscribir | `view/crm/components/av-cliente-form.json` |
| `av-crm` | La vista CRM completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos de ejem | id, cargando, texto, puedeEscribir | `view/crm/components/av-crm.json` |
| `av-embudo` | Tarjetas por etapa del CRM. | activa | `view/crm/components/av-embudo.json` |
| `av-conversor` | Conversión entre COP, USD, MXN y EUR. | ocupado | `view/finanzas/components/av-conversor.json` |
| `av-factura-form` | Crear, emitir y cobrar facturas. | abierto, puedeEscribir | `view/finanzas/components/av-factura-form.json` |
| `av-finanzas` | La vista de finanzas completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos | id, cargando, texto, puedeEscribir | `view/finanzas/components/av-finanzas.json` |
| `av-finanzas-grafica` | Gráficas del mes. | resumen | `view/finanzas/components/av-finanzas-grafica.json` |
| `av-transaccion-form` | Registrar o editar una transacción. | abierto, puedeEscribir | `view/finanzas/components/av-transaccion-form.json` |
| `av-abierto` | «Un software empresarial moderno, flexible y abierto»: banda con el degradado de la paleta y seis pilares. | titulo | `view/inicio/components/av-abierto.json` |
| `av-caracteristicas` | Tarjetas de características. | items | `view/inicio/components/av-caracteristicas.json` |
| `av-comunidad` | «Únete a nuestra comunidad»: constelación de personas que aparecen por turnos, título, texto y cifras. | titulo | `view/inicio/components/av-comunidad.json` |
| `av-hero` | Portada de la landing. | sesion | `view/inicio/components/av-hero.json` |
| `av-inicio` | La landing completa. | sesion | `view/inicio/components/av-inicio.json` |
| `av-precios` | Planes y precios. | planes | `view/inicio/components/av-precios.json` |
| `av-inventario` | La vista de inventario completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con dat | id, cargando, texto, puedeEscribir | `view/inventario/components/av-inventario.json` |
| `av-movimiento-form` | Mover stock con rastro en el kardex. | abierto, tipo | `view/inventario/components/av-movimiento-form.json` |
| `av-pedido-form` | Pedidos a proveedores y de clientes. | abierto | `view/inventario/components/av-pedido-form.json` |
| `av-producto-form` | Ficha de un producto. | abierto, puedeEscribir | `view/inventario/components/av-producto-form.json` |
| `av-proveedor-form` | Ficha de un proveedor. | abierto | `view/inventario/components/av-proveedor-form.json` |
| `av-stock-alertas` | Productos en o bajo su mínimo. | puedeMover | `view/inventario/components/av-stock-alertas.json` |
| `av-empresa-form` | Diálogo de empresa. | abierto, error | `view/organizacion/components/av-empresa-form.json` |
| `av-equipos` | Equipos de la empresa con integrantes. | puedeGestionar, cargando | `view/organizacion/components/av-equipos.json` |
| `av-invitar-form` | Diálogo de invitación. | abierto, usuarios | `view/organizacion/components/av-invitar-form.json` |
| `av-miembros` | Miembros de la empresa. | puedeGestionar, cargando | `view/organizacion/components/av-miembros.json` |
| `av-organizacion` | Empresa, miembros y equipos. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos d | pestana, puedeGestionar, cargando | `view/organizacion/components/av-organizacion.json` |
| `av-embudo-grafica` | Barras del CRM por etapa. | clientes | `view/panel/components/av-embudo-grafica.json` |
| `av-kpis` | Tarjetas KPI del resumen. | resumen | `view/panel/components/av-kpis.json` |
| `av-notificaciones` | Notificaciones del usuario. | cargando | `view/panel/components/av-notificaciones.json` |
| `av-panel` | El dashboard completo. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos de ejem | error, resumen | `view/panel/components/av-panel.json` |
| `av-tareas-grafica` | Dona de tareas por estado. | tareas | `view/panel/components/av-tareas-grafica.json` |
| `av-escena` | Ilustración Corporate Memphis por capas, teñida con la paleta. | escena | `src/js/components/av/av-escena.json` |
| `av-chat` | Shell del chat: con `demo` usa el backend de memoria (abre otra pestaña de la galería y habla como otra person | demo | `src/js/components/chat/av-chat.json` |
| `av-chat-adjunto` | Adjunto de un mensaje o en vista previa. | modo, error | `src/js/components/chat/av-chat-adjunto.json` |
| `av-chat-audio` | Reproductor de notas de voz. | duracion | `src/js/components/chat/av-chat-audio.json` |
| `av-chat-burbuja` | Burbuja de mensaje (propia o ajena). | propio, marca, primero | `src/js/components/chat/av-chat-burbuja.json` |
| `av-chat-busqueda` | Panel de búsqueda de mensajes. | cargando | `src/js/components/chat/av-chat-busqueda.json` |
| `av-chat-cabecera` | Estado en vivo y acciones del chat abierto. | estado, volver | `src/js/components/chat/av-chat-cabecera.json` |
| `av-chat-compositor` | Escribe, adjunta o graba una nota de voz. | deshabilitado, motivo | `src/js/components/chat/av-chat-compositor.json` |
| `av-chat-emojis` | Selector de emojis. | destino | `src/js/components/chat/av-chat-emojis.json` |
| `av-chat-grupo-form` | Diálogo de grupo en pasos. | abierto, modo | `src/js/components/chat/av-chat-grupo-form.json` |
| `av-chat-info` | Panel lateral de información. | modo, soyAdmin | `src/js/components/chat/av-chat-info.json` |
| `av-chat-item` | Fila de chat con su menú de preferencias. | activo | `src/js/components/chat/av-chat-item.json` |
| `av-chat-lista` | Lista con filtros Todos, No leídos, Grupos y Directos; flechas para recorrerla. | filtro, conexion | `src/js/components/chat/av-chat-lista.json` |
| `av-chat-llamada` | Capa de llamada (los flujos van por propiedades, no por props). | fase | `src/js/components/chat/av-chat-llamada.json` |
| `av-chat-mensajes` | Mensajes agrupados con burbujas reconciliadas (sin parpadeo). | hayMas | `src/js/components/chat/av-chat-mensajes.json` |
| `av-chat-nuevo` | Diálogo para empezar un chat. | abierto | `src/js/components/chat/av-chat-nuevo.json` |
| `av-chat-reacciones` | Píldoras de reacciones. | propio | `src/js/components/chat/av-chat-reacciones.json` |
| `av-chat-reenviar` | Reenviar a varios chats. | abierto | `src/js/components/chat/av-chat-reenviar.json` |
| `av-chat-visor` | Visor de medios del chat. | abierto | `src/js/components/chat/av-chat-visor.json` |
| `av-proyecto-form` | Diálogo de proyecto nuevo. | abierto, ocupado | `view/proyectos/components/av-proyecto-form.json` |
| `av-proyectos` | La vista de proyectos completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con dato | id, puedeMover, cargando | `view/proyectos/components/av-proyectos.json` |
| `av-tablero` | Kanban de un proyecto. | puedeMover, cargando | `view/proyectos/components/av-tablero.json` |
| `av-tarea-detalle` | Cajón con la tarea y sus comentarios. | abierto, puedeEliminar | `view/proyectos/components/av-tarea-detalle.json` |
| `av-tarea-form` | Diálogo de crear/editar tarea. | abierto, ocupado, error | `view/proyectos/components/av-tarea-form.json` |
| `av-asistencia-dia` | Marcar la asistencia del día. | puedeMarcar, cargando | `view/rrhh/components/av-asistencia-dia.json` |
| `av-empleado-form` | Ficha de un empleado. | abierto, puedeEscribir | `view/rrhh/components/av-empleado-form.json` |
| `av-rrhh` | La vista de RRHH completa. Sin sesión y empresa activa muestra su estado vacío; abajo, una pieza con datos de  | id, cargando, texto, puedeEscribir | `view/rrhh/components/av-rrhh.json` |
| `av-rrhh-grafica` | Asistencia de hoy y plantilla. | departamentos | `view/rrhh/components/av-rrhh-grafica.json` |
| `av-solicitud-form` | Nueva solicitud. | abierto | `view/rrhh/components/av-solicitud-form.json` |
| `av-solicitudes` | Solicitudes por estado. | filtro, compacto | `view/rrhh/components/av-solicitudes.json` |
| `av-app` | Shell de la app: barra, navegación por permisos, sesión y la vista activa. | vista | `src/js/components/av/av-app.json` |
| `av-logo` | Logo de Avatar: hexágono de neón con los colores de la paleta activa. | wordmark, animado | `src/js/components/av/av-logo.json` |
| `av-perfil-selector` | Cambia de perfil de prueba con PIN. | activo, perfiles | `src/js/components/av/av-perfil-selector.json` |
| `av-perfiles-lista` | Perfiles de prueba con su PIN público; el clic entra. |  | `src/js/components/av/av-perfiles-lista.json` |
| `av-perfiles-tabla` | Usuarios, nombres, roles y PIN de prueba. | abierto | `src/js/components/av/av-perfiles-tabla.json` |
| `av-tabla` | Buscador, grid del kit y estado vacío, configurados por props. | cargando, texto, puedeEscribir | `src/js/components/av/av-tabla.json` |
