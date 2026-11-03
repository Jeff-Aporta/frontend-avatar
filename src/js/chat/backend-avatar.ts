/**
 * backend-avatar.ts — `ChatBackend` contra `api-avatar` (HS-CHAT-04..09): las ops del plugin `avatar` de DER (vendor
 * `@avatar/vendor`) para leer y escribir, y la sala `SalaRT` por WebSocket para el tiempo real.
 *
 *   - El servidor ya difunde por la sala `mensaje.nuevo`, `mensaje.editado`, `mensaje.eliminado`, `reaccion`, `leido`,
 *     `entregado` y `canal.actualizado` (con `de` = quien actuó): aquí solo se traducen; aplicarlos es idempotente
 *     (por `imensaje` / `clave_cliente`). El front publica él mismo `escribiendo`, `grabando` y la señalización
 *     `llamada.*` con `icanal` (la sala descarta lo que viene de quien no integra el chat).
 *   - Al reconectar se pide lo que faltó (`historial(icanal, { despues })`) y la lista al día (W-CHAT-32).
 *   - Todo lo que llega del API o de la sala se parsea con Zod (`safeParse`) y se traduce a `tipos.ts`.
 */
import { z } from '../base/zod.js';
import { archivos, controller, dominio } from '../core/api.js';
import { estado } from '../core/estado.js';
import type { AccionMiembros, ChatBackend, DatosGrupo, FuenteAvisos, OpcionesSubida } from './backend.js';
import { STUN_CLOUDFLARE } from './backend.js';
import { Sala } from './sala.js';
import {
  type Adjunto, type Aviso, type Borrador, type Chat, type EventoChat, type InfoLectura, type Lectura, type MensajeChat, type ModoEscritura, nuevaClave,
  type Preferencias, type RegistroLlamada, type ResultadoBusqueda, type SenalLlamada, SenalLlamadaSchema, type UsuarioChat,
} from './tipos.js';
import { TemaChatSchema } from './tipos.js';
import { fijarLimiteMb } from './formato.js';

/* ── forma de lo que devuelve el API ─────────────────────────── */

const n = z.union([z.number(), z.string()]).transform((v) => String(v));
const fecha = z.union([z.string(), z.date()]).nullable().optional().transform((v) => (v == null ? null : typeof v === 'string' ? v : v.toISOString()));
const UsuarioApi = z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), email: z.string().nullable().optional() });

const UltimoApi = z.object({ imensaje: n, iusuario: z.string(), autor: z.string().nullable().optional(), tipo: z.string(), contenido: z.string().nullable().optional(), eliminado: z.boolean().nullable().optional(), creado: fecha, estado: z.enum(['enviado', 'entregado', 'leido']).nullable().optional() });

export const ResumenApi = z.object({
  icanal: n,
  iempresa: z.number().optional(),
  tipo: z.enum(['publico', 'privado', 'directo', 'grupo']).catch('grupo'),
  nombre: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  foto: z.number().nullable().optional(),
  foto_url: z.string().nullable().optional(),
  tema: TemaChatSchema.nullable().optional(),
  otro: UsuarioApi.nullable().optional(),
  ultimo: UltimoApi.nullable().optional(),
  sin_leer: z.number().optional(),
  fijado: z.boolean().nullable().optional(),
  silenciado: z.boolean().nullable().optional(),
  archivado: z.boolean().nullable().optional(),
  no_leido: z.boolean().nullable().optional(),
  rol: z.string().nullable().optional(),
  integrantes: z.unknown().optional(),
  mensaje_fijado: z.union([z.number(), z.string()]).nullable().optional(),
  actividad: fecha,
}).passthrough();

const ArchivoApi = z.object({ iarchivo: n, nombre: z.string(), mime: z.string(), bytes: z.number(), ancho: z.number().nullable().optional(), alto: z.number().nullable().optional(), duracion: z.number().nullable().optional(), url: z.string().nullable().optional(), expira: z.string().nullable().optional() });

