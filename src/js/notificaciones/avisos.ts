/**
 * avisos.ts — lógica pura de las notificaciones (sin DOM): une los chats con mensajes sin leer y los avisos guardados en una
 * sola lista, cuenta, decide a dónde lleva cada entrada y si un evento merece avisarse. Los efectos viven en `centro.ts`.
 *
 * Los mensajes no se guardan como avisos: cada chat con no leídos es una entrada (`chat:<id>`) cuyo estado de lectura es el del
 * propio chat. El resto (mención, reacción, llamada, tarea, correo, solicitud) son filas persistidas en el API.
 */
import { z } from '../base/zod.js';
import { nombreChat, ultimoDe } from '../chat/estado.js';
import { resumenMensaje } from '../chat/formato.js';
import { textos } from '../chat/textos.js';
import type { Aviso, EstadoChat } from '../chat/tipos.js';

export const DestinoSchema = z.object({ vista: z.string(), id: z.string().nullable() });
export type Destino = z.infer<typeof DestinoSchema>;

/** Una línea del centro de notificaciones. `cuenta`: cuántas cosas sin leer representa. */
export const EntradaSchema = z.object({
  id: z.string(),
  tipo: z.enum(['mensaje', 'mencion', 'reaccion', 'llamada', 'tarea', 'correo', 'solicitud', 'aviso']),
  titulo: z.string(),
  cuerpo: z.string(),
  ts: z.string(),
  leida: z.boolean(),
  cuenta: z.number(),
  chat: z.string().nullable(),
  destino: DestinoSchema.nullable(),
});
export type Entrada = z.infer<typeof EntradaSchema>;

/** Ícono y nombre de cada tipo. */
export const TIPOS_AVISO: Record<Entrada['tipo'], { icono: string; nombre: string }> = {
  mensaje: { icono: 'mdi:message-text-outline', nombre: 'Mensaje' },
  mencion: { icono: 'mdi:at', nombre: 'Mención' },
  reaccion: { icono: 'mdi:emoticon-happy-outline', nombre: 'Reacción' },
  llamada: { icono: 'mdi:phone-missed-outline', nombre: 'Llamada' },
  tarea: { icono: 'mdi:clipboard-check-outline', nombre: 'Tarea' },
  correo: { icono: 'mdi:email-outline', nombre: 'Correo' },
  solicitud: { icono: 'mdi:account-clock-outline', nombre: 'Solicitud' },
  aviso: { icono: 'mdi:bell-outline', nombre: 'Aviso' },
};

const texto = (v: unknown): string | null => (v == null ? null : String(v));

/** Chat al que se refiere un aviso, si es de chat. */
export const chatDeAviso = (a: Aviso): string | null => texto(a.referencia['icanal'] ?? a.referencia['chat']);

/** Vista a la que lleva un aviso; sin vista (demo sin sesión) no navega. */
export function destinoDeAviso(a: Aviso, vistaChat: string): Destino | null {
  const chat = chatDeAviso(a);
  if (chat) return { vista: vistaChat, id: chat };
  if (a.referencia['demo']) return null;
  if (a.tipo === 'correo') return { vista: 'correos', id: null };
  if (a.tipo === 'tarea') return { vista: 'proyectos', id: texto(a.referencia['iproyecto']) };
  if (a.tipo === 'solicitud') return { vista: 'rrhh', id: null };
  return null;
}

const tipoDe = (t: string): Entrada['tipo'] => (t in TIPOS_AVISO ? t as Entrada['tipo'] : 'aviso');

/** Lista del centro: chats con no leídos + avisos guardados, lo más nuevo primero. */
export function entradasDe(e: EstadoChat, avisos: Aviso[], vistaChat: string): Entrada[] {
  const t = textos();
  const out: Entrada[] = [];
  for (const c of Object.values(e.chats)) {
    if (c.noLeidos <= 0 || c.silenciado || c.archivado) continue;
    const u = ultimoDe(e, c.id);
    out.push({
      id: `chat:${c.id}`, tipo: 'mensaje', titulo: nombreChat(c, e.usuarios, e.yo) || 'Chat', cuerpo: u ? resumenMensaje(u, t) : '', ts: u?.ts ?? c.actividad, leida: false, cuenta: c.noLeidos, chat: c.id,
      destino: { vista: vistaChat, id: c.id },
    });
  }
  for (const a of avisos) out.push({ id: a.id, tipo: tipoDe(a.tipo), titulo: a.titulo, cuerpo: a.cuerpo, ts: a.ts, leida: a.leida, cuenta: 1, chat: chatDeAviso(a), destino: destinoDeAviso(a, vistaChat) });
  return out.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
}

/** Total sin leer. */
export const totalDe = (entradas: Entrada[]): number => entradas.reduce((n, x) => n + (x.leida ? 0 : x.cuenta), 0);

/** Sin leer por vista (contadores del menú). */
export function porVista(entradas: Entrada[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of entradas) if (!x.leida && x.destino) out[x.destino.vista] = (out[x.destino.vista] ?? 0) + x.cuenta;
  return out;
}

/** Título de la pestaña con su contador (quita uno anterior). */
export function tituloCon(n: number, titulo: string): string {
  const limpio = titulo.replace(/^\(\d+\+?\) /, '');
  return n > 0 ? `(${n > 99 ? '99+' : n}) ${limpio}` : limpio;
}

/** ¿Un mensaje nuevo merece aviso? No si es mío, de sistema, de un chat callado, o de la conversación que estoy mirando. */
export function mensajeAvisable(o: { autor: string; yo: string; tipo: string; silenciado: boolean; abierto: boolean; visible: boolean; mencionaAlYo: boolean }): boolean {
  if (o.autor === o.yo || o.tipo === 'sistema' || o.tipo === 'llamada' || o.silenciado) return false;
  // la mención llega como aviso propio: no se repite
  if (o.mencionaAlYo) return false;
  return !(o.abierto && o.visible);
}
