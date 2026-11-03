/**
 * busqueda-ia.ts — búsqueda semántica del API (`buscarIa`, `similares`) para las búsquedas de catálogo de las vistas
 * de negocio. El API siempre ordena TODO por parecido (sin umbral), así que aquí se quedan solo los hallazgos fuertes
 * (score alto y cerca del mejor) y se mezclan con la búsqueda por texto: lo literal nunca se pierde. Si el API falla,
 * la entidad no está indexada o no hay hallazgos fuertes, queda la búsqueda por texto. Resultados en caché un minuto.
 */
import { z } from '../base/zod.js';
import { dominio } from './api.js';
import { filtrarTexto } from './datos.js';

/** Entidades que el API indexa. */
export const ENTIDADES_IA = ['clientes', 'productos', 'proveedores', 'tareas', 'proyectos', 'empleados', 'correos', 'facturas', 'mensajes'] as const;

const HallazgoSchema = z.object({ entidad: z.string(), id: z.coerce.string(), score: z.number().nullable().optional() });
const BusquedaSchema = z.object({ resultados: z.array(HallazgoSchema) });
type Hallazgo = z.infer<typeof HallazgoSchema>;

/** Umbrales: un hallazgo cuenta si supera el mínimo y está cerca del mejor. */
const MINIMO_BUSQUEDA = 0.5;
const CERCA_DEL_MEJOR = 0.9;
const MINIMO_SIMILAR = 0.55;
const TTL_MS = 60_000;
// guarda la promesa, no el resultado: dos búsquedas iguales a la vez comparten una sola petición
const CACHE = new Map<string, { hasta: number; ids: Promise<string[] | null> }>();

const indexada = (entidad: string): boolean => (ENTIDADES_IA as readonly string[]).includes(entidad);

/** Ids fuertes (en orden de score) de una respuesta del API. */
export function idsFuertes(hallazgos: Hallazgo[], entidad: string, minimo: number, cerca = 0): string[] {
  const propios = hallazgos.filter((h) => h.entidad === entidad && typeof h.score === 'number');
  const mejor = Math.max(0, ...propios.map((h) => h.score as number));
  const corte = Math.max(minimo, mejor * cerca);
  return propios.filter((h) => (h.score as number) >= corte).sort((a, b) => (b.score as number) - (a.score as number)).map((h) => h.id);
}

function enCache(clave: string, pedir: () => Promise<string[] | null>): Promise<string[] | null> {
  const hit = CACHE.get(clave);
  if (hit && hit.hasta > Date.now()) return hit.ids;
  const ids = pedir().catch(() => null);
  CACHE.set(clave, { hasta: Date.now() + TTL_MS, ids });
  return ids;
}

/** Ids que la búsqueda semántica encuentra con fuerza para `q` en `entidad` (null si no aplica o falla). */
export function idsIa(entidad: string, q: string, iempresa: number | null): Promise<string[] | null> {
  const texto = q.trim();
  if (!indexada(entidad) || texto.length < 3) return Promise.resolve(null);
  return enCache(`b|${entidad}|${iempresa}|${texto.toLowerCase()}`, async () => {
    const op = dominio()['buscarIa'];
    if (typeof op !== 'function') return null;
    const r = BusquedaSchema.safeParse(await op({ q: texto, entidades: [entidad], ...(iempresa ? { iempresa } : {}), limite: 25, modo: 'auto' }));
    return r.success ? idsFuertes(r.data.resultados, entidad, MINIMO_BUSQUEDA, CERCA_DEL_MEJOR) : null;
  });
}

/** Ids de los registros más parecidos a uno (null si no aplica o falla). */
export function similaresIa(entidad: string, id: string | number, limite = 4): Promise<string[] | null> {
  if (!indexada(entidad)) return Promise.resolve(null);
  return enCache(`s|${entidad}|${id}|${limite}`, async () => {
    const op = dominio()['similares'];
    if (typeof op !== 'function') return null;
    const r = BusquedaSchema.safeParse(await op(entidad, id, limite + 1));
    return r.success ? idsFuertes(r.data.resultados, entidad, MINIMO_SIMILAR).filter((x) => x !== String(id)).slice(0, limite) : null;
  });
}

/** Ítems de `items` en el orden de `ids` (los que estén cargados). */
export function porIds<T>(ids: string[], items: T[], idDe: (x: T) => unknown): T[] {
  const mapa = new Map(items.map((x) => [String(idDe(x)), x]));
  return ids.map((i) => mapa.get(i)).filter((x): x is T => x !== undefined);
}

/**
 * Búsqueda de catálogo: hallazgos semánticos fuertes primero y luego las coincidencias por texto (sin repetir).
 * Sin texto, todos. Si la IA no aporta nada, solo texto.
 */
export async function buscarConIa<T>(entidad: string, texto: string, items: T[], campos: (x: T) => unknown[], idDe: (x: T) => unknown, iempresa: number | null): Promise<T[]> {
  const porTexto = filtrarTexto(items, texto, campos);
  if (!texto.trim()) return porTexto;
  const ids = await idsIa(entidad, texto, iempresa);
  if (!ids?.length) return porTexto;
  const ia = porIds(ids, items, idDe);
  const vistos = new Set(ia);
  return [...ia, ...porTexto.filter((x) => !vistos.has(x))];
}
