/**
 * formato.ts — lógica de presentación del chat sin DOM (probada sin navegador):
 *   - formato ligero (W-CHAT-15): *negrita*, _cursiva_, ~tachado~, `código`, bloques ```, enlaces y @menciones → HTML saneado;
 *   - mensajes de solo emojis (hasta 3) en grande;
 *   - agrupación por día y por autor en ráfagas de 5 minutos, con la línea de no leídos (W-CHAT-09/10);
 *   - marcas de lectura ✓ / ✓✓ / ✓✓ en color, con «leído» = todos los demás integrantes (W-CHAT-17);
 *   - validaciones de envío (texto, archivos) y plazos de edición y borrado (W-CHAT-16/20/25/26/43).
 */
import type { Chat, MensajeChat, TipoMensaje, UsuarioChat } from './tipos.js';
import type { Textos } from './textos.js';

export const MAX_TEXTO = 4000;
/** Límite por archivo: lo manda el API (`ajustes/archivos`, se cambia en Administración); este es el de fábrica. */
let maxMb = 30;
export const limiteMb = (): number => maxMb;
export const fijarLimiteMb = (mb: number): void => {
  if (mb > 0) maxMb = mb;
};
export const RAFAGA_MS = 5 * 60 * 1000;
export const EDITAR_MS = 15 * 60 * 1000;
export const ELIMINAR_TODOS_MS = 60 * 60 * 1000;
export const MAX_LLAMADA = 6;
export const REACCIONES_RAPIDAS = ['👍', '❤️', '😂', '😮', '😢', '🙏'] as const;

/** Extensiones que nunca se suben (ejecutables y scripts). */
export const EXTENSIONES_BLOQUEADAS = ['exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif', 'vbs', 'js', 'jse', 'ps1', 'sh', 'jar', 'apk', 'dll', 'reg', 'hta', 'cpl'];

/* ── utilidades de texto ─────────────────────────────────────── */

/** Minúsculas y sin tildes (búsquedas y comparaciones). */
export const normalizar = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const escaparHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Iniciales (máximo 2) de un nombre. */
export function iniciales(nombre: string): string {
  const letras = (p: string) => [...p].filter((ch) => /[\p{L}\p{N}]/u.test(ch));
  const partes = nombre.trim().split(/\s+/).map(letras).filter((l) => l.length > 0);
  if (partes.length === 0) return '?';
  const dos = partes.length > 1 ? `${partes[0]![0]}${partes[1]![0]}` : partes[0]!.slice(0, 2).join('');
  return dos.toUpperCase();
}

/** Color estable por persona: índice 0..7 que la hoja traduce a un token de la paleta. */
export function colorDe(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return h % 8;
}

