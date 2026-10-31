/**
 * datos.ts — utilidades sin DOM que comparten las vistas de negocio (correos, finanzas, inventario, rrhh): filas de un
 * `query` de DER validadas con Zod, búsqueda por texto (la ruta por defecto de toda búsqueda de catálogo), fechas
 * `YYYY-MM-DD` y moneda.
 */
import type { z } from '../base/zod.js';

/** Filas de un `query` de DER como JSON plano validado (las que no cumplen el schema se descartan). */
export function filas<T>(schema: z.ZodType<T>, rows: unknown[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    const j = r && typeof (r as { toJSON?: unknown }).toJSON === 'function' ? (r as { toJSON(): unknown }).toJSON() : r;
    const p = schema.safeParse(j);
    if (p.success) out.push(p.data);
  }
  return out;
}

/** Texto en minúsculas y sin tildes, para comparar. */
export const normalizar = (s: unknown): string => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Ítems cuyo texto (los campos que devuelve `campos`) contiene TODAS las palabras buscadas; texto vacío = todos. */
export function filtrarTexto<T>(items: T[], texto: string, campos: (item: T) => unknown[]): T[] {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  if (!palabras.length) return items;
  return items.filter((it) => {
    const pajar = normalizar(campos(it).filter((v) => v != null).join(' '));
    return palabras.every((p) => pajar.includes(p));
  });
}

/** Fecha local de hoy `YYYY-MM-DD`. */
export function hoyISO(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** `YYYY-MM-DD` de una fecha de DER (texto ISO, `Date` o nulo → ''). */
export function fechaISO(v: unknown): string {
  if (v == null || v === '') return '';
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? '' : v.toISOString().slice(0, 10);
  const s = String(v);
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '';
}

/** Días entre dos fechas `YYYY-MM-DD` (b - a). */
export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/** Moneda en es-CO: COP sin decimales; el resto con 2. */
export function formatoMoneda(n: number, moneda = 'COP'): string {
  const decimales = moneda === 'COP' ? 0 : 2;
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: moneda, minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n);
  } catch {
    return `${n.toFixed(decimales)} ${moneda}`;
  }
}

/** Número en es-CO (entero). */
export const formatoNumero = (n: number): string => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n);

/** Variación porcentual con signo (`+12,5 %`), o '' si no hay base. */
export function tendencia(variacion: number | null | undefined): string {
  if (variacion == null || !Number.isFinite(variacion)) return '';
  const s = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(Math.abs(variacion));
  return `${variacion > 0 ? '+' : variacion < 0 ? '-' : ''}${s} %`;
}

/** Iniciales de un nombre (máx. 2). */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/[\s._-]+/).filter(Boolean);
  return (partes.length > 1 ? `${partes[0]![0]}${partes[1]![0]}` : (partes[0] ?? '?').slice(0, 2)).toUpperCase();
}

/** Texto escapado para HTML (las celdas `{ html }` del grid). */
export const escHtml = (s: unknown): string => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Celda `{ html }` con un `iswc-tag` (color del kit). */
export const celdaTag = (texto: string, color: string, variante = 'filled-outlined'): { html: string } => ({ html: `<iswc-tag color="${escHtml(color)}" variant="${escHtml(variante)}" pill>${escHtml(texto)}</iswc-tag>` });
