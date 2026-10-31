/**
 * estado.ts — estado único del chat sin DOM (HW-CHAT-02): reductor puro `(estado, evento) → estado` que aplican por
 * igual las respuestas del backend, los eventos de la sala y las acciones optimistas del front; y los selectores que
 * arman lo que pintan los componentes (lista ordenada y filtrada, nombre del chat, quién escribe, info de lectura).
 *
 * Inmutable: cada evento devuelve objetos nuevos SOLO en lo que cambió (los mensajes intactos conservan su identidad),
 * así los componentes reconcilian por clave sin repintar lo demás.
 */
import { type Chat, coincide, type EstadoChat, type EventoChat, type InfoLectura, type Lectura, type MensajeChat, type UsuarioChat } from './tipos.js';
import { destinatarios, normalizar, ordenCronologico } from './formato.js';

export const ESCRIBIENDO_MS = 6000;

export function estadoInicial(yo = ''): EstadoChat {
  return { yo, usuarios: {}, chats: {}, mensajes: {}, hayMas: {}, escribiendo: {}, conexion: 'conectando', activo: null };
}

const max = (a: string | null | undefined, b: string | null | undefined): string | null => (!a ? b ?? null : !b ? a : a > b ? a : b);

function conChat(e: EstadoChat, id: string, fn: (c: Chat) => Chat): EstadoChat {
  const c = e.chats[id];
  if (!c) return e;
  const n = fn(c);
  return n === c ? e : { ...e, chats: { ...e.chats, [id]: n } };
}

function conMensajes(e: EstadoChat, chat: string, fn: (ms: MensajeChat[]) => MensajeChat[]): EstadoChat {
  const ms = e.mensajes[chat] ?? [];
  const n = fn(ms);
  return n === ms ? e : { ...e, mensajes: { ...e.mensajes, [chat]: n } };
}

/** Cambia el mensaje referido (por clave o id) con `fn`; si no está, nada. */
function conMensaje(e: EstadoChat, chat: string, ref: string, fn: (m: MensajeChat) => MensajeChat): EstadoChat {
  return conMensajes(e, chat, (ms) => {
    const i = ms.findIndex((m) => coincide(m, ref));
    if (i < 0) return ms;
    const n = fn(ms[i]!);
    if (n === ms[i]) return ms;
    const copia = ms.slice();
    copia[i] = n;
    return copia;
  });
}

/** Inserta o fusiona mensajes en orden cronológico; idempotente por clave o id (W-CHAT-42). */
function fusionar(ms: MensajeChat[], nuevos: MensajeChat[]): { lista: MensajeChat[]; agregados: MensajeChat[] } {
  let lista = ms;
  const agregados: MensajeChat[] = [];
  for (const n of nuevos) {
    const i = lista.findIndex((m) => m.clave === n.clave || (!!n.id && m.id === n.id));
    if (i >= 0) {
      const v = lista[i]!;
      // el servidor manda en contenido; lo local (oculto/destacado/progreso) se conserva si el nuevo no lo trae
      const f: MensajeChat = { ...v, ...n, clave: v.clave, id: n.id ?? v.id, oculto: v.oculto || n.oculto, destacado: n.destacado || v.destacado, progreso: n.estado === 'pendiente' ? v.progreso : null };
      if (JSON.stringify(f) === JSON.stringify(v)) continue;
      if (lista === ms) lista = ms.slice();
      lista[i] = f;
      if (f.ts !== v.ts) lista.sort(ordenCronologico);
      continue;
    }
    if (lista === ms) lista = ms.slice();
    // inserción ordenada (lo normal es al final)
    let j = lista.length;
    while (j > 0 && ordenCronologico(lista[j - 1]!, n) > 0) j--;
    lista.splice(j, 0, n);
    agregados.push(n);
  }
  return { lista, agregados };
}

function lecturaDe(c: Chat, usuario: string): Lectura {
  return c.lecturas[usuario] ?? { entregado: { hasta: null, cuando: null }, leido: { hasta: null, cuando: null } };
}

/** Si el último mensaje del chat es el referido, le aplica `fn` (la lista refleja ediciones y borrados). */
function sincronizarUltimo(e: EstadoChat, chat: string, ref: string, fn: (m: MensajeChat) => MensajeChat): EstadoChat {
  return conChat(e, chat, (c) => (c.ultimo && coincide(c.ultimo, ref) ? { ...c, ultimo: fn(c.ultimo) } : c));
}

