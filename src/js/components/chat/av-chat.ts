/**
 * <av-chat> — shell del chat (HS-CHAT-01, HW-CHAT-01/02): `iswc-split-panel` con lista | conversación | panel lateral
 * (info o búsqueda), diálogos (nuevo chat, grupo, reenviar, reacciones), visor y llamada. Es el ÚNICO que habla con el
 * `ChatBackend` (propiedad `backend`) y el único que guarda estado: el reductor de `src/js/chat/estado.ts`, al que
 * entran por igual las respuestas del backend, los eventos de tiempo real y las acciones optimistas.
 *
 * Cada cambio de estado se agrupa en un cuadro (`requestAnimationFrame`) y se reparte como `props` a los hijos; los
 * hijos que no cambian no se tocan y la lista y la conversación reconcilian por clave (sin parpadeo).
 *
 * Props: `titulo`, `chat` (abrir este chat), `clave` (prefijo de lo que se recuerda: tamaños de paneles).
 * Emite `av-chat-abierto { icanal }` (para que el host refleje la ruta) y `av-chat-error { mensaje }`.
 */
import { adoptarPropsTardias, adoptCss, avisar, define, emitir, html, precargarCss } from '../../base/componente.js';
import { revisarProps } from '../../base/props-registro.js';
import type { AvChatProps, ItemChat, PersonaVista } from '../../consts/schemas/chat.schemas.js';
import type { AccionMiembros, ChatBackend, DatosGrupo } from '../../chat/backend.js';
import { crearCola, type Cola } from '../../chat/cola.js';
import {
  escribiendoEn, esAdmin, estadoInicial, type FiltroChats, filtrarChats, infoLectura, mensajePorRef, nombreChat, otroDe, primerNoLeido, reducir, ultimoDe,
} from '../../chat/estado.js';
import {
  colorDe, enlacesDe, fragmentoHtml, horaLista, iniciales, marcaDe, MAX_LLAMADA, resumenMensaje, textoPresencia, tipoDeMime, validarArchivo,
} from '../../chat/formato.js';
import { crearTono, type EstadoLlamada, GestorLlamadas } from '../../chat/llamadas.js';
import { textos } from '../../chat/textos.js';
import { type Adjunto, type Borrador, type Chat, type EstadoChat, type EventoChat, type InfoLectura, type MensajeChat, type ModoBusqueda, nuevaClave, type Preferencias, type ResultadoBusqueda } from '../../chat/tipos.js';
import './av-chat-lista.js';
import './av-chat-cabecera.js';
import './av-chat-mensajes.js';
import './av-chat-compositor.js';
import './av-chat-info.js';
import './av-chat-busqueda.js';
import './av-chat-nuevo.js';
import './av-chat-grupo-form.js';
import './av-chat-reenviar.js';
import './av-chat-visor.js';
import './av-chat-llamada.js';
import './av-chat-emojis.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Dialogo = HTMLElement & { open: boolean };
type Compositor = ConProps & { agregar?: (f: File[]) => void; enfocar?: () => void };
type Llamada = ConProps & { flujos?: Map<string, MediaStream>; local?: MediaStream | null; pantallaLocal?: MediaStream | null };

type Ui = {
  filtro: FiltroChats;
  q: string;
  archivados: boolean;
  panel: 'info' | 'busqueda' | null;
  infoMensaje: string | null;
  infoFilas: InfoLectura[];
  dialogo: 'nuevo' | 'grupo' | 'reenviar' | 'reaccion' | null;
  grupoModo: 'crear' | 'editar' | 'agregar';
  reenviarRef: string | null;
  reaccionRef: string | null;
  respuesta: string | null;
  edicion: string | null;
  visor: { refs: string[]; indice: number } | null;
  noLeido: { chat: string; clave: string | null } | null;
  resultados: ResultadoBusqueda[];
  buscando: boolean;
  buscado: string;
  cargandoAnteriores: boolean;
  resaltar: string | null;
  estrecho: boolean;
  cargando: boolean;
  guardando: boolean;
};

const ANCHO_ESTRECHO_EM = 48;

precargarCss(import.meta.url, 'av-chat');

