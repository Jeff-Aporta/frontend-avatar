/**
 * backend.ts — interfaz `ChatBackend` (HW-CHAT-01): lo único con lo que habla el shell `<av-chat>`. Dos
 * implementaciones: `backend-demo.ts` (memoria + BroadcastChannel, sin API) y `backend-avatar.ts` (API DER + sala).
 *
 * Contrato de tiempo real: `suscribir` entrega `EventoChat` (los mismos que aplica el reductor) ya filtrados por lo
 * que el usuario puede ver (W-CHAT-45), y aparte las señales de llamada (`alSenal`).
 */
import type {
  Adjunto, Borrador, Chat, EventoChat, InfoLectura, MensajeChat, ModoBusqueda, ModoEscritura, Preferencias, RegistroLlamada, ResultadoBusqueda, SenalLlamada,
  UsuarioChat,
} from './tipos.js';

/** Acciones sobre los integrantes de un grupo (W-CHAT-35). */
export type AccionMiembros = 'agregar' | 'quitar' | 'admin' | 'miembro' | 'salir';

export type OpcionesSubida = { progreso?: (fraccion: number) => void; senal?: AbortSignal };

export type DatosGrupo = { nombre: string; descripcion?: string; miembros: string[]; foto?: string | null };

export interface ChatBackend {
  /** Usuario de la sesión. */
  readonly yo: string;
  /** Identificador de este front (pestaña): separa las señales de llamada entre fronts del mismo usuario. */
  readonly front: string;
  /** Carga inicial: personas visibles y chats del usuario. */
  iniciar(): Promise<{ usuarios: UsuarioChat[]; chats: Chat[] }>;
  /** Tiempo real: eventos del reductor. Devuelve la función para dejar de escuchar. */
  suscribir(fn: (e: EventoChat) => void): () => void;
  /** Señales de llamada que llegan por la sala. */
  alSenal(fn: (s: SenalLlamada) => void): () => void;
  /** Mensajes anteriores a `antes` (ISO), del más viejo al más nuevo. */
  historial(chat: string, antes?: string | null, limite?: number): Promise<{ mensajes: MensajeChat[]; hayMas: boolean }>;
  /** Publica un mensaje (idempotente por `clave`). Devuelve el id y el ts del servidor. */
  enviar(b: Borrador): Promise<{ id: string; ts: string }>;
  /** Sube un archivo (al R2 por el API en producción) y devuelve el adjunto listo para enviar. */
  subir(archivo: Blob & { name?: string }, o?: OpcionesSubida): Promise<Adjunto>;
  editar(chat: string, ref: string, texto: string): Promise<void>;
  eliminar(chat: string, ref: string, paraTodos: boolean): Promise<void>;
  reaccionar(chat: string, ref: string, emoji: string | null): Promise<void>;
  destacar(chat: string, ref: string, valor: boolean): Promise<void>;
  fijar(chat: string, ref: string | null): Promise<void>;
  info(chat: string, ref: string): Promise<InfoLectura[]>;
  leido(chat: string, hasta: string): Promise<void>;
  entregado(chat: string, hasta: string): Promise<void>;
  escribiendo(chat: string, modo: ModoEscritura | null): void;
  preferencias(chat: string, p: Preferencias): Promise<void>;
  directo(usuario: string): Promise<Chat>;
  grupo(d: DatosGrupo): Promise<Chat>;
  editarGrupo(chat: string, d: { nombre?: string; descripcion?: string; foto?: string | null }): Promise<void>;
  miembros(chat: string, accion: AccionMiembros, usuarios: string[]): Promise<void>;
  buscar(q: string, modo: ModoBusqueda, chat?: string | null): Promise<ResultadoBusqueda[]>;
  /** Envía una señal de llamada por la sala. */
  senal(s: SenalLlamada): void;
  /** Servidores ICE (STUN de Cloudflare + TURN si el backend lo da). */
  iceServers(): Promise<RTCIceServer[]>;
  /** Abre el registro de una llamada al empezar (opcional): devuelve su id para cerrarlo en `registrarLlamada`. */
  iniciarLlamada?(chat: string, medio: 'voz' | 'video'): Promise<string | null>;
  /** Deja el mensaje de la llamada en el chat (W-CHAT-38). */
  registrarLlamada(r: RegistroLlamada): Promise<void>;
  /** Cierra la sala y libera recursos. */
  cerrar(): void;
}

/** STUN público de Cloudflare (HS-CHAT-09). */
export const STUN_CLOUDFLARE: RTCIceServer = { urls: 'stun:stun.cloudflare.com:3478' };
