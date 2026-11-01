/**
 * backend-demo.ts — `ChatBackend` sin API (W-CHAT-39): un almacén en memoria compartido entre pestañas del mismo
 * navegador por `BroadcastChannel` y guardado en `localStorage` (sobrevive a recargar). Dos pestañas del demo, cada una
 * «hablando como» una persona distinta, conversan en tiempo real: mensajes, ediciones, borrados, reacciones,
 * entregas y lecturas, «escribiendo», presencia y llamadas (las señales WebRTC viajan por el mismo canal).
 *
 * Cada operación que cambia el almacén se aplica igual en todas las pestañas (`aplicar`), y cada pestaña traduce el
 * cambio a eventos del reductor filtrados por lo que ve su usuario (W-CHAT-45).
 *
 * La búsqueda «por significado» del demo es léxica (raíces + sinónimos): la semántica real (bge-m3 + Vectorize) la
 * resuelve el API (`mensajes/buscar?modo=semantica`). Sin modelos en el navegador.
 */
import { z } from '../base/zod.js';
import type { AccionMiembros, ChatBackend, DatosGrupo, OpcionesSubida } from './backend.js';
import { STUN_CLOUDFLARE } from './backend.js';
import { normalizar, resumenMensaje, tipoDeMime } from './formato.js';
import { infoLectura } from './estado.js';
import { TEXTOS_ES, textos } from './textos.js';
import {
  type Adjunto, type Borrador, type Chat, ChatSchema, coincide, type EventoChat, type InfoLectura, type MensajeChat, MensajeChatSchema,
  type ModoEscritura, nuevaClave, type Preferencias, type RegistroLlamada, type ResultadoBusqueda, type SenalLlamada, SenalLlamadaSchema, type UsuarioChat,
  UsuarioChatSchema,
} from './tipos.js';

/* ── almacén ─────────────────────────────────────────────────── */

const PrefsSchema = z.object({ fijado: z.boolean().default(false), silenciado: z.boolean().default(false), archivado: z.boolean().default(false), marcadoNoLeido: z.boolean().default(false) });

/** Chat compartido (sin preferencias ni conteos: esos son por usuario). */
const ChatDemoSchema = ChatSchema.omit({ fijado: true, silenciado: true, archivado: true, marcadoNoLeido: true, noLeidos: true, ultimo: true });
type ChatDemo = z.infer<typeof ChatDemoSchema>;

/** Mensaje compartido: sin `destacado`/`oculto` (son por usuario). */
const MensajeDemoSchema = MensajeChatSchema.omit({ destacado: true, oculto: true, progreso: true });
type MensajeDemo = z.infer<typeof MensajeDemoSchema>;

const AlmacenSchema = z.object({
  version: z.literal(3),
  usuarios: z.array(UsuarioChatSchema),
  chats: z.array(ChatDemoSchema),
  mensajes: z.array(MensajeDemoSchema),
  prefs: z.record(z.string(), z.record(z.string(), PrefsSchema)),
  destacados: z.record(z.string(), z.array(z.string())),
  ocultos: z.record(z.string(), z.array(z.string())),
  secuencia: z.number(),
});
type Almacen = z.infer<typeof AlmacenSchema>;

/** Operaciones que viajan entre pestañas. */
type Op =
  | { op: 'mensaje'; m: MensajeDemo; blob?: Blob | null }
  | { op: 'editar'; chat: string; ref: string; texto: string; editado: string }
  | { op: 'eliminar'; chat: string; ref: string; paraTodos: boolean; usuario: string }
  | { op: 'reaccion'; chat: string; ref: string; usuario: string; emoji: string | null }
  | { op: 'destacar'; chat: string; ref: string; usuario: string; valor: boolean }
  | { op: 'fijar'; chat: string; ref: string | null }
  | { op: 'lectura'; campo: 'leido' | 'entregado'; chat: string; usuario: string; hasta: string; cuando: string }
  | { op: 'chat'; chat: ChatDemo }
  | { op: 'prefs'; usuario: string; chat: string; p: Preferencias }
  | { op: 'escribiendo'; chat: string; usuario: string; modo: ModoEscritura | null }
  | { op: 'presencia'; usuario: string; front: string; enLinea: boolean; ts: string }
  | { op: 'hola'; front: string }
  | { op: 'senal'; s: SenalLlamada }
  | { op: 'reiniciar' };

export const CLAVE_ALMACEN = 'av-chat-demo:almacen';
export const CANAL_DEMO = 'av-chat-demo';
const LATIDO_MS = 4000;
const AUSENTE_MS = 11000;
const MAX_DATAURL = 700 * 1024;
const BOT = 'lucia';

/* ── semilla ─────────────────────────────────────────────────── */

export const USUARIOS_DEMO: UsuarioChat[] = [
  { id: 'ana', nombre: 'Ana Torres', foto: null, detalle: 'Gerente de proyectos', enLinea: false, ultimaVez: null },
  { id: 'beto', nombre: 'Beto Ruiz', foto: null, detalle: 'Desarrollo', enLinea: false, ultimaVez: null },
  { id: 'carla', nombre: 'Carla Gómez', foto: null, detalle: 'Diseño', enLinea: false, ultimaVez: null },
  { id: 'dario', nombre: 'Darío Peña', foto: null, detalle: 'Ventas', enLinea: false, ultimaVez: null },
  { id: 'elena', nombre: 'Elena Mora', foto: null, detalle: 'Soporte', enLinea: false, ultimaVez: null },
  { id: BOT, nombre: 'Lucía (bot)', foto: null, detalle: 'Responde sola en el demo', enLinea: true, ultimaVez: null },
];

