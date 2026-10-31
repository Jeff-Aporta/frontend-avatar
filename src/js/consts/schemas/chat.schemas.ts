/**
 * chat.schemas.ts — props de la familia de componentes del chat (`src/js/components/chat/`). Los datos del dominio
 * (mensajes, chats, adjuntos) salen de `src/js/chat/tipos.ts`; aquí van las formas que cada pieza pinta (modelos de
 * vista) y el mapa `CHAT_PROPS` que lee `props-registro.ts`.
 */
import { z } from '../../base/zod.js';
import { AdjuntoSchema, ChatSchema, ConexionSchema, MensajeChatSchema, TipoChatSchema } from '../../chat/tipos.js';

export const MarcaEnvioSchema = z.enum(['pendiente', 'fallido', 'enviado', 'entregado', 'leido']);

/** Persona tal como la pintan las piezas (lista, nuevo chat, integrantes). */
export const PersonaVistaSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  foto: z.string().nullable().default(null),
  detalle: z.string().default(''),
  enLinea: z.boolean().default(false),
  color: z.number().default(0),
  rol: z.string().default(''),
});
export type PersonaVista = z.infer<typeof PersonaVistaSchema>;

/** Fila de la lista de chats. */
export const ItemChatSchema = z.object({
  id: z.string(),
  tipo: TipoChatSchema,
  nombre: z.string(),
  foto: z.string().nullable().default(null),
  iniciales: z.string().default(''),
  color: z.number().default(0),
  ultimo: z.string().default(''),
  autorUltimo: z.string().default(''),
  hora: z.string().default(''),
  marca: MarcaEnvioSchema.nullable().default(null),
  noLeidos: z.number().default(0),
  fijado: z.boolean().default(false),
  silenciado: z.boolean().default(false),
  archivado: z.boolean().default(false),
  marcadoNoLeido: z.boolean().default(false),
  escribiendo: z.string().default(''),
  enLinea: z.boolean().default(false),
});
export type ItemChat = z.infer<typeof ItemChatSchema>;

export const FiltroSchema = z.enum(['todos', 'noleidos', 'grupos', 'directos']);

export const AvChatListaPropsSchema = z.object({
  chats: z.array(ItemChatSchema).default([]),
  activo: z.string().nullable().default(null),
  filtro: FiltroSchema.default('todos'),
  q: z.string().default(''),
  archivados: z.boolean().default(false),
  cantidadArchivados: z.number().default(0),
  conexion: ConexionSchema.default('conectado'),
  titulo: z.string().default(''),
  cargando: z.boolean().default(false),
});
export type AvChatListaProps = z.infer<typeof AvChatListaPropsSchema>;

export const AvChatItemPropsSchema = z.object({ chat: ItemChatSchema.nullable().default(null), activo: z.boolean().default(false) });
export type AvChatItemProps = z.infer<typeof AvChatItemPropsSchema>;

export const AvChatCabeceraPropsSchema = z.object({
  id: z.string().nullable().default(null),
  tipo: TipoChatSchema.default('directo'),
  nombre: z.string().default(''),
  foto: z.string().nullable().default(null),
  iniciales: z.string().default(''),
  color: z.number().default(0),
  estado: z.string().default(''),
  activo: z.boolean().default(false),
  integrantes: z.number().default(0),
  puedeLlamar: z.boolean().default(true),
  volver: z.boolean().default(false),
});
export type AvChatCabeceraProps = z.infer<typeof AvChatCabeceraPropsSchema>;

/** Autor visible (nombre y color estable). */
export const AutorVistaSchema = z.object({ nombre: z.string(), color: z.number().default(0) });

export const AvChatMensajesPropsSchema = z.object({
  chat: ChatSchema.nullable().default(null),
  mensajes: z.array(MensajeChatSchema).default([]),
  yo: z.string().default(''),
  autores: z.record(z.string(), AutorVistaSchema).default({}),
  primerNoLeido: z.string().nullable().default(null),
  hayMas: z.boolean().default(false),
  cargandoAnteriores: z.boolean().default(false),
  resaltar: z.string().nullable().default(null),
});
export type AvChatMensajesProps = z.infer<typeof AvChatMensajesPropsSchema>;

export const ReaccionVistaSchema = z.object({ emoji: z.string(), n: z.number(), nombres: z.array(z.string()).default([]), mia: z.boolean().default(false) });
export type ReaccionVista = z.infer<typeof ReaccionVistaSchema>;

export const CitaVistaSchema = z.object({ ref: z.string(), autor: z.string(), color: z.number().default(0), texto: z.string(), miniatura: z.string().nullable().default(null) });
export type CitaVista = z.infer<typeof CitaVistaSchema>;

