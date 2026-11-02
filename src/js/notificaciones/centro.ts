/**
 * centro.ts — el sistema de notificaciones, en un solo lugar y vivo durante toda la sesión de la pestaña (no depende de la
 * vista montada: navegar por la SPA no lo toca).
 *
 * Es dueño del `ChatBackend` de la sesión (uno por empresa, o el del demo) y por tanto del ÚNICO socket de la pestaña; `<av-chat>`
 * lo toma prestado: se suscribe al montar y se da de baja al salir. Aquí entra cada evento en tiempo real; salen el estado de
 * los contadores (`alCambio`, lo pintan `<av-campana>` y el menú) y los efectos: toast con acción, sonido opcional, notificación
 * del navegador, título con contador, puntos en el ícono de la pestaña.
 *
 *   - Al reconectar, el backend se pone al día (`inicio`) y se recargan los avisos: lo que faltó se resume en un solo toast.
 *   - Una llamada que entra fuera de Canales queda pendiente: `<av-chat>` la toma al montar y timbra.
 *   - Un solo sonido entre pestañas: lo hace la pestaña a la vista o, si ninguna lo está, la líder (Web Locks); la notificación
 *     del navegador lleva `tag`, así el navegador no la repite.
 */
import { avisar } from '../base/componente.js';
import type { ChatBackend } from '../chat/backend.js';
import { estadoInicial, nombreChat, reducir } from '../chat/estado.js';
import { resumenMensaje } from '../chat/formato.js';
import { textos } from '../chat/textos.js';
import type { Aviso, Conexion, EstadoChat, EventoChat, MensajeChat, SenalLlamada } from '../chat/tipos.js';
import { ir } from '../core/router.js';
import { chatDeAviso, type Destino, destinoDeAviso, type Entrada, entradasDe, mensajeAvisable, porVista, tituloCon, totalDe } from './avisos.js';

export type Preferencias = { sonido: boolean; navegador: boolean };
export type VistaCentro = { activo: boolean; entradas: Entrada[]; total: number; vistas: Record<string, number>; conexion: Conexion; preferencias: Preferencias };

type Fuente = { clave: string; be: ChatBackend; vistaChat: string; bajas: Array<() => void>; lista: boolean };

const CLAVE_PREFS = 'av-notificaciones:prefs';
const VIGENCIA_LLAMADA_MS = 45_000;
const COLOR_PUNTO = '#e5484d';

let fuente: Fuente | null = null;
let e: EstadoChat = estadoInicial();
let avisos: Aviso[] = [];
let abierto: string | null = null;
let conexion: Conexion = 'desconectado';
let llamada: { senal: SenalLlamada; hasta: number } | null = null;
let lider = false;
let chatMontado = false;
let preferencias: Preferencias = leerPreferencias();
const vistos = new Set<string>();
const oyentes = new Set<(v: VistaCentro) => void>();

function leerPreferencias(): Preferencias {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE_PREFS) ?? '{}') as Partial<Preferencias>;
    return { sonido: p.sonido ?? false, navegador: p.navegador ?? false };
  } catch {
    return { sonido: false, navegador: false };
  }
}

const visible = (): boolean => typeof document !== 'undefined' && document.visibilityState === 'visible';

/** Lo que pintan la campana y el menú. */
export function vistaCentro(): VistaCentro {
  const entradas = entradasDe(e, avisos, fuente?.vistaChat ?? 'canales');
  return { activo: !!fuente, entradas, total: totalDe(entradas), vistas: porVista(entradas), conexion, preferencias };
}

/** Escucha los cambios (recibe el estado actual al suscribirse). Devuelve la baja. */
export function alCambio(fn: (v: VistaCentro) => void): () => void {
  oyentes.add(fn);
  fn(vistaCentro());
  return () => oyentes.delete(fn);
}

let pendiente = 0;
function publicar(): void {
  if (pendiente) return;
  pendiente = setTimeout(() => {
    pendiente = 0;
    const v = vistaCentro();
    pintarPestana(v.total);
    for (const fn of oyentes) fn(v);
  }, 0) as unknown as number;
}

/* ── pestaña: título, ícono y distintivo de la app ── */

let observador: MutationObserver | null = null;
let totalPintado = 0;
let lienzoBase: HTMLImageElement | null = null;
let iconoOriginal: string | null = null;

/** El router reescribe el título al navegar: se vuelve a poner el contador. */
function vigilarTitulo(): void {
  const t = document.querySelector('title');
  if (observador || !t) return;
  observador = new MutationObserver(() => {
    const deseado = tituloCon(totalPintado, document.title);
    if (document.title !== deseado) document.title = deseado;
  });
  observador.observe(t, { childList: true, characterData: true, subtree: true });
}