/** Almacén inicial con historia relativa a `ahora`. */
export function semilla(ahora = Date.now()): Almacen {
  const hace = (min: number) => new Date(ahora - min * 60000).toISOString();
  const lect = (ids: string[], hasta: string) => Object.fromEntries(ids.map((id) => [id, { entregado: { hasta, cuando: hasta }, leido: { hasta, cuando: hasta } }]));
  let n = 0;
  const msg = (chat: string, autor: string, min: number, texto: string, extra: Partial<MensajeDemo> = {}): MensajeDemo => {
    n++;
    return { clave: `s${n}`, id: String(n), chat, autor, tipo: 'texto', texto, ts: hace(min), editado: null, eliminado: false, reenviado: false, respuestaA: null, adjunto: null, reacciones: [], estado: 'enviado', meta: {}, ...extra };
  };
  const base = (id: string, tipo: Chat['tipo'], nombre: string, miembros: { id: string; rol?: 'admin' | 'miembro' }[], creadoMin: number, descripcion = ''): ChatDemo => ({
    tema: null,
    id, tipo, nombre, descripcion, foto: null, miembros: miembros.map((m) => ({ id: m.id, rol: m.rol ?? 'miembro' })), mensajeFijado: null, actividad: hace(creadoMin), creado: hace(creadoMin), lecturas: {},
  });
  const dia = 24 * 60;
  const chats: ChatDemo[] = [
    base('d-ana-beto', 'directo', '', [{ id: 'ana' }, { id: 'beto' }], 3 * dia),
    base('g-odys', 'grupo', 'Equipo Odys', [{ id: 'ana', rol: 'admin' }, { id: 'beto' }, { id: 'carla' }, { id: 'dario' }], 5 * dia, 'Coordinación del proyecto Odys: tablero, entregas y reuniones.'),
    base('g-diseno', 'grupo', 'Diseño y marca', [{ id: 'carla', rol: 'admin' }, { id: 'beto' }, { id: 'elena' }, { id: 'ana' }], 4 * dia, 'Piezas gráficas, paleta y tipografías.'),
    base('p-general', 'publico', 'General', USUARIOS_DEMO.filter((u) => u.id !== BOT).map((u) => ({ id: u.id })), 10 * dia, 'Anuncios para toda la empresa.'),
    base('d-ana-lucia', 'directo', '', [{ id: 'ana' }, { id: BOT }], 2 * dia),
    base('d-beto-lucia', 'directo', '', [{ id: 'beto' }, { id: BOT }], 2 * dia),
    base('d-beto-carla', 'directo', '', [{ id: 'beto' }, { id: 'carla' }], 6 * dia),
    base('d-carla-lucia', 'directo', '', [{ id: 'carla' }, { id: BOT }], 2 * dia),
  ];
  const t = TEXTOS_ES;
  const mensajes: MensajeDemo[] = [
    msg('p-general', 'ana', 10 * dia, t.creoGrupo('Ana Torres', 'General'), { tipo: 'sistema' }),
    msg('p-general', 'ana', 2 * dia + 30, '*Bienvenidos* al nuevo chat de la empresa 🎉 Aquí van los anuncios generales.'),
    msg('p-general', 'dario', 2 * dia + 20, 'Genial, por fin todo en un solo lugar.'),
    msg('p-general', 'elena', dia + 200, 'Recuerden actualizar sus datos de contacto en https://avatar.odys.co/perfil'),

    msg('g-odys', 'ana', 5 * dia, t.creoGrupo('Ana Torres', 'Equipo Odys'), { tipo: 'sistema' }),
    msg('g-odys', 'ana', 2 * dia + 90, 'Equipo, el lunes arrancamos la fase 2 del tablero.'),
    msg('g-odys', 'beto', 2 * dia + 88, 'Listo. Yo me encargo de la integración con el API.'),
    msg('g-odys', 'carla', 2 * dia + 85, 'Comparto las piezas de la marca mañana temprano ✨'),
    msg('g-odys', 'dario', dia + 300, 'El cliente pidió una demo para la próxima semana, ¿quién se apunta?'),
    msg('g-odys', 'ana', dia + 290, '@Darío yo la preparo con _Beto_. Nos vemos el lunes a las 9 en la sala grande.'),
    msg('g-odys', 'beto', dia + 288, '👍'),
    msg('g-odys', 'carla', 120, 'Les dejo el checklist de la entrega:\n```\n1. Revisar textos\n2. Exportar piezas\n3. Subir al tablero\n```'),
    msg('g-odys', 'dario', 95, 'Perfecto, ~mañana~ hoy mismo lo reviso.'),
    msg('g-odys', 'ana', 30, '¿Alguien tiene el presupuesto actualizado de *Odys*?'),
    msg('g-odys', 'beto', 28, 'Lo subo en un rato al drive.'),

    msg('d-ana-beto', 'beto', 3 * dia, 'Hola Ana, ¿tienes un minuto?'),
    msg('d-ana-beto', 'ana', 3 * dia - 2, 'Claro, dime 🙂'),
    msg('d-ana-beto', 'beto', 3 * dia - 3, 'Quería confirmar el alcance del sprint.'),
    msg('d-ana-beto', 'ana', dia + 60, 'Te paso la lista de tareas mañana.'),
    msg('d-ana-beto', 'beto', 45, 'Ana, revisé el tablero: quedan 4 tareas en revisión.'),
    msg('d-ana-beto', 'beto', 44, '¿Las cerramos antes del viernes?'),

    msg('g-diseno', 'carla', 4 * dia, t.creoGrupo('Carla Gómez', 'Diseño y marca'), { tipo: 'sistema' }),
    msg('g-diseno', 'carla', 3 * dia, 'Propuesta de paleta: turquesa y magenta con acentos neón.'),
    msg('g-diseno', 'elena', 3 * dia - 10, 'Me encanta, se ve muy futurista 😍'),
    msg('g-diseno', 'beto', 200, 'Ojo con el contraste en modo claro.'),

    msg('d-ana-lucia', BOT, 2 * dia, 'Hola, soy Lucía, el bot del demo. Escríbeme y te respondo 🤖'),
    msg('d-beto-lucia', BOT, 2 * dia, 'Hola, soy Lucía, el bot del demo. Escríbeme y te respondo 🤖'),
    msg('d-carla-lucia', BOT, 2 * dia, 'Hola, soy Lucía, el bot del demo. Escríbeme y te respondo 🤖'),
    msg('d-beto-carla', 'carla', 6 * dia, '¿Te gustó el nuevo logo?'),
    msg('d-beto-carla', 'beto', 6 * dia - 5, '¡Mucho! Quedó limpio.'),
  ];
  // reacciones, respuesta, fijado y lecturas de muestra
  const buscar = (txt: string) => mensajes.find((m) => m.texto.startsWith(txt))!;
  buscar('Equipo, el lunes').reacciones = [{ usuario: 'beto', emoji: '👍' }, { usuario: 'carla', emoji: '❤️' }, { usuario: 'dario', emoji: '👍' }];
  buscar('Lo subo en un rato').respuestaA = buscar('¿Alguien tiene').clave;
  buscar('Me encanta').reacciones = [{ usuario: 'carla', emoji: '😂' }];
  const odys = chats.find((c) => c.id === 'g-odys')!;
  odys.mensajeFijado = buscar('@Darío yo la preparo').clave;
  for (const c of chats) {
    const ms = mensajes.filter((m) => m.chat === c.id);
    const ultimo = ms[ms.length - 1];
    if (ultimo) c.actividad = ultimo.ts;
    const ids = c.miembros.map((m) => m.id);
    // todos leyeron hasta el penúltimo; el último mensaje queda sin leer para algunos
    const penultimo = ms[ms.length - 2]?.ts ?? ultimo?.ts ?? c.creado;
    c.lecturas = lect(ids, penultimo);
    if (ultimo) for (const id of ids) if (id === ultimo.autor) c.lecturas[id] = { entregado: { hasta: ultimo.ts, cuando: ultimo.ts }, leido: { hasta: ultimo.ts, cuando: ultimo.ts } };
  }
  const odysUlt = mensajes.filter((m) => m.chat === 'g-odys').slice(-3);
  for (const id of ['ana', 'carla', 'dario']) odys.lecturas[id] = { entregado: { hasta: odysUlt[2]!.ts, cuando: odysUlt[2]!.ts }, leido: { hasta: odysUlt[0]!.ts, cuando: odysUlt[0]!.ts } };
  const usuarios = USUARIOS_DEMO.map((u, i) => ({ ...u, ultimaVez: u.id === BOT ? null : hace(15 + i * 37) }));
  return {
    version: 3, usuarios, chats, mensajes, prefs: { ana: { 'g-odys': { fijado: true, silenciado: false, archivado: false, marcadoNoLeido: false } } },
    destacados: { ana: [buscar('Les dejo el checklist').clave] }, ocultos: {}, secuencia: n,
  };
}