export const AvChatBurbujaPropsSchema = z.object({
  mensaje: MensajeChatSchema.nullable().default(null),
  propio: z.boolean().default(false),
  primero: z.boolean().default(true),
  ultimo: z.boolean().default(true),
  autor: AutorVistaSchema.nullable().default(null),
  marca: MarcaEnvioSchema.nullable().default(null),
  cita: CitaVistaSchema.nullable().default(null),
  menciones: z.array(z.string()).default([]),
  reacciones: z.array(ReaccionVistaSchema).default([]),
  resaltado: z.boolean().default(false),
});
export type AvChatBurbujaProps = z.infer<typeof AvChatBurbujaPropsSchema>;

export const AvChatReaccionesPropsSchema = z.object({ ref: z.string().default(''), reacciones: z.array(ReaccionVistaSchema).default([]), propio: z.boolean().default(false) });
export type AvChatReaccionesProps = z.infer<typeof AvChatReaccionesPropsSchema>;

export const AvChatEmojisPropsSchema = z.object({ destino: z.string().default('') });
export type AvChatEmojisProps = z.infer<typeof AvChatEmojisPropsSchema>;

export const AvChatCompositorPropsSchema = z.object({
  chat: z.string().nullable().default(null),
  respuesta: CitaVistaSchema.nullable().default(null),
  edicion: z.object({ ref: z.string(), texto: z.string() }).nullable().default(null),
  deshabilitado: z.boolean().default(false),
  motivo: z.string().default(''),
});
export type AvChatCompositorProps = z.infer<typeof AvChatCompositorPropsSchema>;

export const AvChatAdjuntoPropsSchema = z.object({
  adjunto: AdjuntoSchema.nullable().default(null),
  modo: z.enum(['burbuja', 'previa']).default('burbuja'),
  progreso: z.number().nullable().default(null),
  propio: z.boolean().default(false),
  error: z.string().default(''),
});
export type AvChatAdjuntoProps = z.infer<typeof AvChatAdjuntoPropsSchema>;

export const AvChatAudioPropsSchema = z.object({ url: z.string().default(''), duracion: z.number().nullable().default(null), onda: z.array(z.number()).default([]), propio: z.boolean().default(false) });
export type AvChatAudioProps = z.infer<typeof AvChatAudioPropsSchema>;

export const ItemVisorSchema = z.object({ ref: z.string(), url: z.string(), tipo: z.enum(['imagen', 'video']), nombre: z.string().default(''), autor: z.string().default(''), ts: z.string().default('') });
export type ItemVisor = z.infer<typeof ItemVisorSchema>;

export const AvChatVisorPropsSchema = z.object({ abierto: z.boolean().default(false), items: z.array(ItemVisorSchema).default([]), indice: z.number().default(0) });
export type AvChatVisorProps = z.infer<typeof AvChatVisorPropsSchema>;

export const ResultadoVistaSchema = z.object({ chat: z.string(), chatNombre: z.string(), ref: z.string(), autor: z.string(), color: z.number().default(0), ts: z.string(), fragmento: z.string() });
export type ResultadoVista = z.infer<typeof ResultadoVistaSchema>;

export const AvChatBusquedaPropsSchema = z.object({
  abierto: z.boolean().default(false),
  chat: z.string().nullable().default(null),
  chatNombre: z.string().default(''),
  resultados: z.array(ResultadoVistaSchema).default([]),
  cargando: z.boolean().default(false),
  buscado: z.string().default(''),
});
export type AvChatBusquedaProps = z.infer<typeof AvChatBusquedaPropsSchema>;

export const AvChatNuevoPropsSchema = z.object({ abierto: z.boolean().default(false), personas: z.array(PersonaVistaSchema).default([]) });
export type AvChatNuevoProps = z.infer<typeof AvChatNuevoPropsSchema>;

export const AvChatGrupoFormPropsSchema = z.object({
  abierto: z.boolean().default(false),
  modo: z.enum(['crear', 'editar', 'agregar']).default('crear'),
  personas: z.array(PersonaVistaSchema).default([]),
  excluir: z.array(z.string()).default([]),
  nombre: z.string().default(''),
  descripcion: z.string().default(''),
  foto: z.string().nullable().default(null),
  guardando: z.boolean().default(false),
  error: z.string().default(''),
});
export type AvChatGrupoFormProps = z.infer<typeof AvChatGrupoFormPropsSchema>;

export const ElementoInfoSchema = z.object({ ref: z.string(), titulo: z.string().default(''), detalle: z.string().default(''), url: z.string().default(''), tipo: z.string().default(''), bytes: z.number().default(0), color: z.number().default(0) });
export type ElementoInfo = z.infer<typeof ElementoInfoSchema>;

