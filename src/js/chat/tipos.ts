/**
 * tipos.ts — contrato del chat (sin DOM): usuarios, chats, mensajes, adjuntos, eventos del reductor, señales de llamada
 * y resultados de búsqueda. Todo con Zod: lo que llega de fuera (API, sala, BroadcastChannel, localStorage) se parsea
 * con `safeParse`; los tipos salen de `z.infer`.
 *
 * Identidad de un mensaje: `clave` (la `clave_cliente` que genera el front al redactar: estable desde el envío optimista
 * hasta la confirmación) y `id` (el que asigna el backend). Toda referencia a un mensaje (`ref`) admite cualquiera de
 * las dos (`coincide`).
 */
import { z } from '../base/zod.js';

export const TipoChatSchema = z.enum(['directo', 'grupo', 'publico', 'privado']);

/** Tema del chat: predefinido por `id` o `propio` con sus colores. */
export const TemaChatSchema = z.object({ id: z.string(), color1: z.string().optional(), color2: z.string().optional(), angulo: z.number().optional(), fondo: z.string().optional() });
export type TemaChat = z.infer<typeof TemaChatSchema>;
export type TipoChat = z.infer<typeof TipoChatSchema>;

export const TipoMensajeSchema = z.enum(['texto', 'sistema', 'archivo', 'imagen', 'video', 'audio', 'llamada']);
export type TipoMensaje = z.infer<typeof TipoMensajeSchema>;

export const RolSchema = z.enum(['admin', 'miembro']);
export type Rol = z.infer<typeof RolSchema>;

export const ConexionSchema = z.enum(['conectado', 'conectando', 'desconectado']);
export type Conexion = z.infer<typeof ConexionSchema>;

/** Persona que puede chatear. `enLinea` mientras tiene un front abierto; si no, `ultimaVez` (ISO). */
export const UsuarioChatSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  foto: z.string().nullable().default(null),
  detalle: z.string().default(''),
  enLinea: z.boolean().default(false),
  ultimaVez: z.string().nullable().default(null),
});
export type UsuarioChat = z.infer<typeof UsuarioChatSchema>;

export const MiembroSchema = z.object({ id: z.string(), rol: RolSchema.default('miembro') });
export type Miembro = z.infer<typeof MiembroSchema>;

/** Marca de agua de entrega o lectura: `hasta` = ts del último mensaje alcanzado; `cuando` = cuándo ocurrió. */
export const MarcaSchema = z.object({ hasta: z.string().nullable().default(null), cuando: z.string().nullable().default(null) });
export type Marca = z.infer<typeof MarcaSchema>;

export const LecturaSchema = z.object({
  entregado: MarcaSchema.default({ hasta: null, cuando: null }),
  leido: MarcaSchema.default({ hasta: null, cuando: null }),
});
export type Lectura = z.infer<typeof LecturaSchema>;

/** Chat tal como lo ve el usuario de la sesión (preferencias propias incluidas); `ultimo` se agrega más abajo. */
const ChatBaseSchema = z.object({
  id: z.string(),
  tipo: TipoChatSchema,
  nombre: z.string().default(''),
  descripcion: z.string().default(''),
  foto: z.string().nullable().default(null),
  tema: TemaChatSchema.nullable().default(null),
  miembros: z.array(MiembroSchema).default([]),
  fijado: z.boolean().default(false),
  silenciado: z.boolean().default(false),
  archivado: z.boolean().default(false),
  marcadoNoLeido: z.boolean().default(false),
  noLeidos: z.number().int().default(0),
  mensajeFijado: z.string().nullable().default(null),
  actividad: z.string().default(''),
  creado: z.string().default(''),
  lecturas: z.record(z.string(), LecturaSchema).default({}),
});

/** Archivo subido (imagen, video, audio o documento). `onda`: alturas 0..1 de la nota de voz. */
export const AdjuntoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  mime: z.string(),
  bytes: z.number(),
  url: z.string().default(''),
  ancho: z.number().nullable().default(null),
  alto: z.number().nullable().default(null),
  duracion: z.number().nullable().default(null),
  onda: z.array(z.number()).default([]),
});
export type Adjunto = z.infer<typeof AdjuntoSchema>;

export const ReaccionSchema = z.object({ usuario: z.string(), emoji: z.string() });
export type Reaccion = z.infer<typeof ReaccionSchema>;

export const EstadoEnvioSchema = z.enum(['pendiente', 'enviado', 'fallido']);
export type EstadoEnvio = z.infer<typeof EstadoEnvioSchema>;

