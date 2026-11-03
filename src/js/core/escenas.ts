/**
 * escenas.ts — composiciones de ilustraciones (sin DOM). Cada escena es una lista de capas:
 *
 *   - `pieza`: WebP Corporate Memphis de `assets/img/memphis/` (ubicada por su centro).
 *   - `forma`: figura geométrica pintada con CSS en los colores de la paleta (por su centro).
 *   - `retazo`: pieza recortada de un collage (`consts/collages.ts`, generado por `deno task collages`); su posición
 *     viene del collage original, así la escena lo recompone tal cual y cada retazo puede moverse solo.
 *   - `vector`: SVG propio (la «A» de marca, el anillo) ubicado por su esquina superior izquierda.
 *   - `dibujo`: elemento CSS (retícula, líneas, triángulos de contorno, aros, sombra, tarjetas) por su esquina.
 *
 * Coordenadas en % del lienzo. Las escenas de collage se escriben en px del original con `enPx` (mismo sistema que
 * `posiciones.json`) y se convierten con el recorte del collage. `prof` es la profundidad del parallax con el cursor
 * (0 quieto · 1 lo que más se mueve: lo cercano) y `retraso` el desfase de sus loops en s.
 *
 * Movimientos (`anim`): se combinan, uno por grupo, porque cada grupo anima una propiedad distinta.
 *   desplazamiento — flotar (sube y baja) · marea (deriva lenta en ocho) · deriva (vaivén lateral)
 *   rotación       — mecer (balanceo) · oscilar (±6°) · girar (vuelta completa)
 *   escala         — latir (pulso suave) · rebote (crece con rebote y vuelve)
 *   opacidad       — alfa (0.7 ↔ 1)
 * `radar` pone ondas detrás de la capa: `radar` (dos ondas y 4 s de pausa) u `ondas` (tres anillos finos continuos).
 * `oscuro`: en tema oscuro la capa se oculta (piezas pensadas para fondo claro) o gana un contorno claro.
 */
import { COLLAGES } from '../consts/collages.js';

export type Animacion = 'flotar' | 'marea' | 'deriva' | 'mecer' | 'oscilar' | 'girar' | 'latir' | 'rebote' | 'alfa' | 'ninguna';
export type FormaColor = 'acento' | 'contraste' | 'marca' | 'suave';
export type Forma = 'circulo' | 'triangulo' | 'anillo' | 'zigzag' | 'puntos';
export type Dibujo = 'reticula' | 'punteado' | 'linea-h' | 'linea-v' | 'triangulo-linea' | 'triangulo-linea-abajo' | 'triangulo-abajo' | 'aro' | 'sombra' | 'tarjeta-comunidad' | 'tarjeta-video';
type Movimiento = { z?: number; prof?: number; anim?: Animacion | Animacion[]; retraso?: number; giro?: number; radar?: 'radar' | 'ondas'; oscuro?: 'ocultar' | 'contorno' };
export type CapaPieza = Movimiento & { tipo: 'pieza'; pieza: string; x: number; y: number; ancho: number };
export type CapaForma = Movimiento & { tipo: 'forma'; forma: Forma; color: FormaColor; x: number; y: number; ancho: number };
export type CapaRetazo = Movimiento & { tipo: 'retazo'; id: string };
export type CapaVector = Movimiento & { tipo: 'vector'; src: string; x: number; y: number; ancho: number; alto: number };
export type CapaDibujo = Movimiento & { tipo: 'dibujo'; dibujo: Dibujo; x: number; y: number; ancho: number; alto: number };
export type Capa = CapaPieza | CapaForma | CapaRetazo | CapaVector | CapaDibujo;
export type Escena = { proporcion: number; collage?: string; capas: Capa[] };

/** Formas de fondo comunes; `n` las desplaza un poco para que cada escena no se vea calcada. */
const formas = (n: number): Capa[] => [
  { tipo: 'forma', forma: 'circulo', color: 'acento', x: 8 + n, y: 14, ancho: 9, anim: ['flotar', 'alfa'], retraso: 0.4, prof: 0.9 },
  { tipo: 'forma', forma: 'triangulo', color: 'contraste', x: 86, y: 10 + n, ancho: 8, anim: 'girar', giro: 12, prof: 1 },
  { tipo: 'forma', forma: 'anillo', color: 'marca', x: 82 - n, y: 80, ancho: 11, anim: ['latir', 'marea'], retraso: 1.2, prof: 0.8 },
  { tipo: 'forma', forma: 'zigzag', color: 'acento', x: 10, y: 74 - n, ancho: 14, anim: 'mecer', retraso: 0.8, prof: 0.7 },
  { tipo: 'forma', forma: 'puntos', color: 'suave', x: 62, y: 6, ancho: 16, anim: 'alfa', prof: 0.3 },
];

