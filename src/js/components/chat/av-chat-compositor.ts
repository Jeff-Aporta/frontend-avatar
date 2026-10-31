/**
 * <av-chat-compositor> — redactor del chat (W-CHAT-16/19/20/21/25/44):
 *   - `iswc-textarea` que crece hasta 6 líneas; Enter envía, Shift+Enter salto de línea; vacío o > 4000 no se envía.
 *   - Selector de emojis (inserta en el cursor), cita de la respuesta o «Editando mensaje» arriba (Esc cancela).
 *   - Adjuntos por botón, pegar o soltar (método `agregar(files)`): vista previa con texto opcional; lo que supera 25 MB
 *     o es de tipo bloqueado se rechaza antes de subir, con el motivo.
 *   - Nota de voz: tocar el micrófono graba (con tiempo y onda) hasta enviar o cancelar; mantenerlo pulsado graba y
 *     al soltar envía. Sin micrófono o sin permiso, lo explica.
 *   - Borrador por chat: cambiar de chat guarda lo escrito y recupera el del otro.
 * Emite `av-chat-enviar { contenido, respuesta_a, archivos, nota? }`, `av-chat-escribiendo { modo }`,
 * `av-chat-accion { accion: 'editar-guardar' | 'cancelar', imensaje?, texto? }`.
 * Tras el primer pintado nunca se repinta: lo escrito y el foco no se pierden.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatCompositorProps } from '../../consts/schemas/chat.schemas.js';
import { duracionTexto, MAX_TEXTO, validarArchivo, validarTexto } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';
import './av-chat-emojis.js';
import './av-chat-adjunto.js';

type Area = HTMLElement & { value: string; focus(): void };
type ConProps = HTMLElement & { props: Record<string, unknown> };
type Pendiente = { id: string; archivo: File; url: string; error: string };
type Host = HTMLElement & { agregar?: (files: File[]) => void; enfocar?: () => void };

const borradores = new Map<string, string>();
const MANTENER_MS = 320;
const ESCRIBIENDO_CADA_MS = 2500;

function mimeGrabacion(): string {
  const opciones = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return opciones.find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(m)) ?? '';
}

function montar(root: ShadowRoot, props: AvChatCompositorProps, host: Host): void {
  const t = textos();
  let estado = props;
  let pendientes: Pendiente[] = [];
  let ultimoEscribiendo = 0;
  let grabacion: { rec: MediaRecorder; flujo: MediaStream; trozos: Blob[]; inicio: number; muestras: number[]; reloj: ReturnType<typeof setInterval>; ctx: AudioContext; an: AnalyserNode; enviar: boolean } | null = null;
  let pulsado: ReturnType<typeof setTimeout> | null = null;
  let modoMantener = false;
  let ignorarSoltar = false;

  root.append(html`
    <div class="compositor" part="compositor">
      <div class="panel-emojis" hidden><av-chat-emojis id="emojis"></av-chat-emojis></div>
      <div class="contexto" hidden>
        <iswc-icon class="contexto-icono" icon="mdi:reply"></iswc-icon>
        <div class="contexto-texto" data-color="0"><strong></strong><span></span></div>
        <iswc-button class="contexto-cerrar" variant="plain" color="neutral" title=${t.cancelar} aria-label=${t.cancelar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
      </div>
      <div class="adjuntos" hidden></div>
      <div class="barra">
        <iswc-button class="b-emoji" variant="plain" color="neutral" title=${t.emojis} aria-label=${t.emojis} aria-expanded="false"><iswc-icon icon="mdi:emoticon-outline"></iswc-icon></iswc-button>
        <iswc-button class="b-adjuntar" variant="plain" color="neutral" title=${t.adjuntar} aria-label=${t.adjuntar}><iswc-icon icon="mdi:paperclip"></iswc-icon></iswc-button>
        <input class="archivo" type="file" multiple hidden>
        <iswc-textarea class="area" resize="auto" autosize rows="1" min-rows="1" max-rows="6" placeholder=${t.escribeMensaje} aria-label=${t.escribeMensaje}></iswc-textarea>
        <iswc-button class="b-accion" color="brand" pill title=${t.grabarNota} aria-label=${t.grabarNota}><iswc-icon icon="mdi:microphone"></iswc-icon></iswc-button>
      </div>
      <div class="grabacion" hidden role="status">
        <iswc-button class="g-cancelar" variant="plain" color="danger" title=${t.cancelarGrabacion} aria-label=${t.cancelarGrabacion}><iswc-icon icon="mdi:delete-outline"></iswc-icon></iswc-button>
        <span class="g-punto"></span>
        <span class="g-tiempo">0:00</span>
        <canvas class="g-onda" width="600" height="60"></canvas>
        <iswc-button class="g-enviar" color="brand" pill title=${t.detenerYEnviar} aria-label=${t.detenerYEnviar}><iswc-icon icon="mdi:send"></iswc-icon></iswc-button>
      </div>
      <p class="aviso" role="alert" hidden></p>
      <span class="cuenta" hidden></span>
    </div>
  `);
  const caja = root.querySelector('.compositor') as HTMLElement;
  const area = root.querySelector('.area') as Area;
  const accion = root.querySelector('.b-accion') as HTMLElement;
  const accionIcono = accion.querySelector('iswc-icon') as HTMLElement;
  const panel = root.querySelector('.panel-emojis') as HTMLElement;
  const bEmoji = root.querySelector('.b-emoji') as HTMLElement;
  const contexto = root.querySelector('.contexto') as HTMLElement;
  const adjuntos = root.querySelector('.adjuntos') as HTMLElement;
  const input = root.querySelector('.archivo') as HTMLInputElement;
  const aviso = root.querySelector('.aviso') as HTMLElement;
  const cuenta = root.querySelector('.cuenta') as HTMLElement;
  const grab = root.querySelector('.grabacion') as HTMLElement;
  const lienzo = root.querySelector('.g-onda') as HTMLCanvasElement;
  const interno = () => area.shadowRoot?.querySelector('textarea') ?? null;
  let avisoReloj: ReturnType<typeof setTimeout> | null = null;

  const avisar = (m: string) => {
    aviso.textContent = m;
    aviso.hidden = !m;
    if (avisoReloj) clearTimeout(avisoReloj);
    if (m) avisoReloj = setTimeout(() => { aviso.hidden = true; }, 5000);
  };

  const texto = () => area.value ?? '';
  const refrescarBoton = () => {
    const hayAlgo = texto().trim().length > 0 || pendientes.some((p) => !p.error) || !!estado.edicion;
    accion.dataset['modo'] = hayAlgo ? 'enviar' : 'grabar';
    accionIcono.setAttribute('icon', hayAlgo ? (estado.edicion ? 'mdi:check' : 'mdi:send') : 'mdi:microphone');
    const r = hayAlgo ? (estado.edicion ? t.guardar : t.enviar) : t.grabarNota;
    accion.setAttribute('title', r);
    accion.setAttribute('aria-label', r);
    const n = texto().length;
    cuenta.hidden = n < MAX_TEXTO - 500;
    cuenta.textContent = `${n}/${MAX_TEXTO}`;
    cuenta.dataset['excede'] = n > MAX_TEXTO ? '1' : '0';
    area.setAttribute('placeholder', pendientes.length ? t.textoOpcional : t.escribeMensaje);
  };

  const pintarAdjuntos = () => {
    adjuntos.hidden = pendientes.length === 0;
    adjuntos.replaceChildren(...pendientes.map((p) => {
      const el = document.createElement('av-chat-adjunto') as ConProps;
      el.dataset['id'] = p.id;
      el.props = { adjunto: { id: p.id, nombre: p.archivo.name, mime: p.archivo.type || 'application/octet-stream', bytes: p.archivo.size, url: p.url, ancho: null, alto: null, duracion: null, onda: [] }, modo: 'previa', error: p.error };
      return el;
    }));
    refrescarBoton();
  };

  host.agregar = (files: File[]) => {
    if (estado.deshabilitado || estado.edicion) return;
    for (const f of files) {
      const error = validarArchivo(f, t) ?? '';
      pendientes.push({ id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, archivo: f, url: error ? '' : URL.createObjectURL(f), error });
      if (error) avisar(`${f.name}: ${error}`);
    }
    pintarAdjuntos();
    area.focus();
  };
  host.enfocar = () => area.focus();

  const limpiarAdjuntos = () => {
    pendientes = [];
    pintarAdjuntos();
  };

  const escribiendo = (modo: 'texto' | 'audio' | null) => {
    const ahora = Date.now();
    if (modo && modo === 'texto' && ahora - ultimoEscribiendo < ESCRIBIENDO_CADA_MS) return;
    ultimoEscribiendo = modo ? ahora : 0;
    emitir(host, 'av-chat-escribiendo', { modo });
  };

  const enviar = () => {
    if (estado.deshabilitado) return;
    const crudo = texto();
    if (crudo.length > MAX_TEXTO) {
      avisar(t.textoLargo(MAX_TEXTO));
      return;
    }
    if (estado.edicion) {
      const nuevo = validarTexto(crudo);
      if (!nuevo) return;
      emitir(host, 'av-chat-accion', { accion: 'editar-guardar', imensaje: estado.edicion.ref, texto: nuevo });
      area.value = '';
      refrescarBoton();
      return;
    }
    const archivos = pendientes.filter((p) => !p.error).map((p) => p.archivo);
    const contenido = crudo.trim();
    if (!contenido && archivos.length === 0) return;
    emitir(host, 'av-chat-enviar', { contenido, respuesta_a: estado.respuesta?.ref ?? null, archivos });
    area.value = '';
    if (estado.chat) borradores.delete(estado.chat);
    limpiarAdjuntos();
    escribiendo(null);
    panel.hidden = true;
    bEmoji.setAttribute('aria-expanded', 'false');
    area.focus();
  };

  const cancelarContexto = () => emitir(host, 'av-chat-accion', { accion: 'cancelar' });

  /* ── nota de voz ── */
  const dibujar = () => {
    if (!grabacion) return;
    const g = lienzo.getContext('2d');
    if (!g) return;
    const datos = new Uint8Array(grabacion.an.frequencyBinCount);
    grabacion.an.getByteTimeDomainData(datos);
    let suma = 0;
    for (const x of datos) suma += (x - 128) ** 2;
    const nivel = Math.min(1, Math.sqrt(suma / datos.length) / 40);
    grabacion.muestras.push(nivel);
    const color = getComputedStyle(host).getPropertyValue('--iswc-accent').trim() || 'currentColor';
    g.clearRect(0, 0, lienzo.width, lienzo.height);
    g.fillStyle = color;
    const ultimas = grabacion.muestras.slice(-60);
    const ancho = lienzo.width / 60;
    ultimas.forEach((v, i) => {
      const h = Math.max(4, v * lienzo.height);
      g.fillRect(i * ancho + 1, (lienzo.height - h) / 2, ancho - 3, h);
    });
    (root.querySelector('.g-tiempo') as HTMLElement).textContent = duracionTexto((Date.now() - grabacion.inicio) / 1000);
  };

  const empezarGrabacion = async () => {
    if (grabacion || estado.deshabilitado) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      avisar(t.sinMicrofono);
      return;
    }
    let flujo: MediaStream;
    try {
      flujo = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      avisar(t.sinMicrofono);
      modoMantener = false;
      return;
    }
    const mime = mimeGrabacion();
    const rec = mime ? new MediaRecorder(flujo, { mimeType: mime }) : new MediaRecorder(flujo);
    const ctx = new AudioContext();
    const an = ctx.createAnalyser();
    an.fftSize = 512;
    ctx.createMediaStreamSource(flujo).connect(an);
    const trozos: Blob[] = [];
    rec.ondataavailable = (e) => {
      if (e.data.size) trozos.push(e.data);
    };
    grabacion = { rec, flujo, trozos, inicio: Date.now(), muestras: [], reloj: setInterval(dibujar, 100), ctx, an, enviar: false };
    rec.onstop = () => {
      const g = grabacion;
      grabacion = null;
      if (!g) return;
      clearInterval(g.reloj);
      for (const tr of g.flujo.getTracks()) tr.stop();
      void g.ctx.close().catch(() => undefined);
      caja.dataset['grabando'] = '0';
      grab.hidden = true;
      refrescarBoton();
      escribiendo(null);
      const duracion = (Date.now() - g.inicio) / 1000;
      if (!g.enviar || duracion < 0.6 || g.trozos.length === 0) return;
      const tipo = rec.mimeType || 'audio/webm';
      const ext = tipo.includes('mp4') ? 'm4a' : tipo.includes('ogg') ? 'ogg' : 'webm';
      const archivo = new File(g.trozos, `nota-${new Date().toISOString().replace(/[:.]/g, '-')}.${ext}`, { type: tipo });
      const n = 48;
      const pico = Math.max(0.05, ...g.muestras);
      const onda = Array.from({ length: n }, (_, i) => {
        const tramo = g.muestras.slice(Math.floor((i * g.muestras.length) / n), Math.floor(((i + 1) * g.muestras.length) / n));
        const v = tramo.length ? tramo.reduce((a, b) => a + b, 0) / tramo.length : 0;
        return Math.round((v / pico) * 100) / 100;
      });
      emitir(host, 'av-chat-enviar', { contenido: '', respuesta_a: estado.respuesta?.ref ?? null, archivos: [archivo], nota: { duracion: Math.round(duracion * 10) / 10, onda } });
    };
    rec.start(250);
    caja.dataset['grabando'] = '1';
    accionIcono.setAttribute('icon', 'mdi:send');
    accion.setAttribute('aria-label', t.detenerYEnviar);
    grab.hidden = false;
    escribiendo('audio');
  };

  const terminarGrabacion = (enviarla: boolean) => {
    if (!grabacion) return;
    grabacion.enviar = enviarla;
    if (grabacion.rec.state !== 'inactive') grabacion.rec.stop();
  };

  /* ── eventos ── */
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      enviar();
    } else if (e.key === 'Escape') {
      if (!panel.hidden) {
        panel.hidden = true;
        bEmoji.setAttribute('aria-expanded', 'false');
      } else if (estado.respuesta || estado.edicion) cancelarContexto();
      else if (pendientes.length) limpiarAdjuntos();
    }
  });
  area.addEventListener('iswc-input', () => {
    refrescarBoton();
    if (texto().trim()) escribiendo('texto');
    else if (ultimoEscribiendo) escribiendo(null);
  });
  area.addEventListener('paste', (e) => {
    const files = [...((e as ClipboardEvent).clipboardData?.files ?? [])];
    if (!files.length) return;
    e.preventDefault();
    host.agregar?.(files);
  });
  bEmoji.addEventListener('iswc-click', () => {
    panel.hidden = !panel.hidden;
    bEmoji.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
    if (!panel.hidden) (root.querySelector('#emojis') as HTMLElement).shadowRoot?.querySelector<HTMLElement>('.emoji[tabindex="0"]')?.focus();
  });
  root.querySelector('#emojis')?.addEventListener('av-chat-emoji', (e) => {
    e.stopPropagation();
    const emoji = (e as CustomEvent<{ emoji: string }>).detail.emoji;
    const ta = interno();
    const v = texto();
    const ini = ta?.selectionStart ?? v.length;
    const fin = ta?.selectionEnd ?? v.length;
    area.value = v.slice(0, ini) + emoji + v.slice(fin);
    area.focus();
    requestAnimationFrame(() => ta?.setSelectionRange(ini + emoji.length, ini + emoji.length));
    refrescarBoton();
  });
  root.querySelector('.b-adjuntar')?.addEventListener('iswc-click', () => input.click());
  input.addEventListener('change', () => {
    host.agregar?.([...(input.files ?? [])]);
    input.value = '';
  });
  adjuntos.addEventListener('av-chat-adjunto-quitar', (e) => {
    const id = (e as CustomEvent<{ id: string }>).detail.id;
    pendientes = pendientes.filter((p) => p.id !== id);
    pintarAdjuntos();
  });
  root.querySelector('.contexto-cerrar')?.addEventListener('iswc-click', cancelarContexto);
  // botón principal: enviar, o micrófono (tocar = grabar fijo; mantener = grabar y soltar envía)
  accion.addEventListener('pointerdown', (e) => {
    if (accion.dataset['modo'] !== 'grabar') return;
    e.preventDefault();
    if (grabacion) {
      // ya grababa (modo fijo): tocar de nuevo envía
      terminarGrabacion(true);
      ignorarSoltar = true;
      return;
    }
    try {
      accion.setPointerCapture(e.pointerId);
    } catch {
      /* sin captura */
    }
    modoMantener = false;
    pulsado = setTimeout(() => {
      pulsado = null;
      modoMantener = true;
      void empezarGrabacion();
    }, MANTENER_MS);
  });
  const soltar = () => {
    if (ignorarSoltar) {
      ignorarSoltar = false;
      return;
    }
    if (accion.dataset['modo'] !== 'grabar' && !grabacion) return;
    if (pulsado) {
      clearTimeout(pulsado);
      pulsado = null;
      void empezarGrabacion(); // toque corto: graba hasta enviar o cancelar
      return;
    }
    if (modoMantener) {
      modoMantener = false;
      terminarGrabacion(true);
    }
  };
  accion.addEventListener('pointerup', soltar);
  accion.addEventListener('pointercancel', () => {
    if (pulsado) clearTimeout(pulsado);
    pulsado = null;
    if (modoMantener) terminarGrabacion(false);
  });
  accion.addEventListener('click', (e) => {
    if (accion.dataset['modo'] === 'enviar') enviar();
    else if ((e as MouseEvent).detail === 0) {
      // teclado: Enter/Espacio alterna la grabación
      if (grabacion) terminarGrabacion(true);
      else void empezarGrabacion();
    }
  });
  root.querySelector('.g-cancelar')?.addEventListener('iswc-click', () => terminarGrabacion(false));
  root.querySelector('.g-enviar')?.addEventListener('iswc-click', () => terminarGrabacion(true));

  const aplicar = (p: AvChatCompositorProps, previo: AvChatCompositorProps | null) => {
    estado = p;
    if (previo && previo.chat !== p.chat) {
      if (previo.chat) borradores.set(previo.chat, previo.edicion ? '' : texto());
      area.value = (p.chat && borradores.get(p.chat)) || '';
      limpiarAdjuntos();
      terminarGrabacion(false);
      panel.hidden = true;
      escribiendo(null);
    }
    const ctx = p.edicion ? { titulo: t.editando, texto: p.edicion.texto, color: 0, icono: 'mdi:pencil-outline' } : p.respuesta ? { titulo: `${t.respondiendoA} ${p.respuesta.autor}`, texto: p.respuesta.texto, color: p.respuesta.color, icono: 'mdi:reply' } : null;
    contexto.hidden = !ctx;
    if (ctx) {
      (contexto.querySelector('strong') as HTMLElement).textContent = ctx.titulo;
      (contexto.querySelector('span') as HTMLElement).textContent = ctx.texto;
      (contexto.querySelector('.contexto-texto') as HTMLElement).dataset['color'] = String(ctx.color);
      (contexto.querySelector('.contexto-icono') as HTMLElement).setAttribute('icon', ctx.icono);
    }
    if (p.edicion && previo?.edicion?.ref !== p.edicion.ref) {
      area.value = p.edicion.texto;
      area.focus();
    }
    if (!p.edicion && previo?.edicion) area.value = '';
    if (p.respuesta && previo?.respuesta?.ref !== p.respuesta.ref) area.focus();
    area.toggleAttribute('disabled', p.deshabilitado);
    for (const b of root.querySelectorAll('.barra iswc-button')) b.toggleAttribute('disabled', p.deshabilitado);
    caja.dataset['deshabilitado'] = p.deshabilitado ? '1' : '0';
    if (p.deshabilitado && p.motivo) {
      aviso.textContent = p.motivo;
      aviso.hidden = false;
    } else if (previo?.deshabilitado) aviso.hidden = true;
    refrescarBoton();
  };
  aplicar(props, null);
  (host as Host & { __aplicar?: typeof aplicar }).__aplicar = aplicar;
}

const AvChatCompositor = crearComponente<AvChatCompositorProps>(
  import.meta.url,
  'av-chat-compositor',
  { chat: null, respuesta: null, edicion: null, deshabilitado: false, motivo: '' },
  (root, props, host) => montar(root, props, host as Host),
  (_root, props, previos, host) => {
    const fn = (host as Host & { __aplicar?: (p: AvChatCompositorProps, q: AvChatCompositorProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-compositor', AvChatCompositor);
