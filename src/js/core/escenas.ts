/**
 * escenas.ts — composiciones de ilustraciones Corporate Memphis (sin DOM). Cada escena es una lista de capas: piezas
 * WebP de `assets/img/memphis/` (personajes y objetos, de la hoja de vida y generadas para Avatar) y formas
 * geométricas que se pintan con CSS en los colores de la paleta activa. Coordenadas en % del lienzo; tamaños en %
 * de su ancho; `anim` elige el movimiento suave (flotar, mecer, girar o latir) y `retraso` lo desfasa.
 */

export type Animacion = 'flotar' | 'mecer' | 'girar' | 'latir' | 'ninguna';
export type FormaColor = 'acento' | 'contraste' | 'marca' | 'suave';
export type Forma = 'circulo' | 'triangulo' | 'anillo' | 'zigzag' | 'puntos';
export type CapaPieza = { tipo: 'pieza'; pieza: string; x: number; y: number; ancho: number; z?: number; anim?: Animacion; retraso?: number; giro?: number };
export type CapaForma = { tipo: 'forma'; forma: Forma; color: FormaColor; x: number; y: number; ancho: number; z?: number; anim?: Animacion; retraso?: number; giro?: number };
export type Capa = CapaPieza | CapaForma;
export type Escena = { proporcion: number; capas: Capa[] };

/** Formas de fondo comunes; `n` las desplaza un poco para que cada escena no se vea calcada. */
const formas = (n: number): Capa[] => [
  { tipo: 'forma', forma: 'circulo', color: 'acento', x: 8 + n, y: 14, ancho: 9, anim: 'flotar', retraso: 0.4 },
  { tipo: 'forma', forma: 'triangulo', color: 'contraste', x: 86, y: 10 + n, ancho: 8, anim: 'girar', giro: 12 },
  { tipo: 'forma', forma: 'anillo', color: 'marca', x: 82 - n, y: 80, ancho: 11, anim: 'latir', retraso: 1.2 },
  { tipo: 'forma', forma: 'zigzag', color: 'acento', x: 10, y: 74 - n, ancho: 14, anim: 'mecer', retraso: 0.8 },
  { tipo: 'forma', forma: 'puntos', color: 'suave', x: 62, y: 6, ancho: 16, anim: 'ninguna' },
];

const pieza = (p: string, x: number, y: number, ancho: number, extra: Partial<CapaPieza> = {}): CapaPieza => ({ tipo: 'pieza', pieza: p, x, y, ancho, z: 2, ...extra });

/** Escenas por nombre. `bienvenida` es la del hero; las de módulo acompañan cabeceras, acceso y estados vacíos. */
export const ESCENAS: Record<string, Escena> = {
  bienvenida: {
    proporcion: 1.05,
    capas: [...formas(0), pieza('equipo', 50, 56, 64), pieza('globo-1', 18, 22, 26, { z: 3, anim: 'flotar' }), pieza('cohete', 86, 32, 11, { z: 3, anim: 'flotar', retraso: 0.6, giro: 18 }), pieza('avion', 74, 12, 18, { z: 1, anim: 'mecer', retraso: 1 })],
  },
  acceso: {
    proporcion: 0.95,
    capas: [...formas(3), pieza('saludo', 46, 58, 50), pieza('globo-2', 80, 24, 20, { z: 3, anim: 'flotar' }), pieza('nube', 18, 26, 22, { z: 1, anim: 'mecer', retraso: 0.7 })],
  },
  chat: { proporcion: 1, capas: [...formas(2), pieza('chat', 50, 54, 70), pieza('globo-2', 84, 20, 16, { z: 3, anim: 'flotar' })] },
  canales: { proporcion: 1, capas: [...formas(1), pieza('chat', 50, 54, 70), pieza('globo-1', 16, 18, 22, { z: 3, anim: 'flotar' })] },
  asistente: { proporcion: 1, capas: [...formas(1), pieza('robot', 48, 54, 34, { anim: 'flotar' }), pieza('globo-1', 78, 22, 28, { z: 3, anim: 'mecer' })] },
  proyectos: { proporcion: 1.1, capas: [...formas(4), pieza('kanban', 50, 54, 68), pieza('estrella', 86, 16, 10, { z: 3, anim: 'girar' })] },
  crm: { proporcion: 1, capas: [...formas(2), pieza('videollamada', 50, 54, 66), pieza('linea', 16, 20, 22, { z: 3, anim: 'flotar' })] },
  finanzas: { proporcion: 1, capas: [...formas(3), pieza('finanzas', 52, 54, 64), pieza('barras', 14, 22, 18, { z: 3, anim: 'latir' })] },
  inventario: { proporcion: 1, capas: [...formas(0), pieza('inventario', 50, 55, 54), pieza('nube', 82, 18, 18, { z: 1, anim: 'mecer' })] },
  rrhh: { proporcion: 1, capas: [...formas(2), pieza('rrhh', 50, 55, 54), pieza('estrella', 16, 18, 10, { z: 3, anim: 'girar' })] },
  correos: { proporcion: 1, capas: [...formas(4), pieza('correo', 48, 55, 38), pieza('avion', 80, 20, 22, { z: 3, anim: 'mecer' })] },
  organizacion: { proporcion: 1.05, capas: [...formas(1), pieza('equipo', 50, 56, 66)] },
  logros: { proporcion: 1, capas: [...formas(0), pieza('trofeo', 50, 52, 40, { anim: 'flotar' }), pieza('confeti', 50, 22, 70, { z: 1, anim: 'mecer' })] },
  vacio: { proporcion: 1, capas: [...formas(3), pieza('pensando', 50, 56, 52), pieza('nube', 80, 18, 20, { z: 1, anim: 'mecer' })] },
};

/** Nombres válidos de escena (para el schema y las fichas del demo). */
export const NOMBRES_ESCENA = Object.keys(ESCENAS);

/** URL de una pieza relativa al documento (la app y las páginas de vista resuelven `assets/` con su base). */
export const urlPieza = (p: string, base: string): string => new URL(`assets/img/memphis/${p}.webp`, base).href;