const pieza = (p: string, x: number, y: number, ancho: number, extra: Partial<CapaPieza> = {}): CapaPieza => ({ tipo: 'pieza', pieza: p, x, y, ancho, z: 2, prof: 0.5, anim: 'marea', ...extra });

/** Px del original del collage → % de su recorte (para vectores y dibujos alineados con los retazos). */
function enPx(collage: string) {
  const c = COLLAGES[collage];
  if (!c) throw new Error(`collage ${collage} sin generar`);
  const [rx, ry, rw, rh] = c.recorte;
  return (x: number, y: number, w: number, h: number) => ({ x: ((x - rx) / rw) * 100, y: ((y - ry) / rh) * 100, ancho: (w / rw) * 100, alto: (h / rh) * 100 });
}
type Caja = ReturnType<ReturnType<typeof enPx>>;
const retazo = (id: string, extra: Movimiento = {}): CapaRetazo => ({ tipo: 'retazo', id, z: 2, prof: 0.5, ...extra });
const dib = (dibujo: Dibujo, caja: Caja, extra: Movimiento = {}): CapaDibujo => ({ tipo: 'dibujo', dibujo, ...caja, z: 1, prof: 0.6, ...extra });
const vec = (src: string, caja: Caja, extra: Movimiento = {}): CapaVector => ({ tipo: 'vector', src, ...caja, z: 2, prof: 0.4, ...extra });

const cr = enPx('crecimiento');
const mc = enPx('marca');
const md = enPx('modulos');

/**
 * Collages de la identidad (las propuestas con la «A» de cinta). Cada uno para un contexto:
 *   crecimiento — hero de la landing (marca + métricas + equipo validado).
 *   marca       — productividad y acceso: la A que sube con las barras, el engranaje y la persona.
 *   modulos     — características: la plataforma como centro de tableros, comunidad, video y crecimiento.
 *   red         — software abierto: la marca conectada a datos y personas.
 * Todo se mueve: cada capa combina desplazamiento, rotación, escala y/o alfa, con desfases para que el conjunto
 * respire sin sincronizarse; las piezas protagonistas emiten radar u ondas.
 */