class AvChat extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' });
  #props: AvChatProps = { titulo: '', chat: null, clave: 'av-chat', demo: '' };
  #backend: ChatBackend | null = null;
  #bajas: Array<() => void> = [];
  #e: EstadoChat = estadoInicial();
  #cola: Cola | null = null;
  #llamadas: GestorLlamadas | null = null;
  #llamada: EstadoLlamada | null = null;
  #revLlamada = 0;
  #tono = crearTono();
  #cuadro = 0;
  #montado = false;
  #iniciado = false;
  #demoPropio = false;
  #ro: ResizeObserver | null = null;
  #subidas = new Map<string, AbortController>();
  #archivos = new Map<string, { archivo: File; nota: { duracion: number; onda: number[] } | null }>();
  #relojEscribiendo: ReturnType<typeof setInterval> | null = null;
  #resaltado: ReturnType<typeof setTimeout> | null = null;
  /** Envíos en orden por chat: lo que se escribe después sale después. */
  #cadenas = new Map<string, Promise<void>>();
  #ui: Ui = {
    filtro: 'todos', q: '', archivados: false, panel: null, infoMensaje: null, infoFilas: [], dialogo: null, grupoModo: 'crear', reenviarRef: null, reaccionRef: null,
    respuesta: null, edicion: null, visor: null, noLeido: null, resultados: [], buscando: false, buscado: '', cargandoAnteriores: false, resaltar: null, estrecho: false,
    cargando: true, guardando: false,
  };
  #visible = () => {
    if (document.visibilityState === 'visible' && this.#e.activo) void this.#marcarLeido(this.#e.activo);
  };

  get props(): AvChatProps {
    return this.#props;
  }

  set props(v: Partial<AvChatProps> | null | undefined) {
    revisarProps('av-chat', v);
    const previo = this.#props;
    this.#props = { ...previo, ...(v ?? {}) };
    if (this.#props.chat && this.#props.chat !== previo.chat && this.#iniciado && this.#props.chat !== this.#e.activo) void this.#abrir(this.#props.chat);
    if (this.#props.demo && this.#props.demo !== previo.demo && this.isConnected) this.#usarDemo();
    this.#programar();
  }

  get backend(): ChatBackend | null {
    return this.#backend;
  }

  set backend(b: ChatBackend | null) {
    if (b === this.#backend) return;
    this.#demoPropio = false;
    this.#desconectar();
    this.#backend = b;
    if (b && this.isConnected) void this.#iniciar();
  }

  /** Vuelve a pedir chats y personas (p. ej. tras crear un canal fuera del chat) y, si se pide, abre uno. */
  async recargar(abrir: string | null = null): Promise<void> {
    const b = this.#backend;
    if (!b) return;
    const d = await b.iniciar();
    this.#aplicar({ tipo: 'inicio', yo: b.yo, usuarios: d.usuarios, chats: d.chats });
    if (abrir) await this.#abrir(abrir);
  }

  /** Abre un diálogo desde fuera (atajos del host): `nuevo` (buscador de personas) o `grupo` (nuevo grupo). */
  abrirPanel(panel: 'nuevo' | 'grupo' | 'busqueda'): void {
    if (panel === 'busqueda') this.#ui.panel = 'busqueda';
    else {
      this.#ui.dialogo = panel;
      if (panel === 'grupo') this.#ui.grupoModo = 'crear';
    }
    this.#programar();
  }

  /** Estado actual (lectura; para pruebas y depuración). */
  get estado(): EstadoChat {
    return this.#e;
  }

  connectedCallback(): void {
    adoptarPropsTardias(this as unknown as HTMLElement & { props?: unknown });
    if (Object.prototype.hasOwnProperty.call(this, 'backend')) {
      const b = (this as unknown as { backend: ChatBackend }).backend;
      delete (this as unknown as { backend?: unknown }).backend;
      this.backend = b;
    }
    if (!this.#montado) this.#montar();
    this.#ro = new ResizeObserver(() => this.#medir());
    this.#ro.observe(this);
    document.addEventListener('visibilitychange', this.#visible);
    if (this.#backend && !this.#iniciado) void this.#iniciar();
    else if (!this.#backend && this.#props.demo) this.#usarDemo();
  }

  /** Sin backend asignado y con `demo`: backend de memoria hablando como esa persona (galería, demos). */
  #usarDemo(): void {
    if (this.#backend && !this.#demoPropio) return;
    void import('../../chat/backend-demo.js').then(({ crearBackendDemo }) => {
      if (this.#backend && !this.#demoPropio) return;
      this.#backend?.cerrar();
      this.#demoPropio = true;
      this.backend = crearBackendDemo({ yo: this.#props.demo });
      this.#demoPropio = true;
    });
  }

  disconnectedCallback(): void {
    this.#ro?.disconnect();
    document.removeEventListener('visibilitychange', this.#visible);
    this.#llamadas?.destruir();
    this.#tono.detener();
  }

  /* ── conexión con el backend ── */

  #desconectar(): void {
    for (const baja of this.#bajas.splice(0)) baja();
    this.#llamadas?.destruir();
    this.#llamadas = null;
    this.#llamada = null;
    this.#iniciado = false;
    this.#e = estadoInicial();
    this.#ui.noLeido = null;
    this.#ui.cargando = true;
  }

  async #iniciar(): Promise<void> {
    const b = this.#backend;
    if (!b || this.#iniciado) return;
    this.#iniciado = true;
    const t = textos();
    this.#e = estadoInicial(b.yo);
    this.#cola = crearCola(b.yo);
    this.#bajas.push(b.suscribir((ev) => this.#recibir(ev)));
    this.#llamadas = new GestorLlamadas({
      yo: b.yo, front: b.front, enviar: (s) => b.senal(s), iceServers: () => b.iceServers(), simular: true, textos: t,
      alCambio: (e) => this.#alCambioLlamada(e), registrar: (r) => void b.registrarLlamada(r).catch(() => undefined),
      ...(b.iniciarLlamada ? { iniciar: (chat: string, medio: 'voz' | 'video') => b.iniciarLlamada!(chat, medio) } : {}),
    });
    this.#bajas.push(b.alSenal((s) => void this.#llamadas?.recibir(s)));
    try {
      const d = await b.iniciar();
      if (this.#backend !== b) return;
      this.#aplicar({ tipo: 'inicio', yo: b.yo, usuarios: d.usuarios, chats: d.chats });
      if (this.#e.conexion === 'conectando') this.#aplicar({ tipo: 'conexion', estado: 'conectado' });
      this.#ui.cargando = false;
      // lo que llegó mientras no estaba: entregado (✓✓ gris en el otro lado)
      for (const c of d.chats) if (c.noLeidos > 0 && c.ultimo) void b.entregado(c.id, c.ultimo.ts).catch(() => undefined);
      void this.#reponerCola();
      const pedido = this.#props.chat;
      if (pedido && this.#e.chats[pedido]) void this.#abrir(pedido);
    } catch (err) {
      this.#ui.cargando = false;
      this.#aplicar({ tipo: 'conexion', estado: 'desconectado' });
      emitir(this, 'av-chat-error', { mensaje: err instanceof Error ? err.message : String(err) });
    }
    this.#programar();
  }

  /** Evento de tiempo real: al estado, y efectos (entregado, leído). */
  #recibir(ev: EventoChat): void {
    const b = this.#backend;
    if (ev.tipo === 'mensaje' && b) {
      const m = ev.mensaje;
      const ya = (this.#e.mensajes[m.chat] ?? []).some((x) => x.clave === m.clave || (!!m.id && x.id === m.id));
      this.#aplicar(ev);
      if (!ya && m.autor !== b.yo && m.tipo !== 'sistema') {
        void b.entregado(m.chat, m.ts).catch(() => undefined);
        if (m.chat === this.#e.activo) void this.#marcarLeido(m.chat);
      }
      return;
    }
    this.#aplicar(ev);
  }

  #aplicar(ev: EventoChat): void {
    this.#e = reducir(this.#e, ev);
    if (ev.tipo === 'escribiendo' && ev.modo && !this.#relojEscribiendo) {
      this.#relojEscribiendo = setInterval(() => {
        const hay = Object.values(this.#e.escribiendo).some((x) => Object.values(x).some((v) => v.hasta > Date.now()));
        this.#programar();
        if (!hay && this.#relojEscribiendo) {
          clearInterval(this.#relojEscribiendo);
          this.#relojEscribiendo = null;
        }
      }, 1000);
    }
    this.#programar();
  }

  /** Reintenta lo que quedó en la cola local (W-CHAT-18). */
  async #reponerCola(): Promise<void> {
    const cola = this.#cola;
    const b = this.#backend;
    if (!cola || !b) return;
    for (const p of cola.leer()) {
      if (!this.#e.chats[p.chat]) continue;
      const m: MensajeChat = {
        clave: p.clave, id: null, chat: p.chat, autor: b.yo, tipo: p.tipo, texto: p.texto, ts: p.ts, editado: null, eliminado: false, reenviado: p.reenviado,
        respuestaA: p.respuestaA, adjunto: p.adjunto, reacciones: [], estado: 'pendiente', progreso: null, destacado: false, oculto: false, meta: p.meta,
      };
      this.#aplicar({ tipo: 'mensaje', mensaje: m });
      this.#encolar(p);
    }
  }

  /* ── abrir chats ── */

  async #abrir(chat: string, ref: string | null = null): Promise<void> {
    const b = this.#backend;
    if (!b || !this.#e.chats[chat]) return;
    const cambia = this.#e.activo !== chat;
    if (cambia) {
      this.#ui.respuesta = null;
      this.#ui.edicion = null;
      this.#ui.infoMensaje = null;
      if (this.#ui.panel === 'info') this.#ui.panel = this.#ui.estrecho ? null : 'info';
      this.#aplicar({ tipo: 'activo', chat });
      emitir(this, 'av-chat-abierto', { icanal: chat });
    }
    if (!(this.#e.mensajes[chat]?.length)) {
      try {
        const h = await b.historial(chat, null, 40);
        this.#aplicar({ tipo: 'historial', chat, mensajes: h.mensajes, hayMas: h.hayMas });
      } catch (err) {
        avisar(err instanceof Error ? err.message : String(err), 'danger');
      }
    }
    if (cambia || !this.#ui.noLeido || this.#ui.noLeido.chat !== chat) this.#ui.noLeido = { chat, clave: primerNoLeido(this.#e, chat) };
    void this.#marcarLeido(chat);
    if (ref) await this.#irA(chat, ref);
    this.#programar();
    requestAnimationFrame(() => (this.#root.querySelector('#compositor') as Compositor | null)?.enfocar?.());
  }

  /** Marca leído hasta el último mensaje (si la pestaña está a la vista). */
  async #marcarLeido(chat: string): Promise<void> {
    const b = this.#backend;
    const c = this.#e.chats[chat];
    if (!b || !c || document.visibilityState !== 'visible') return;
    const u = ultimoDe(this.#e, chat);
    const hasta = u?.ts ?? null;
    const mia = c.lecturas[b.yo]?.leido.hasta ?? null;
    if (!hasta || (mia && mia >= hasta && !c.marcadoNoLeido && c.noLeidos === 0)) return;
    this.#aplicar({ tipo: 'leido', chat, usuario: b.yo, hasta, cuando: new Date().toISOString() });
    try {
      await b.leido(chat, hasta);
    } catch {
      /* se reintenta al próximo mensaje */
    }
  }

  /** Lleva la conversación a un mensaje (cargando anteriores si hace falta) y lo resalta. */
  async #irA(chat: string, ref: string): Promise<void> {
    const b = this.#backend;
    if (!b) return;
    for (let i = 0; i < 25 && !mensajePorRef(this.#e, chat, ref) && this.#e.hayMas[chat]; i++) {
      const primero = this.#e.mensajes[chat]?.[0];
      const h = await b.historial(chat, primero?.ts ?? null, 60);
      this.#aplicar({ tipo: 'historial', chat, mensajes: h.mensajes, hayMas: h.hayMas });
    }
    const m = mensajePorRef(this.#e, chat, ref);
    if (!m) return;
    this.#ui.resaltar = m.clave;
    this.#programar();
    if (this.#resaltado) clearTimeout(this.#resaltado);
    this.#resaltado = setTimeout(() => {
      this.#ui.resaltar = null;
      this.#programar();
    }, 1800);
  }

  /* ── envío ── */

  #borradorBase(chat: string, extra: Partial<Borrador>): Borrador {
    return { clave: nuevaClave(), chat, tipo: 'texto', texto: '', respuestaA: null, adjunto: null, reenviado: false, meta: {}, ...extra };
  }

  /** Muestra el mensaje al instante (pendiente), lo guarda en la cola y lo manda. */
  #publicar(b: Borrador, archivo: File | null = null, nota: { duracion: number; onda: number[] } | null = null): void {
    const be = this.#backend;
    if (!be) return;
    const ts = new Date().toISOString();
    const previa: Adjunto | null = archivo
      ? { id: b.clave, nombre: archivo.name, mime: archivo.type || 'application/octet-stream', bytes: archivo.size, url: URL.createObjectURL(archivo), ancho: null, alto: null, duracion: nota?.duracion ?? null, onda: nota?.onda ?? [] }
      : b.adjunto;
    const m: MensajeChat = {
      clave: b.clave, id: null, chat: b.chat, autor: be.yo, tipo: b.tipo, texto: b.texto, ts, editado: null, eliminado: false, reenviado: b.reenviado, respuestaA: b.respuestaA,
      adjunto: previa, reacciones: [], estado: 'pendiente', progreso: archivo ? 0 : null, destacado: false, oculto: false, meta: b.meta,
    };
    this.#aplicar({ tipo: 'mensaje', mensaje: m });
    if (archivo) this.#archivos.set(b.clave, { archivo, nota });
    else this.#cola?.poner({ ...b, ts, autor: be.yo });
    this.#encolar({ ...b, ts });
  }

  #encolar(b: Borrador & { ts: string }): void {
    const previa = this.#cadenas.get(b.chat) ?? Promise.resolve();
    const sig = previa.then(() => this.#mandar(b));
    this.#cadenas.set(b.chat, sig);
    void sig.finally(() => {
      if (this.#cadenas.get(b.chat) === sig) this.#cadenas.delete(b.chat);
    });
  }

  async #mandar(b: Borrador & { ts: string }): Promise<void> {
    const be = this.#backend;
    if (!be) return;
    const pendiente = this.#archivos.get(b.clave);
    try {
      let borrador = b;
      if (pendiente && !b.adjunto) {
        const ctrl = new AbortController();
        this.#subidas.set(b.clave, ctrl);
        this.#aplicar({ tipo: 'mensaje.progreso', chat: b.chat, clave: b.clave, progreso: 0 });
        const adj = await be.subir(pendiente.archivo, { senal: ctrl.signal, progreso: (f) => this.#aplicar({ tipo: 'mensaje.progreso', chat: b.chat, clave: b.clave, progreso: f }) });
        this.#subidas.delete(b.clave);
        const adjunto: Adjunto = pendiente.nota ? { ...adj, duracion: pendiente.nota.duracion, onda: pendiente.nota.onda } : adj;
        borrador = { ...b, adjunto };
        this.#cola?.poner({ ...borrador, autor: be.yo });
        this.#archivos.delete(b.clave);
      }
      const r = await be.enviar(borrador);
      this.#cola?.quitar(b.clave);
      this.#aplicar({ tipo: 'mensaje.confirmado', chat: b.chat, clave: b.clave, id: r.id, ts: r.ts });
    } catch (err) {
      this.#subidas.delete(b.clave);
      if (err instanceof DOMException && err.name === 'AbortError') {
        this.#archivos.delete(b.clave);
        this.#cola?.quitar(b.clave);
        this.#aplicar({ tipo: 'mensaje.quitado', chat: b.chat, clave: b.clave });
        return;
      }
      this.#cola?.intento(b.clave);
      this.#aplicar({ tipo: 'mensaje.fallido', chat: b.chat, clave: b.clave });
    }
  }

  #enviar(d: { contenido: string; respuesta_a: string | null; archivos?: File[]; nota?: { duracion: number; onda: number[] } }): void {
    const chat = this.#e.activo;
    if (!chat) return;
    const citado = d.respuesta_a ? mensajePorRef(this.#e, chat, d.respuesta_a) : null;
    d = { ...d, respuesta_a: citado ? citado.id ?? citado.clave : d.respuesta_a };
    const t = textos();
    const archivos = (d.archivos ?? []).filter((f) => {
      const motivo = validarArchivo(f, t);
      if (motivo) avisar(`${f.name}: ${motivo}`, 'warning');
      return !motivo;
    });
    if (archivos.length) {
      archivos.forEach((f, i) => {
        const tipo = d.nota ? 'audio' : tipoDeMime(f.type);
        this.#publicar(this.#borradorBase(chat, { tipo, texto: i === 0 ? d.contenido : '', respuestaA: i === 0 ? d.respuesta_a : null }), f, d.nota ?? null);
      });
    } else if (d.contenido) {
      this.#publicar(this.#borradorBase(chat, { texto: d.contenido, respuestaA: d.respuesta_a }));
    }
    this.#ui.respuesta = null;
    this.#programar();
  }

  /* ── acciones sobre mensajes ── */

  async #accion(accion: string, ref: string | undefined, texto?: string): Promise<void> {
    const b = this.#backend;
    const chat = this.#e.activo;
    const t = textos();
    if (accion === 'cancelar') {
      this.#ui.respuesta = null;
      this.#ui.edicion = null;
      return this.#programar();
    }
    if (!b || !chat || !ref) return;
    const m = mensajePorRef(this.#e, chat, ref);
    try {
      switch (accion) {
        case 'responder':
          this.#ui.respuesta = m?.clave ?? ref;
          this.#ui.edicion = null;
          break;
        case 'copiar':
          if (m?.texto) {
            await navigator.clipboard?.writeText(m.texto);
            avisar(t.copiado, 'success');
          }
          break;
        case 'reenviar':
          this.#ui.dialogo = 'reenviar';
          this.#ui.reenviarRef = ref;
          break;
        case 'destacar':
          if (!m) break;
          this.#aplicar({ tipo: 'destacado', chat, ref: m.clave, valor: !m.destacado });
          await b.destacar(chat, m.id ?? m.clave, !m.destacado);
          break;
        case 'fijar':
        case 'desfijar': {
          const valor = accion === 'fijar' ? (m?.id ?? ref) : null;
          this.#aplicar({ tipo: 'fijado', chat, ref: accion === 'fijar' ? (m?.clave ?? ref) : null });
          await b.fijar(chat, valor);
          break;
        }
        case 'info':
          this.#ui.panel = 'info';
          this.#ui.infoMensaje = m?.clave ?? ref;
          this.#ui.infoFilas = m && this.#e.chats[chat] ? infoLectura(m, this.#e.chats[chat]!, b.yo) : [];
          this.#programar();
          this.#ui.infoFilas = await b.info(chat, m?.id ?? ref).catch(() => this.#ui.infoFilas);
          break;
        case 'editar':
          this.#ui.edicion = m?.clave ?? ref;
          this.#ui.respuesta = null;
          break;
        case 'editar-guardar':
          if (!m || !texto) break;
          this.#ui.edicion = null;
          this.#aplicar({ tipo: 'mensaje.editado', chat, ref: m.clave, texto, editado: new Date().toISOString() });
          await b.editar(chat, m.id ?? m.clave, texto);
          break;
        case 'eliminar-mi':
        case 'eliminar-todos': {
          if (!m) break;
          const todos = accion === 'eliminar-todos';
          if (m.estado !== 'enviado') {
            this.#subidas.get(m.clave)?.abort();
            this.#cola?.quitar(m.clave);
            this.#aplicar({ tipo: 'mensaje.quitado', chat, clave: m.clave });
            break;
          }
          this.#aplicar({ tipo: 'mensaje.eliminado', chat, ref: m.clave, paraTodos: todos });
          await b.eliminar(chat, m.id ?? m.clave, todos);
          break;
        }
        case 'reintentar':
          if (!m) break;
          this.#aplicar({ tipo: 'mensaje', mensaje: { ...m, estado: 'pendiente' } });
          this.#encolar({ clave: m.clave, chat, tipo: m.tipo, texto: m.texto, respuestaA: m.respuestaA, adjunto: this.#archivos.has(m.clave) ? null : m.adjunto, reenviado: m.reenviado, meta: m.meta, ts: m.ts });
          break;
        case 'cancelar-subida':
          this.#subidas.get(ref)?.abort();
          break;
        case 'ver': {
          const medios = this.#medios(chat);
          const i = medios.findIndex((x) => x.clave === (m?.clave ?? ref));
          if (i >= 0) this.#ui.visor = { refs: medios.map((x) => x.clave), indice: i };
          break;
        }
        case 'ir':
          await this.#irA(chat, ref);
          break;
        case 'reaccionar-mas':
          this.#ui.dialogo = 'reaccion';
          this.#ui.reaccionRef = m?.clave ?? ref;
          break;
      }
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    }
    this.#programar();
  }

  async #reaccionar(ref: string, emoji: string | null): Promise<void> {
    const b = this.#backend;
    const chat = this.#e.activo;
    if (!b || !chat) return;
    const m = mensajePorRef(this.#e, chat, ref);
    if (!m) return;
    this.#aplicar({ tipo: 'reaccion', chat, ref: m.clave, usuario: b.yo, emoji });
    try {
      await b.reaccionar(chat, m.id ?? m.clave, emoji);
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    }
  }

  /** Imágenes y videos del chat (para el visor y la info). */
  #medios(chat: string): MensajeChat[] {
    return (this.#e.mensajes[chat] ?? []).filter((m) => !m.oculto && !m.eliminado && !!m.adjunto?.url && ['imagen', 'video'].includes(tipoDeMime(m.adjunto.mime)));
  }

  /* ── grupos, directos, preferencias ── */

  async #directo(usuario: string): Promise<void> {
    const b = this.#backend;
    if (!b || usuario === b.yo) return;
    try {
      const c = await b.directo(usuario);
      this.#aplicar({ tipo: 'chat', chat: c });
      this.#ui.dialogo = null;
      this.#ui.panel = this.#ui.estrecho ? null : this.#ui.panel;
      await this.#abrir(c.id);
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    }
  }

  async #grupo(d: DatosGrupo): Promise<void> {
    const b = this.#backend;
    if (!b) return;
    this.#ui.guardando = true;
    this.#programar();
    try {
      const c = await b.grupo(d);
      this.#aplicar({ tipo: 'chat', chat: c });
      this.#ui.dialogo = null;
      await this.#abrir(c.id);
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    } finally {
      this.#ui.guardando = false;
      this.#programar();
    }
  }

  async #miembros(accion: AccionMiembros, usuarios: string[]): Promise<void> {
    const b = this.#backend;
    const chat = this.#e.activo;
    if (!b || !chat) return;
    try {
      await b.miembros(chat, accion, usuarios);
      if (accion === 'agregar') this.#ui.dialogo = null;
      if (accion === 'salir') this.#ui.panel = null;
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    }
    this.#programar();
  }

  async #preferencias(chat: string, p: Preferencias): Promise<void> {
    const b = this.#backend;
    if (!b) return;
    this.#aplicar({ tipo: 'chat', chat: { id: chat, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) } });
    try {
      await b.preferencias(chat, p);
      if (p.marcadoNoLeido === false) {
        const u = ultimoDe(this.#e, chat);
        if (u) await b.leido(chat, u.ts);
      }
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    }
  }

  async #reenviar(ref: string, chats: string[]): Promise<void> {
    const origen = this.#e.activo;
    const m = origen ? mensajePorRef(this.#e, origen, ref) : null;
    if (!m) return;
    for (const chat of chats) this.#publicar(this.#borradorBase(chat, { tipo: m.tipo, texto: m.texto, adjunto: m.adjunto, reenviado: true, meta: m.meta }));
    this.#ui.dialogo = null;
    avisar(`${textos().reenviado} ✓`, 'success');
    this.#programar();
  }

  async #buscar(q: string, modo: ModoBusqueda, chat: string | null): Promise<void> {
    const b = this.#backend;
    if (!b) return;
    if (!q.trim()) {
      this.#ui.resultados = [];
      this.#ui.buscado = '';
      return this.#programar();
    }
    this.#ui.buscando = true;
    this.#programar();
    try {
      this.#ui.resultados = await b.buscar(q, modo, chat);
      this.#ui.buscado = q;
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'danger');
    } finally {
      this.#ui.buscando = false;
      this.#programar();
    }
  }

  /* ── llamadas ── */

  async #llamar(medio: 'voz' | 'video'): Promise<void> {
    const chat = this.#e.activo ? this.#e.chats[this.#e.activo] : null;
    if (!chat || !this.#llamadas || !this.#backend) return;
    const miembros = chat.miembros.map((m) => m.id).filter((id) => id !== this.#backend!.yo);
    try {
      if (miembros.length + 1 > MAX_LLAMADA) throw new Error(textos().maxLlamada(MAX_LLAMADA));
      await this.#llamadas.llamar(chat.id, miembros, medio);
    } catch (err) {
      avisar(err instanceof Error ? err.message : String(err), 'warning');
    }
  }

  #alCambioLlamada(e: EstadoLlamada | null): void {
    const previa = this.#llamada?.fase ?? null;
    this.#llamada = e;
    this.#revLlamada++;
    const fase = e?.fase ?? null;
    if (fase !== previa) {
      const silenciado = e ? this.#e.chats[e.chat]?.silenciado : false;
      if (fase === 'entrante' && !silenciado) this.#tono.iniciar('entrante');
      else if (fase === 'saliente') this.#tono.iniciar('saliente');
      else this.#tono.detener();
    }
    this.#programar();
  }

  async #accionLlamada(a: string): Promise<void> {
    const g = this.#llamadas;
    if (!g) return;
    if (a === 'aceptar') await g.aceptar();
    else if (a === 'rechazar') g.rechazar();
    else if (a === 'colgar') g.colgar();
    else if (a === 'mic') g.alternarMic();
    else if (a === 'cam') await g.alternarCam();
    else if (a === 'pantalla') await g.alternarPantalla();
    else if (a === 'video') await g.aVideo();
  }

  /* ── diseño ── */

  #medir(): void {
    const em = parseFloat(getComputedStyle(this).fontSize) || 16;
    const estrecho = this.getBoundingClientRect().width < ANCHO_ESTRECHO_EM * em;
    if (estrecho === this.#ui.estrecho) return;
    this.#ui.estrecho = estrecho;
    this.#programar();
  }

  #montar(): void {
    this.#montado = true;
    const t = textos();
    const clave = this.#props.clave || 'av-chat';
    const on = <T>(nombre: string, fn: (d: T, e: CustomEvent<T>) => void) => this.#root.addEventListener(nombre, (e) => fn((e as CustomEvent<T>).detail, e as CustomEvent<T>));
    this.#root.append(html`
      <div class="chat" part="chat">
        <iswc-split-panel class="exterior" position="31" storage-key=${`${clave}:lista`}>
          <av-chat-lista slot="start" id="lista" class="lista"></av-chat-lista>
          <iswc-split-panel slot="end" class="interior" position="62" storage-key=${`${clave}:lateral`}>
            <div slot="start" class="centro" part="centro">
              <av-chat-cabecera id="cabecera"></av-chat-cabecera>
              <av-chat-mensajes id="mensajes" class="mensajes"></av-chat-mensajes>
              <av-chat-compositor id="compositor"></av-chat-compositor>
            </div>
            <div slot="end" class="lateral" part="lateral">
              <av-chat-info id="info"></av-chat-info>
              <av-chat-busqueda id="busqueda"></av-chat-busqueda>
            </div>
          </iswc-split-panel>
        </iswc-split-panel>
        <av-chat-nuevo id="nuevo"></av-chat-nuevo>
        <av-chat-grupo-form id="grupo"></av-chat-grupo-form>
        <av-chat-reenviar id="reenviar"></av-chat-reenviar>
        <av-chat-visor id="visor"></av-chat-visor>
        <av-chat-llamada id="llamada"></av-chat-llamada>
        <iswc-dialog id="reaccion" label=${t.masReacciones} backdrop-variant="basic"><av-chat-emojis id="emojis-reaccion"></av-chat-emojis></iswc-dialog>
      </div>
    `);
    adoptCss(this.#root, import.meta.url, 'av-chat');
    (this.#root.querySelector('#emojis-reaccion') as ConProps).props = { destino: 'reaccion' };

    on<{ icanal: string; imensaje?: string }>('av-chat-abrir', (d) => {
      if (this.#ui.estrecho && this.#ui.panel === 'busqueda') this.#ui.panel = null;
      void this.#abrir(d.icanal, d.imensaje ?? null);
    });
    on<{ filtro?: FiltroChats; q?: string; archivados?: boolean }>('av-chat-lista-filtro', (d) => {
      if (d.filtro) this.#ui.filtro = d.filtro;
      if (d.q !== undefined) this.#ui.q = d.q;
      if (d.archivados !== undefined) this.#ui.archivados = d.archivados;
      this.#programar();
    });
    on<{ panel: string }>('av-chat-panel', (d) => {
      if (d.panel === 'nuevo' || d.panel === 'reaccion') this.#ui.dialogo = d.panel;
      else if (d.panel === 'grupo') {
        this.#ui.dialogo = 'grupo';
        this.#ui.grupoModo = 'crear';
      } else if (d.panel === 'grupo-editar' || d.panel === 'grupo-agregar') {
        this.#ui.dialogo = 'grupo';
        this.#ui.grupoModo = d.panel === 'grupo-editar' ? 'editar' : 'agregar';
      } else if (d.panel === 'info' || d.panel === 'busqueda') {
        this.#ui.panel = this.#ui.panel === d.panel && !this.#ui.infoMensaje ? null : d.panel;
        this.#ui.infoMensaje = null;
      }
      this.#programar();
    });
    on<{ panel: string }>('av-chat-panel-cerrar', (d) => {
      if (d.panel === 'info' || d.panel === 'busqueda') {
        if (this.#ui.panel === d.panel) this.#ui.panel = null;
        this.#ui.infoMensaje = null;
      } else if (this.#ui.dialogo === d.panel) this.#ui.dialogo = null;
      this.#programar();
    });
    on('av-chat-volver', () => {
      this.#aplicar({ tipo: 'activo', chat: null });
      this.#ui.panel = null;
      emitir(this, 'av-chat-abierto', { icanal: null });
    });
    on<{ icanal: string } & Preferencias>('av-chat-preferencias', (d) => {
      const { icanal, ...p } = d;
      void this.#preferencias(icanal, p);
    });
    on<{ contenido: string; respuesta_a: string | null; archivos?: File[]; nota?: { duracion: number; onda: number[] } }>('av-chat-enviar', (d) => this.#enviar(d));
    on<{ modo: 'texto' | 'audio' | null }>('av-chat-escribiendo', (d) => {
      if (this.#e.activo) this.#backend?.escribiendo(this.#e.activo, d.modo);
    });
    on<{ accion: string; imensaje?: string; texto?: string }>('av-chat-accion', (d) => void this.#accion(d.accion, d.imensaje, d.texto));
    on<{ imensaje: string; emoji: string | null }>('av-chat-reaccionar', (d) => void this.#reaccionar(d.imensaje, d.emoji));
    on<{ emoji: string; destino: string }>('av-chat-emoji', (d) => {
      if (d.destino !== 'reaccion' || !this.#ui.reaccionRef) return;
      void this.#reaccionar(this.#ui.reaccionRef, d.emoji);
      this.#ui.dialogo = null;
      this.#programar();
    });
    on('av-chat-cargar-anteriores', async () => {
      const chat = this.#e.activo;
      const b = this.#backend;
      if (!chat || !b || this.#ui.cargandoAnteriores || !this.#e.hayMas[chat]) return;
      this.#ui.cargandoAnteriores = true;
      this.#programar();
      try {
        const h = await b.historial(chat, this.#e.mensajes[chat]?.[0]?.ts ?? null, 40);
        this.#aplicar({ tipo: 'historial', chat, mensajes: h.mensajes, hayMas: h.hayMas });
      } catch (err) {
        avisar(err instanceof Error ? err.message : String(err), 'danger');
      } finally {
        this.#ui.cargandoAnteriores = false;
        this.#programar();
      }
    });
    on('av-chat-al-fondo', () => {
      if (this.#e.activo) void this.#marcarLeido(this.#e.activo);
    });
    on<{ archivos: File[] }>('av-chat-soltar', (d) => (this.#root.querySelector('#compositor') as Compositor | null)?.agregar?.(d.archivos));
    on<{ q: string; modo: ModoBusqueda; icanal: string | null }>('av-chat-buscar', (d) => void this.#buscar(d.q, d.modo, d.icanal));
    on<{ iusuario: string }>('av-chat-directo', (d) => void this.#directo(d.iusuario));
    on<DatosGrupo>('av-chat-grupo-crear', (d) => void this.#grupo(d));
    on<{ nombre: string; descripcion: string; foto: string | null }>('av-chat-grupo-editar', async (d) => {
      if (!this.#e.activo || !this.#backend) return;
      try {
        await this.#backend.editarGrupo(this.#e.activo, d);
        this.#ui.dialogo = null;
      } catch (err) {
        avisar(err instanceof Error ? err.message : String(err), 'danger');
      }
      this.#programar();
    });
    on<{ accion: AccionMiembros; usuarios: string[] }>('av-chat-miembros', (d) => void this.#miembros(d.accion, d.usuarios));
    on<{ imensaje: string; chats: string[] }>('av-chat-reenviar', (d) => void this.#reenviar(d.imensaje, d.chats));
    on<{ tipo: 'voz' | 'video' }>('av-chat-llamar', (d) => void this.#llamar(d.tipo));
    on<{ accion: string }>('av-chat-llamada-accion', (d) => void this.#accionLlamada(d.accion));
    on('av-chat-visor-cerrar', () => {
      this.#ui.visor = null;
      this.#programar();
    });
    (this.#root.querySelector('#reaccion') as HTMLElement).addEventListener('iswc-hide', () => {
      if (this.#ui.dialogo === 'reaccion') this.#ui.dialogo = null;
      this.#programar();
    });
    // Esc cierra el panel lateral (W-CHAT-40)
    this.#root.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape' && this.#ui.panel && !this.#ui.dialogo) {
        this.#ui.panel = null;
        this.#ui.infoMensaje = null;
        this.#programar();
      }
    });
    this.#programar();
  }

  #programar(): void {
    if (!this.#montado || this.#cuadro) return;
    this.#cuadro = requestAnimationFrame(() => {
      this.#cuadro = 0;
      this.#pintar();
    });
  }

  /* ── reparto de props ── */

  #pintar(): void {
    const t = textos();
    const e = this.#e;
    const ui = this.#ui;
    const yo = e.yo;
    const q = (id: string) => this.#root.querySelector(`#${id}`) as ConProps;
    const activo = e.activo ? e.chats[e.activo] ?? null : null;
    const ahora = Date.now();
    const nombreDe = (id: string) => (id === yo ? t.tu : e.usuarios[id]?.nombre ?? id);
    const primerNombre = (id: string) => (id === yo ? t.tu : (e.usuarios[id]?.nombre ?? id).split(/\s+/)[0] ?? id);
    const fotoChat = (c: Chat) => c.foto ?? (c.tipo === 'directo' ? e.usuarios[otroDe(c, yo) ?? '']?.foto ?? null : null);
    const colorChat = (c: Chat) => colorDe(c.tipo === 'directo' ? otroDe(c, yo) ?? c.id : c.id);
    const escribiendoTexto = (c: Chat): string => {
      const quien = escribiendoEn(e, c.id, ahora);
      if (!quien.length) return '';
      if (c.tipo === 'directo') return quien[0]!.modo === 'audio' ? t.grabando : t.escribiendo;
      if (quien.length > 1) return t.escribiendoVarios;
      return `${primerNombre(quien[0]!.usuario)} ${quien[0]!.modo === 'audio' ? t.grabando : t.escribiendo}`;
    };

    // lista
    const todos = Object.values(e.chats);
    const filtrados = filtrarChats(todos, { filtro: ui.filtro, q: ui.q, archivados: ui.archivados, usuarios: e.usuarios, yo });
    const item = (c: Chat): ItemChat => {
      const u = ultimoDe(e, c.id);
      const otro = otroDe(c, yo);
      return {
        id: c.id, tipo: c.tipo, nombre: nombreChat(c, e.usuarios, yo), foto: fotoChat(c), iniciales: iniciales(nombreChat(c, e.usuarios, yo)), color: colorChat(c),
        ultimo: u ? resumenMensaje(u, t) : c.descripcion, autorUltimo: u && u.tipo !== 'sistema' && u.tipo !== 'llamada' && (c.tipo !== 'directo' || u.autor === yo) && !u.eliminado ? (u.autor === yo ? t.tu : primerNombre(u.autor)) : '',
        hora: horaLista(u?.ts ?? c.actividad, t), marca: u ? marcaDe(u, c, yo) : null, noLeidos: c.noLeidos, fijado: c.fijado, silenciado: c.silenciado, archivado: c.archivado,
        marcadoNoLeido: c.marcadoNoLeido, escribiendo: escribiendoTexto(c), enLinea: !!otro && !!e.usuarios[otro]?.enLinea,
      };
    };
    q('lista').props = {
      chats: filtrados.map(item), activo: e.activo, filtro: ui.filtro, q: ui.q, archivados: ui.archivados, cantidadArchivados: todos.filter((c) => c.archivado).length,
      conexion: e.conexion, titulo: this.#props.titulo, cargando: ui.cargando,
    };

    // cabecera
    if (activo) {
      const otro = otroDe(activo, yo);
      const esc = escribiendoTexto(activo);
      const estado = esc || (activo.tipo === 'directo' ? textoPresencia(otro ? e.usuarios[otro] : undefined, t) : `${activo.miembros.length} ${t.integrantes}`);
      q('cabecera').props = {
        id: activo.id, tipo: activo.tipo, nombre: nombreChat(activo, e.usuarios, yo), foto: fotoChat(activo), iniciales: iniciales(nombreChat(activo, e.usuarios, yo)), color: colorChat(activo),
        estado, activo: !!esc || (activo.tipo === 'directo' && !!otro && !!e.usuarios[otro]?.enLinea), integrantes: activo.miembros.length,
        puedeLlamar: activo.tipo !== 'publico' && activo.miembros.length <= MAX_LLAMADA && activo.miembros.length > 1, volver: ui.estrecho,
      };
    } else q('cabecera').props = { id: null };

    // conversación
    const autores = Object.fromEntries(Object.values(e.usuarios).map((u) => [u.id, { nombre: u.nombre, color: colorDe(u.id) }]));
    q('mensajes').props = {
      chat: activo, mensajes: activo ? e.mensajes[activo.id] ?? [] : [], yo, autores, primerNoLeido: activo && ui.noLeido?.chat === activo.id ? ui.noLeido.clave : null,
      hayMas: activo ? !!e.hayMas[activo.id] : false, cargandoAnteriores: ui.cargandoAnteriores, resaltar: ui.resaltar,
    };
    const resp = activo && ui.respuesta ? mensajePorRef(e, activo.id, ui.respuesta) : null;
    const edic = activo && ui.edicion ? mensajePorRef(e, activo.id, ui.edicion) : null;
    const salio = !!activo && activo.tipo !== 'publico' && !activo.miembros.some((m) => m.id === yo);
    q('compositor').props = {
      chat: activo?.id ?? null,
      respuesta: resp ? { ref: resp.clave, autor: nombreDe(resp.autor), color: colorDe(resp.autor), texto: resumenMensaje(resp, t), miniatura: null } : null,
      edicion: edic ? { ref: edic.clave, texto: edic.texto } : null,
      deshabilitado: !activo || salio, motivo: salio ? t.salio(t.tu) : '',
    };
    const centro = this.#root.querySelector('.centro') as HTMLElement;
    centro.dataset['vacio'] = activo ? '0' : '1';

    // panel lateral
    const infoMsg = activo && ui.infoMensaje ? mensajePorRef(e, activo.id, ui.infoMensaje) : null;
    if (activo) {
      const ms = (e.mensajes[activo.id] ?? []).filter((m) => !m.oculto && !m.eliminado);
      const otro = otroDe(activo, yo);
      const persona = (id: string, rol = ''): PersonaVista => ({ id, nombre: e.usuarios[id]?.nombre ?? id, foto: e.usuarios[id]?.foto ?? null, detalle: e.usuarios[id]?.detalle ?? '', enLinea: !!e.usuarios[id]?.enLinea, color: colorDe(id), rol });
      q('info').props = {
        abierto: ui.panel === 'info', modo: infoMsg ? 'mensaje' : 'chat', id: activo.id, tipo: activo.tipo, nombre: nombreChat(activo, e.usuarios, yo), descripcion: activo.descripcion,
        foto: fotoChat(activo), iniciales: iniciales(nombreChat(activo, e.usuarios, yo)), color: colorChat(activo), estado: activo.tipo === 'directo' ? textoPresencia(otro ? e.usuarios[otro] : undefined, t) : '',
        yo, soyAdmin: esAdmin(activo, yo), miembros: activo.miembros.map((m) => persona(m.id, m.rol)).sort((a, b) => (a.rol === b.rol ? a.nombre.localeCompare(b.nombre) : a.rol === 'admin' ? -1 : 1)),
        fijado: activo.fijado, silenciado: activo.silenciado, archivado: activo.archivado,
        multimedia: this.#medios(activo.id).slice(-60).reverse().map((m) => ({ ref: m.clave, titulo: m.adjunto!.nombre, url: m.adjunto!.url, tipo: tipoDeMime(m.adjunto!.mime), detalle: '', bytes: m.adjunto!.bytes, color: 0 })),
        archivos: ms.filter((m) => m.adjunto && tipoDeMime(m.adjunto.mime) === 'archivo').reverse().map((m) => ({ ref: m.clave, titulo: m.adjunto!.nombre, url: m.adjunto!.url, tipo: m.adjunto!.mime, detalle: horaLista(m.ts, t), bytes: m.adjunto!.bytes, color: 0 })),
        enlaces: ms.flatMap((m) => enlacesDe(m.texto).map((url) => ({ ref: m.clave, titulo: url, url, tipo: 'enlace', detalle: `${nombreDe(m.autor)} · ${horaLista(m.ts, t)}`, bytes: 0, color: 0 }))).reverse(),
        destacados: ms.filter((m) => m.destacado).reverse().map((m) => ({ ref: m.clave, titulo: nombreDe(m.autor), url: '', tipo: m.tipo, detalle: resumenMensaje(m, t), bytes: 0, color: colorDe(m.autor) })),
        mensaje: infoMsg ? { texto: resumenMensaje(infoMsg, t), ts: infoMsg.ts, filas: ui.infoFilas.map((f) => ({ usuario: f.usuario, nombre: nombreDe(f.usuario), color: colorDe(f.usuario), entregado: f.entregado, leido: f.leido })) } : null,
      };
    } else q('info').props = { abierto: false, id: null };
    const resultados = ui.resultados.map((r) => ({
      chat: r.chat, chatNombre: e.chats[r.chat] ? nombreChat(e.chats[r.chat]!, e.usuarios, yo) : r.chat, ref: r.ref, autor: nombreDe(r.autor), color: colorDe(r.autor), ts: r.ts, fragmento: fragmentoHtml(r.texto, ui.buscado),
    }));
    q('busqueda').props = { abierto: ui.panel === 'busqueda', chat: activo?.id ?? null, chatNombre: activo ? nombreChat(activo, e.usuarios, yo) : '', resultados, cargando: ui.buscando, buscado: ui.buscado };
    const lateral = this.#root.querySelector('.lateral') as HTMLElement;
    lateral.dataset['panel'] = ui.panel ?? '';

    // diálogos
    const personas = Object.values(e.usuarios).filter((u) => u.id !== yo).sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map((u): PersonaVista => ({ id: u.id, nombre: u.nombre, foto: u.foto, detalle: u.enLinea ? t.enLinea : u.detalle, enLinea: u.enLinea, color: colorDe(u.id), rol: '' }));
    q('nuevo').props = { abierto: ui.dialogo === 'nuevo', personas };
    q('grupo').props = {
      abierto: ui.dialogo === 'grupo', modo: ui.grupoModo, personas, excluir: ui.grupoModo === 'agregar' && activo ? activo.miembros.map((m) => m.id) : [],
      nombre: ui.grupoModo === 'editar' && activo ? activo.nombre : '', descripcion: ui.grupoModo === 'editar' && activo ? activo.descripcion : '', foto: ui.grupoModo === 'editar' && activo ? activo.foto : null,
      guardando: ui.guardando, error: '',
    };
    q('reenviar').props = { abierto: ui.dialogo === 'reenviar', ref: ui.reenviarRef, chats: filtrarChats(todos, { filtro: 'todos', q: '', archivados: false, usuarios: e.usuarios, yo }).map(item) };
    const dlgReaccion = this.#root.querySelector('#reaccion') as Dialogo;
    if (dlgReaccion.open !== (ui.dialogo === 'reaccion')) dlgReaccion.open = ui.dialogo === 'reaccion';
    const medios = activo && ui.visor ? this.#medios(activo.id).filter((m) => ui.visor!.refs.includes(m.clave)) : [];
    q('visor').props = {
      abierto: !!ui.visor && medios.length > 0, indice: ui.visor?.indice ?? 0,
      items: medios.map((m) => ({ ref: m.clave, url: m.adjunto!.url, tipo: tipoDeMime(m.adjunto!.mime) === 'video' ? 'video' : 'imagen', nombre: m.adjunto!.nombre, autor: nombreDe(m.autor), ts: m.ts })),
    };

    // llamada
    const ll = this.#llamada;
    const el = q('llamada') as Llamada;
    el.flujos = this.#llamadas?.flujos() ?? new Map();
    el.local = this.#llamadas?.flujoLocal ?? null;
    el.pantallaLocal = this.#llamadas?.flujoPantalla ?? null;
    const chatLl = ll ? e.chats[ll.chat] : null;
    el.props = ll && ll.fase !== 'terminada'
      ? {
        fase: ll.fase, medio: ll.medio, chatNombre: chatLl ? nombreChat(chatLl, e.usuarios, yo) : '', de: nombreDe(ll.de), iniciales: iniciales(ll.fase === 'entrante' ? nombreDe(ll.de) : chatLl ? nombreChat(chatLl, e.usuarios, yo) : '?'),
        color: colorDe(ll.fase === 'entrante' ? ll.de : (chatLl && otroDe(chatLl, yo)) || ll.chat), participantes: ll.participantes.map((p) => ({ front: p.front, nombre: nombreDe(p.usuario), iniciales: iniciales(nombreDe(p.usuario)), color: colorDe(p.usuario), video: p.video, hablando: p.hablando, conectado: p.conectado })),
        inicio: ll.inicio, mic: ll.local.mic, cam: ll.local.cam, pantalla: ll.local.pantalla, hablando: ll.local.hablando, aviso: ll.aviso, rev: this.#revLlamada,
      }
      : { fase: null, rev: this.#revLlamada };

    // disposición: una columna en pantallas estrechas; panel lateral solo si hay uno abierto
    this.dataset['estrecho'] = ui.estrecho ? '1' : '0';
    const exterior = this.#root.querySelector('.exterior') as HTMLElement;
    const interior = this.#root.querySelector('.interior') as HTMLElement;
    const colapsoExt = ui.estrecho ? (activo ? 'start' : 'end') : null;
    const colapsoInt = !ui.panel ? 'end' : ui.estrecho ? 'start' : null;
    if (colapsoExt) exterior.setAttribute('collapse', colapsoExt);
    else exterior.removeAttribute('collapse');
    if (colapsoInt) interior.setAttribute('collapse', colapsoInt);
    else interior.removeAttribute('collapse');
    (q('info') as HTMLElement).hidden = ui.panel !== 'info';
    (q('busqueda') as HTMLElement).hidden = ui.panel !== 'busqueda';
  }
}

define('av-chat', AvChat);
