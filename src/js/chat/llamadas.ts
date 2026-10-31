/**
 * llamadas.ts — llamadas de voz y video WebRTC en malla (W-CHAT-36/37/38, HS-CHAT-09), con señalización por la sala.
 *
 * Flujo:
 *   1. Quien llama abre su medio y difunde `llamada.invitar` a los integrantes del chat (suena en sus fronts).
 *   2. Quien acepta difunde `llamada.unirse`; cada front que ya está en la llamada crea un RTCPeerConnection hacia el
 *      recién llegado y le agrega sus pistas: la negociación sale sola (`negotiationneeded`).
 *   3. Negociación «perfecta» (patrón del W3C): ofertas, respuestas e ICE por `llamada.oferta|respuesta|ice`, con un
 *      lado cortés por par (el de `front` menor) que cede si dos ofertas chocan. Así también funciona renegociar al
 *      encender la cámara o compartir pantalla a mitad de llamada.
 *   4. `llamada.colgar` saca a ese front; `llamada.rechazar` en un 1:1 termina la llamada. Sin respuesta en 35 s, perdida.
 *
 * Sin cámara o micrófono (o sin permiso) la llamada lo explica (W-CHAT-44); con `simular` (demo) usa un medio
 * sintético (lienzo animado + tono mudo) para poder probar entre pestañas sin dispositivos.
 */
import { MAX_LLAMADA } from './formato.js';
import { STUN_CLOUDFLARE } from './backend.js';
import type { RegistroLlamada, SenalLlamada } from './tipos.js';

export type FaseLlamada = 'entrante' | 'saliente' | 'activa' | 'terminada';
export type Medio = 'voz' | 'video';

export type ParticipanteLlamada = { front: string; usuario: string; video: boolean; silenciado: boolean; hablando: boolean; conectado: boolean };

export type EstadoLlamada = {
  id: string;
  chat: string;
  medio: Medio;
  fase: FaseLlamada;
  iniciador: string;
  /** Quién invita (para la llamada entrante). */
  de: string;
  participantes: ParticipanteLlamada[];
  inicio: number | null;
  local: { mic: boolean; cam: boolean; pantalla: boolean; hablando: boolean };
  aviso: string;
  simulado: boolean;
};

type Par = { pc: RTCPeerConnection; cortes: boolean; haciendoOferta: boolean; ignorarOferta: boolean; flujo: MediaStream; usuario: string };

export type OpcionesLlamadas = {
  yo: string;
  front: string;
  enviar: (s: SenalLlamada) => void;
  iceServers: () => Promise<RTCIceServer[]>;
  alCambio: (e: EstadoLlamada | null) => void;
  registrar?: (r: RegistroLlamada) => void;
  /** Abre el registro al empezar (quien llama); el id vuelve en `registrar`. */
  iniciar?: (chat: string, medio: Medio) => Promise<string | null>;
  /** Medio sintético si no hay dispositivos (demo). */
  simular?: boolean;
  textos?: { sinMicrofono: string; sinCamara: string; medioSimulado: string; maxLlamada: (n: number) => string };
  esperaMs?: number;
};

const ESPERA_MS = 35000;

export class GestorLlamadas {
  #o: OpcionesLlamadas;
  #e: EstadoLlamada | null = null;
  #pares = new Map<string, Par>();
  #local: MediaStream | null = null;
  #pantalla: MediaStream | null = null;
  #ice: RTCIceServer[] = [STUN_CLOUDFLARE];
  #espera: ReturnType<typeof setTimeout> | null = null;
  #medidor: ReturnType<typeof setInterval> | null = null;
  #audio: AudioContext | null = null;
  #analizadores = new Map<string, AnalyserNode>();
  #pendientesIce = new Map<string, RTCIceCandidateInit[]>();
  #invitados: string[] = [];
  #alguienSeUnio = false;
  #sinteticos: Array<() => void> = [];
  #registro: Promise<string | null> | null = null;

  constructor(o: OpcionesLlamadas) {
    this.#o = o;
  }

  get estado(): EstadoLlamada | null {
    return this.#e;
  }

  /** Flujo local (para la vista previa propia). */
  get flujoLocal(): MediaStream | null {
    return this.#local;
  }