const COLLAGE_ESCENAS: Record<string, Escena> = {
  crecimiento: {
    proporcion: COLLAGES['crecimiento']!.proporcion,
    collage: 'crecimiento',
    capas: [
      dib('sombra', cr(169, 664, 493, 30), { z: 0, prof: 0.1, anim: ['latir', 'alfa'] }),
      dib('triangulo-linea', cr(138, 232, 77, 62), { prof: 1, anim: ['marea', 'oscilar', 'alfa'] }),
      dib('triangulo-linea-abajo', cr(387, 205, 77, 62), { prof: 0.9, anim: ['deriva', 'oscilar', 'alfa'], retraso: 1.4 }),
      dib('aro', cr(245, 239, 22, 22), { prof: 1.2, anim: ['marea', 'rebote', 'alfa'] }),
      dib('aro', cr(442, 329, 21, 20), { prof: 1.1, anim: ['flotar', 'rebote', 'alfa'], retraso: 1 }),
      dib('aro', cr(109, 526, 24, 24), { prof: 1.3, anim: ['deriva', 'rebote', 'alfa'], retraso: 2 }),
      dib('punteado', cr(387, 529, 318, 157), { z: 1, prof: 0.2, anim: ['marea', 'alfa'] }),
      vec('assets/img/collage/vector/anillo-atras.svg', cr(87, 325, 480, 300), { z: 2, prof: 0.55, anim: ['marea', 'oscilar'] }),
      vec('assets/img/marca/a-cinta.svg', cr(138, 278, 313, 358), { z: 3, prof: 0.4, anim: ['flotar', 'latir'], radar: 'radar' }),
      retazo('engranaje', { z: 4, prof: 0.7, anim: ['girar', 'latir'] }),
      vec('assets/img/collage/vector/anillo-frente.svg', cr(87, 325, 480, 300), { z: 5, prof: 0.55, anim: ['marea', 'oscilar'] }),
      vec('assets/img/collage/vector/grafica.svg', cr(482, 173, 249, 220), { z: 3, prof: 0.3, anim: ['deriva', 'latir'] }),
      retazo('persona-1', { z: 4, prof: 0.6, anim: ['flotar', 'rebote', 'alfa'] }),
      retazo('persona-2', { z: 4, prof: 0.6, anim: ['flotar', 'rebote', 'alfa'], retraso: 0.6 }),
      retazo('persona-3', { z: 4, prof: 0.6, anim: ['flotar', 'rebote', 'alfa'], retraso: 1.2 }),
      retazo('sello', { z: 6, prof: 0.85, anim: ['marea', 'oscilar', 'rebote'], radar: 'ondas' }),
    ],
  },
  marca: {
    proporcion: COLLAGES['marca']!.proporcion,
    collage: 'marca',
    capas: [
      dib('reticula', mc(70, 120, 570, 520), { z: 0, prof: 0.1, anim: 'alfa' }),
      dib('sombra', mc(110, 600, 520, 28), { z: 0, prof: 0.1, anim: ['latir', 'alfa'] }),
      retazo('barra-1', { z: 1, prof: 0.45, anim: ['flotar', 'rebote', 'alfa'] }),
      retazo('barra-2', { z: 1, prof: 0.5, anim: ['flotar', 'rebote', 'alfa'], retraso: 0.5 }),
      retazo('barra-3', { z: 1, prof: 0.55, anim: ['flotar', 'rebote', 'alfa'], retraso: 1 }),
      retazo('a', { z: 2, prof: 0.35, anim: ['marea', 'latir'], radar: 'radar' }),
      retazo('engranaje', { z: 3, prof: 0.8, anim: ['girar', 'flotar'] }),
      retazo('persona', { z: 3, prof: 0.9, anim: ['flotar', 'oscilar', 'alfa'], radar: 'ondas' }),
    ],
  },
  modulos: {
    proporcion: COLLAGES['modulos']!.proporcion,
    collage: 'modulos',
    capas: [
      dib('linea-h', md(27, 419, 760, 4), { z: 0, prof: 0.1, anim: 'alfa' }),
      dib('linea-v', md(405, 41, 4, 760), { z: 0, prof: 0.1, anim: 'alfa', retraso: 1.5 }),
      dib('triangulo-abajo', md(346, 95, 122, 109), { z: 0, prof: 0.3, anim: ['deriva', 'oscilar', 'alfa'] }),
      dib('triangulo-linea-abajo', md(88, 421, 61, 54), { z: 1, prof: 0.9, anim: ['marea', 'mecer', 'alfa'] }),
      dib('tarjeta-comunidad', md(495, 139, 258, 258), { z: 2, prof: 0.45, anim: ['flotar', 'latir'], radar: 'ondas' }),
      dib('tarjeta-video', md(54, 495, 296, 221), { z: 2, prof: 0.45, anim: ['marea', 'latir'], retraso: 1 }),
      retazo('play', { z: 3, prof: 0.55, anim: ['flotar', 'rebote', 'alfa'] }),
      retazo('tablero', { z: 2, prof: 0.45, anim: ['marea', 'latir'], retraso: 2 }),
      retazo('crecimiento', { z: 2, prof: 0.45, anim: ['deriva', 'latir'], retraso: 0.5 }),
      retazo('engranaje', { z: 4, prof: 0.8, anim: ['girar', 'flotar'] }),
      retazo('logo', { z: 5, prof: 0.2, anim: ['flotar', 'latir'], radar: 'radar' }),
    ],
  },
  red: {
    proporcion: COLLAGES['red']!.proporcion,
    collage: 'red',
    capas: [
      retazo('base', { z: 0, prof: 0.12, anim: 'marea' }),
      retazo('mancha', { z: 1, prof: 0.35, anim: ['deriva', 'latir', 'alfa'] }),
      retazo('hoja', { z: 2, prof: 0.5, anim: ['flotar', 'latir'] }),
      retazo('torta', { z: 2, prof: 0.7, anim: ['girar', 'rebote'], radar: 'ondas' }),
      retazo('flecha', { z: 2, prof: 0.7, anim: ['flotar', 'oscilar'] }),
      retazo('triangulo-1', { z: 2, prof: 1, anim: ['marea', 'mecer', 'alfa'] }),
      retazo('triangulo-2', { z: 2, prof: 0.9, anim: ['deriva', 'oscilar', 'alfa'], retraso: 1 }),
      retazo('triangulo-3', { z: 2, prof: 1.1, anim: ['marea', 'girar'], retraso: 2 }),
      retazo('circulo-1', { z: 2, prof: 1, anim: ['flotar', 'rebote', 'alfa'] }),
      retazo('circulo-2', { z: 2, prof: 1.1, anim: ['deriva', 'rebote', 'alfa'], retraso: 0.8 }),
      retazo('circulo-3', { z: 2, prof: 0.9, anim: ['marea', 'rebote', 'alfa'], retraso: 1.6 }),
      retazo('rombo', { z: 2, prof: 1.2, anim: ['girar', 'latir', 'alfa'] }),
      retazo('logo', { z: 3, prof: 0.3, anim: ['flotar', 'latir'], radar: 'radar' }),
    ],
  },
};