export const MensajeChatSchema = z.object({
  clave: z.string(),
  id: z.string().nullable().default(null),
  chat: z.string(),
  autor: z.string(),
  tipo: TipoMensajeSchema.default('texto'),
  texto: z.string().default(''),
  ts: z.string(),
  editado: z.string().nullable().default(null),
  eliminado: z.boolean().default(false),
  reenviado: z.boolean().default(false),
  respuestaA: z.string().nullable().default(null),
  adjunto: AdjuntoSchema.nullable().default(null),
  reacciones: z.array(ReaccionSchema).default([]),
  estado: EstadoEnvioSchema.default('enviado'),
  progreso: z.number().nullable().default(null),
  destacado: z.boolean().default(false),
  oculto: z.boolean().default(false),
  meta: z.record(z.string(), z.unknown()).default({}),
});
export type MensajeChat = z.infer<typeof MensajeChatSchema>;

/** Chat con su último mensaje visible (para la lista, aunque su historial no esté cargado). */
export const ChatSchema = ChatBaseSchema.extend({ ultimo: MensajeChatSchema.nullable().default(null) });
export type Chat = z.infer<typeof ChatSchema>;

export const ModoEscrituraSchema = z.enum(['texto', 'audio']);
export type ModoEscritura = z.infer<typeof ModoEscrituraSchema>;

export const PreferenciasSchema = z.object({
  fijado: z.boolean().optional(),
  silenciado: z.boolean().optional(),
  archivado: z.boolean().optional(),
  marcadoNoLeido: z.boolean().optional(),
});
export type Preferencias = z.infer<typeof PreferenciasSchema>;

/** Estado único del chat (lo produce el reductor de `estado.ts`). */
export const EstadoChatSchema = z.object({
  yo: z.string(),
  usuarios: z.record(z.string(), UsuarioChatSchema),
  chats: z.record(z.string(), ChatSchema),
  mensajes: z.record(z.string(), z.array(MensajeChatSchema)),
  hayMas: z.record(z.string(), z.boolean()),
  escribiendo: z.record(z.string(), z.record(z.string(), z.object({ modo: ModoEscrituraSchema, hasta: z.number() }))),
  conexion: ConexionSchema,
  activo: z.string().nullable(),
});
export type EstadoChat = z.infer<typeof EstadoChatSchema>;

const ChatParcialSchema = ChatSchema.partial().extend({ id: z.string() });

/** Eventos que aplica el reductor: los producen por igual las respuestas del backend, la sala y el propio front. */
export const EventoChatSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('inicio'), yo: z.string(), usuarios: z.array(UsuarioChatSchema), chats: z.array(ChatSchema), reinicio: z.boolean().optional() }),
  z.object({ tipo: z.literal('usuarios'), usuarios: z.array(UsuarioChatSchema) }),
  z.object({ tipo: z.literal('chat'), chat: ChatParcialSchema }),
  z.object({ tipo: z.literal('chat.quitado'), chat: z.string() }),
  z.object({ tipo: z.literal('historial'), chat: z.string(), mensajes: z.array(MensajeChatSchema), hayMas: z.boolean() }),
  z.object({ tipo: z.literal('mensaje'), mensaje: MensajeChatSchema }),
  z.object({ tipo: z.literal('mensaje.confirmado'), chat: z.string(), clave: z.string(), id: z.string(), ts: z.string().optional() }),
  z.object({ tipo: z.literal('mensaje.fallido'), chat: z.string(), clave: z.string() }),
  z.object({ tipo: z.literal('mensaje.progreso'), chat: z.string(), clave: z.string(), progreso: z.number().nullable() }),
  z.object({ tipo: z.literal('mensaje.quitado'), chat: z.string(), clave: z.string() }),
  z.object({ tipo: z.literal('mensaje.editado'), chat: z.string(), ref: z.string(), texto: z.string(), editado: z.string() }),
  z.object({ tipo: z.literal('mensaje.eliminado'), chat: z.string(), ref: z.string(), paraTodos: z.boolean() }),
  z.object({ tipo: z.literal('reaccion'), chat: z.string(), ref: z.string(), usuario: z.string(), emoji: z.string().nullable() }),
  z.object({ tipo: z.literal('reacciones'), chat: z.string(), ref: z.string(), reacciones: z.array(ReaccionSchema) }),
  z.object({ tipo: z.literal('destacado'), chat: z.string(), ref: z.string(), valor: z.boolean() }),
  z.object({ tipo: z.literal('fijado'), chat: z.string(), ref: z.string().nullable() }),
  z.object({ tipo: z.literal('leido'), chat: z.string(), usuario: z.string(), hasta: z.string(), cuando: z.string() }),
  z.object({ tipo: z.literal('entregado'), chat: z.string(), usuario: z.string(), hasta: z.string(), cuando: z.string() }),
  z.object({ tipo: z.literal('escribiendo'), chat: z.string(), usuario: z.string(), modo: ModoEscrituraSchema.nullable(), ahora: z.number() }),
  z.object({ tipo: z.literal('presencia'), usuario: z.string(), enLinea: z.boolean(), ultimaVez: z.string().nullable() }),
  z.object({ tipo: z.literal('conexion'), estado: ConexionSchema }),
  z.object({ tipo: z.literal('activo'), chat: z.string().nullable() }),
]);
export type EventoChat = z.infer<typeof EventoChatSchema>;