export const MensajeApi = z.object({
  imensaje: n,
  icanal: n,
  iusuario: z.string(),
  autor: UsuarioApi.nullable().optional(),
  tipo: z.enum(['texto', 'sistema', 'archivo', 'imagen', 'video', 'audio', 'llamada']).catch('texto'),
  contenido: z.string().nullable().optional(),
  respuesta_a: z.union([z.number(), z.string()]).nullable().optional(),
  cita: z.object({ imensaje: n, iusuario: z.string(), autor: z.string().nullable().optional(), tipo: z.string(), contenido: z.string().nullable().optional(), eliminado: z.boolean().nullable().optional() }).nullable().optional(),
  archivo: ArchivoApi.nullable().optional(),
  reenviado: z.boolean().nullable().optional(),
  eliminado: z.boolean().nullable().optional(),
  editado_en: fecha,
  clave_cliente: z.string().nullable().optional(),
  metadatos: z.record(z.string(), z.unknown()).nullable().optional(),
  reacciones: z.record(z.string(), z.array(z.string())).nullable().optional(),
  destacado: z.boolean().nullable().optional(),
  creado: fecha,
}).passthrough();
type MensajeApiT = z.infer<typeof MensajeApi>;

const LecturasApi = z.object({ icanal: n, participantes: z.array(z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), rol: z.string().nullable().optional(), ultimo_leido: fecha, ultimo_entregado: fecha, conectado: fecha })) });
const IntegrantesApi = z.object({ icanal: n, integrantes: z.array(z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), rol: z.string() })) });
const HistorialApi = z.object({ icanal: n, mensajes: z.array(MensajeApi), hay_mas: z.boolean(), mensaje_fijado: z.union([z.number(), z.string()]).nullable().optional() });
const TicketApi = z.object({ ticket: z.string(), url: z.string(), iceServers: z.array(z.object({ urls: z.union([z.string(), z.array(z.string())]), username: z.string().optional(), credential: z.string().optional() })).optional() });
const BusquedaApi = z.object({ resultados: z.array(z.object({ imensaje: n, icanal: n, iusuario: z.string(), autor: z.string().nullable().optional(), contenido: z.string(), creado: fecha, score: z.number().nullable().optional() })) });
const InfoApi = z.object({ entregas: z.array(z.object({ iusuario: z.string(), nombre: z.string().nullable().optional(), entregado: fecha, leido: fecha })) });
const ReaccionesApi = z.object({ imensaje: n, reacciones: z.record(z.string(), z.array(z.string())) });
const LlamadaApi = z.object({ illamada: n });
const MiembroEmpresaApi = z.object({ iusuario: z.string(), cargo: z.string().nullable().optional(), rol: z.string().nullable().optional(), usuario: UsuarioApi.nullable().optional() }).passthrough();

/** Fila de `notificaciones/mias` (y del evento `notificacion` de la sala). */
const AvisoApi = z.object({ inotificacion: n, tipo: z.string(), titulo: z.string(), cuerpo: z.string().nullable().optional(), leida: z.boolean().nullable().optional(), referencia: z.record(z.string(), z.unknown()).nullable().optional(), creado: fecha }).passthrough();

/** Evento de la sala (el servidor sella `de` y `ts`). */
const EventoSalaApi = z.object({ tipo: z.string(), de: z.string().optional(), ts: z.string().optional(), icanal: z.union([z.number(), z.string()]).optional() }).passthrough();

/* ── traducción ──────────────────────────────────────────────── */

const reaccionesDe = (r: Record<string, string[]> | null | undefined) => Object.entries(r ?? {}).flatMap(([emoji, us]) => us.map((usuario) => ({ usuario, emoji })));

function adjuntoDe(a: z.infer<typeof ArchivoApi>): Adjunto {
  return { id: a.iarchivo, nombre: a.nombre, mime: a.mime, bytes: a.bytes, url: a.url ?? '', ancho: a.ancho ?? null, alto: a.alto ?? null, duracion: a.duracion ?? null, onda: [] };
}

/** Mensaje del API → mensaje del chat. Las llamadas traen `metadatos { tipo, estado, duracion }`. */
export function mensajeDe(m: MensajeApiT): MensajeChat {
  const meta: Record<string, unknown> = { ...(m.metadatos ?? {}) };
  if (m.tipo === 'llamada') {
    meta['medio'] = meta['tipo'] === 'video' ? 'video' : 'voz';
    meta['perdida'] = meta['estado'] === 'perdida' || meta['estado'] === 'rechazada';
  }
  if (m.cita) meta['cita'] = m.cita;
  const onda = Array.isArray(meta['onda']) ? (meta['onda'] as unknown[]).filter((x): x is number => typeof x === 'number') : [];
  const adjunto = m.archivo ? { ...adjuntoDe(m.archivo), onda } : null;
  return {
    clave: m.clave_cliente || `m${m.imensaje}`, id: m.imensaje, chat: m.icanal, autor: m.iusuario, tipo: m.tipo, texto: m.contenido ?? '', ts: m.creado ?? new Date().toISOString(),
    editado: m.editado_en, eliminado: !!m.eliminado, reenviado: !!m.reenviado, respuestaA: m.respuesta_a == null ? null : String(m.respuesta_a), adjunto,
    reacciones: reaccionesDe(m.reacciones), estado: 'enviado', progreso: null, destacado: !!m.destacado, oculto: false, meta,
  };
}