/**
 * Collages recortados con SAM (fondo sin fondo + piezas): la escena se arma sola desde `consts/collages.ts`. Cada
 * pieza toma movimientos según su nombre (personas flotan, formas se mecen y laten, gráficas y tarjetas respiran);
 * `foco` emite radar y `ondas` ondas finas. Todo lento y sutil (ver RITMO).
 */
function porNombre(id: string): Movimiento {
  if (id.startsWith('persona') || id.startsWith('grupo')) return { anim: ['flotar', 'alfa'], prof: 0.7 };
  if (/^(triangulo|rombo)/.test(id)) return { anim: ['marea', 'oscilar', 'alfa'], prof: 0.9 };
  if (/^(circulo|bolita|mas|check)/.test(id)) return { anim: ['flotar', 'rebote', 'alfa'], prof: 1 };
  if (/^(torta|dona|diana)/.test(id)) return { anim: ['deriva', 'oscilar', 'latir'], prof: 0.6 };
  if (/^(barras|grafica|flecha|montana)/.test(id)) return { anim: ['flotar', 'latir'], prof: 0.5 };
  return { anim: ['marea', 'latir'], prof: 0.45 };
}
function collageSam(nombre: string, foco = '', ondas = ''): Escena {
  const c = COLLAGES[nombre];
  if (!c) throw new Error(`collage ${nombre} sin generar`);
  return {
    proporcion: c.proporcion,
    collage: nombre,
    capas: c.piezas.map((p, i): Capa => p.id === 'base'
      ? retazo('base', { z: 0, prof: 0.12, anim: 'marea' })
      : retazo(p.id, { z: 2, ...porNombre(p.id), retraso: (i * 1.3) % 7, ...(p.id === foco ? { radar: 'radar' as const } : p.id === ondas ? { radar: 'ondas' as const } : {}) })),
  };
}

/** Collages de módulo (propuestas de noviembre): cada vista privada tiene el suyo. */
const COLLAGES_MODULO: Record<string, Escena> = {
  'tablero-rombos': collageSam('tablero-rombos', 'dona', 'circulo-mas'),
  'tablero-circulos': collageSam('tablero-circulos', 'diana', 'circulo-grande'),
  empresa: collageSam('empresa', 'check', 'torta'),
  capas: collageSam('capas', 'diana'),
  rejilla: collageSam('rejilla', 'tarjeta-torta'),
  reporte: collageSam('reporte', 'documento', 'torta'),
  'equipo-tablero': collageSam('equipo-tablero', 'torta'),
  atencion: collageSam('atencion', 'burbuja'),
  negocios: collageSam('negocios', 'ventana-clara', 'circulo-der'),
  comunidad: collageSam('comunidad', 'persona-centro', 'rombo-rosa'),
};