function pintarPuntoIcono(n: number): void {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) return;
  iconoOriginal ??= link.getAttribute('href');
  if (n <= 0) {
    if (iconoOriginal) link.setAttribute('href', iconoOriginal);
    return;
  }
  const dibujar = (img: HTMLImageElement) => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    if (!g) return;
    g.drawImage(img, 0, 0, 64, 64);
    g.fillStyle = COLOR_PUNTO;
    g.beginPath();
    g.arc(44, 20, 20, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#fff';
    g.font = '700 28px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(n > 9 ? '9+' : String(n), 44, 22);
    try {
      link.setAttribute('href', c.toDataURL('image/png'));
    } catch {
      /* lienzo contaminado: queda el contador del título */
    }
  };
  if (lienzoBase) return dibujar(lienzoBase);
  const img = new Image();
  img.onload = () => {
    lienzoBase = img;
    dibujar(img);
  };
  img.src = new URL('assets/img/tabicon_256x256.png', document.baseURI).href;
}

function pintarPestana(n: number): void {
  if (typeof document === 'undefined') return;
  vigilarTitulo();
  if (n !== totalPintado) {
    totalPintado = n;
    document.title = tituloCon(n, document.title);
    pintarPuntoIcono(n);
    const nav = navigator as Navigator & { setAppBadge?(n: number): Promise<void>; clearAppBadge?(): Promise<void> };
    void (n > 0 ? nav.setAppBadge?.(n) : nav.clearAppBadge?.())?.catch(() => undefined);
  }
}

/* ── efectos ── */

let audio: AudioContext | null = null;

function sonar(): void {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume().catch(() => undefined);
    const t = audio.currentTime;
    for (const [i, hz] of [880, 1175].entries()) {
      const osc = audio.createOscillator();
      const gan = audio.createGain();
      osc.frequency.value = hz;
      gan.gain.setValueAtTime(0.0001, t + i * 0.13);
      gan.gain.exponentialRampToValueAtTime(0.12, t + i * 0.13 + 0.02);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.13 + 0.16);
      osc.connect(gan).connect(audio.destination);
      osc.start(t + i * 0.13);
      osc.stop(t + i * 0.13 + 0.18);
    }
  } catch {
    /* sin audio */
  }
}

/** Toast con botón «Abrir» que lleva al destino. */
async function toast(titulo: string, cuerpo: string, destino: Destino | null, color: 'brand' | 'success', duracion: number): Promise<void> {
  const item = await avisar(titulo, color, { caption: cuerpo, duration: duracion, icon: 'mdi:bell-ring-outline' });
  if (!item || !destino) return;
  const boton = document.createElement('iswc-button');
  boton.setAttribute('slot', 'caption');
  boton.setAttribute('variant', 'soft compact');
  boton.setAttribute('color', 'brand');
  boton.textContent = 'Abrir';
  boton.addEventListener('iswc-click', () => {
    (item as HTMLElement & { hide?(): void }).hide?.();
    navegar(destino);
  });
  item.append(boton);
}

function navegar(destino: Destino): void {
  ir(destino.vista, destino.id);
}

/** Avisa algo nuevo, una sola vez por `clave`. */
function avisarAlgo(o: { clave: string; titulo: string; cuerpo: string; destino: Destino | null; silencioso?: boolean; color?: 'brand' | 'success'; duracion?: number }): void {
  if (vistos.has(o.clave)) return;
  vistos.add(o.clave);
  const aLaVista = visible();
  if (aLaVista) void toast(o.titulo, o.cuerpo, o.destino, o.color ?? 'brand', o.duracion ?? 6000);
  else if (preferencias.navegador && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      const n = new Notification(o.titulo, { body: o.cuerpo, tag: o.clave, icon: new URL('assets/img/tabicon_256x256.png', document.baseURI).href });
      n.onclick = () => {
        focus();
        n.close();
        if (o.destino) navegar(o.destino);
      };
    } catch {
      /* el navegador exige service worker para notificar: queda el centro */
    }
  }
  if (preferencias.sonido && !o.silencioso && (aLaVista || lider)) sonar();
}

function menciona(m: MensajeChat, yo: string): boolean {
  const lista = m.meta['menciones'];
  return Array.isArray(lista) && lista.includes(yo);
}

