/**
 * reporte.ts — lo que un reporte de error lleva además del texto: el HTML de la página (con el contenido de los shadow roots y sin
 * secretos), el contexto del navegador, capturas de pantalla y notas de voz. El envío va por el plugin `errores` de `core/api.ts`.
 */
import { reportes } from './api.js';
import { leerBitacora } from './bitacora.js';
import { empresaActiva, estado } from './estado.js';

const MAX_HTML = 400 * 1024;
const JWT = /eyJ[\w-]+\.[\w-]+\.[\w-]+/g;
const SIN_CONTENIDO = new Set(['script', 'style', 'noscript', 'iswc-icon']);
const SIN_CIERRE = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
/** Muestreo de las notas de voz: suficiente para la voz y mucho más liviano. */
const HZ_VOZ = 16000;

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Atributos de un elemento, sin lo que nunca debe salir de la página. */
function atributos(el: Element): string {
  const secreto = el.getAttribute('type') === 'password' || /codigo|clave|pass|token|pin/i.test(el.id);
  let out = '';
  for (const a of el.attributes) {
    if (a.name === 'value' && secreto) continue;
    if (a.name === 'style' && a.value.length > 200) continue;
    out += ` ${a.name}="${escapar(a.value.slice(0, 500))}"`;
  }
  return out;
}

/** HTML de un nodo con sus shadow roots abiertos, hasta agotar el presupuesto. */
function serializar(n: Node, presupuesto: { queda: number }): string {
  if (presupuesto.queda <= 0) return '';
  let out = '';
  if (n.nodeType === Node.TEXT_NODE) out = escapar(n.textContent?.trim().slice(0, 400) ?? '');
  else if (n.nodeType === Node.ELEMENT_NODE) {
    const el = n as Element;
    const tag = el.localName;
    if (SIN_CONTENIDO.has(tag)) out = `<${tag}${atributos(el)}></${tag}>`;
    else if (SIN_CIERRE.has(tag)) out = `<${tag}${atributos(el)}>`;
    else {
      presupuesto.queda -= tag.length * 2 + 5;
      const sombra = el.shadowRoot ? `<template shadowrootmode="open">${hijos(el.shadowRoot, presupuesto)}</template>` : '';
      out = `<${tag}${atributos(el)}>${sombra}${hijos(el, presupuesto)}</${tag}>`;
      return out;
    }
  }
  presupuesto.queda -= out.length;
  return out;
}

const hijos = (n: Node, presupuesto: { queda: number }): string => [...n.childNodes].map((h) => serializar(h, presupuesto)).join('');

/** HTML actual de la página, sin scripts, estilos, contraseñas ni tokens. */
export function capturarHtml(): string {
  return serializar(document.body, { queda: MAX_HTML }).replace(JWT, '[token]');
}

/** Estado del navegador y de la app en el momento del reporte. Sin tokens. */
export function capturarContexto(): Record<string, unknown> {
  const raiz = document.documentElement;
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const red = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType ?? null;
  return {
    vista: raiz.dataset['vista'] ?? null,
    usuario: estado.yo?.iusuario ?? null,
    empresa: empresaActiva(),
    tema: raiz.dataset['theme'] ?? null,
    paleta: raiz.dataset['palette'] ?? null,
    pantalla: { ancho: innerWidth, alto: innerHeight, escala: devicePixelRatio },
    navegador: navigator.userAgent,
    idioma: navigator.language,
    enLinea: navigator.onLine,
    red,
    cargaMs: nav ? Math.round(nav.loadEventEnd) : null,
    errores: leerBitacora(),
  };
}

/** ¿El navegador puede capturar la pantalla? En móvil normalmente no: ahí se adjunta una imagen. */
export const puedeCapturar = (): boolean => Boolean(navigator.mediaDevices?.getDisplayMedia);