/** Aplica un evento. Puro: no toca `e`. */
export function reducir(e: EstadoChat, ev: EventoChat): EstadoChat {
  switch (ev.tipo) {
    case 'inicio': {
      const usuarios = Object.fromEntries(ev.usuarios.map((u) => [u.id, u]));
      const chats = Object.fromEntries(ev.chats.map((c) => [c.id, c]));
      return { ...e, yo: ev.yo, usuarios, chats };
    }
    case 'usuarios': {
      if (!ev.usuarios.length) return e;
      const usuarios = { ...e.usuarios };
      for (const u of ev.usuarios) usuarios[u.id] = { ...usuarios[u.id], ...u };
      return { ...e, usuarios };
    }
    case 'chat': {
      const previo = e.chats[ev.chat.id];
      if (!previo && !ev.chat.tipo) return e;
      const base: Chat = previo ?? {
        id: ev.chat.id, tipo: ev.chat.tipo!, nombre: '', descripcion: '', foto: null, miembros: [], fijado: false, silenciado: false, archivado: false,
        marcadoNoLeido: false, noLeidos: 0, mensajeFijado: null, actividad: '', creado: '', lecturas: {}, ultimo: null,
      };
      const limpio = Object.fromEntries(Object.entries(ev.chat).filter(([, v]) => v !== undefined));
      const n = { ...base, ...limpio } as Chat;
      if (previo && JSON.stringify(n) === JSON.stringify(previo)) return e;
      return { ...e, chats: { ...e.chats, [n.id]: n } };
    }
    case 'chat.quitado': {
      if (!e.chats[ev.chat]) return e;
      const chats = { ...e.chats };
      delete chats[ev.chat];
      const mensajes = { ...e.mensajes };
      delete mensajes[ev.chat];
      return { ...e, chats, mensajes, activo: e.activo === ev.chat ? null : e.activo };
    }
    case 'historial': {
      const r = fusionar(e.mensajes[ev.chat] ?? [], ev.mensajes);
      const sig = r.lista === (e.mensajes[ev.chat] ?? []) ? e : { ...e, mensajes: { ...e.mensajes, [ev.chat]: r.lista } };
      return sig.hayMas[ev.chat] === ev.hayMas ? sig : { ...sig, hayMas: { ...sig.hayMas, [ev.chat]: ev.hayMas } };
    }
    case 'mensaje': {
      const m = ev.mensaje;
      const previos = e.mensajes[m.chat] ?? [];
      const r = fusionar(previos, [m]);
      if (r.lista === previos) return e;
      let sig: EstadoChat = { ...e, mensajes: { ...e.mensajes, [m.chat]: r.lista } };
      const nuevo = r.agregados.length > 0;
      const fusionado = r.lista.find((x) => x.clave === m.clave) ?? m;
      sig = conChat(sig, m.chat, (c) => {
        const actividad = max(c.actividad, m.ts) ?? c.actividad;
        const esUltimo = !fusionado.oculto && (!c.ultimo || c.ultimo.clave === fusionado.clave || c.ultimo.ts <= fusionado.ts);
        if (esUltimo) c = { ...c, ultimo: fusionado };
        if (!nuevo) return actividad === c.actividad ? c : { ...c, actividad };
        if (m.autor === e.yo) return { ...c, actividad, noLeidos: 0, marcadoNoLeido: false, archivado: c.archivado && c.silenciado };
        const cuenta = m.tipo !== 'sistema' && !m.oculto && e.activo !== m.chat;
        // un mensaje nuevo saca de archivados a los no silenciados (como WhatsApp)
        return { ...c, actividad, noLeidos: cuenta ? c.noLeidos + 1 : c.noLeidos, archivado: c.archivado && c.silenciado };
      });
      // quien escribe un mensaje deja de «escribir»
      if (nuevo && sig.escribiendo[m.chat]?.[m.autor]) {
        const del = { ...sig.escribiendo[m.chat] };
        delete del[m.autor];
        sig = { ...sig, escribiendo: { ...sig.escribiendo, [m.chat]: del } };
      }
      return sig;
    }
    case 'mensaje.confirmado':
      return conMensaje(e, ev.chat, ev.clave, (m) => ({ ...m, id: ev.id, ts: ev.ts ?? m.ts, estado: 'enviado', progreso: null }));
    case 'mensaje.fallido':
      return conMensaje(e, ev.chat, ev.clave, (m) => (m.estado === 'fallido' ? m : { ...m, estado: 'fallido', progreso: null }));
    case 'mensaje.progreso':
      return conMensaje(e, ev.chat, ev.clave, (m) => (m.progreso === ev.progreso ? m : { ...m, progreso: ev.progreso }));
    case 'mensaje.quitado':
      return conMensajes(e, ev.chat, (ms) => (ms.some((m) => m.clave === ev.clave) ? ms.filter((m) => m.clave !== ev.clave) : ms));
    case 'mensaje.editado':
      return sincronizarUltimo(conMensaje(e, ev.chat, ev.ref, (m) => (m.texto === ev.texto && m.editado ? m : { ...m, texto: ev.texto, editado: ev.editado })), ev.chat, ev.ref, (m) => ({ ...m, texto: ev.texto, editado: ev.editado }));
    case 'mensaje.eliminado': {
      const sig = conMensaje(e, ev.chat, ev.ref, (m) => {
        if (!ev.paraTodos) return m.oculto ? m : { ...m, oculto: true };
        return m.eliminado ? m : { ...m, eliminado: true, texto: '', adjunto: null, reacciones: [], respuestaA: null, destacado: false };
      });
      if (!ev.paraTodos) {
        // oculto para mí: el último visible pasa a ser el anterior (si está cargado)
        return conChat(sig, ev.chat, (c) => (c.ultimo && coincide(c.ultimo, ev.ref) ? { ...c, ultimo: [...(sig.mensajes[ev.chat] ?? [])].reverse().find((x) => !x.oculto) ?? null } : c));
      }
      return sincronizarUltimo(sig, ev.chat, ev.ref, (m) => ({ ...m, eliminado: true, texto: '', adjunto: null }));
    }
    case 'reaccion':
      return conMensaje(e, ev.chat, ev.ref, (m) => {
        const otras = m.reacciones.filter((r) => r.usuario !== ev.usuario);
        const previa = m.reacciones.find((r) => r.usuario === ev.usuario);
        if (!ev.emoji && !previa) return m;
        if (previa?.emoji === ev.emoji) return m;
        return { ...m, reacciones: ev.emoji ? [...otras, { usuario: ev.usuario, emoji: ev.emoji }] : otras };
      });
    case 'reacciones':
      return conMensaje(e, ev.chat, ev.ref, (m) => (JSON.stringify(m.reacciones) === JSON.stringify(ev.reacciones) ? m : { ...m, reacciones: ev.reacciones }));
    case 'destacado':
      return conMensaje(e, ev.chat, ev.ref, (m) => (m.destacado === ev.valor ? m : { ...m, destacado: ev.valor }));
    case 'fijado':
      return conChat(e, ev.chat, (c) => (c.mensajeFijado === ev.ref ? c : { ...c, mensajeFijado: ev.ref }));
    case 'leido':
    case 'entregado': {
      let sig = conChat(e, ev.chat, (c) => {
        const l = lecturaDe(c, ev.usuario);
        const campo = ev.tipo;
        const actual = l[campo];
        if (actual.hasta && actual.hasta >= ev.hasta) return c;
        const nueva: Lectura = { ...l, [campo]: { hasta: ev.hasta, cuando: ev.cuando } };
        // leer implica haber recibido
        if (campo === 'leido' && (!l.entregado.hasta || l.entregado.hasta < ev.hasta)) nueva.entregado = { hasta: ev.hasta, cuando: ev.cuando };
        return { ...c, lecturas: { ...c.lecturas, [ev.usuario]: nueva } };
      });
      if (ev.tipo === 'leido' && ev.usuario === e.yo) {
        sig = conChat(sig, ev.chat, (c) => (c.noLeidos === 0 && !c.marcadoNoLeido ? c : { ...c, noLeidos: 0, marcadoNoLeido: false }));
      }
      return sig;
    }
    case 'escribiendo': {
      const actual = e.escribiendo[ev.chat] ?? {};
      if (!ev.modo) {
        if (!actual[ev.usuario]) return e;
        const n = { ...actual };
        delete n[ev.usuario];
        return { ...e, escribiendo: { ...e.escribiendo, [ev.chat]: n } };
      }
      return { ...e, escribiendo: { ...e.escribiendo, [ev.chat]: { ...actual, [ev.usuario]: { modo: ev.modo, hasta: ev.ahora + ESCRIBIENDO_MS } } } };
    }
    case 'presencia': {
      const u = e.usuarios[ev.usuario];
      if (!u) return e;
      const ultimaVez = ev.ultimaVez ?? u.ultimaVez;
      if (u.enLinea === ev.enLinea && u.ultimaVez === ultimaVez) return e;
      return { ...e, usuarios: { ...e.usuarios, [u.id]: { ...u, enLinea: ev.enLinea, ultimaVez } } };
    }
    case 'conexion':
      return e.conexion === ev.estado ? e : { ...e, conexion: ev.estado };
    case 'activo': {
      if (e.activo === ev.chat) return e;
      return { ...e, activo: ev.chat };
    }
  }
}