/** Escenas por nombre: collages de identidad, collages de módulo (y su alias por vista) y Memphis de reserva. */
export const ESCENAS: Record<string, Escena> = {
  ...COLLAGE_ESCENAS,
  ...COLLAGES_MODULO,
  // Alias por vista: la escena de cada módulo es su collage.
  panel: COLLAGES_MODULO['tablero-rombos']!,
  finanzas: COLLAGES_MODULO['reporte']!,
  crm: COLLAGES_MODULO['negocios']!,
  organizacion: COLLAGES_MODULO['empresa']!,
  proyectos: COLLAGES_MODULO['equipo-tablero']!,
  canales: COLLAGES_MODULO['atencion']!,
  chat: COLLAGES_MODULO['atencion']!,
  rrhh: COLLAGES_MODULO['comunidad']!,
  inventario: COLLAGES_MODULO['capas']!,
  asistente: COLLAGES_MODULO['tablero-circulos']!,
  correos: COLLAGES_MODULO['rejilla']!,
  bienvenida: {
    proporcion: 1.05,
    capas: [...formas(0), pieza('equipo', 50, 56, 64), pieza('globo-1', 18, 22, 26, { z: 3, anim: ['flotar', 'oscilar'], prof: 0.8 }), pieza('cohete', 86, 32, 11, { z: 3, anim: ['flotar', 'latir'], retraso: 0.6, giro: 18, prof: 0.9 }), pieza('avion', 74, 12, 18, { z: 1, anim: 'mecer', retraso: 1, prof: 0.7 })],
  },
  acceso: {
    proporcion: 0.95,
    capas: [...formas(3), pieza('saludo', 46, 58, 50), pieza('globo-2', 80, 24, 20, { z: 3, anim: ['flotar', 'oscilar'], prof: 0.8 }), pieza('nube', 18, 26, 22, { z: 1, anim: ['deriva', 'alfa'], retraso: 0.7, prof: 0.3 })],
  },
  logros: { proporcion: 1, capas: [...formas(0), pieza('trofeo', 50, 52, 40, { anim: ['flotar', 'latir'] }), pieza('confeti', 50, 22, 70, { z: 1, anim: ['mecer', 'alfa'], prof: 0.3 })] },
  vacio: { proporcion: 1, capas: [...formas(3), pieza('pensando', 50, 56, 52), pieza('nube', 80, 18, 20, { z: 1, anim: ['deriva', 'alfa'], prof: 0.3 })] },
};

/** Nombres válidos de escena (para el schema y las fichas del demo). */
export const NOMBRES_ESCENA = Object.keys(ESCENAS);

/** Grupo de cada movimiento: dos del mismo grupo animarían la misma propiedad y uno anularía al otro. */
export const GRUPO_ANIM: Record<Exclude<Animacion, 'ninguna'>, 'desplazamiento' | 'rotacion' | 'escala' | 'opacidad'> = {
  flotar: 'desplazamiento',
  marea: 'desplazamiento',
  deriva: 'desplazamiento',
  mecer: 'rotacion',
  oscilar: 'rotacion',
  girar: 'rotacion',
  latir: 'escala',
  rebote: 'escala',
  alfa: 'opacidad',
};

/**
 * Duración (s) y curva de cada movimiento: lentos (detalles sutiles que no roban atención) y con períodos distintos
 * para que el conjunto no se vea sincronizado.
 */
const RITMO: Record<Exclude<Animacion, 'ninguna'>, string> = {
  flotar: '12s ease-in-out',
  marea: '22s ease-in-out',
  deriva: '17s ease-in-out',
  mecer: '14s ease-in-out',
  oscilar: '11s ease-in-out',
  girar: '40s linear',
  latir: '9s ease-in-out',
  rebote: '8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  alfa: '10s ease-in-out',
};

/** Valor de `animation` para una capa: un loop por movimiento (el primero de cada grupo), con su desfase. */
export function animacionCss(anim: Animacion | Animacion[] | undefined, retraso = 0): string {
  const lista = (Array.isArray(anim) ? anim : [anim ?? 'ninguna']).filter((a): a is Exclude<Animacion, 'ninguna'> => !!a && a !== 'ninguna');
  const vistos = new Set<string>();
  const partes: string[] = [];
  for (const a of lista) {
    if (vistos.has(GRUPO_ANIM[a])) continue;
    vistos.add(GRUPO_ANIM[a]);
    partes.push(`av-${a} ${RITMO[a]} ${-retraso}s infinite`);
  }
  return partes.join(', ');
}

/** URL de una pieza relativa al documento (la app y las páginas de vista resuelven `assets/` con su base). */
export const urlPieza = (p: string, base: string): string => new URL(`assets/img/memphis/${p}.webp`, base).href;

/** `srcset` de un retazo: todas sus variantes WebP con su ancho real. */
export const srcsetRetazo = (collage: string, id: string, anchos: number[], base: string): string =>
  anchos.map((w) => `${new URL(`assets/img/collage/${collage}/${id}-${w}.webp`, base).href} ${w}w`).join(', ');
