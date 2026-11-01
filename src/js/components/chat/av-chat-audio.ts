/**
 * <av-chat-audio> — reproductor de notas de voz (W-CHAT-21): reproducir/pausar, onda tocable como barra de avance
 * (también con flechas del teclado), tiempo y velocidad 1× / 1.5× / 2×. Solo un audio suena a la vez en la página.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvChatAudioProps } from '../../consts/schemas/chat.schemas.js';
import { duracionTexto } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';

const BARRAS = 36;
const VELOCIDADES = [1, 1.5, 2];
let sonando: HTMLAudioElement | null = null;

/** Onda de `n` barras: la grabada (re-muestreada) o una estable derivada de la url. */
export function ondaDe(onda: number[], n = BARRAS, semilla = ''): number[] {
  if (onda.length) return Array.from({ length: n }, (_, i) => Math.max(0.12, Math.min(1, onda[Math.floor((i * onda.length) / n)] ?? 0.2)));
  let h = 7;
  for (const c of semilla) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return 0.2 + ((h >>> 8) % 1000) / 1250;
  });
}

const AvChatAudio = crearComponente<AvChatAudioProps>(import.meta.url, 'av-chat-audio', { url: '', duracion: null, onda: [], propio: false }, (root, props) => {
  const t = textos();
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.src = props.url;
  let velocidad = 0;
  const total = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : props.duracion ?? 0);
  const barras = ondaDe(props.onda, BARRAS, props.url.slice(-64));
  root.append(html`
    <div class="audio" part="audio" data-propio=${props.propio ? '1' : '0'}>
      <iswc-button class="play" variant="soft compact" color="brand" pill title=${t.reproducir} aria-label=${t.reproducir}><iswc-icon icon="mdi:play"></iswc-icon></iswc-button>
      <div class="pista">
        <div class="onda" role="slider" tabindex="0" aria-label=${t.notaDeVoz} aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          ${barras.map((b) => html`<span class="barra" style=${`--h:${b.toFixed(2)}`}></span>`)}
        </div>
        <span class="tiempos"><span class="tiempo">${duracionTexto(props.duracion ?? 0)}</span></span>
      </div>
      <iswc-button class="velocidad" variant="outlined compact" color="neutral" shape="pill" title=${t.velocidad}>1×</iswc-button>
      <iswc-icon class="mic" icon="mdi:microphone"></iswc-icon>
    </div>
  `);
  const caja = root.querySelector('.audio') as HTMLElement;
  const boton = root.querySelector('.play') as HTMLElement;
  const icono = boton.querySelector('iswc-icon') as HTMLElement;
  const onda = root.querySelector('.onda') as HTMLElement;
  const tiempo = root.querySelector('.tiempo') as HTMLElement;
  const vel = root.querySelector('.velocidad') as HTMLElement;
  const listaBarras = [...root.querySelectorAll<HTMLElement>('.barra')];
  const pintar = () => {
    const d = total();
    const f = d ? Math.min(1, audio.currentTime / d) : 0;
    listaBarras.forEach((b, i) => b.toggleAttribute('data-on', (i + 0.5) / listaBarras.length <= f));
    onda.setAttribute('aria-valuenow', String(Math.round(f * 100)));
    tiempo.textContent = duracionTexto(audio.paused && audio.currentTime === 0 ? d : audio.currentTime);
  };
  const alternar = () => {
    if (audio.paused) {
      if (sonando && sonando !== audio) sonando.pause();
      sonando = audio;
      void audio.play().catch(() => undefined);
    } else audio.pause();
  };
  const ir = (f: number) => {
    const d = total();
    if (!d) return;
    audio.currentTime = Math.max(0, Math.min(d, f * d));
    pintar();
  };
  boton.addEventListener('iswc-click', alternar);
  audio.addEventListener('play', () => {
    caja.dataset['sonando'] = '1';
    icono.setAttribute('icon', 'mdi:pause');
    boton.setAttribute('aria-label', t.pausar);
  });
  audio.addEventListener('pause', () => {
    caja.dataset['sonando'] = '0';
    icono.setAttribute('icon', 'mdi:play');
    boton.setAttribute('aria-label', t.reproducir);
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    pintar();
  });
  audio.addEventListener('timeupdate', pintar);
  audio.addEventListener('loadedmetadata', pintar);
  onda.addEventListener('click', (e) => {
    const r = onda.getBoundingClientRect();
    ir((e.clientX - r.left) / r.width);
  });
  onda.addEventListener('keydown', (e) => {
    const d = total();
    if (!d) return;
    if (e.key === 'ArrowRight') ir((audio.currentTime + 5) / d);
    else if (e.key === 'ArrowLeft') ir((audio.currentTime - 5) / d);
    else if (e.key === ' ' || e.key === 'Enter') alternar();
    else return;
    e.preventDefault();
  });
  vel.addEventListener('iswc-click', () => {
    velocidad = (velocidad + 1) % VELOCIDADES.length;
    audio.playbackRate = VELOCIDADES[velocidad]!;
    vel.textContent = `${VELOCIDADES[velocidad]}×`;
    vel.setAttribute('color', velocidad ? 'brand' : 'neutral');
  });
  pintar();
});

define('av-chat-audio', AvChatAudio);