  /** Flujos remotos por front. */
  flujos(): Map<string, MediaStream> {
    return new Map([...this.#pares].map(([f, p]) => [f, p.flujo]));
  }

  #emitir(): void {
    this.#o.alCambio(this.#e ? { ...this.#e, participantes: this.#e.participantes.map((p) => ({ ...p })), local: { ...this.#e.local } } : null);
  }

  #senal(tipo: SenalLlamada['tipo'], extra: Partial<SenalLlamada> = {}): void {
    if (!this.#e) return;
    this.#o.enviar({ tipo, llamada: this.#e.id, chat: this.#e.chat, de: this.#o.yo, front: this.#o.front, paraFront: null, medio: this.#e.medio, descripcion: null, candidato: null, ...extra });
  }

  /** Abre micrófono (y cámara si `video`). Sin dispositivos: medio simulado o error explicado. */
  async #abrirMedio(video: boolean): Promise<MediaStream> {
    const t = this.#o.textos;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('sin mediaDevices');
      return await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false });
    } catch (err) {
      if (video) {
        // sin cámara: al menos la voz
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (this.#e) this.#e.aviso = t?.sinCamara ?? '';
          return s;
        } catch {
          /* tampoco micrófono */
        }
      }
      if (this.#o.simular) {
        if (this.#e) {
          this.#e.aviso = t?.medioSimulado ?? '';
          this.#e.simulado = true;
        }
        return this.#medioSintetico(video);
      }
      throw new Error(t?.sinMicrofono ?? (err instanceof Error ? err.message : String(err)));
    }
  }

  /** Lienzo animado con los tonos de la paleta + pista de audio muda. */
  #medioSintetico(video: boolean): MediaStream {
    const ctx = this.#contextoAudio();
    const osc = ctx.createOscillator();
    const gan = ctx.createGain();
    gan.gain.value = 0.0001;
    const destino = ctx.createMediaStreamDestination();
    osc.connect(gan).connect(destino);
    osc.start();
    const pistas: MediaStreamTrack[] = [...destino.stream.getAudioTracks()];
    let parar = () => osc.stop();
    if (video) {
      const lienzo = document.createElement('canvas');
      lienzo.width = 640;
      lienzo.height = 360;
      const g = lienzo.getContext('2d')!;
      const css = getComputedStyle(document.documentElement);
      const acento = css.getPropertyValue('--iswc-accent').trim() || 'currentColor';
      const fondo = css.getPropertyValue('--iswc-bg-elev').trim() || css.getPropertyValue('--iswc-bg').trim();
      const texto = css.getPropertyValue('--iswc-text').trim();
      let cuadro = 0;
      const pintar = () => {
        cuadro++;
        g.fillStyle = fondo;
        g.fillRect(0, 0, 640, 360);
        for (let i = 0; i < 6; i++) {
          g.beginPath();
          g.strokeStyle = acento;
          g.globalAlpha = 0.25 + 0.12 * i;
          g.lineWidth = 3;
          g.arc(320, 180, 40 + i * 26 + 10 * Math.sin((cuadro + i * 12) / 18), 0, Math.PI * 2);
          g.stroke();
        }
        g.globalAlpha = 1;
        g.fillStyle = texto;
        g.font = '600 28px sans-serif';
        g.textAlign = 'center';
        g.fillText(this.#o.yo, 320, 192);
      };
      const id = setInterval(pintar, 1000 / 15);
      pintar();
      const v = lienzo.captureStream(15);
      pistas.push(...v.getVideoTracks());
      const previo = parar;
      parar = () => {
        previo();
        clearInterval(id);
      };
    }
    this.#sinteticos.push(parar);
    return new MediaStream(pistas);
  }

  #contextoAudio(): AudioContext {
    if (!this.#audio) this.#audio = new AudioContext();
    if (this.#audio.state === 'suspended') void this.#audio.resume().catch(() => undefined);
    return this.#audio;
  }

  /** Llama a los integrantes de un chat (W-CHAT-36). */
  async llamar(chat: string, miembros: string[], medio: Medio): Promise<void> {
    if (this.#e && this.#e.fase !== 'terminada') return;
    if (miembros.length + 1 > MAX_LLAMADA) throw new Error(this.#o.textos?.maxLlamada(MAX_LLAMADA) ?? `Máximo ${MAX_LLAMADA}`);
    const id = `ll-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    this.#invitados = miembros.filter((m) => m !== this.#o.yo);
    this.#alguienSeUnio = false;
    this.#e = { id, chat, medio, fase: 'saliente', iniciador: this.#o.yo, de: this.#o.yo, participantes: [], inicio: null, local: { mic: true, cam: medio === 'video', pantalla: false, hablando: false }, aviso: '', simulado: false };
    this.#emitir();
    try {
      this.#local = await this.#abrirMedio(medio === 'video');
    } catch (err) {
      const aviso = err instanceof Error ? err.message : String(err);
      this.#e = null;
      this.#o.alCambio(null);
      throw new Error(aviso);
    }
    this.#e.local.cam = this.#local.getVideoTracks().length > 0;
    this.#medirLocal();
    void this.#o.iceServers().then((s) => { if (s.length) this.#ice = s; }).catch(() => undefined);
    this.#senal('llamada.invitar');
    this.#registro = this.#o.iniciar ? this.#o.iniciar(chat, medio).catch(() => null) : null;
    this.#emitir();
    this.#espera = setTimeout(() => {
      if (this.#e?.id === id && !this.#alguienSeUnio) this.#terminar(true);
    }, this.#o.esperaMs ?? ESPERA_MS);
  }

  /** Acepta la llamada entrante. */
  async aceptar(): Promise<void> {
    const e = this.#e;
    if (!e || e.fase !== 'entrante') return;
    try {
      this.#local = await this.#abrirMedio(e.medio === 'video');
    } catch (err) {
      e.aviso = err instanceof Error ? err.message : String(err);
      this.#emitir();
      return;
    }
    e.local.cam = this.#local.getVideoTracks().length > 0;
    e.fase = 'activa';
    e.inicio = Date.now();
    if (this.#espera) clearTimeout(this.#espera);
    this.#medirLocal();
    try {
      const s = await this.#o.iceServers();
      if (s.length) this.#ice = s;
    } catch {
      /* STUN por defecto */
    }
    this.#senal('llamada.unirse');
    this.#emitir();
  }

  rechazar(): void {
    if (!this.#e || this.#e.fase !== 'entrante') return;
    this.#senal('llamada.rechazar');
    this.#limpiar();
  }

  colgar(): void {
    if (!this.#e) return;
    if (this.#e.fase === 'entrante') return this.rechazar();
    this.#senal('llamada.colgar');
    this.#terminar(this.#e.fase === 'saliente' && !this.#alguienSeUnio);
  }

  alternarMic(): void {
    if (!this.#e || !this.#local) return;
    this.#e.local.mic = !this.#e.local.mic;
    for (const t of this.#local.getAudioTracks()) t.enabled = this.#e.local.mic;
    this.#emitir();
  }

  async alternarCam(): Promise<void> {
    const e = this.#e;
    if (!e || !this.#local) return;
    const pistas = this.#local.getVideoTracks();
    if (pistas.length) {
      e.local.cam = !e.local.cam;
      for (const t of pistas) t.enabled = e.local.cam;
      this.#emitir();
      return;
    }
    await this.aVideo();
  }

  /** Pasa una llamada de voz a video: agrega la cámara y renegocia (W-CHAT-37). */
  async aVideo(): Promise<void> {
    const e = this.#e;
    if (!e || !this.#local) return;
    let pista: MediaStreamTrack | undefined;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      pista = s.getVideoTracks()[0];
    } catch {
      if (this.#o.simular) pista = this.#medioSintetico(true).getVideoTracks()[0];
      else {
        e.aviso = this.#o.textos?.sinCamara ?? '';
        this.#emitir();
        return;
      }
    }
    if (!pista) return;
    this.#local.addTrack(pista);
    e.medio = 'video';
    e.local.cam = true;
    for (const p of this.#pares.values()) p.pc.addTrack(pista, this.#local);
    this.#emitir();
  }

  /** Comparte pantalla reemplazando la pista de video (o agregándola). */
  async alternarPantalla(): Promise<void> {
    const e = this.#e;
    if (!e || !this.#local) return;
    if (this.#pantalla) {
      const camara = this.#local.getVideoTracks()[0] ?? null;
      for (const p of this.#pares.values()) {
        const envio = p.pc.getSenders().find((s) => s.track?.kind === 'video');
        if (envio) await envio.replaceTrack(camara);
      }
      for (const t of this.#pantalla.getTracks()) t.stop();
      this.#pantalla = null;
      e.local.pantalla = false;
      this.#emitir();
      return;
    }
    let s: MediaStream;
    try {
      s = await navigator.mediaDevices.getDisplayMedia({ video: true });
    } catch {
      return;
    }
    const pista = s.getVideoTracks()[0];
    if (!pista) return;
    this.#pantalla = s;
    pista.onended = () => {
      if (this.#pantalla === s) void this.alternarPantalla();
    };
    for (const p of this.#pares.values()) {
      const envio = p.pc.getSenders().find((x) => x.track?.kind === 'video');
      if (envio) await envio.replaceTrack(pista);
      else p.pc.addTrack(pista, s);
    }
    e.local.pantalla = true;
    this.#emitir();
  }

  /** Flujo de la pantalla compartida (para la vista previa propia). */
  get flujoPantalla(): MediaStream | null {
    return this.#pantalla;
  }

  /** Procesa una señal que llegó por la sala. */
  async recibir(s: SenalLlamada): Promise<void> {
    if (s.front === this.#o.front) return;
    if (s.paraFront && s.paraFront !== this.#o.front) return;
    const e = this.#e;
    switch (s.tipo) {
      case 'llamada.invitar': {
        if (s.de === this.#o.yo) return;
        if (e && e.fase !== 'terminada') {
          // ocupado: se rechaza solo a ese front
          this.#o.enviar({ ...s, tipo: 'llamada.rechazar', de: this.#o.yo, front: this.#o.front, paraFront: s.front, descripcion: null, candidato: null });
          return;
        }
        this.#e = { id: s.llamada, chat: s.chat, medio: s.medio, fase: 'entrante', iniciador: s.de, de: s.de, participantes: [], inicio: null, local: { mic: true, cam: s.medio === 'video', pantalla: false, hablando: false }, aviso: '', simulado: false };
        this.#espera = setTimeout(() => {
          if (this.#e?.id === s.llamada && this.#e.fase === 'entrante') this.#limpiar();
        }, this.#o.esperaMs ?? ESPERA_MS);
        this.#emitir();
        return;
      }
      case 'llamada.unirse': {
        if (!e || e.id !== s.llamada) return;
        if (e.fase === 'entrante' && s.de === this.#o.yo) {
          // la contesté en otro front: deja de sonar aquí
          this.#limpiar();
          return;
        }
        if (e.fase === 'entrante') return;
        this.#alguienSeUnio = true;
        if (e.fase === 'saliente') {
          e.fase = 'activa';
          e.inicio = Date.now();
          if (this.#espera) clearTimeout(this.#espera);
        }
        this.#par(s.front, s.de);
        this.#emitir();
        return;
      }
      case 'llamada.oferta':
      case 'llamada.respuesta': {
        if (!e || e.id !== s.llamada || !s.descripcion || e.fase === 'entrante') return;
        const p = this.#par(s.front, s.de);
        const desc = s.descripcion as RTCSessionDescriptionInit;
        const choque = desc.type === 'offer' && (p.haciendoOferta || p.pc.signalingState !== 'stable');
        p.ignorarOferta = !p.cortes && choque;
        if (p.ignorarOferta) return;
        try {
          await p.pc.setRemoteDescription(desc);
          for (const c of this.#pendientesIce.get(s.front) ?? []) await p.pc.addIceCandidate(c).catch(() => undefined);
          this.#pendientesIce.delete(s.front);
          if (desc.type === 'offer') {
            await p.pc.setLocalDescription();
            this.#senal('llamada.respuesta', { paraFront: s.front, descripcion: { type: p.pc.localDescription!.type, sdp: p.pc.localDescription!.sdp } });
          }
        } catch {
          /* descripción inválida: se ignora */
        }
        return;
      }
      case 'llamada.ice': {
        if (!e || e.id !== s.llamada || !s.candidato) return;
        const p = this.#pares.get(s.front);
        const c = s.candidato as RTCIceCandidateInit;
        if (!p || !p.pc.remoteDescription) {
          this.#pendientesIce.set(s.front, [...(this.#pendientesIce.get(s.front) ?? []), c]);
          return;
        }
        try {
          await p.pc.addIceCandidate(c);
        } catch {
          if (!p.ignorarOferta) {
            /* candidato tardío: sin efecto */
          }
        }
        return;
      }
      case 'llamada.colgar': {
        if (!e || e.id !== s.llamada) return;
        if (e.fase === 'entrante' && s.de === e.iniciador) {
          // quien llamaba colgó antes de que contestara: perdida
          this.#limpiar();
          return;
        }
        this.#quitarPar(s.front);
        if (e.fase === 'activa' && this.#pares.size === 0) this.#terminar(false);
        else this.#emitir();
        return;
      }
      case 'llamada.rechazar': {
        if (!e || e.id !== s.llamada) return;
        if (e.fase === 'entrante' && s.de === this.#o.yo) {
          this.#limpiar();
          return;
        }
        if (e.fase === 'saliente') {
          this.#invitados = this.#invitados.filter((i) => i !== s.de);
          if (this.#invitados.length === 0) this.#terminar(true);
        }
        return;
      }
    }
  }

  #par(front: string, usuario: string): Par {
    const ya = this.#pares.get(front);
    if (ya) return ya;
    const pc = new RTCPeerConnection({ iceServers: this.#ice });
    const p: Par = { pc, cortes: this.#o.front < front, haciendoOferta: false, ignorarOferta: false, flujo: new MediaStream(), usuario };
    this.#pares.set(front, p);
    this.#e?.participantes.push({ front, usuario, video: false, silenciado: false, hablando: false, conectado: false });
    pc.onnegotiationneeded = async () => {
      try {
        p.haciendoOferta = true;
        await pc.setLocalDescription();
        this.#senal('llamada.oferta', { paraFront: front, descripcion: { type: pc.localDescription!.type, sdp: pc.localDescription!.sdp } });
      } catch {
        /* reintenta en la próxima negociación */
      } finally {
        p.haciendoOferta = false;
      }
    };
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) this.#senal('llamada.ice', { paraFront: front, candidato: candidate.toJSON() as Record<string, unknown> });
    };
    pc.ontrack = ({ track }) => {
      if (!p.flujo.getTracks().includes(track)) p.flujo.addTrack(track);
      track.onunmute = () => this.#actualizarPar(front);
      track.onmute = () => this.#actualizarPar(front);
      track.onended = () => {
        p.flujo.removeTrack(track);
        this.#actualizarPar(front);
      };
      if (track.kind === 'audio') this.#analizar(front, p.flujo);
      this.#actualizarPar(front);
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.#quitarPar(front);
        if (this.#e?.fase === 'activa' && this.#pares.size === 0) this.#terminar(false);
        else this.#emitir();
        return;
      }
      this.#actualizarPar(front);
    };
    if (this.#local) for (const t of this.#local.getTracks()) pc.addTrack(t, this.#local);
    if (this.#pantalla) {
      const pista = this.#pantalla.getVideoTracks()[0];
      const envio = pc.getSenders().find((x) => x.track?.kind === 'video');
      if (pista && envio) void envio.replaceTrack(pista);
      else if (pista) pc.addTrack(pista, this.#pantalla);
    }
    return p;
  }

  #actualizarPar(front: string): void {
    const p = this.#pares.get(front);
    const v = this.#e?.participantes.find((x) => x.front === front);
    if (!p || !v) return;
    v.video = p.flujo.getVideoTracks().some((t) => t.readyState === 'live' && !t.muted);
    v.conectado = p.pc.connectionState === 'connected';
    this.#emitir();
  }

  #quitarPar(front: string): void {
    const p = this.#pares.get(front);
    if (!p) return;
    try {
      p.pc.close();
    } catch {
      /* nada */
    }
    this.#pares.delete(front);
    this.#analizadores.delete(front);
    if (this.#e) this.#e.participantes = this.#e.participantes.filter((x) => x.front !== front);
  }

  #analizar(clave: string, flujo: MediaStream): void {
    try {
      const ctx = this.#contextoAudio();
      const fuente = ctx.createMediaStreamSource(flujo);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      fuente.connect(an);
      this.#analizadores.set(clave, an);
    } catch {
      return;
    }
    if (this.#medidor) return;
    const datos = new Uint8Array(256);
    this.#medidor = setInterval(() => {
      const e = this.#e;
      if (!e) return;
      let cambio = false;
      for (const [k, an] of this.#analizadores) {
        an.getByteTimeDomainData(datos);
        let suma = 0;
        for (const x of datos) suma += (x - 128) ** 2;
        const habla = Math.sqrt(suma / datos.length) > 6;
        if (k === '__local') {
          const h = habla && e.local.mic;
          if (e.local.hablando !== h) {
            e.local.hablando = h;
            cambio = true;
          }
          continue;
        }
        const v = e.participantes.find((x) => x.front === k);
        if (v && v.hablando !== habla) {
          v.hablando = habla;
          cambio = true;
        }
      }
      if (cambio) this.#emitir();
    }, 250);
  }

  #medirLocal(): void {
    if (this.#local?.getAudioTracks().length) this.#analizar('__local', this.#local);
  }

  /** Fin de la llamada: quien la inició deja el registro en el chat. */
  #terminar(perdida: boolean): void {
    const e = this.#e;
    if (!e) return;
    if (e.iniciador === this.#o.yo && this.#o.registrar) {
      const fin = Date.now();
      const registrar = this.#o.registrar;
      const datos = {
        chat: e.chat, medio: e.medio, iniciador: e.iniciador, inicio: new Date(e.inicio ?? fin).toISOString(), fin: new Date(fin).toISOString(),
        duracion: e.inicio ? Math.round((fin - e.inicio) / 1000) : 0, perdida: perdida || !e.inicio, participantes: [this.#o.yo, ...new Set(e.participantes.map((p) => p.usuario))],
      };
      const reg = this.#registro;
      this.#registro = null;
      if (reg) void reg.then((illamada) => registrar({ ...datos, illamada }));
      else registrar({ ...datos, illamada: null });
    }
    this.#limpiar();
  }

  #limpiar(): void {
    if (this.#espera) clearTimeout(this.#espera);
    if (this.#medidor) clearInterval(this.#medidor);
    this.#medidor = null;
    for (const f of [...this.#pares.keys()]) this.#quitarPar(f);
    for (const t of this.#local?.getTracks() ?? []) t.stop();
    for (const t of this.#pantalla?.getTracks() ?? []) t.stop();
    for (const parar of this.#sinteticos.splice(0)) {
      try {
        parar();
      } catch {
        /* nada */
      }
    }
    this.#local = null;
    this.#pantalla = null;
    this.#analizadores.clear();
    this.#pendientesIce.clear();
    this.#e = null;
    this.#o.alCambio(null);
  }

  /** Cuelga y libera todo (al desmontar). */
  destruir(): void {
    if (this.#e && this.#e.fase !== 'entrante') this.#senal('llamada.colgar');
    this.#limpiar();
    void this.#audio?.close().catch(() => undefined);
    this.#audio = null;
  }
}

/**
 * Tono de llamada con Web Audio (sin archivos): entrante = doble pitido de timbre; saliente = tono largo de espera.
 */
export function crearTono(): { iniciar(tipo: 'entrante' | 'saliente'): void; detener(): void } {
  let ctx: AudioContext | null = null;
  let id: ReturnType<typeof setInterval> | null = null;
  const pitido = (f: number, ini: number, dur: number, vol = 0.08) => {
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, ctx.currentTime + ini);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + ini + 0.02);
    g.gain.setValueAtTime(vol, ctx.currentTime + ini + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + ini + dur);
    o.connect(g).connect(ctx.destination);
    o.start(ctx.currentTime + ini);
    o.stop(ctx.currentTime + ini + dur + 0.02);
  };
  return {
    iniciar(tipo) {
      this.detener();
      try {
        ctx = new AudioContext();
        void ctx.resume().catch(() => undefined);
      } catch {
        return;
      }
      const sonar = () => {
        if (tipo === 'entrante') {
          pitido(880, 0, 0.35);
          pitido(660, 0.45, 0.35);
        } else pitido(440, 0, 1.2, 0.04);
      };
      sonar();
      id = setInterval(sonar, tipo === 'entrante' ? 2200 : 3000);
    },
    detener() {
      if (id) clearInterval(id);
      id = null;
      void ctx?.close().catch(() => undefined);
      ctx = null;
    },
  };
}