/** Un cuadro de la pantalla que la persona elija, como PNG. */
export async function capturarPantalla(): Promise<File> {
  const flujo = await navigator.mediaDevices.getDisplayMedia({ video: true });
  try {
    const video = document.createElement('video');
    video.srcObject = flujo;
    video.muted = true;
    await video.play();
    await new Promise((listo) => setTimeout(listo, 250));
    const lienzo = document.createElement('canvas');
    lienzo.width = video.videoWidth;
    lienzo.height = video.videoHeight;
    lienzo.getContext('2d')!.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((listo) => lienzo.toBlob(listo, 'image/png'));
    if (!blob) throw new Error('No se pudo capturar la pantalla');
    return new File([blob], 'captura.png', { type: 'image/png' });
  } finally {
    flujo.getTracks().forEach((t) => t.stop());
  }
}

/** Audio a WAV de 16 kHz mono: el formato que acepta cualquier servicio de transcripción (el `webm` de Chrome no siempre). */
async function aWav(original: Blob): Promise<File> {
  const contexto = new AudioContext();
  try {
    const decodificado = await contexto.decodeAudioData(await original.arrayBuffer());
    const fuera = new OfflineAudioContext(1, Math.ceil(decodificado.duration * HZ_VOZ), HZ_VOZ);
    const fuente = fuera.createBufferSource();
    fuente.buffer = decodificado;
    fuente.connect(fuera.destination);
    fuente.start();
    const muestras = (await fuera.startRendering()).getChannelData(0);
    const datos = new DataView(new ArrayBuffer(44 + muestras.length * 2));
    const ascii = (pos: number, t: string) => [...t].forEach((c, i) => datos.setUint8(pos + i, c.charCodeAt(0)));
    ascii(0, 'RIFF');
    datos.setUint32(4, 36 + muestras.length * 2, true);
    ascii(8, 'WAVEfmt ');
    datos.setUint32(16, 16, true);
    datos.setUint16(20, 1, true);
    datos.setUint16(22, 1, true);
    datos.setUint32(24, HZ_VOZ, true);
    datos.setUint32(28, HZ_VOZ * 2, true);
    datos.setUint16(32, 2, true);
    datos.setUint16(34, 16, true);
    ascii(36, 'data');
    datos.setUint32(40, muestras.length * 2, true);
    muestras.forEach((m, i) => datos.setInt16(44 + i * 2, Math.max(-1, Math.min(1, m)) * 0x7fff, true));
    return new File([datos.buffer], 'nota-de-voz.wav', { type: 'audio/wav' });
  } finally {
    void contexto.close();
  }
}

/** Empieza a grabar; lo devuelto termina la grabación y da el archivo. */
export async function grabarVoz(): Promise<() => Promise<File>> {
  const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
  const grabadora = new MediaRecorder(flujo);
  const trozos: Blob[] = [];
  grabadora.ondataavailable = (e) => trozos.push(e.data);
  grabadora.start();
  return () => new Promise((listo, mal) => {
    grabadora.onstop = () => {
      flujo.getTracks().forEach((t) => t.stop());
      const blob = new Blob(trozos, { type: grabadora.mimeType });
      // si no se puede convertir, va el original: en el API se conserva para el agente
      aWav(blob).then(listo).catch(() => listo(new File([blob], 'nota-de-voz.webm', { type: blob.type || 'audio/webm' }))).catch(mal);
    };
    grabadora.stop();
  });
}

export type Enviado = { ierror: number; token: string; estado: string };

/** Manda el reporte: la fila con todo el contexto y luego cada adjunto. */
export async function enviarReporte(descripcion: string, adjuntos: File[], codigo: string): Promise<Enviado> {
  const api = reportes();
  const creado = await api['reportarError']!({
    descripcion,
    ruta: location.pathname,
    url: location.href,
    html: capturarHtml(),
    contexto: capturarContexto(),
    apporigin: 'avatar-front',
    adjuntos: adjuntos.length,
    ...(codigo ? { codigo } : {}),
  }) as Enviado;
  for (const a of adjuntos) await api['adjuntarError']!(creado.ierror, creado.token, a, a.name);
  if (adjuntos.length) await api['errorListo']!(creado.ierror, creado.token);
  return { ...creado, estado: 'pendiente' };
}

/** Estado y bitácora de lo que el agente lleva hecho. */
export function seguimiento(r: Enviado): Promise<{ estado: string; avance: { fh: string; texto: string }[] }> {
  return reportes()['seguimientoError']!(r.ierror, r.token) as Promise<{ estado: string; avance: { fh: string; texto: string }[] }>;
}
