/**
 * avo.ts — dominio de la vista `asistente` (sin DOM): convertir consultas guardadas en turnos del chat, sugerencias
 * iniciales y validación de la pregunta.
 */
import type { Consulta, Turno } from '../../../src/js/consts/schemas/asistente.schemas.js';

/** Sugerencias cuando aún no hay conversación. */
export const SUGERENCIAS_INICIALES = ['¿Cuántas tareas tengo pendientes?', '¿Qué clientes están en negociación?', '¿Cómo creo un canal?', '¿Cómo invito a alguien a mi empresa?'];

/** ISO de una fecha (Date o texto) o `null`. */
function iso(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  const d = typeof v === 'string' ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Historial guardado (más reciente primero) → turnos en orden cronológico: pregunta del usuario y respuesta de AVO. */
export function turnosDe(consultas: Consulta[]): Turno[] {
  const orden = [...consultas].sort((a, b) => a.iconsulta - b.iconsulta);
  const out: Turno[] = [];
  for (const c of orden) {
    const creado = iso(c.creado);
    out.push({ id: `p-${c.iconsulta}`, quien: 'yo', texto: c.pregunta, creado });
    if (c.respuesta) out.push({ id: `r-${c.iconsulta}`, quien: 'avo', texto: c.respuesta, creado });
  }
  return out;
}

/** Pregunta lista para enviar (recortada) o `null` si vacía o mayor a 2000 caracteres. */
export function preguntaValida(texto: string): string | null {
  const t = texto.trim();
  if (!t || t.length > 2000) return null;
  return t;
}

/** Id único para un turno local (sin API todavía). */
export const idLocal = (prefijo: string): string => `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