function alMensaje(m: MensajeChat): void {
  const f = fuente;
  if (!f) return;
  const c = e.chats[m.chat];
  const chatVisible = abierto === m.chat;
  if (!mensajeAvisable({ autor: m.autor, yo: e.yo, tipo: m.tipo, silenciado: !!c?.silenciado, abierto: chatVisible, visible: visible(), mencionaAlYo: menciona(m, e.yo) })) return;
  const autor = e.usuarios[m.autor]?.nombre ?? m.autor;
  const nombre = c ? nombreChat(c, e.usuarios, e.yo) : '';
  avisarAlgo({ clave: `m:${m.clave}`, titulo: c && c.tipo !== 'directo' ? `${autor} · ${nombre}` : autor, cuerpo: resumenMensaje(m, textos()), destino: { vista: f.vistaChat, id: m.chat } });
}

function alEvento(f: Fuente, ev: EventoChat): void {
  const previos = Object.values(e.chats).reduce((n, c) => n + (c.silenciado || c.archivado ? 0 : c.noLeidos), 0);
  const nuevo = ev.tipo === 'mensaje' && !(e.mensajes[ev.mensaje.chat] ?? []).some((x) => x.clave === ev.mensaje.clave);
  e = reducir(e, ev);
  if (ev.tipo === 'conexion') {
    const volvio = ev.estado === 'conectado' && conexion !== 'conectado';
    conexion = ev.estado;
    if (volvio && f.lista) void cargarAvisos(f);
  }
  if (nuevo && ev.tipo === 'mensaje' && !f.be.reproduciendo?.()) alMensaje(ev.mensaje);
  if (ev.tipo === 'inicio' && f.lista) {
    const faltaron = Object.values(e.chats).reduce((n, c) => n + (c.silenciado || c.archivado ? 0 : c.noLeidos), 0) - previos;
    if (faltaron > 0) avisarAlgo({ clave: `resumen:${Date.now()}`, titulo: faltaron === 1 ? '1 mensaje nuevo' : `${faltaron} mensajes nuevos`, cuerpo: 'Llegaron mientras no estabas conectado.', destino: { vista: f.vistaChat, id: null } });
  }
  publicar();
}

function alSenal(f: Fuente, s: SenalLlamada): void {
  if (s.tipo === 'llamada.colgar' || s.tipo === 'llamada.rechazar') {
    if (llamada?.senal.llamada === s.llamada) llamada = null;
    return;
  }
  if (s.tipo !== 'llamada.invitar' || s.de === e.yo) return;
  // con el chat montado, él mismo timbra
  if (chatMontado && visible()) return;
  if (!chatMontado) llamada = { senal: s, hasta: Date.now() + VIGENCIA_LLAMADA_MS };
  const quien = e.usuarios[s.de]?.nombre ?? s.de;
  avisarAlgo({ clave: `ll:${s.llamada}`, titulo: `${quien} te está llamando`, cuerpo: s.medio === 'video' ? 'Videollamada entrante' : 'Llamada de voz entrante', destino: { vista: f.vistaChat, id: s.chat }, duracion: 20000 });
}

function alAviso(f: Fuente, a: Aviso): void {
  if (avisos.some((x) => x.id === a.id)) return;
  avisos = [a, ...avisos];
  const chat = chatDeAviso(a);
  if (!(chat && abierto === chat && visible())) avisarAlgo({ clave: `a:${a.id}`, titulo: a.titulo, cuerpo: a.cuerpo, destino: destinoDeAviso(a, f.vistaChat) });
  publicar();
}

/** Recarga los avisos del API: lo que llegó sin conexión entra aquí; se resume en un toast. */
async function cargarAvisos(f: Fuente): Promise<void> {
  try {
    const lista = await f.be.avisos?.listar();
    if (!lista || fuente !== f) return;
    const conocidos = new Set(avisos.map((a) => a.id));
    const nuevos = f.lista ? lista.filter((a) => !a.leida && !conocidos.has(a.id)) : [];
    avisos = lista;
    if (nuevos.length === 1) {
      const a = nuevos[0]!;
      avisarAlgo({ clave: `a:${a.id}`, titulo: a.titulo, cuerpo: a.cuerpo, destino: destinoDeAviso(a, f.vistaChat) });
    } else if (nuevos.length > 1) avisarAlgo({ clave: `resumen-a:${Date.now()}`, titulo: `${nuevos.length} avisos nuevos`, cuerpo: 'Llegaron mientras no estabas conectado.', destino: null });
    publicar();
  } catch {
    /* se reintenta al reconectar */
  }
}