/** Aplica varios eventos en orden. */
export const reducirTodos = (e: EstadoChat, evs: EventoChat[]): EstadoChat => evs.reduce(reducir, e);

/* ── selectores ──────────────────────────────────────────────── */

/** Nombre visible: en un directo, el de la otra persona. */
export function nombreChat(c: Chat, usuarios: Record<string, UsuarioChat>, yo: string): string {
  if (c.tipo === 'directo') {
    const otro = c.miembros.find((m) => m.id !== yo)?.id;
    return (otro && usuarios[otro]?.nombre) || c.nombre || otro || '';
  }
  return c.nombre;
}

/** La otra persona de un directo. */
export const otroDe = (c: Chat, yo: string): string | null => (c.tipo === 'directo' ? c.miembros.find((m) => m.id !== yo)?.id ?? null : null);

/** Fijados arriba; luego por actividad más reciente (W-CHAT-03). */
export function ordenarChats(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => {
    if (a.fijado !== b.fijado) return a.fijado ? -1 : 1;
    if (a.actividad !== b.actividad) return a.actividad > b.actividad ? -1 : 1;
    return a.nombre.localeCompare(b.nombre);
  });
}

export type FiltroChats = 'todos' | 'noleidos' | 'grupos' | 'directos';

/**
 * Filtros rápidos y búsqueda por nombre del chat o de sus integrantes (W-CHAT-04). Los archivados solo aparecen con
 * `archivados = true` (y entonces solo ellos).
 */