export const AvChatInfoPropsSchema = z.object({
  abierto: z.boolean().default(false),
  modo: z.enum(['chat', 'mensaje']).default('chat'),
  id: z.string().nullable().default(null),
  tipo: TipoChatSchema.default('directo'),
  nombre: z.string().default(''),
  descripcion: z.string().default(''),
  foto: z.string().nullable().default(null),
  iniciales: z.string().default(''),
  color: z.number().default(0),
  estado: z.string().default(''),
  yo: z.string().default(''),
  soyAdmin: z.boolean().default(false),
  miembros: z.array(PersonaVistaSchema).default([]),
  fijado: z.boolean().default(false),
  silenciado: z.boolean().default(false),
  archivado: z.boolean().default(false),
  multimedia: z.array(ElementoInfoSchema).default([]),
  archivos: z.array(ElementoInfoSchema).default([]),
  enlaces: z.array(ElementoInfoSchema).default([]),
  destacados: z.array(ElementoInfoSchema).default([]),
  mensaje: z.object({ texto: z.string(), ts: z.string(), filas: z.array(z.object({ usuario: z.string(), nombre: z.string(), color: z.number().default(0), entregado: z.string().nullable(), leido: z.string().nullable() })) }).nullable().default(null),
});
export type AvChatInfoProps = z.infer<typeof AvChatInfoPropsSchema>;

export const AvChatReenviarPropsSchema = z.object({ abierto: z.boolean().default(false), ref: z.string().nullable().default(null), chats: z.array(ItemChatSchema).default([]) });
export type AvChatReenviarProps = z.infer<typeof AvChatReenviarPropsSchema>;

export const ParticipanteVistaSchema = z.object({ front: z.string(), nombre: z.string(), iniciales: z.string().default(''), color: z.number().default(0), video: z.boolean().default(false), hablando: z.boolean().default(false), conectado: z.boolean().default(false) });
export type ParticipanteVista = z.infer<typeof ParticipanteVistaSchema>;

export const AvChatLlamadaPropsSchema = z.object({
  fase: z.enum(['entrante', 'saliente', 'activa']).nullable().default(null),
  medio: z.enum(['voz', 'video']).default('voz'),
  chatNombre: z.string().default(''),
  de: z.string().default(''),
  iniciales: z.string().default(''),
  color: z.number().default(0),
  participantes: z.array(ParticipanteVistaSchema).default([]),
  inicio: z.number().nullable().default(null),
  mic: z.boolean().default(true),
  cam: z.boolean().default(false),
  pantalla: z.boolean().default(false),
  hablando: z.boolean().default(false),
  aviso: z.string().default(''),
  rev: z.number().default(0),
});
export type AvChatLlamadaProps = z.infer<typeof AvChatLlamadaPropsSchema>;

/** `<av-chat>`: `demo` = id de una persona de muestra → sin `backend` asignado, usa el backend de memoria hablando como ella. */
export const AvChatPropsSchema = z.object({ titulo: z.string().default(''), chat: z.string().nullable().default(null), clave: z.string().default('av-chat'), demo: z.string().default('') });
export type AvChatProps = z.infer<typeof AvChatPropsSchema>;

/** `<av-chat-demo>` (vista `chat-demo`): persona con la que se habla (`?como=`); sin valor, la primera libre. */
export const AvChatDemoPropsSchema = z.object({ como: z.string().nullable().default(null), id: z.string().nullable().default(null) });
export type AvChatDemoProps = z.infer<typeof AvChatDemoPropsSchema>;

/** Props de la familia (y del demo del chat), por tag. */
export const CHAT_PROPS = {
  'av-chat': AvChatPropsSchema,
  'av-chat-lista': AvChatListaPropsSchema,
  'av-chat-item': AvChatItemPropsSchema,
  'av-chat-cabecera': AvChatCabeceraPropsSchema,
  'av-chat-mensajes': AvChatMensajesPropsSchema,
  'av-chat-burbuja': AvChatBurbujaPropsSchema,
  'av-chat-reacciones': AvChatReaccionesPropsSchema,
  'av-chat-emojis': AvChatEmojisPropsSchema,
  'av-chat-compositor': AvChatCompositorPropsSchema,
  'av-chat-adjunto': AvChatAdjuntoPropsSchema,
  'av-chat-audio': AvChatAudioPropsSchema,
  'av-chat-visor': AvChatVisorPropsSchema,
  'av-chat-busqueda': AvChatBusquedaPropsSchema,
  'av-chat-nuevo': AvChatNuevoPropsSchema,
  'av-chat-grupo-form': AvChatGrupoFormPropsSchema,
  'av-chat-info': AvChatInfoPropsSchema,
  'av-chat-reenviar': AvChatReenviarPropsSchema,
  'av-chat-llamada': AvChatLlamadaPropsSchema,
  'av-chat-demo': AvChatDemoPropsSchema,
} as const;
