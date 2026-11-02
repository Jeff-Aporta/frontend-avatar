/**
 * sala.ts — cliente WebSocket de la sala de tiempo real (HS-CHAT-07) con reconexión exponencial y cola de salida.
 *
 *   - `url()` se pide en CADA conexión (el ticket de la sala vence): `wss://…/rt/empresa-{iempresa}?ticket=`.
 *   - Si el socket se cae: «conectando», reintento a 0.5 s, 1 s, 2 s… hasta 15 s (con algo de azar para no llegar
 *     todos a la vez); al volver la red (`online`) o la pestaña al frente, reintenta en el acto.
 *   - Lo que se envía sin conexión queda en cola y sale al reconectar (lo efímero, como «escribiendo», no se encola).
 *   - Latido cada 25 s para que proxies no corten el socket ocioso; si dejan de llegar respuestas, el socket se da por muerto y
 *     se reconecta (un corte de red no siempre dispara `onclose`).
 *
 * Protocolo de la sala: JSON `{ tipo, para?, icanal?, … }`; el servidor sella `de` y `ts` y difunde. El latido es el texto
 * plano `ping` (la sala responde `pong` sin despertarse ni difundirlo).
 */
import type { Conexion } from './tipos.js';

type SocketLike = {
  readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  onopen: ((ev: unknown) => void) | null;
  onclose: ((ev: unknown) => void) | null;
  onerror: ((ev: unknown) => void) | null;
  onmessage: ((ev: { data: unknown }) => void) | null;
};

export type OpcionesSala = {
  url: () => Promise<string>;
  alMensaje: (datos: unknown) => void;
  alEstado?: (estado: Conexion, intento: number) => void;
  /** Al reconectar tras una caída (para pedir lo que faltó). */
  alReconectar?: () => void;
  crearSocket?: (url: string) => SocketLike;
  retardoBase?: number;
  retardoMax?: number;
  latidoMs?: number;
  azar?: () => number;
};

/** Retardo del intento `n` (0, 1, 2…): base·2ⁿ con tope, más hasta un 20 % de azar. */
export function retardo(n: number, base = 500, tope = 15000, azar: () => number = Math.random): number {
  const puro = Math.min(tope, base * 2 ** Math.max(0, n));
  return Math.round(puro + puro * 0.2 * azar());
}

const ABIERTO = 1;

export class Sala {
  #o: OpcionesSala;
  #ws: SocketLike | null = null;
  #cola: string[] = [];
  #intento = 0;
  #temporizador: ReturnType<typeof setTimeout> | null = null;
  #latido: ReturnType<typeof setInterval> | null = null;
  #cerrada = false;
  #yaConecto = false;
  #estado: Conexion = 'desconectado';
  #ultimaRespuesta = 0;
  #alVolver = () => {
    if (typeof document === 'undefined' || document.visibilityState === 'visible') this.#reanudar();
  };
  #reanudar = () => {
    if (this.#estado !== 'conectado' && !this.#cerrada) this.#reintentarYa();
  };

  constructor(o: OpcionesSala) {
    this.#o = o;
  }

  get estado(): Conexion {
    return this.#estado;
  }

  /** Mensajes esperando conexión. */
  get pendientes(): number {
    return this.#cola.length;
  }

  conectar(): void {
    this.#cerrada = false;
    if (typeof addEventListener === 'function') {
      addEventListener('online', this.#reanudar);
      addEventListener('focus', this.#reanudar);
    }
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', this.#alVolver);
    void this.#abrir();
  }

  /** Envía (o encola si no hay conexión y `encolar`). */
  enviar(datos: unknown, encolar = true): void {
    const texto = JSON.stringify(datos);
    if (this.#ws && this.#ws.readyState === ABIERTO) {
      try {
        this.#ws.send(texto);
        return;
      } catch {
        /* se encola abajo */
      }
    }
    if (encolar) this.#cola.push(texto);
  }

  cerrar(): void {
    this.#cerrada = true;
    if (typeof removeEventListener === 'function') {
      removeEventListener('online', this.#reanudar);
      removeEventListener('focus', this.#reanudar);
    }
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.#alVolver);
    if (this.#temporizador) clearTimeout(this.#temporizador);
    if (this.#latido) clearInterval(this.#latido);
    const ws = this.#ws;
    this.#ws = null;
    try {
      ws?.close(1000, 'cerrada');
    } catch {
      /* nada */
    }
    this.#fijar('desconectado');
  }

  #fijar(e: Conexion): void {
    if (this.#estado === e) return;
    this.#estado = e;
    this.#o.alEstado?.(e, this.#intento);
  }

  async #abrir(): Promise<void> {
    if (this.#cerrada) return;
    this.#fijar('conectando');
    let url: string;
    try {
      url = await this.#o.url();
    } catch {
      this.#programar();
      return;
    }
    if (this.#cerrada) return;
    let ws: SocketLike;
    try {
      ws = this.#o.crearSocket ? this.#o.crearSocket(url) : (new WebSocket(url) as unknown as SocketLike);
    } catch {
      this.#programar();
      return;
    }
    this.#ws = ws;
    ws.onopen = () => {
      if (this.#ws !== ws) return;
      const reconexion = this.#yaConecto;
      this.#yaConecto = true;
      this.#intento = 0;
      this.#fijar('conectado');
      const cola = this.#cola.splice(0);
      for (const t of cola) ws.send(t);
      if (this.#latido) clearInterval(this.#latido);
      const latidoMs = this.#o.latidoMs ?? 25000;
      this.#ultimaRespuesta = Date.now();
      this.#latido = setInterval(() => {
        if (this.#ws !== ws) return;
        if (Date.now() - this.#ultimaRespuesta > latidoMs * 2.5) return this.#caido(ws);
        try {
          if (ws.readyState === ABIERTO) ws.send('ping');
        } catch {
          /* el cierre llega por onclose */
        }
      }, latidoMs);
      if (reconexion) this.#o.alReconectar?.();
    };
    ws.onmessage = (ev) => {
      if (this.#ws !== ws) return;
      this.#ultimaRespuesta = Date.now();
      try {
        if (ev.data === 'pong') return;
        const datos = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
        if (datos && typeof datos === 'object' && (datos as { tipo?: unknown }).tipo === 'pong') return;
        this.#o.alMensaje(datos);
      } catch {
        /* mensaje ilegible: se ignora */
      }
    };
    ws.onclose = () => this.#caido(ws);
    ws.onerror = () => {
      /* el cierre llega después por onclose */
    };
  }

  /** Socket perdido (cierre o sin respuesta al latido): se suelta y se reintenta. */
  #caido(ws: SocketLike): void {
    if (this.#ws !== ws) return;
    this.#ws = null;
    if (this.#latido) clearInterval(this.#latido);
    try {
      ws.close();
    } catch {
      /* ya estaba cerrado */
    }
    if (!this.#cerrada) this.#programar();
  }

  #programar(): void {
    if (this.#cerrada) return;
    this.#fijar('conectando');
    if (this.#temporizador) clearTimeout(this.#temporizador);
    const ms = retardo(this.#intento++, this.#o.retardoBase, this.#o.retardoMax, this.#o.azar);
    this.#temporizador = setTimeout(() => void this.#abrir(), ms);
  }

  #reintentarYa(): void {
    if (this.#ws && this.#ws.readyState <= ABIERTO) return;
    if (this.#temporizador) clearTimeout(this.#temporizador);
    this.#intento = 0;
    void this.#abrir();
  }
}