/* ── búsqueda léxica (demo) ──────────────────────────────────── */

const SINONIMOS: string[][] = [
  ['reunion', 'junta', 'vemos', 'encuentro', 'cita', 'sala', 'llamada', 'meet'],
  ['presupuesto', 'costo', 'precio', 'cotizacion', 'dinero', 'plata'],
  ['tarea', 'pendiente', 'ticket', 'tablero', 'sprint', 'checklist'],
  ['entrega', 'entregar', 'subir', 'publicar', 'exportar'],
  ['cliente', 'demo', 'venta', 'comprador'],
  ['diseno', 'paleta', 'color', 'marca', 'logo', 'pieza', 'tipografia'],
  ['lunes', 'semana', 'viernes', 'manana', 'hoy'],
  ['hola', 'saludo', 'bienvenidos', 'buenas'],
  ['error', 'fallo', 'problema', 'bug', 'contraste'],
];

const raiz = (p: string) => normalizar(p).replace(/[^a-z0-9ñ]/g, '').slice(0, 5);

function expandir(texto: string): Set<string> {
  const out = new Set<string>();
  for (const p of normalizar(texto).split(/[^a-z0-9ñ]+/).filter((x) => x.length > 2)) {
    const r = raiz(p);
    out.add(r);
    for (const grupo of SINONIMOS) if (grupo.some((g) => raiz(g) === r)) for (const g of grupo) out.add(raiz(g));
  }
  return out;
}

/** Similitud léxica 0..1 entre una consulta y un texto (raíces + sinónimos). */
export function similitudLexica(q: string, texto: string): number {
  const a = expandir(q);
  if (a.size === 0) return 0;
  const b = expandir(texto);
  let comun = 0;
  for (const x of a) if (b.has(x)) comun++;
  return comun / a.size;
}

/* ── respuestas del bot ──────────────────────────────────────── */

function respuestaBot(texto: string): string {
  const t = normalizar(texto);
  if (/\b(hola|buenas|hey)\b/.test(t)) return '¡Hola! 👋 ¿En qué te ayudo? Prueba enviarme una foto, una nota de voz o reaccionar a este mensaje.';
  if (t.includes('?')) return 'Buena pregunta 🤔 En el demo no sé mucho, pero el chat real te conecta con tu equipo al instante.';
  if (/gracias/.test(t)) return '¡Con gusto! 😊';
  const r = ['Anotado ✅', 'Interesante… cuéntame más.', '*Recibido*. Abre otra pestaña y habla como otra persona para ver el tiempo real ✨', '😂', 'Te leo 👀'];
  return r[Math.floor(Math.random() * r.length)]!;
}