async function iniciar(f: Fuente): Promise<void> {
  try {
    const d = await f.be.iniciar();
    if (fuente !== f) return;
    e = reducir(e, { tipo: 'inicio', yo: f.be.yo, usuarios: d.usuarios, chats: d.chats });
    if (abierto) e = reducir(e, { tipo: 'activo', chat: abierto });
  } catch (err) {
    console.warn('[notificaciones]', err instanceof Error ? err.message : String(err));
  }
  await cargarAvisos(f);
  if (fuente === f) f.lista = true;
  publicar();
}

/** Corta la fuente actual (cierre de sesión, cambio de empresa o de persona). */
export function detener(): void {
  const f = fuente;
  fuente = null;
  if (f) {
    for (const baja of f.bajas) baja();
    f.be.cerrar();
  }
  e = estadoInicial();
  avisos = [];
  abierto = null;
  llamada = null;
  conexion = 'desconectado';
  publicar();
}

/**
 * El backend de la sesión: si ya existe con esa `clave` lo devuelve (por eso sobrevive a navegar); si no, cierra el anterior y
 * crea este. `vistaChat`: la vista que abre sus chats.
 */
export function fuenteDe(clave: string, vistaChat: string, crear: () => ChatBackend): ChatBackend {
  if (fuente?.clave === clave) return fuente.be;
  detener();
  const be = crear();
  const f: Fuente = { clave, be, vistaChat, bajas: [], lista: false };
  fuente = f;
  e = estadoInicial(be.yo);
  conexion = 'conectando';
  f.bajas.push(be.suscribir((ev) => alEvento(f, ev)));
  f.bajas.push(be.alSenal((s) => alSenal(f, s)));
  if (be.avisos) {
    f.bajas.push(be.avisos.alAviso((a) => alAviso(f, a)));
    f.bajas.push(be.avisos.alLeidas((ids) => {
      avisos = avisos.map((a) => (!ids || ids.includes(a.id) ? { ...a, leida: true } : a));
      publicar();
    }));
  }
  void iniciar(f);
  return be;
}

/** Clave de la fuente vigente. */
export const claveFuente = (): string | null => fuente?.clave ?? null;

/** El chat que la persona tiene abierto (no se le avisa de lo que está mirando). */
export function fijarAbierto(chat: string | null): void {
  abierto = chat;
  e = reducir(e, { tipo: 'activo', chat });
  publicar();
}

/** `<av-chat>` montado: las llamadas las timbra él. */
export function fijarMontado(si: boolean): void {
  chatMontado = si;
}

/** Llamada entrante aún vigente (la toma `<av-chat>` al montar). */
export function llamadaPendiente(): SenalLlamada | null {
  if (!llamada || llamada.hasta < Date.now()) {
    llamada = null;
    return null;
  }
  const s = llamada.senal;
  llamada = null;
  return s;
}

/** Marca leída una entrada (un chat con no leídos se marca en el chat). */
export async function marcarLeida(x: Entrada): Promise<void> {
  const f = fuente;
  if (!f) return;
  if (x.id.startsWith('chat:')) {
    await f.be.leido(x.chat!, x.ts).catch(() => undefined);
    return;
  }
  avisos = avisos.map((a) => (a.id === x.id ? { ...a, leida: true } : a));
  publicar();
  await f.be.avisos?.leer([x.id]).catch(() => undefined);
}

/** Marca todo como leído. */
export async function marcarTodas(): Promise<void> {
  const f = fuente;
  if (!f) return;
  const chats = vistaCentro().entradas.filter((x) => x.id.startsWith('chat:'));
  avisos = avisos.map((a) => ({ ...a, leida: true }));
  publicar();
  await Promise.allSettled([f.be.avisos?.leer(null), ...chats.map((x) => f.be.leido(x.chat!, x.ts))]);
}

/** Abre una entrada: la marca y va a su destino. */
export function abrir(x: Entrada): void {
  void marcarLeida(x);
  if (x.destino) navegar(x.destino);
}

/** Cambia una preferencia (se recuerda en este navegador). */
export function fijarPreferencia(p: Partial<Preferencias>): void {
  preferencias = { ...preferencias, ...p };
  try {
    localStorage.setItem(CLAVE_PREFS, JSON.stringify(preferencias));
  } catch {
    /* sin almacenamiento: dura la sesión */
  }
  publicar();
}

/** Pide permiso para notificar por el navegador y guarda el resultado. */
export async function pedirPermisoNavegador(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  const r = await Notification.requestPermission();
  fijarPreferencia({ navegador: r === 'granted' });
  return r;
}

if (typeof navigator !== 'undefined' && navigator.locks) {
  void navigator.locks.request('av-notificaciones-lider', () => {
    lider = true;
    return new Promise<void>(() => undefined);
  }).catch(() => undefined);
}