/** Aviso persistente para una persona (mención, reacción, llamada, tarea, correo, solicitud). `referencia`: a qué se refiere. */
export const AvisoSchema = z.object({
  id: z.string(),
  tipo: z.string(),
  titulo: z.string(),
  cuerpo: z.string().default(''),
  ts: z.string(),
  leida: z.boolean().default(false),
  referencia: z.record(z.string(), z.unknown()).default({}),
});
export type Aviso = z.infer<typeof AvisoSchema>;

/** Señales de llamada (WebRTC en malla): viajan por la sala; `front` identifica la pestaña emisora. */
export const SenalLlamadaSchema = z.object({
  tipo: z.enum(['llamada.invitar', 'llamada.unirse', 'llamada.oferta', 'llamada.respuesta', 'llamada.ice', 'llamada.colgar', 'llamada.rechazar']),
  llamada: z.string(),
  chat: z.string(),
  de: z.string(),
  front: z.string(),
  paraFront: z.string().nullable().default(null),
  medio: z.enum(['voz', 'video']).default('voz'),
  descripcion: z.object({ type: z.string(), sdp: z.string().optional() }).nullable().default(null),
  candidato: z.record(z.string(), z.unknown()).nullable().default(null),
});
export type SenalLlamada = z.infer<typeof SenalLlamadaSchema>;


export const ResultadoBusquedaSchema = z.object({
  chat: z.string(),
  ref: z.string(),
  autor: z.string(),
  ts: z.string(),
  texto: z.string(),
  puntaje: z.number().default(1),
});
export type ResultadoBusqueda = z.infer<typeof ResultadoBusquedaSchema>;

/** Fila de «Info del mensaje»: cuándo le llegó y cuándo lo leyó cada integrante. */
export const InfoLecturaSchema = z.object({ usuario: z.string(), entregado: z.string().nullable(), leido: z.string().nullable() });
export type InfoLectura = z.infer<typeof InfoLecturaSchema>;

/** Borrador que el front entrega al backend al enviar. */
export const BorradorSchema = z.object({
  clave: z.string(),
  chat: z.string(),
  tipo: TipoMensajeSchema.default('texto'),
  texto: z.string().default(''),
  respuestaA: z.string().nullable().default(null),
  adjunto: AdjuntoSchema.nullable().default(null),
  reenviado: z.boolean().default(false),
  meta: z.record(z.string(), z.unknown()).default({}),
});
export type Borrador = z.infer<typeof BorradorSchema>;

/** Registro de una llamada terminada (deja su mensaje en el chat). */
export const RegistroLlamadaSchema = z.object({
  chat: z.string(),
  medio: z.enum(['voz', 'video']),
  iniciador: z.string(),
  inicio: z.string(),
  fin: z.string(),
  duracion: z.number(),
  perdida: z.boolean(),
  participantes: z.array(z.string()),
  /** Id del registro abierto al empezar (si el backend lo lleva). */
  illamada: z.string().nullable().default(null),
});
export type RegistroLlamada = z.infer<typeof RegistroLlamadaSchema>;

/** ¿El mensaje es el referido? (`ref` = su clave o su id). */
export const coincide = (m: { clave: string; id: string | null }, ref: string | null | undefined): boolean => !!ref && (m.clave === ref || m.id === ref);

/** Clave de cliente única (idempotencia del envío). */
export function nuevaClave(prefijo = 'c'): string {
  const aleatorio = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Math.random().toString(36).slice(2, 14);
  return `${prefijo}${Date.now().toString(36)}${aleatorio}`;
}
