/**
 * temas.ts — temas por chat, como en Messenger: colores y degradados predefinidos o propios. El tema es del chat, no del
 * usuario: lo cambia cualquier integrante y lo ven todos. Se aplica con variables CSS sobre `<av-chat>`; el texto de la
 * burbuja propia sale de la luminosidad oklch del tema (mismo criterio que `bg2font` del kit).
 */
import type { TemaChat } from './tipos.js';

export type TemaPredefinido = { id: string; nombre: string; color1: string; color2: string; angulo: number };

export const TEMAS: readonly TemaPredefinido[] = [
  { id: 'oceano', nombre: 'Océano', color1: '#0077b6', color2: '#00b4d8', angulo: 135 },
  { id: 'atardecer', nombre: 'Atardecer', color1: '#ff5f6d', color2: '#ffc371', angulo: 135 },
  { id: 'selva', nombre: 'Selva', color1: '#11998e', color2: '#38ef7d', angulo: 135 },
  { id: 'uva', nombre: 'Uva', color1: '#7928ca', color2: '#ff0080', angulo: 135 },
  { id: 'cereza', nombre: 'Cereza', color1: '#b20a2c', color2: '#eb3349', angulo: 160 },
  { id: 'neon', nombre: 'Neón', color1: '#00f5a0', color2: '#00d9f5', angulo: 90 },
  { id: 'oro', nombre: 'Oro', color1: '#b8860b', color2: '#f7c948', angulo: 135 },
  { id: 'medianoche', nombre: 'Medianoche', color1: '#141e30', color2: '#3a4f7a', angulo: 160 },
  { id: 'algodon', nombre: 'Algodón', color1: '#a18cd1', color2: '#fbc2eb', angulo: 135 },
  { id: 'lavanda', nombre: 'Lavanda', color1: '#5f2c82', color2: '#a770ef', angulo: 135 },
  { id: 'coral', nombre: 'Coral', color1: '#ee5253', color2: '#ff9f80', angulo: 90 },
  { id: 'grafito', nombre: 'Grafito', color1: '#232526', color2: '#5a6068', angulo: 135 },
];

/** Variables que puede fijar un tema: se limpian al volver al de la app. */
export const VARS_TEMA = ['--chat-propia', '--chat-propia-texto', '--chat-fondo', '--iswc-accent'] as const;

/** Degradado de un tema. */
export const degradado = (t: { color1: string; color2: string; angulo: number }): string => `linear-gradient(${t.angulo}deg, ${t.color1}, ${t.color2})`;

/** Colores efectivos de un tema (predefinido por id o propio), o `null` si no aplica ninguno. */
export function coloresDe(tema: TemaChat | null | undefined): TemaPredefinido | null {
  if (!tema) return null;
  const base = TEMAS.find((t) => t.id === tema.id);
  if (base) return base;
  if (!tema.color1) return null;
  return { id: 'propio', nombre: 'Propio', color1: tema.color1, color2: tema.color2 ?? tema.color1, angulo: tema.angulo ?? 135 };
}

/** Variables CSS del tema; vacío si es el de la app. */
export function varsDeTema(tema: TemaChat | null | undefined): Partial<Record<(typeof VARS_TEMA)[number], string>> {
  const c = coloresDe(tema);
  if (!c) return {};
  const medio = `color-mix(in srgb, ${c.color1}, ${c.color2})`;
  return {
    '--chat-propia': degradado(c),
    '--chat-propia-texto': `oklch(from ${medio} clamp(0, calc((0.65 - l) * 1000), 1) 0 0)`,
    '--chat-fondo': tema?.fondo ?? `color-mix(in srgb, ${c.color1} 7%, var(--iswc-bg))`,
    '--iswc-accent': c.color1,
  };
}