const TIPOS_MSG = ['texto', 'sistema', 'archivo', 'imagen', 'video', 'audio', 'llamada'];

/** Resumen del API → chat (sin integrantes ni lecturas: llegan con `lecturas(icanal)`). */
export function chatDe(c: z.infer<typeof ResumenApi>, yo: string): Chat {
  const u = c.ultimo;
  const miembros = c.tipo === 'directo' && c.otro ? [{ id: yo, rol: 'miembro' as const }, { id: c.otro.iusuario, rol: 'miembro' as const }] : [];
  return {
    id: c.icanal, tipo: c.tipo, nombre: c.nombre ?? '', descripcion: c.descripcion ?? '', foto: c.foto_url ?? null, tema: c.tema ?? null, miembros, fijado: !!c.fijado, silenciado: !!c.silenciado,
    archivado: !!c.archivado, marcadoNoLeido: !!c.no_leido, noLeidos: c.sin_leer ?? 0, mensajeFijado: c.mensaje_fijado == null ? null : String(c.mensaje_fijado),
    actividad: c.actividad ?? u?.creado ?? '', creado: '', lecturas: {},
    ultimo: u
      ? {
        clave: `m${u.imensaje}`, id: u.imensaje, chat: c.icanal, autor: u.iusuario, tipo: (TIPOS_MSG.includes(u.tipo) ? u.tipo : 'texto') as MensajeChat['tipo'],
        texto: u.contenido ?? '', ts: u.creado ?? '', editado: null, eliminado: !!u.eliminado, reenviado: false, respuestaA: null, adjunto: null, reacciones: [], estado: 'enviado',
        progreso: null, destacado: false, oculto: false, meta: u.estado ? { estado: u.estado } : {},
      }
      : null,
  };
}

/** Lecturas del API → integrantes y marcas de agua. */
function lecturasDe(l: z.infer<typeof LecturasApi>): { miembros: Chat['miembros']; lecturas: Record<string, Lectura> } {
  return {
    miembros: l.participantes.map((p) => ({ id: p.iusuario, rol: p.rol === 'admin' ? 'admin' : 'miembro' })),
    lecturas: Object.fromEntries(l.participantes.map((p) => [p.iusuario, { entregado: { hasta: p.ultimo_entregado ?? null, cuando: p.ultimo_entregado ?? null }, leido: { hasta: p.ultimo_leido ?? null, cuando: p.ultimo_leido ?? null } }])),
  };
}

/** Aviso del API → aviso del centro. */
export function avisoDe(a: z.infer<typeof AvisoApi>): Aviso {
  return { id: a.inotificacion, tipo: a.tipo, titulo: a.titulo, cuerpo: a.cuerpo ?? '', ts: a.creado ?? new Date().toISOString(), leida: !!a.leida, referencia: a.referencia ?? {} };
}

/* ── backend ─────────────────────────────────────────────────── */

type Op = (...args: unknown[]) => Promise<unknown>;
type Plugin = Record<string, unknown>;

export type OpcionesAvatar = { iempresa: number; plugin?: Plugin; crearSocket?: ConstructorParameters<typeof Sala>[0]['crearSocket'] };

/** Ops que el API debe publicar para el chat (si falta alguna, el host cae al demo con un mensaje reconocible). */
export const OPS_CHAT = ['mios', 'historial', 'enviar', 'ticketSala', 'lecturas', 'leido', 'entregado'] as const;