/* ── backend ─────────────────────────────────────────────────── */

type Canal = { postMessage(d: unknown): void; close(): void; onmessage: ((ev: { data: unknown }) => void) | null };

export type OpcionesDemo = {
  yo: string;
  /** Nombre del BroadcastChannel (pruebas: uno por caso). */
  canal?: string;
  almacen?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  crearCanal?: (nombre: string) => Canal | null;
  /** Bot y presencia periódica (en pruebas se apagan). */
  vivo?: boolean;
  ahora?: () => number;
};

export type BackendDemo = ChatBackend & { reiniciar(): void; personas(): UsuarioChat[]; enLinea(): string[] };

function almacenLocal(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function canalPorDefecto(nombre: string): Canal | null {
  try {
    return typeof BroadcastChannel === 'undefined' ? null : (new BroadcastChannel(nombre) as unknown as Canal);
  } catch {
    return null;
  }
}

/** Crea el backend de demostración para `yo`. */
export function crearBackendDemo(o: OpcionesDemo): BackendDemo {
  const yo = o.yo;
  const front = nuevaClave('f');
  const ahora = o.ahora ?? (() => Date.now());
  const iso = () => new Date(ahora()).toISOString();
  const persistencia = o.almacen === undefined ? almacenLocal() : o.almacen;
  const canal = (o.crearCanal ?? canalPorDefecto)(o.canal ?? CANAL_DEMO);
  const vivo = o.vivo ?? true;
  const oyentes = new Set<(e: EventoChat) => void>();
  const senales = new Set<(s: SenalLlamada) => void>();
  const blobs = new Map<string, string>();
  const archivos = new Map<string, Blob>();
  /** front → { usuario, ts } de los latidos de presencia. */
  const latidos = new Map<string, { usuario: string; ts: number }>();
  const temporizadores: ReturnType<typeof setTimeout>[] = [];
  let guardado: ReturnType<typeof setTimeout> | null = null;

  const cargar = (): Almacen => {
    if (persistencia) {
      try {
        const r = AlmacenSchema.safeParse(JSON.parse(persistencia.getItem(CLAVE_ALMACEN) ?? 'null'));
        if (r.success) return r.data;
      } catch {
        /* corrupto: semilla */
      }
    }
    return semilla(ahora());
  };
  let A = cargar();

  const guardar = () => {
    if (!persistencia) return;
    if (guardado) clearTimeout(guardado);
    guardado = setTimeout(() => {
      try {
        persistencia.setItem(CLAVE_ALMACEN, JSON.stringify(A));
      } catch {
        // sin cupo: se guardan sin los adjuntos pesados
        try {
          const liviano = { ...A, mensajes: A.mensajes.map((m) => (m.adjunto && m.adjunto.url.length > 200 * 1024 ? { ...m, adjunto: { ...m.adjunto, url: '' } } : m)) };
          persistencia.setItem(CLAVE_ALMACEN, JSON.stringify(liviano));
        } catch {
          /* bloqueado */
        }
      }
    }, 150);
  };

  const emitir = (e: EventoChat) => {
    for (const fn of oyentes) fn(e);
  };
  const difundir = (op: Op) => {
    try {
      canal?.postMessage(op);
    } catch {
      // un Blob que no se puede clonar: se manda sin él
      if (op.op === 'mensaje') canal?.postMessage({ ...op, blob: null });
    }
  };

  /* vista por usuario */
  const ve = (c: ChatDemo, u = yo) => c.tipo === 'publico' || c.miembros.some((m) => m.id === u);
  const chatDemo = (id: string) => A.chats.find((c) => c.id === id);
  const prefsDe = (chat: string, u = yo) => A.prefs[u]?.[chat] ?? { fijado: false, silenciado: false, archivado: false, marcadoNoLeido: false };

  const aMensaje = (m: MensajeDemo): MensajeChat => ({
    ...m, destacado: (A.destacados[yo] ?? []).includes(m.clave), oculto: (A.ocultos[yo] ?? []).includes(m.clave), progreso: null,
    adjunto: m.adjunto ? { ...m.adjunto, url: blobs.get(m.adjunto.id) ?? m.adjunto.url } : null,
  });

  const vistaChat = (c: ChatDemo): Chat => {
    const p = prefsDe(c.id);
    const hasta = c.lecturas[yo]?.leido.hasta ?? '';
    const ocultos = A.ocultos[yo] ?? [];
    const propios = A.mensajes.filter((m) => m.chat === c.id && !ocultos.includes(m.clave));
    const noLeidos = propios.filter((m) => m.autor !== yo && m.tipo !== 'sistema' && m.ts > hasta).length;
    const ultimo = propios.reduce<MensajeDemo | null>((u, m) => (!u || m.ts >= u.ts ? m : u), null);
    return { ...c, ...p, noLeidos, ultimo: ultimo ? aMensaje(ultimo) : null };
  };

  const usuariosVistos = (): UsuarioChat[] => {
    const t = ahora();
    const activos = new Set([...latidos.values()].filter((l) => t - l.ts < AUSENTE_MS).map((l) => l.usuario));
    return A.usuarios.map((u) => ({ ...u, enLinea: u.id === BOT || activos.has(u.id) || u.id === yo }));
  };

  /** Aplica una operación al almacén y emite lo que corresponde al usuario de esta pestaña. */
  const aplicar = (op: Op) => {
    switch (op.op) {
      case 'mensaje': {
        const c = chatDemo(op.m.chat);
        if (!c) return;
        const i = A.mensajes.findIndex((m) => m.clave === op.m.clave);
        if (op.blob && op.m.adjunto && !blobs.has(op.m.adjunto.id) && typeof URL !== 'undefined' && URL.createObjectURL) blobs.set(op.m.adjunto.id, URL.createObjectURL(op.blob));
        if (i >= 0) A.mensajes[i] = op.m;
        else {
          A.mensajes.push(op.m);
          A.secuencia = Math.max(A.secuencia, Number(op.m.id) || 0);
        }
        if (op.m.ts > c.actividad) c.actividad = op.m.ts;
        // el autor ya «leyó» su propio mensaje
        c.lecturas[op.m.autor] = { entregado: { hasta: op.m.ts, cuando: op.m.ts }, leido: { hasta: op.m.ts, cuando: op.m.ts } };
        guardar();
        if (ve(c)) {
          // solo actividad y lecturas: el conteo de no leídos lo lleva el reductor al recibir el mensaje
          emitir({ tipo: 'chat', chat: { id: c.id, actividad: c.actividad, lecturas: c.lecturas } });
          emitir({ tipo: 'mensaje', mensaje: aMensaje(op.m) });
        }
        return;
      }
      case 'editar': {
        const m = A.mensajes.find((x) => x.chat === op.chat && coincide(x, op.ref));
        if (!m) return;
        m.texto = op.texto;
        m.editado = op.editado;
        guardar();
        if (ve(chatDemo(op.chat)!)) emitir({ tipo: 'mensaje.editado', chat: op.chat, ref: m.clave, texto: op.texto, editado: op.editado });
        return;
      }
      case 'eliminar': {
        const m = A.mensajes.find((x) => x.chat === op.chat && coincide(x, op.ref));
        if (!m) return;
        if (op.paraTodos) Object.assign(m, { eliminado: true, texto: '', adjunto: null, reacciones: [], respuestaA: null });
        else A.ocultos[op.usuario] = [...new Set([...(A.ocultos[op.usuario] ?? []), m.clave])];
        guardar();
        if (op.paraTodos || op.usuario === yo) emitir({ tipo: 'mensaje.eliminado', chat: op.chat, ref: m.clave, paraTodos: op.paraTodos });
        return;
      }
      case 'reaccion': {
        const m = A.mensajes.find((x) => x.chat === op.chat && coincide(x, op.ref));
        if (!m) return;
        m.reacciones = m.reacciones.filter((r) => r.usuario !== op.usuario);
        if (op.emoji) m.reacciones.push({ usuario: op.usuario, emoji: op.emoji });
        guardar();
        emitir({ tipo: 'reaccion', chat: op.chat, ref: m.clave, usuario: op.usuario, emoji: op.emoji });
        return;
      }
      case 'destacar': {
        const lista = new Set(A.destacados[op.usuario] ?? []);
        const m = A.mensajes.find((x) => x.chat === op.chat && coincide(x, op.ref));
        if (!m) return;
        if (op.valor) lista.add(m.clave);
        else lista.delete(m.clave);
        A.destacados[op.usuario] = [...lista];
        guardar();
        if (op.usuario === yo) emitir({ tipo: 'destacado', chat: op.chat, ref: m.clave, valor: op.valor });
        return;
      }
      case 'fijar': {
        const c = chatDemo(op.chat);
        if (!c) return;
        c.mensajeFijado = op.ref;
        guardar();
        emitir({ tipo: 'fijado', chat: op.chat, ref: op.ref });
        return;
      }
      case 'lectura': {
        const c = chatDemo(op.chat);
        if (!c) return;
        const l = c.lecturas[op.usuario] ?? { entregado: { hasta: null, cuando: null }, leido: { hasta: null, cuando: null } };
        const actual = l[op.campo].hasta;
        if (actual && actual >= op.hasta) return;
        l[op.campo] = { hasta: op.hasta, cuando: op.cuando };
        if (op.campo === 'leido' && (!l.entregado.hasta || l.entregado.hasta < op.hasta)) l.entregado = { hasta: op.hasta, cuando: op.cuando };
        c.lecturas[op.usuario] = l;
        if (op.campo === 'leido' && op.usuario === yo) {
          const p = prefsDe(op.chat);
          if (p.marcadoNoLeido) A.prefs[yo] = { ...A.prefs[yo], [op.chat]: { ...p, marcadoNoLeido: false } };
        }
        guardar();
        if (ve(c)) emitir({ tipo: op.campo, chat: op.chat, usuario: op.usuario, hasta: op.hasta, cuando: op.cuando });
        return;
      }
      case 'chat': {
        const i = A.chats.findIndex((c) => c.id === op.chat.id);
        const antes = i >= 0 ? A.chats[i]! : null;
        if (i >= 0) A.chats[i] = op.chat;
        else A.chats.push(op.chat);
        guardar();
        if (ve(op.chat)) emitir({ tipo: 'chat', chat: vistaChat(op.chat) });
        else if (antes && ve(antes)) emitir({ tipo: 'chat.quitado', chat: op.chat.id });
        return;
      }
      case 'prefs': {
        const actual = prefsDe(op.chat, op.usuario);
        const limpio = Object.fromEntries(Object.entries(op.p).filter(([, v]) => v !== undefined));
        A.prefs[op.usuario] = { ...A.prefs[op.usuario], [op.chat]: { ...actual, ...limpio } };
        guardar();
        const c = chatDemo(op.chat);
        if (op.usuario === yo && c) emitir({ tipo: 'chat', chat: vistaChat(c) });
        return;
      }
      case 'escribiendo': {
        const c = chatDemo(op.chat);
        if (c && ve(c) && op.usuario !== yo) emitir({ tipo: 'escribiendo', chat: op.chat, usuario: op.usuario, modo: op.modo, ahora: ahora() });
        return;
      }
      case 'presencia': {
        if (op.enLinea) latidos.set(op.front, { usuario: op.usuario, ts: ahora() });
        else latidos.delete(op.front);
        const u = A.usuarios.find((x) => x.id === op.usuario);
        if (u && !op.enLinea) {
          u.ultimaVez = op.ts;
          guardar();
        }
        const sigue = [...latidos.values()].some((l) => l.usuario === op.usuario && ahora() - l.ts < AUSENTE_MS);
        if (op.usuario !== yo && op.usuario !== BOT) emitir({ tipo: 'presencia', usuario: op.usuario, enLinea: sigue, ultimaVez: sigue ? null : op.ts });
        return;
      }
      case 'hola':
        // alguien llegó: le anuncio que estoy en línea
        latir();
        return;
      case 'senal': {
        const c = chatDemo(op.s.chat);
        if (!c || !ve(c)) return;
        for (const fn of senales) fn(op.s);
        return;
      }
      case 'reiniciar':
        A = semilla(ahora());
        guardar();
        void inicio().then((d) => emitir({ tipo: 'inicio', yo, usuarios: d.usuarios, chats: d.chats }));
        return;
    }
  };

  /** Aplica aquí y en las demás pestañas. */
  const operar = (op: Op) => {
    aplicar(op);
    difundir(op);
  };

  if (canal) {
    canal.onmessage = (ev) => {
      const op = ev.data as Op;
      if (!op || typeof op !== 'object' || typeof (op as { op?: unknown }).op !== 'string') return;
      if (op.op === 'senal') {
        const r = SenalLlamadaSchema.safeParse(op.s);
        if (!r.success) return;
        aplicar({ op: 'senal', s: r.data });
        return;
      }
      if (op.op === 'mensaje') {
        const r = MensajeDemoSchema.safeParse(op.m);
        if (!r.success) return;
        aplicar({ op: 'mensaje', m: r.data, blob: op.blob ?? null });
        return;
      }
      aplicar(op);
    };
  }

  const latir = () => difundir({ op: 'presencia', usuario: yo, front, enLinea: true, ts: iso() });
  let intervalo: ReturnType<typeof setInterval> | null = null;
  const despedir = () => difundir({ op: 'presencia', usuario: yo, front, enLinea: false, ts: iso() });
  if (vivo) {
    intervalo = setInterval(() => {
      latir();
      // revisa ausencias (quien dejó de latir pasa a «últ. vez»)
      const t = ahora();
      for (const [f, l] of [...latidos]) {
        if (t - l.ts < AUSENTE_MS) continue;
        latidos.delete(f);
        if (![...latidos.values()].some((x) => x.usuario === l.usuario) && l.usuario !== yo) {
          emitir({ tipo: 'presencia', usuario: l.usuario, enLinea: false, ultimaVez: new Date(l.ts).toISOString() });
        }
      }
    }, LATIDO_MS);
    if (typeof addEventListener === 'function') addEventListener('pagehide', despedir);
    difundir({ op: 'hola', front });
    latir();
  }

  const inicio = async () => ({ usuarios: usuariosVistos(), chats: A.chats.filter((c) => ve(c)).map(vistaChat) });

  /** El bot responde en sus directos si nadie está hablando como él. */
  const bot = (m: MensajeDemo) => {
    if (!vivo || m.autor === BOT || m.tipo === 'sistema') return;
    const c = chatDemo(m.chat);
    if (!c || c.tipo !== 'directo' || !c.miembros.some((x) => x.id === BOT)) return;
    if ([...latidos.values()].some((l) => l.usuario === BOT && ahora() - l.ts < AUSENTE_MS)) return;
    const en = (ms: number, fn: () => void) => temporizadores.push(setTimeout(fn, ms));
    en(500, () => operar({ op: 'lectura', campo: 'entregado', chat: c.id, usuario: BOT, hasta: m.ts, cuando: iso() }));
    en(1100, () => operar({ op: 'lectura', campo: 'leido', chat: c.id, usuario: BOT, hasta: m.ts, cuando: iso() }));
    en(1300, () => operar({ op: 'escribiendo', chat: c.id, usuario: BOT, modo: 'texto' }));
    en(2800, () => {
      operar({ op: 'escribiendo', chat: c.id, usuario: BOT, modo: null });
      A.secuencia++;
      const texto = m.tipo === 'texto' ? respuestaBot(m.texto) : m.tipo === 'audio' ? '¡Qué buena nota de voz! 🎧' : '¡Gracias por el archivo! 📎';
      operar({ op: 'mensaje', m: { clave: nuevaClave('b'), id: String(A.secuencia), chat: c.id, autor: BOT, tipo: 'texto', texto, ts: iso(), editado: null, eliminado: false, reenviado: false, respuestaA: null, adjunto: null, reacciones: [], estado: 'enviado', meta: {} } });
    });
  };

  const sistema = (chat: string, texto: string) => {
    A.secuencia++;
    operar({ op: 'mensaje', m: { clave: nuevaClave('y'), id: String(A.secuencia), chat, autor: yo, tipo: 'sistema', texto, ts: iso(), editado: null, eliminado: false, reenviado: false, respuestaA: null, adjunto: null, reacciones: [], estado: 'enviado', meta: {} } });
  };
  const nombre = (id: string) => A.usuarios.find((u) => u.id === id)?.nombre ?? id;

  const backend: BackendDemo = {
    yo,
    front,
    iniciar: inicio,
    suscribir(fn) {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    alSenal(fn) {
      senales.add(fn);
      return () => senales.delete(fn);
    },
    async historial(chat, antes, limite = 40) {
      const c = chatDemo(chat);
      if (!c || !ve(c)) return { mensajes: [], hayMas: false };
      const todos = A.mensajes.filter((m) => m.chat === chat && (!antes || m.ts < antes)).sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
      const pagina = todos.slice(-limite);
      return { mensajes: pagina.map(aMensaje), hayMas: todos.length > pagina.length };
    },
    async enviar(b: Borrador) {
      const c = chatDemo(b.chat);
      if (!c || !ve(c)) throw new Error('Chat no disponible');
      const ya = A.mensajes.find((m) => m.clave === b.clave);
      if (ya) return { id: ya.id ?? '', ts: ya.ts };
      A.secuencia++;
      const m: MensajeDemo = {
        clave: b.clave, id: String(A.secuencia), chat: b.chat, autor: yo, tipo: b.tipo, texto: b.texto, ts: iso(), editado: null, eliminado: false, reenviado: b.reenviado,
        respuestaA: b.respuestaA, adjunto: b.adjunto, reacciones: [], estado: 'enviado', meta: b.meta,
      };
      const blob = b.adjunto ? archivos.get(b.adjunto.id) ?? null : null;
      aplicar({ op: 'mensaje', m });
      difundir({ op: 'mensaje', m, blob });
      bot(m);
      return { id: m.id!, ts: m.ts };
    },
    async subir(archivo, op?: OpcionesSubida) {
      const id = nuevaClave('a');
      const nombreArchivo = archivo.name ?? `archivo-${id}`;
      const mime = archivo.type || 'application/octet-stream';
      // progreso simulado (cancelable)
      await new Promise<void>((ok, mal) => {
        let p = 0;
        const paso = setInterval(() => {
          if (op?.senal?.aborted) {
            clearInterval(paso);
            mal(new DOMException('Cancelado', 'AbortError'));
            return;
          }
          p = Math.min(1, p + 0.08 + Math.random() * 0.12);
          op?.progreso?.(p);
          if (p >= 1) {
            clearInterval(paso);
            ok();
          }
        }, 70);
      });
      let url = '';
      if (archivo.size <= MAX_DATAURL && typeof FileReader !== 'undefined') {
        url = await new Promise<string>((ok) => {
          const lector = new FileReader();
          lector.onload = () => ok(String(lector.result));
          lector.onerror = () => ok('');
          lector.readAsDataURL(archivo);
        });
      }
      if (!url && typeof URL !== 'undefined' && URL.createObjectURL) {
        const b = URL.createObjectURL(archivo);
        blobs.set(id, b);
        archivos.set(id, archivo);
        url = b;
      }
      const dims = tipoDeMime(mime) === 'imagen' ? await medirImagen(url) : null;
      return { id, nombre: nombreArchivo, mime, bytes: archivo.size, url, ancho: dims?.ancho ?? null, alto: dims?.alto ?? null, duracion: null, onda: [] } satisfies Adjunto;
    },
    async editar(chat, ref, texto) {
      operar({ op: 'editar', chat, ref, texto, editado: iso() });
    },
    async eliminar(chat, ref, paraTodos) {
      operar({ op: 'eliminar', chat, ref, paraTodos, usuario: yo });
    },
    async reaccionar(chat, ref, emoji) {
      operar({ op: 'reaccion', chat, ref, usuario: yo, emoji });
    },
    async destacar(chat, ref, valor) {
      operar({ op: 'destacar', chat, ref, usuario: yo, valor });
    },
    async fijar(chat, ref) {
      operar({ op: 'fijar', chat, ref });
    },
    async info(chat, ref): Promise<InfoLectura[]> {
      const c = chatDemo(chat);
      const m = A.mensajes.find((x) => x.chat === chat && coincide(x, ref));
      if (!c || !m) return [];
      return infoLectura(aMensaje(m), vistaChat(c), yo);
    },
    async leido(chat, hasta) {
      operar({ op: 'lectura', campo: 'leido', chat, usuario: yo, hasta, cuando: iso() });
    },
    async entregado(chat, hasta) {
      operar({ op: 'lectura', campo: 'entregado', chat, usuario: yo, hasta, cuando: iso() });
    },
    escribiendo(chat, modo) {
      difundir({ op: 'escribiendo', chat, usuario: yo, modo });
    },
    async preferencias(chat, p) {
      operar({ op: 'prefs', usuario: yo, chat, p });
    },
    async directo(usuario) {
      const ya = A.chats.find((c) => c.tipo === 'directo' && c.miembros.length === 2 && c.miembros.some((m) => m.id === yo) && c.miembros.some((m) => m.id === usuario));
      if (ya) return vistaChat(ya);
      const t = iso();
      const c: ChatDemo = { id: `d-${[yo, usuario].sort().join('-')}-${Date.now().toString(36)}`, tema: null, tipo: 'directo', nombre: '', descripcion: '', foto: null, miembros: [{ id: yo, rol: 'miembro' }, { id: usuario, rol: 'miembro' }], mensajeFijado: null, actividad: t, creado: t, lecturas: {} };
      operar({ op: 'chat', chat: c });
      return vistaChat(c);
    },
    async grupo(d: DatosGrupo) {
      const t = iso();
      const miembros = [{ id: yo, rol: 'admin' as const }, ...[...new Set(d.miembros)].filter((m) => m !== yo).map((id) => ({ id, rol: 'miembro' as const }))];
      const c: ChatDemo = { id: `g-${Date.now().toString(36)}`, tema: null, tipo: 'grupo', nombre: d.nombre.trim(), descripcion: d.descripcion?.trim() ?? '', foto: d.foto ?? null, miembros, mensajeFijado: null, actividad: t, creado: t, lecturas: {} };
      operar({ op: 'chat', chat: c });
      sistema(c.id, textos().creoGrupo(nombre(yo), c.nombre));
      return vistaChat(chatDemo(c.id)!);
    },
    async tema(chat, tema) {
      const c = chatDemo(chat);
      if (c) operar({ op: 'chat', chat: { ...c, tema } });
    },
    async editarGrupo(chat, d) {
      const c = chatDemo(chat);
      if (!c) return;
      operar({ op: 'chat', chat: { ...c, nombre: d.nombre?.trim() || c.nombre, descripcion: d.descripcion ?? c.descripcion, foto: d.foto === undefined ? c.foto : d.foto } });
      sistema(chat, textos().cambioGrupo(nombre(yo)));
    },
    async miembros(chat, accion: AccionMiembros, usuarios) {
      const c = chatDemo(chat);
      if (!c) return;
      const t = textos();
      let miembros = c.miembros.map((m) => ({ ...m }));
      const textosSistema: string[] = [];
      for (const u of usuarios) {
        if (accion === 'agregar' && !miembros.some((m) => m.id === u)) {
          miembros.push({ id: u, rol: 'miembro' });
          textosSistema.push(t.agrego(nombre(yo), nombre(u)));
        } else if (accion === 'quitar') {
          miembros = miembros.filter((m) => m.id !== u);
          textosSistema.push(t.quito(nombre(yo), nombre(u)));
        } else if (accion === 'admin' || accion === 'miembro') {
          miembros = miembros.map((m) => (m.id === u ? { ...m, rol: accion === 'admin' ? 'admin' : 'miembro' } : m));
          textosSistema.push(accion === 'admin' ? t.nombroAdmin(nombre(yo), nombre(u)) : t.quitoAdmin(nombre(yo), nombre(u)));
        }
      }
      if (accion === 'salir') {
        miembros = miembros.filter((m) => m.id !== yo);
        // si no queda administrador, el más antiguo pasa a serlo
        if (miembros.length && !miembros.some((m) => m.rol === 'admin')) miembros[0]!.rol = 'admin';
        textosSistema.push(t.salio(nombre(yo)));
      }
      for (const s of textosSistema) sistema(chat, s);
      operar({ op: 'chat', chat: { ...c, miembros } });
    },
    async buscar(q, chat) {
      const consulta = q.trim();
      if (!consulta) return [];
      const visibles = new Set(A.chats.filter((c) => ve(c) && (!chat || c.id === chat)).map((c) => c.id));
      const ocultos = new Set(A.ocultos[yo] ?? []);
      const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
      const out: ResultadoBusqueda[] = [];
      for (const m of A.mensajes) {
        if (!visibles.has(m.chat) || ocultos.has(m.clave) || m.eliminado || m.tipo === 'sistema') continue;
        const texto = m.texto || resumenMensaje(m, textos());
        const base = normalizar(`${texto} ${m.adjunto?.nombre ?? ''}`);
        // La coincidencia siempre gana a lo parecido.
        const puntaje = palabras.every((p) => base.includes(p)) ? 2 : similitudLexica(consulta, texto);
        if (puntaje >= 0.34) out.push({ chat: m.chat, ref: m.clave, autor: m.autor, ts: m.ts, texto, puntaje });
      }
      return out.sort((a, b) => b.puntaje - a.puntaje || (a.ts < b.ts ? 1 : -1)).slice(0, 50);
    },
    senal(s) {
      difundir({ op: 'senal', s });
    },
    async iceServers() {
      return [STUN_CLOUDFLARE];
    },
    async registrarLlamada(r: RegistroLlamada) {
      A.secuencia++;
      const m: MensajeDemo = {
        clave: nuevaClave('l'), id: String(A.secuencia), chat: r.chat, autor: r.iniciador, tipo: 'llamada', texto: '', ts: r.fin, editado: null, eliminado: false, reenviado: false,
        respuestaA: null, adjunto: null, reacciones: [], estado: 'enviado', meta: { medio: r.medio, duracion: r.duracion, perdida: r.perdida, participantes: r.participantes },
      };
      operar({ op: 'mensaje', m });
    },
    cerrar() {
      if (intervalo) clearInterval(intervalo);
      for (const t of temporizadores) clearTimeout(t);
      if (vivo) despedir();
      if (typeof removeEventListener === 'function') removeEventListener('pagehide', despedir);
      try {
        canal?.close();
      } catch {
        /* nada */
      }
      oyentes.clear();
      senales.clear();
    },
    reiniciar() {
      operar({ op: 'reiniciar' });
    },
    personas: () => usuariosVistos(),
    enLinea: () => usuariosVistos().filter((u) => u.enLinea).map((u) => u.id),
  };
  return backend;
}

/** Ancho y alto de una imagen (para reservar su lugar en la burbuja y no saltar al cargar). */
function medirImagen(url: string): Promise<{ ancho: number; alto: number } | null> {
  if (!url || typeof Image === 'undefined') return Promise.resolve(null);
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok({ ancho: img.naturalWidth, alto: img.naturalHeight });
    img.onerror = () => ok(null);
    img.src = url;
  });
}

/** Personas que hay en el demo (para el selector «hablar como»). */
export const personasDemo = (): UsuarioChat[] => USUARIOS_DEMO.filter((u) => u.id !== BOT);