/** `m:ss` o `h:mm:ss`. */
export function duracionTexto(segundos: number): string {
  const s = Math.max(0, Math.round(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}

/* ── formato ligero ──────────────────────────────────────────── */

const URL_RE = /\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)'"\]]/g;
const MENCION_RE = /(^|[\s(>])@([\p{L}\p{N}_][\p{L}\p{N}_.-]*[\p{L}\p{N}_]|[\p{L}\p{N}_])/gu;
const borde = String.raw`(^|[\s(>¡¿"'\u0000])`;
const cierre = String.raw`(?=$|[\s.,;:!?)<"'\u0000])`;
const marca = (c: string) => new RegExp(`${borde}\\${c}(?=\\S)([^\\${c}\\n]*?\\S)\\${c}${cierre}`, 'g');
const NEGRITA_RE = marca('*');
const CURSIVA_RE = marca('_');
const TACHADO_RE = marca('~');

/** Enlaces de un texto (para «Enlaces» de la info del chat). */
export const enlacesDe = (texto: string): string[] => texto.match(URL_RE) ?? [];

/**
 * Texto del mensaje → HTML saneado: primero se escapa TODO y luego se marcan los patrones, así ningún dato del usuario
 * llega a ser HTML. `menciones`: nombres conocidos (si se pasan, solo esos se resaltan).
 */
export function formatearHtml(texto: string, menciones: string[] = []): string {
  const guardados: string[] = [];
  const guardar = (html: string) => `\u0000${guardados.push(html) - 1}\u0000`;
  let s = escaparHtml(texto);
  s = s.replace(/```\n?([\s\S]*?)\n?```/g, (_m, codigo: string) => guardar(`<pre class="bloque"><code>${codigo}</code></pre>`));
  s = s.replace(/`([^`\n]+)`/g, (_m, codigo: string) => guardar(`<code class="codigo">${codigo}</code>`));
  s = s.replace(URL_RE, (url) => guardar(`<a class="enlace" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`));
  const conocidos = new Set(menciones.map((n) => normalizar(n.split(/\s+/)[0] ?? n)));
  s = s.replace(MENCION_RE, (m, antes: string, nombre: string) => {
    if (conocidos.size && !conocidos.has(normalizar(nombre))) return m;
    return `${antes}${guardar(`<span class="mencion">@${nombre}</span>`)}`;
  });
  for (let i = 0; i < 2; i++) {
    s = s.replace(NEGRITA_RE, (_m, a: string, t: string) => `${a}<strong>${t}</strong>`);
    s = s.replace(CURSIVA_RE, (_m, a: string, t: string) => `${a}<em>${t}</em>`);
    s = s.replace(TACHADO_RE, (_m, a: string, t: string) => `${a}<s>${t}</s>`);
  }
  // los guardados pueden anidarse (un enlace dentro de negrita): se restauran hasta que no quede ninguno
  for (let i = 0; i < 4 && s.includes('\u0000'); i++) s = s.replace(/\u0000(\d+)\u0000/g, (_m, n: string) => guardados[Number(n)] ?? '');
  return s;
}

const EMOJI_RE = /^(?:\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*)*|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]️?⃣)$/u;

/** Grafemas de un texto (con Intl.Segmenter si existe). */
function grafemas(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return [...new Seg(undefined, { granularity: 'grapheme' }).segment(s)].map((x) => x.segment);
  return [...s];
}

/** Cantidad de emojis si el texto es SOLO emojis (1..3, se ve grande); 0 en otro caso. */
export function soloEmojis(texto: string): number {
  const t = texto.replace(/\s+/g, '');
  if (!t) return 0;
  const g = grafemas(t);
  if (g.length > 3) return 0;
  return g.every((x) => EMOJI_RE.test(x)) ? g.length : 0;
}

/** Fragmento de `texto` alrededor de la primera coincidencia de `q`, en HTML saneado con `<mark>`. */
export function fragmentoHtml(texto: string, q: string, radio = 48): string {
  const todas = normalizar(q).split(/\s+/).filter((p) => p.length > 1);
  // las palabras cortas («de», «del», «el») solo se resaltan si no hay otras
  const largas = todas.filter((p) => p.length > 3);
  const palabras = largas.length ? largas : todas;
  const base = normalizar(texto);
  let pos = -1;
  let largo = 0;
  for (const p of palabras) {
    const i = base.indexOf(p);
    if (i >= 0 && (pos < 0 || i < pos)) {
      pos = i;
      largo = p.length;
    }
  }
  if (pos < 0) return escaparHtml(texto.length > radio * 2 ? `${texto.slice(0, radio * 2)}…` : texto);
  const ini = Math.max(0, pos - radio);
  const fin = Math.min(texto.length, pos + largo + radio);
  return `${ini > 0 ? '…' : ''}${escaparHtml(texto.slice(ini, pos))}<mark>${escaparHtml(texto.slice(pos, pos + largo))}</mark>${escaparHtml(texto.slice(pos + largo, fin))}${fin < texto.length ? '…' : ''}`;
}

/* ── fechas ──────────────────────────────────────────────────── */

const p2 = (n: number) => String(n).padStart(2, '0');

/** `YYYY-MM-DD` local de un ISO (inválido → `sin-fecha`). */
export function claveDia(iso: string | null | undefined): string {
  if (!iso) return 'sin-fecha';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'sin-fecha';
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

/** «Hoy», «Ayer» o la fecha larga. */
export function rotuloDia(clave: string, t: Pick<Textos, 'hoy' | 'ayer' | 'sinFecha'>, hoy: Date = new Date()): string {
  if (clave === 'sin-fecha') return t.sinFecha;
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  if (clave === claveDia(hoy.toISOString())) return t.hoy;
  if (clave === claveDia(ayer.toISOString())) return t.ayer;
  const [y, m, d] = clave.split('-').map(Number);
  const fecha = new Date(y!, (m ?? 1) - 1, d ?? 1);
  const mismoAnio = fecha.getFullYear() === hoy.getFullYear();
  const dias = (hoy.getTime() - fecha.getTime()) / 86400000;
  if (dias < 7 && dias > 0) return fecha.toLocaleDateString(undefined, { weekday: 'long' });
  return fecha.toLocaleDateString(undefined, mismoAnio ? { day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long', year: 'numeric' });
}

/** `10:42` (hora local). */
export function horaCorta(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}

/** Hora de la lista: hoy → `10:42`; ayer → «Ayer»; esta semana → día; si no, fecha corta. */
export function horaLista(iso: string | null | undefined, t: Pick<Textos, 'hoy' | 'ayer' | 'sinFecha'>, hoy: Date = new Date()): string {
  if (!iso) return '';
  const k = claveDia(iso);
  if (k === claveDia(hoy.toISOString())) return horaCorta(iso);
  const r = rotuloDia(k, t, hoy);
  if (r === t.ayer) return r;
  const d = new Date(iso);
  const dias = (hoy.getTime() - d.getTime()) / 86400000;
  if (dias < 7) return d.toLocaleDateString(undefined, { weekday: 'short' });
  return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/** «en línea» o «últ. vez hoy a las 10:42». */
export function textoPresencia(u: Pick<UsuarioChat, 'enLinea' | 'ultimaVez'> | undefined, t: Textos, hoy: Date = new Date()): string {
  if (!u) return '';
  if (u.enLinea) return t.enLinea;
  if (!u.ultimaVez) return '';
  const k = claveDia(u.ultimaVez);
  const r = rotuloDia(k, t, hoy);
  const h = horaCorta(u.ultimaVez);
  if (r === t.hoy) return `${t.ultVez} ${t.hoyALas} ${h}`;
  if (r === t.ayer) return `${t.ultVez} ${t.ayerALas} ${h}`;
  return `${t.ultVez} ${r} ${t.aLas} ${h}`;
}

/* ── agrupación ──────────────────────────────────────────────── */

export type ItemConversacion =
  | { clave: string; tipo: 'dia'; rotulo: string }
  | { clave: 'noleidos'; tipo: 'noleidos'; n: number }
  | { clave: string; tipo: 'mensaje'; mensaje: MensajeChat; primero: boolean; ultimo: boolean };

const agrupable = (tipo: TipoMensaje) => tipo !== 'sistema' && tipo !== 'llamada';

/** Orden cronológico estable (ts, luego id, luego clave). */
export function ordenCronologico(a: Pick<MensajeChat, 'ts' | 'id' | 'clave'>, b: Pick<MensajeChat, 'ts' | 'id' | 'clave'>): number {
  if (a.ts !== b.ts) return a.ts < b.ts ? -1 : 1;
  const ia = Number(a.id);
  const ib = Number(b.id);
  if (a.id && b.id && !Number.isNaN(ia) && !Number.isNaN(ib) && ia !== ib) return ia - ib;
  return a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0;
}

/**
 * Mensajes visibles → items de la conversación: separador por día, línea de no leídos antes de `primerNoLeido`
 * (con `n` = cuántos quedan desde ahí) y, para cada mensaje, si abre ráfaga (`primero`: lleva cola y nombre) o la
 * cierra (`ultimo`). Ráfaga = mismo autor, mismo día, menos de 5 minutos entre uno y otro y sin la línea en medio.
 */
export function agrupar(mensajes: MensajeChat[], opciones: { primerNoLeido?: string | null; t: Pick<Textos, 'hoy' | 'ayer' | 'sinFecha'>; hoy?: Date; yo?: string }): ItemConversacion[] {
  const visibles = mensajes.filter((m) => !m.oculto);
  const items: ItemConversacion[] = [];
  let dia = '';
  let previo: MensajeChat | null = null;
  const idxNoLeido = opciones.primerNoLeido ? visibles.findIndex((m) => m.clave === opciones.primerNoLeido || m.id === opciones.primerNoLeido) : -1;
  visibles.forEach((m, i) => {
    const k = claveDia(m.ts);
    let corte = false;
    if (k !== dia) {
      items.push({ clave: `dia:${k}`, tipo: 'dia', rotulo: rotuloDia(k, opciones.t, opciones.hoy) });
      dia = k;
      corte = true;
    }
    if (i === idxNoLeido) {
      // cuenta solo los ajenos desde la línea (lo que yo escriba después no es «no leído»)
      items.push({ clave: 'noleidos', tipo: 'noleidos', n: visibles.slice(i).filter((x) => x.autor !== opciones.yo && x.tipo !== 'sistema').length });
      corte = true;
    }
    const sigue = !corte && previo !== null && previo.autor === m.autor && agrupable(previo.tipo) && agrupable(m.tipo) &&
      new Date(m.ts).getTime() - new Date(previo.ts).getTime() < RAFAGA_MS;
    items.push({ clave: `m:${m.clave}`, tipo: 'mensaje', mensaje: m, primero: !sigue, ultimo: false });
    previo = m;
  });
  // cierra ráfaga el mensaje cuyo siguiente item no la continúa (otro autor, separador o fin)
  items.forEach((it, i) => {
    if (it.tipo !== 'mensaje') return;
    const sig = items[i + 1];
    it.ultimo = !sig || sig.tipo !== 'mensaje' || sig.primero;
  });
  return items;
}

/* ── marcas de lectura ───────────────────────────────────────── */

export type MarcaEnvio = 'pendiente' | 'fallido' | 'enviado' | 'entregado' | 'leido';

/** Los demás integrantes del chat (los que deben recibir y leer). */
export function destinatarios(chat: Pick<Chat, 'miembros' | 'lecturas'>, yo: string): string[] {
  const miembros = chat.miembros.map((m) => m.id);
  const base = miembros.length ? miembros : Object.keys(chat.lecturas);
  return base.filter((id) => id !== yo);
}

/**
 * Marca de un mensaje propio: reloj (pendiente), «no enviado», ✓ enviado, ✓✓ entregado a TODOS los demás, ✓✓ en color
 * leído por TODOS los demás. Ajenos y de sistema → `null`.
 */
export function marcaDe(m: MensajeChat, chat: Pick<Chat, 'miembros' | 'lecturas'>, yo: string): MarcaEnvio | null {
  if (m.autor !== yo || m.tipo === 'sistema' || m.tipo === 'llamada') return null;
  if (m.estado === 'fallido') return 'fallido';
  if (m.estado === 'pendiente') return 'pendiente';
  const otros = destinatarios(chat, yo);
  if (otros.length === 0) return 'enviado';
  const alcanza = (id: string, campo: 'leido' | 'entregado') => {
    const h = chat.lecturas[id]?.[campo]?.hasta;
    return !!h && h >= m.ts;
  };
  if (otros.every((id) => alcanza(id, 'leido'))) return 'leido';
  if (otros.every((id) => alcanza(id, 'entregado') || alcanza(id, 'leido'))) return 'entregado';
  return 'enviado';
}

/* ── envío ───────────────────────────────────────────────────── */

/** Texto listo para enviar (recortado) o `null` si está vacío o supera 4000 caracteres. */
export function validarTexto(texto: string): string | null {
  const t = texto.trim();
  if (!t || t.length > MAX_TEXTO) return null;
  return t;
}

/** Motivo de rechazo de un archivo antes de subirlo, o `null` si sirve. */
export function validarArchivo(a: { name?: string; size: number }, t: Pick<Textos, 'archivoGrande' | 'archivoBloqueado'>): string | null {
  if (a.size > maxMb * 1024 * 1024) return t.archivoGrande(maxMb);
  const ext = (a.name ?? '').toLowerCase().split('.').pop() ?? '';
  if (a.name?.includes('.') && EXTENSIONES_BLOQUEADAS.includes(ext)) return t.archivoBloqueado;
  return null;
}

/** Tipo de mensaje según el mime del adjunto. */
export function tipoDeMime(mime: string): 'imagen' | 'video' | 'audio' | 'archivo' {
  if (mime.startsWith('image/')) return 'imagen';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'archivo';
}

/** Solo los propios de texto y durante 15 minutos (W-CHAT-25). */
export const puedeEditar = (m: MensajeChat, yo: string, ahora = Date.now()): boolean =>
  m.autor === yo && m.tipo === 'texto' && !m.eliminado && m.estado === 'enviado' && ahora - new Date(m.ts).getTime() <= EDITAR_MS;

/** «Para todos» solo los propios y durante una hora (W-CHAT-26). */
export const puedeEliminarParaTodos = (m: MensajeChat, yo: string, ahora = Date.now()): boolean =>
  m.autor === yo && !m.eliminado && m.tipo !== 'sistema' && ahora - new Date(m.ts).getTime() <= ELIMINAR_TODOS_MS;

/** Texto sin las marcas del formato ligero (para vistas previas de una línea). */
export const sinFormato = (texto: string): string =>
  texto.replace(/```\n?([\s\S]*?)\n?```/g, '$1').replace(/`([^`\n]+)`/g, '$1').replace(/(^|[\s(])([*_~])(?=\S)([^*_~\n]*?\S)\2(?=$|[\s.,;:!?)])/g, '$1$3');

/** Una línea que resume un mensaje (lista de chats, citas, notificaciones). */
export function resumenMensaje(m: Pick<MensajeChat, 'tipo' | 'texto' | 'eliminado' | 'adjunto' | 'meta'>, t: Textos): string {
  if (m.eliminado) return t.eliminado;
  const texto = sinFormato(m.texto).replace(/\s+/g, ' ').trim();
  switch (m.tipo) {
    case 'imagen':
      return `📷 ${texto || t.foto}`;
    case 'video':
      return `🎬 ${texto || t.video}`;
    case 'audio':
      return `🎤 ${t.notaDeVoz}${m.adjunto?.duracion ? ` (${duracionTexto(m.adjunto.duracion)})` : ''}`;
    case 'archivo':
      return `📄 ${texto || m.adjunto?.nombre || t.documento}`;
    case 'llamada':
      return `📞 ${textoLlamada(m.meta, t)}`;
    default:
      return texto;
  }
}

/** «Llamada de voz · 3:12», «Videollamada perdida». */
export function textoLlamada(meta: Record<string, unknown>, t: Textos): string {
  const video = meta['medio'] === 'video';
  if (meta['perdida'] === true) return video ? t.videollamadaPerdida : t.llamadaVozPerdida;
  const dur = typeof meta['duracion'] === 'number' ? ` · ${duracionTexto(meta['duracion'])}` : '';
  return `${video ? t.videollamada : t.llamadaVoz}${dur}`;
}