export function crearBackendAvatar(o: OpcionesAvatar): ChatBackend {
  const yo = estado.yo?.iusuario ?? '';
  const front = nuevaClave('f');
  const plugin = o.plugin ?? (dominio() as unknown as Plugin);
  const op = <R = unknown>(nombre: string, ...args: unknown[]): Promise<R> => {
    const f = plugin[nombre];
    if (typeof f !== 'function') return Promise.reject(new Error(`El plugin "avatar" no define el path "${nombre}"`));
    return (f as Op).apply(plugin, args) as Promise<R>;
  };
  const oyentes = new Set<(e: EventoChat) => void>();
  const senales = new Set<(s: SenalLlamada) => void>();
  const oyentesAviso = new Set<(a: Aviso) => void>();
  const oyentesLeidas = new Set<(ids: string[] | null) => void>();
  /** Los avisos sin empresa (globales) se ven en todas. */
  const deEstaEmpresa = (a: Aviso) => a.referencia['iempresa'] == null || Number(a.referencia['iempresa']) === o.iempresa;
  const emitir = (e: EventoChat) => {
    for (const fn of oyentes) fn(e);
  };
  const conocidos = new Map<string, UsuarioChat>();
  /** ts de cada imensaje visto (las marcas de agua del API llegan por imensaje o por ts). */
  const tsDe = new Map<string, string>();
  /** imensaje más viejo cargado y más nuevo visto por chat (cursores del historial). */
  const masViejo = new Map<string, string>();
  const masNuevo = new Map<string, string>();
  const fijados = new Map<string, string | null>();
  let ice: RTCIceServer[] = [STUN_CLOUDFLARE];

  const conocer = (id: string, nombre?: string | null, detalle = '') => {
    if (!id || conocidos.has(id)) return;
    const u: UsuarioChat = { id, nombre: nombre || id, foto: null, detalle, enLinea: false, ultimaVez: null };
    conocidos.set(id, u);
    emitir({ tipo: 'usuarios', usuarios: [u] });
  };
  const visto = (m: MensajeChat) => {
    if (!m.id) return;
    tsDe.set(m.id, m.ts);
    const n0 = masNuevo.get(m.chat);
    if (!n0 || Number(m.id) > Number(n0)) masNuevo.set(m.chat, m.id);
  };
  const traducir = (m: MensajeApiT): MensajeChat => {
    if (m.autor) conocer(m.autor.iusuario, m.autor.nombre);
    const r = mensajeDe(m);
    visto(r);
    return r;
  };
  const hastaDe = (v: unknown, respaldo: string): string => {
    if (typeof v === 'string' && v.includes('T')) return v;
    if (v != null && tsDe.has(String(v))) return tsDe.get(String(v))!;
    return respaldo;
  };

  /** Integrantes y lecturas de un chat (para marcas ✓✓, info del grupo y la sala). */
  async function cargarLecturas(chat: string): Promise<void> {
    try {
      const r = LecturasApi.safeParse(await op('lecturas', Number(chat)));
      if (!r.success) return;
      for (const p of r.data.participantes) {
        conocer(p.iusuario, p.nombre);
        if (p.conectado) emitir({ tipo: 'presencia', usuario: p.iusuario, enLinea: conocidos.get(p.iusuario)?.enLinea ?? false, ultimaVez: p.conectado });
      }
      emitir({ tipo: 'chat', chat: { id: chat, ...lecturasDe(r.data) } });
    } catch {
      /* sin permiso o sin red: sin marcas por ahora */
    }
  }

  async function iniciar(): Promise<{ usuarios: UsuarioChat[]; chats: Chat[] }> {
    for (const nombre of OPS_CHAT) if (typeof plugin[nombre] !== 'function') throw new Error(`El plugin "avatar" no define el path "${nombre}"`);
    const r = z.array(ResumenApi).safeParse(await op('mios', o.iempresa));
    if (!r.success) throw new Error('Chats con forma inesperada');
    const chats = r.data.map((c) => chatDe(c, yo));
    for (const c of r.data) {
      if (c.otro) conocer(c.otro.iusuario, c.otro.nombre);
      if (c.ultimo) conocer(c.ultimo.iusuario, c.ultimo.autor);
      fijados.set(c.icanal, c.mensaje_fijado == null ? null : String(c.mensaje_fijado));
    }
    // personas de la empresa (para «Nuevo chat»): miembros con su usuario
    try {
      const filas = await controller('miembros').query({ where: { iempresa: o.iempresa }, pageSize: 200, include: { usuario: true } });
      for (const f of filas as unknown[]) {
        const crudo = typeof (f as { toJSON?: () => unknown }).toJSON === 'function' ? (f as { toJSON: () => unknown }).toJSON() : f;
        const p = MiembroEmpresaApi.safeParse(crudo);
        if (p.success) conocer(p.data.iusuario, p.data.usuario?.nombre, p.data.cargo ?? p.data.rol ?? '');
      }
    } catch {
      /* sin permiso para listar miembros: quedan los conocidos por los chats */
    }
    if (!conocidos.has(yo)) conocidos.set(yo, { id: yo, nombre: estado.yo?.nombre ?? yo, foto: null, detalle: '', enLinea: true, ultimaVez: null });
    // marcas del último mensaje propio en la lista: lecturas de esos chats (en segundo plano, pocos)
    setTimeout(() => {
      for (const c of chats.filter((x) => x.ultimo?.autor === yo).slice(0, 20)) void cargarLecturas(c.id);
    }, 0);
    return { usuarios: [...conocidos.values()], chats };
  }

  /** Tras una caída: chats al día y los mensajes que faltaron (W-CHAT-32). */
  async function resincronizar(): Promise<void> {
    try {
      const d = await iniciar();
      emitir({ tipo: 'inicio', yo, usuarios: d.usuarios, chats: d.chats });
      for (const [chat, despues] of masNuevo) {
        const h = HistorialApi.safeParse(await op('historial', Number(chat), { despues: Number(despues), limite: 100 }));
        if (h.success) emitir({ tipo: 'historial', chat, mensajes: h.data.mensajes.map(traducir), hayMas: true });
      }
    } catch {
      /* se reintenta en la próxima reconexión */
    }
  }

  function recibir(datos: unknown): void {
    const r = EventoSalaApi.safeParse(datos);
    if (!r.success) return;
    const d = r.data as Record<string, unknown> & { tipo: string; de?: string; ts?: string };
    const de = d.de ?? '';
    const ts = d.ts ?? new Date().toISOString();
    const chat = d['icanal'] == null ? '' : String(d['icanal']);
    if (d.tipo.startsWith('llamada.')) {
      const s = SenalLlamadaSchema.safeParse({ ...d, chat: d['chat'] ?? chat });
      if (s.success) for (const fn of senales) fn(s.data);
      return;
    }
    switch (d.tipo) {
      case 'notificacion': {
        const a = AvisoApi.safeParse(d['notificacion']);
        if (!a.success) return;
        const aviso = avisoDe(a.data);
        if (deEstaEmpresa(aviso)) for (const fn of oyentesAviso) fn(aviso);
        return;
      }
      case 'notificacion.leida': {
        const ids = Array.isArray(d['ids']) ? (d['ids'] as unknown[]).map(String) : null;
        for (const fn of oyentesLeidas) fn(ids);
        return;
      }
      case 'sala.estado': {
        const conectados = Array.isArray(d['conectados']) ? (d['conectados'] as unknown[]).map(String) : [];
        const vistos = (d['vistos'] ?? {}) as Record<string, string>;
        for (const u of new Set([...conectados, ...Object.keys(vistos)])) {
          const c = conocidos.get(u);
          if (c) c.enLinea = conectados.includes(u);
          emitir({ tipo: 'presencia', usuario: u, enLinea: conectados.includes(u), ultimaVez: vistos[u] ?? null });
        }
        return;
      }
      case 'presencia': {
        const u = String(d['iusuario'] ?? de);
        const en = d['en_linea'] === true;
        const c = conocidos.get(u);
        if (c) c.enLinea = en;
        emitir({ tipo: 'presencia', usuario: u, enLinea: en, ultimaVez: typeof d['visto'] === 'string' ? d['visto'] : null });
        return;
      }
      case 'mensaje.nuevo': {
        const m = MensajeApi.safeParse(d['mensaje']);
        if (m.success) emitir({ tipo: 'mensaje', mensaje: traducir(m.data) });
        return;
      }
      case 'mensaje.editado':
        if (d['imensaje'] != null && typeof d['contenido'] === 'string') emitir({ tipo: 'mensaje.editado', chat, ref: String(d['imensaje']), texto: d['contenido'], editado: typeof d['editado_en'] === 'string' ? d['editado_en'] : ts });
        return;
      case 'mensaje.eliminado':
        if (d['imensaje'] != null) emitir({ tipo: 'mensaje.eliminado', chat, ref: String(d['imensaje']), paraTodos: true });
        return;
      case 'reaccion': {
        const rr = ReaccionesApi.safeParse(d);
        if (rr.success) emitir({ tipo: 'reacciones', chat, ref: rr.data.imensaje, reacciones: reaccionesDe(rr.data.reacciones) });
        return;
      }
      case 'leido':
      case 'entregado': {
        const usuario = String(d['iusuario'] ?? de);
        emitir({ tipo: d.tipo, chat, usuario, hasta: hastaDe(d['hasta'] ?? d['imensaje'], ts), cuando: ts });
        return;
      }
      case 'escribiendo':
      case 'grabando':
        if (de && de !== yo && chat) emitir({ tipo: 'escribiendo', chat, usuario: de, modo: d['modo'] === null || d['activo'] === false ? null : d.tipo === 'grabando' ? 'audio' : 'texto', ahora: Date.now() });
        return;
      case 'canal.actualizado': {
        if (d['accion'] === 'fijado') {
          const f = d['fijado'] == null ? null : String(d['fijado']);
          fijados.set(chat, f);
          emitir({ tipo: 'fijado', chat, ref: f });
          return;
        }
        // cambió el grupo (integrantes, nombre, foto) o se creó uno donde estoy: lista al día y sus integrantes
        void (async () => {
          try {
            const lista = z.array(ResumenApi).safeParse(await op('mios', o.iempresa));
            if (!lista.success) return;
            const mio = lista.data.find((c) => c.icanal === chat);
            if (!mio) {
              emitir({ tipo: 'chat.quitado', chat });
              return;
            }
            const c = chatDe(mio, yo);
            emitir({ tipo: 'chat', chat: { id: c.id, tipo: c.tipo, nombre: c.nombre, descripcion: c.descripcion, foto: c.foto, tema: c.tema, mensajeFijado: c.mensajeFijado, actividad: c.actividad, ...(c.miembros.length ? { miembros: c.miembros } : {}) } });
            await cargarLecturas(chat);
          } catch {
            /* se corrige al reconectar */
          }
        })();
        return;
      }
    }
  }

  const sala = new Sala({
    url: async () => {
      const r = TicketApi.safeParse(await op('ticketSala', o.iempresa));
      if (!r.success) throw new Error('Ticket de sala inválido');
      if (r.data.iceServers?.length) ice = r.data.iceServers as RTCIceServer[];
      return r.data.url.includes('ticket=') ? r.data.url : `${r.data.url}${r.data.url.includes('?') ? '&' : '?'}ticket=${encodeURIComponent(r.data.ticket)}`;
    },
    alEstado: (e) => emitir({ tipo: 'conexion', estado: e }),
    alReconectar: () => void resincronizar(),
    alMensaje: (datos) => recibir(datos),
    ...(o.crearSocket ? { crearSocket: o.crearSocket } : {}),
  });

  /** Publica en la sala lo que solo conocen los fronts (escribiendo, llamadas): efímero, no se encola. */
  const publicar = (ev: Record<string, unknown>) => sala.enviar(ev, false);

  const avisos: FuenteAvisos = {
    async listar() {
      const r = z.array(AvisoApi).safeParse(await op('mias'));
      return r.success ? r.data.map(avisoDe).filter(deEstaEmpresa) : [];
    },
    async leer(ids) {
      await op('leer', ids ? { ids: ids.map(Number) } : {});
    },
    alAviso(fn) {
      oyentesAviso.add(fn);
      return () => oyentesAviso.delete(fn);
    },
    alLeidas(fn) {
      oyentesLeidas.add(fn);
      return () => oyentesLeidas.delete(fn);
    },
  };

  let conectada = false;
  const be: ChatBackend = {
    yo,
    front,
    avisos,
    async iniciar() {
      void op('ajustesArchivos').then((a: unknown) => fijarLimiteMb(Number((a as { max_mb?: number }).max_mb))).catch(() => undefined);
      // primero el socket: lo que llegue mientras se carga la lista no se pierde
      if (!conectada) {
        conectada = true;
        sala.conectar();
      }
      return await iniciar();
    },
    suscribir(fn) {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    alSenal(fn) {
      senales.add(fn);
      return () => senales.delete(fn);
    },
    async historial(chat, antes, limite = 40) {
      const cursor = antes ? masViejo.get(chat) : undefined;
      const r = HistorialApi.safeParse(await op('historial', Number(chat), { ...(cursor ? { antes: Number(cursor) } : {}), limite }));
      if (!r.success) return { mensajes: [], hayMas: false };
      const mensajes = r.data.mensajes.map(traducir);
      if (mensajes[0]?.id) masViejo.set(chat, mensajes[0].id);
      if (!antes) {
        fijados.set(chat, r.data.mensaje_fijado == null ? null : String(r.data.mensaje_fijado));
        emitir({ tipo: 'fijado', chat, ref: fijados.get(chat) ?? null });
        void cargarLecturas(chat);
      }
      return { mensajes, hayMas: r.data.hay_mas };
    },
    async enviar(b: Borrador) {
      const respuesta = b.respuestaA && /^\d+$/.test(b.respuestaA) ? Number(b.respuestaA) : undefined;
      const archivo = b.adjunto && /^\d+$/.test(b.adjunto.id) ? Number(b.adjunto.id) : undefined;
      const meta = { ...b.meta, ...(b.adjunto?.onda.length ? { onda: b.adjunto.onda } : {}) };
      const tipo = b.tipo === 'sistema' || b.tipo === 'llamada' ? 'texto' : b.tipo;
      const r = MensajeApi.safeParse(await op('enviar', Number(b.chat), {
        ...(b.texto ? { contenido: b.texto } : {}), tipo, clave_cliente: b.clave, ...(respuesta ? { respuesta_a: respuesta } : {}), ...(archivo ? { iarchivo: archivo } : {}),
        ...(b.reenviado ? { reenviado: true } : {}), ...(Object.keys(meta).length ? { metadatos: meta } : {}),
      }));
      if (!r.success) throw new Error('Respuesta inesperada al enviar');
      const m = traducir(r.data);
      return { id: m.id!, ts: m.ts };
    },
    async subir(archivo, opciones?: OpcionesSubida) {
      opciones?.progreso?.(0.05);
      const subida = archivos()['subirArchivo']!(archivo, { iempresa: o.iempresa, nombre: archivo.name ?? 'archivo' });
      const cancelada = new Promise<never>((_, mal) => opciones?.senal?.addEventListener('abort', () => mal(new DOMException('Cancelado', 'AbortError'))));
      // la op no expone progreso: avance suave hasta que responde
      let f = 0.05;
      const paso = setInterval(() => opciones?.progreso?.((f = Math.min(0.92, f + (0.95 - f) * 0.12))), 200);
      try {
        const r = ArchivoApi.safeParse(await Promise.race([subida, cancelada]));
        if (!r.success) throw new Error('Archivo con forma inesperada');
        opciones?.progreso?.(1);
        return adjuntoDe(r.data);
      } finally {
        clearInterval(paso);
      }
    },
    async editar(_chat, ref, texto) {
      await op('editarMensaje', Number(ref), { contenido: texto });
    },
    async eliminar(_chat, ref, paraTodos) {
      await op('eliminarMensaje', Number(ref), { para: paraTodos ? 'todos' : 'mi' });
    },
    async reaccionar(chat, ref, emoji) {
      const r = ReaccionesApi.safeParse(await op('reaccionar', Number(ref), emoji));
      if (r.success) emitir({ tipo: 'reacciones', chat, ref: r.data.imensaje, reacciones: reaccionesDe(r.data.reacciones) });
    },
    async destacar(_chat, ref, valor) {
      await op('destacar', Number(ref), valor);
    },
    async fijar(chat, ref) {
      const objetivo = ref ?? fijados.get(chat) ?? null;
      if (!objetivo) return;
      await op('fijarMensaje', Number(objetivo), ref != null);
      fijados.set(chat, ref);
    },
    async info(_chat, ref): Promise<InfoLectura[]> {
      const r = InfoApi.safeParse(await op('infoMensaje', Number(ref)));
      return r.success ? r.data.entregas.map((x) => ({ usuario: x.iusuario, entregado: x.entregado, leido: x.leido })) : [];
    },
    async leido(chat) {
      await op('leido', Number(chat), {});
    },
    async entregado(chat) {
      await op('entregado', Number(chat));
    },
    escribiendo(chat, modo: ModoEscritura | null) {
      publicar({ tipo: modo === 'audio' ? 'grabando' : 'escribiendo', icanal: Number(chat), modo });
    },
    async preferencias(chat, p: Preferencias) {
      await op('preferencias', Number(chat), {
        ...(p.fijado !== undefined ? { fijado: p.fijado } : {}), ...(p.silenciado !== undefined ? { silenciado: p.silenciado } : {}),
        ...(p.archivado !== undefined ? { archivado: p.archivado } : {}), ...(p.marcadoNoLeido !== undefined ? { no_leido: p.marcadoNoLeido } : {}),
      });
    },
    async directo(usuario) {
      const r = ResumenApi.safeParse(await op('directo', { iempresa: o.iempresa, iusuario: usuario }));
      if (!r.success) throw new Error('Directo con forma inesperada');
      if (r.data.otro) conocer(r.data.otro.iusuario, r.data.otro.nombre);
      return chatDe(r.data, yo);
    },
    async grupo(d: DatosGrupo) {
      const r = ResumenApi.safeParse(await op('grupo', { iempresa: o.iempresa, nombre: d.nombre, ...(d.descripcion ? { descripcion: d.descripcion } : {}), miembros: d.miembros }));
      if (!r.success) throw new Error('Grupo con forma inesperada');
      const c = chatDe(r.data, yo);
      void cargarLecturas(c.id);
      return c;
    },
    async tema(chat, tema) {
      const r = ResumenApi.safeParse(await op('editarCanal', Number(chat), { tema }));
      if (r.success) emitir({ tipo: 'chat', chat: { id: String(r.data.icanal), tema: r.data.tema ?? null } });
    },
    async editarGrupo(chat, d) {
      const r = ResumenApi.safeParse(await op('editarCanal', Number(chat), { ...(d.nombre ? { nombre: d.nombre } : {}), ...(d.descripcion !== undefined ? { descripcion: d.descripcion || null } : {}) }));
      if (r.success) {
        const c = chatDe(r.data, yo);
        emitir({ tipo: 'chat', chat: { id: c.id, nombre: c.nombre, descripcion: c.descripcion, foto: c.foto } });
      }
    },
    async miembros(chat, accion: AccionMiembros, usuarios) {
      const cuerpo = accion === 'salir' ? { accion: 'salir' } : accion === 'admin' || accion === 'miembro' ? { accion: 'rol', iusuarios: usuarios, rol: accion } : { accion, iusuarios: usuarios };
      const r = IntegrantesApi.safeParse(await op('miembrosCanal', Number(chat), cuerpo));
      if (accion === 'salir') {
        emitir({ tipo: 'chat.quitado', chat });
        return;
      }
      if (r.success) {
        for (const i of r.data.integrantes) conocer(i.iusuario, i.nombre);
        emitir({ tipo: 'chat', chat: { id: chat, miembros: r.data.integrantes.map((i) => ({ id: i.iusuario, rol: i.rol === 'admin' ? 'admin' : 'miembro' })) } });
      }
    },
    async buscar(q, chat) {
      const r = BusquedaApi.safeParse(await op('buscarMensajes', { q, iempresa: o.iempresa, ...(chat ? { icanal: Number(chat) } : {}), limite: 50 }));
      if (!r.success) return [];
      return r.data.resultados.map((x): ResultadoBusqueda => {
        conocer(x.iusuario, x.autor);
        return { chat: x.icanal, ref: x.imensaje, autor: x.iusuario, ts: x.creado ?? '', texto: x.contenido, puntaje: x.score ?? 1 };
      });
    },
    senal(s) {
      publicar({ ...s, icanal: Number(s.chat) });
    },
    async iceServers() {
      return ice;
    },
    async iniciarLlamada(chat, medio) {
      const r = LlamadaApi.safeParse(await op('registrarLlamada', { icanal: Number(chat), tipo: medio, estado: 'en_curso' }));
      return r.success ? r.data.illamada : null;
    },
    async registrarLlamada(r: RegistroLlamada) {
      await op('registrarLlamada', {
        icanal: Number(r.chat), tipo: r.medio, estado: r.perdida ? 'perdida' : 'completada', ...(r.illamada ? { illamada: Number(r.illamada) } : {}), participantes: r.participantes,
      });
      // el mensaje de la llamada llega por la sala a los demás; este front lo pide
      const desde = masNuevo.get(r.chat);
      const h = HistorialApi.safeParse(await op('historial', Number(r.chat), { ...(desde ? { despues: Number(desde) } : {}), limite: 20 }));
      if (h.success) for (const m of h.data.mensajes.map(traducir)) emitir({ tipo: 'mensaje', mensaje: m });
    },
    cerrar() {
      sala.cerrar();
      oyentes.clear();
      senales.clear();
      oyentesAviso.clear();
      oyentesLeidas.clear();
    },
  };
  return be;
}
