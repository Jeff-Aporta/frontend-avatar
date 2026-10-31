/**
 * <av-chat-llamada> — la llamada en curso (W-CHAT-36/37/44): entrante (aceptar / rechazar), saliente («Llamando…»)
 * y activa: mosaico de participantes (video o foto) con quién habla resaltado, vista previa propia, duración y
 * controles (silenciar, cámara, compartir pantalla, pasar a video, colgar).
 *
 * Los flujos de medios no viajan en `props` (no son datos): el shell los deja en las propiedades `flujos`
 * (`Map<front, MediaStream>`) y `local`, y sube `rev`. Las fichas se reconcilian por front: un video que ya suena no
 * se reinicia al cambiar el estado. Emite `av-chat-llamada-accion { accion }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatLlamadaProps } from '../../consts/schemas/chat.schemas.js';
import { duracionTexto } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

type Host = HTMLElement & { flujos?: Map<string, MediaStream>; local?: MediaStream | null; pantallaLocal?: MediaStream | null; __reloj?: ReturnType<typeof setInterval> };

function asignar(video: HTMLVideoElement, flujo: MediaStream | null | undefined): void {
  if (video.srcObject !== (flujo ?? null)) {
    video.srcObject = flujo ?? null;
    if (flujo) void video.play().catch(() => undefined);
  }
}

function montar(root: ShadowRoot, inicial: AvChatLlamadaProps, hostEl: HTMLElement) {
  const host = hostEl as Host;
  const t = textos();
  const accion = (a: string) => emitir(host, 'av-chat-llamada-accion', { accion: a });
  root.append(html`
    <div class="capa" part="capa" hidden>
      <div class="tarjeta" role="dialog" aria-modal="true">
        <div class="aviso-llamada"><span class="foto" data-color="0"><iswc-avatar class="avatar" initials=""></iswc-avatar><span class="onda"></span><span class="onda dos"></span></span>
          <strong class="quien"></strong><span class="que"></span></div>
        <div class="mosaico" aria-live="polite"></div>
        <video class="propio" muted playsinline autoplay></video>
        <p class="aviso" role="status" hidden></p>
        <div class="controles">
          <iswc-button class="c-rechazar" color="danger" pill title=${t.rechazar} aria-label=${t.rechazar}><iswc-icon icon="mdi:phone-hangup"></iswc-icon></iswc-button>
          <iswc-button class="c-aceptar" color="success" pill title=${t.aceptar} aria-label=${t.aceptar}><iswc-icon icon="mdi:phone"></iswc-icon></iswc-button>
          <iswc-button class="c-mic" variant="soft" color="neutral" pill></iswc-button>
          <iswc-button class="c-cam" variant="soft" color="neutral" pill></iswc-button>
          <iswc-button class="c-pantalla" variant="soft" color="neutral" pill></iswc-button>
          <iswc-button class="c-video" variant="soft" color="neutral" pill title=${t.cambiarAVideo} aria-label=${t.cambiarAVideo}><iswc-icon icon="mdi:video-plus-outline"></iswc-icon></iswc-button>
          <iswc-button class="c-colgar" color="danger" pill title=${t.colgar} aria-label=${t.colgar}><iswc-icon icon="mdi:phone-hangup"></iswc-icon></iswc-button>
        </div>
      </div>
    </div>
  `);
  const capa = root.querySelector('.capa') as HTMLElement;
  const mosaico = root.querySelector('.mosaico') as HTMLElement;
  const propio = root.querySelector('.propio') as HTMLVideoElement;
  const que = root.querySelector('.que') as HTMLElement;
  const boton = (sel: string, on: boolean, iconoOn: string, iconoOff: string, rotOn: string, rotOff: string) => {
    const b = root.querySelector(sel) as HTMLElement;
    b.replaceChildren(Object.assign(document.createElement('iswc-icon'), {}));
    b.firstElementChild!.setAttribute('icon', on ? iconoOn : iconoOff);
    b.setAttribute('title', on ? rotOn : rotOff);
    b.setAttribute('aria-label', on ? rotOn : rotOff);
    b.setAttribute('aria-pressed', String(!on));
    b.setAttribute('color', on ? 'neutral' : 'danger');
  };
  for (const [sel, a] of [['.c-rechazar', 'rechazar'], ['.c-aceptar', 'aceptar'], ['.c-mic', 'mic'], ['.c-cam', 'cam'], ['.c-pantalla', 'pantalla'], ['.c-video', 'video'], ['.c-colgar', 'colgar']] as const) {
    root.querySelector(sel)?.addEventListener('iswc-click', () => accion(a));
  }
  capa.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') accion(capa.dataset['fase'] === 'entrante' ? 'rechazar' : 'colgar');
  });

  const aplicar = (p: AvChatLlamadaProps) => {
    capa.hidden = !p.fase;
    if (!p.fase) {
      mosaico.replaceChildren();
      asignar(propio, null);
      if (host.__reloj) clearInterval(host.__reloj);
      host.__reloj = undefined;
      return;
    }
    capa.dataset['fase'] = p.fase;
    capa.dataset['medio'] = p.medio;
    const foto = root.querySelector('.foto') as HTMLElement;
    foto.dataset['color'] = String(p.color);
    (root.querySelector('.avatar') as HTMLElement).setAttribute('initials', p.iniciales);
    (root.querySelector('.quien') as HTMLElement).textContent = p.fase === 'entrante' ? p.de : p.chatNombre;
    const pintarQue = () => {
      que.textContent = p.fase === 'entrante'
        ? (p.medio === 'video' ? t.videollamadaEntrante : t.llamadaEntrante)
        : p.fase === 'saliente' ? t.llamando
        : duracionTexto(p.inicio ? (Date.now() - p.inicio) / 1000 : 0);
    };
    pintarQue();
    if (host.__reloj) clearInterval(host.__reloj);
    host.__reloj = p.fase === 'activa' ? setInterval(pintarQue, 1000) : undefined;
    const aviso = root.querySelector('.aviso') as HTMLElement;
    aviso.hidden = !p.aviso;
    aviso.textContent = p.aviso;
    boton('.c-mic', p.mic, 'mdi:microphone', 'mdi:microphone-off', t.silenciarMic, t.activarMic);
    boton('.c-cam', p.cam, 'mdi:video', 'mdi:video-off', t.apagarCamara, t.encenderCamara);
    const pant = root.querySelector('.c-pantalla') as HTMLElement;
    boton('.c-pantalla', true, p.pantalla ? 'mdi:monitor-off' : 'mdi:monitor-share', '', p.pantalla ? t.dejarDeCompartir : t.compartirPantalla, '');
    pant.setAttribute('color', p.pantalla ? 'brand' : 'neutral');
    root.querySelector('.c-video')?.toggleAttribute('hidden', p.medio === 'video' || p.fase !== 'activa');
    root.querySelector('.c-cam')?.toggleAttribute('hidden', p.medio !== 'video' || p.fase === 'entrante');
    root.querySelector('.c-pantalla')?.toggleAttribute('hidden', p.fase !== 'activa' || !navigator.mediaDevices?.getDisplayMedia);
    root.querySelector('.c-aceptar')?.toggleAttribute('hidden', p.fase !== 'entrante');
    root.querySelector('.c-rechazar')?.toggleAttribute('hidden', p.fase !== 'entrante');
    root.querySelector('.c-mic')?.toggleAttribute('hidden', p.fase === 'entrante');
    root.querySelector('.c-colgar')?.toggleAttribute('hidden', p.fase === 'entrante');
    // vista previa propia
    propio.hidden = p.fase === 'entrante' || !(p.cam || p.pantalla);
    asignar(propio, p.pantalla ? host.pantallaLocal ?? host.local : host.local);
    propio.dataset['hablando'] = p.hablando ? '1' : '0';
    // fichas reconciliadas por front
    const existentes = new Map<string, HTMLElement>();
    for (const n of [...mosaico.children] as HTMLElement[]) existentes.set(n.dataset['front'] ?? '', n);
    mosaico.dataset['n'] = String(Math.min(6, p.participantes.length));
    p.participantes.forEach((pa, i) => {
      let ficha = existentes.get(pa.front);
      existentes.delete(pa.front);
      if (!ficha) {
        ficha = document.createElement('div');
        ficha.className = 'ficha';
        ficha.dataset['front'] = pa.front;
        ficha.append(html`<video playsinline autoplay></video><span class="foto" data-color="0"><iswc-avatar initials=""></iswc-avatar></span><span class="nombre"></span>`);
      }
      ficha.dataset['video'] = pa.video ? '1' : '0';
      ficha.dataset['hablando'] = pa.hablando ? '1' : '0';
      ficha.dataset['conectado'] = pa.conectado ? '1' : '0';
      (ficha.querySelector('.foto') as HTMLElement).dataset['color'] = String(pa.color);
      ficha.querySelector('iswc-avatar')?.setAttribute('initials', pa.iniciales);
      (ficha.querySelector('.nombre') as HTMLElement).textContent = pa.nombre;
      asignar(ficha.querySelector('video') as HTMLVideoElement, host.flujos?.get(pa.front));
      if (mosaico.children[i] !== ficha) mosaico.insertBefore(ficha, mosaico.children[i] ?? null);
    });
    for (const n of existentes.values()) n.remove();
    if (p.fase !== 'activa') requestAnimationFrame(() => (root.querySelector(p.fase === 'entrante' ? '.c-aceptar' : '.c-colgar') as HTMLElement | null)?.focus());
  };
  aplicar(inicial);
  return aplicar;
}

const AvChatLlamada = crearComponente<AvChatLlamadaProps>(
  import.meta.url,
  'av-chat-llamada',
  { fase: null, medio: 'voz', chatNombre: '', de: '', iniciales: '', color: 0, participantes: [], inicio: null, mic: true, cam: false, pantalla: false, hablando: false, aviso: '', rev: 0 },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, _previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatLlamadaProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props);
    return true;
  },
);

define('av-chat-llamada', AvChatLlamada);