export function filtrarChats(chats: Chat[], o: { filtro: FiltroChats; q: string; archivados: boolean; usuarios: Record<string, UsuarioChat>; yo: string }): Chat[] {
  const q = normalizar(o.q.trim());
  return ordenarChats(chats.filter((c) => {
    if (c.archivado !== o.archivados) return false;
    if (o.filtro === 'noleidos' && c.noLeidos === 0 && !c.marcadoNoLeido) return false;
    if (o.filtro === 'grupos' && c.tipo === 'directo') return false;
    if (o.filtro === 'directos' && c.tipo !== 'directo') return false;
    if (!q) return true;
    if (normalizar(nombreChat(c, o.usuarios, o.yo)).includes(q)) return true;
    return c.miembros.some((m) => normalizar(o.usuarios[m.id]?.nombre ?? m.id).includes(q));
  }));
}

/** Quién escribe (o graba) ahora en un chat, sin contarme. */
export function escribiendoEn(e: EstadoChat, chat: string, ahora = Date.now()): { usuario: string; modo: 'texto' | 'audio' }[] {
  return Object.entries(e.escribiendo[chat] ?? {})
    .filter(([u, v]) => u !== e.yo && v.hasta > ahora)
    .map(([usuario, v]) => ({ usuario, modo: v.modo }));
}

/** Primer mensaje ajeno posterior a mi marca de lectura (para la línea «N no leídos»). */
export function primerNoLeido(e: EstadoChat, chat: string): string | null {
  const c = e.chats[chat];
  if (!c) return null;
  const hasta = c.lecturas[e.yo]?.leido.hasta ?? null;
  const ms = (e.mensajes[chat] ?? []).filter((m) => !m.oculto);
  const m = ms.find((x) => x.autor !== e.yo && x.tipo !== 'sistema' && (!hasta || x.ts > hasta));
  if (!m) return null;
  return c.noLeidos > 0 || c.marcadoNoLeido ? m.clave : null;
}

/** Último mensaje visible del chat. */
export function ultimoDe(e: EstadoChat, chat: string): MensajeChat | null {
  const ms = e.mensajes[chat] ?? [];
  for (let i = ms.length - 1; i >= 0; i--) if (!ms[i]!.oculto) return ms[i]!;
  return e.chats[chat]?.ultimo ?? null;
}

/** Info de lectura de un mensaje propio (W-CHAT-28): por integrante, cuándo le llegó y cuándo lo leyó. */
export function infoLectura(m: MensajeChat, c: Chat, yo: string): InfoLectura[] {
  return destinatarios(c, yo).map((usuario) => {
    const l = c.lecturas[usuario];
    const leido = l?.leido.hasta && l.leido.hasta >= m.ts ? l.leido.cuando ?? l.leido.hasta : null;
    const entregado = l?.entregado.hasta && l.entregado.hasta >= m.ts ? l.entregado.cuando ?? l.entregado.hasta : leido;
    return { usuario, entregado, leido };
  });
}

/** Busca un mensaje en todo el estado por `ref`. */
export function mensajePorRef(e: EstadoChat, chat: string, ref: string | null): MensajeChat | null {
  if (!ref) return null;
  return (e.mensajes[chat] ?? []).find((m) => coincide(m, ref)) ?? null;
}

/** Total de no leídos (chats no silenciados ni archivados). */
export const totalNoLeidos = (e: EstadoChat): number => Object.values(e.chats).reduce((n, c) => n + (c.archivado || c.silenciado ? 0 : c.noLeidos), 0);

/** ¿Es administrador `usuario` del chat? */
export const esAdmin = (c: Chat, usuario: string): boolean => c.miembros.some((m) => m.id === usuario && m.rol === 'admin');
