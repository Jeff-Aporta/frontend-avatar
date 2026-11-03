/**
 * emojis.ts — categorías del selector, catálogo completo y recientes del usuario (localStorage con try/catch). El
 * catálogo no vive aquí: se genera con `deno task embeddings` en `assets/ia/emojis-catalogo.json` y se carga una vez al
 * abrir el selector, para no engordar este módulo.
 */
import { vectorLocal } from '../core/ia-local.js';
import { calibracionDe } from '../core/calibracion.js';
import { cargarAplanado, ordenarAplanado } from '../core/semantica.js';
import { normalizar } from './formato.js';

export type Emoji = { e: string; k: string };
export type CategoriaEmoji = { id: string; nombre: string; icono: string };
/** Emojis de cada categoría, por id. */
export type CatalogoEmojis = Record<string, Emoji[]>;

export const CATEGORIAS_EMOJI: CategoriaEmoji[] = [
  { id: 'caras', nombre: 'Caras', icono: 'mdi:emoticon-happy-outline' },
  { id: 'gestos', nombre: 'Gestos', icono: 'mdi:hand-wave-outline' },
  { id: 'corazones', nombre: 'Corazones', icono: 'mdi:heart-outline' },
  { id: 'naturaleza', nombre: 'Naturaleza', icono: 'mdi:paw' },
  { id: 'comida', nombre: 'Comida', icono: 'mdi:food-apple-outline' },
  { id: 'actividades', nombre: 'Actividades', icono: 'mdi:soccer' },
  { id: 'viajes', nombre: 'Viajes', icono: 'mdi:airplane' },
  { id: 'objetos', nombre: 'Objetos', icono: 'mdi:lightbulb-outline' },
  { id: 'simbolos', nombre: 'Símbolos', icono: 'mdi:check-circle-outline' },
];

let catalogo: Promise<CatalogoEmojis> | null = null;
let listos: Emoji[] = [];

/** Carga el catálogo una vez; si falla se puede reintentar al volver a abrir. */
export function cargarCatalogoEmojis(): Promise<CatalogoEmojis> {
  catalogo ??= fetch(new URL('assets/ia/emojis-catalogo.json', document.baseURI), { signal: AbortSignal.timeout(15000) }).then((r) => {
    if (!r.ok) throw new Error(`catálogo de emojis: ${r.status}`);
    return r.json() as Promise<CatalogoEmojis>;
  }).then((c) => {
    listos = Object.values(c).flat();
    return c;
  }).catch((e) => {
    catalogo = null;
    throw e;
  });
  return catalogo;
}

/** Todo el catálogo cargado con lo que coincide primero: buscar ordena, no oculta. */
export function ordenarEmojis(q: string): Emoji[] {
  const t = normalizar(q.trim());
  return [...listos.filter((e) => normalizar(e.k).includes(t)), ...listos.filter((e) => !normalizar(e.k).includes(t))];
}

/** Todo el catálogo por significado («comida italiana» → 🍝🍕). Null si el modelo no está o el usuario lo dejó para después. */
export async function ordenarEmojisPorSentido(q: string): Promise<Emoji[] | null> {
  const [corpus, vector] = await Promise.all([cargarAplanado('emojis', document.baseURI), vectorLocal(q)]);
  return vector ? conClaves(ordenarAplanado(corpus, q, vector, calibracionDe('emojis').orden)) : null;
}

/** Todo el catálogo por palabra tolerante (errores de tecleo, prefijos, español e inglés): no espera ni pide el modelo. */
export async function ordenarEmojisTolerante(q: string): Promise<Emoji[]> {
  const corpus = await cargarAplanado('emojis', document.baseURI);
  return conClaves(ordenarAplanado(corpus, q, null, calibracionDe('emojis').orden));
}

const conClaves = (r: { item: { id: string } }[]): Emoji[] => {
  const claves = new Map(listos.map((e) => [e.e, e.k]));
  return r.map((x) => ({ e: x.item.id, k: claves.get(x.item.id) ?? '' }));
};

const CLAVE_RECIENTES = 'av-chat:emojis-recientes';

export function recientes(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_RECIENTES) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 24) : [];
  } catch {
    return [];
  }
}

export function usarEmoji(e: string): void {
  try {
    localStorage.setItem(CLAVE_RECIENTES, JSON.stringify([e, ...recientes().filter((x) => x !== e)].slice(0, 24)));
  } catch {
    /* sin almacenamiento */
  }
}
