/**
 * chat.ts — dominio de la vista `canales` (sin DOM, probable sin navegador): ordenar canales, agrupar mensajes por día,
 * decidir si un mensaje es propio, ícono por tipo de canal y validación del texto a enviar.
 */
import type { CanalMio } from '../../../src/js/consts/schemas/api.schemas.js';
import type { Mensaje } from '../../../src/js/consts/schemas/canales.schemas.js';

/** Ícono por tipo de canal. */
export const ICONO_CANAL: Record<string, string> = { publico: 'mdi:pound', privado: 'mdi:lock-outline', directo: 'mdi:account-outline' };

/** Canales ordenados: primero con no leídos (más no leídos arriba), luego por último mensaje reciente, luego por nombre. */
export function ordenarCanales(canales: CanalMio[]): CanalMio[] {
  return [...canales].sort((a, b) => {
    if ((b.sin_leer > 0 ? 1 : 0) !== (a.sin_leer > 0 ? 1 : 0)) return b.sin_leer > 0 ? 1 : -1;
    const ta = a.ultimo?.creado ?? '';
    const tb = b.ultimo?.creado ?? '';
    if (ta !== tb) return tb.localeCompare(ta);
    return a.nombre.localeCompare(b.nombre);
  });
}

/** Total de no leídos (para el título / badge). */
export const totalSinLeer = (canales: CanalMio[]): number => canales.reduce((n, c) => n + c.sin_leer, 0);

/** ISO de la fecha de un mensaje (Date o texto), o `null`. */
export function fechaDe(creado: string | Date | null | undefined): string | null {
  if (!creado) return null;
  const d = typeof creado === 'string' ? new Date(creado) : creado;
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Clave de día `YYYY-MM-DD` local de un mensaje (sin fecha → `sin-fecha`). */
export function claveDia(creado: string | Date | null | undefined): string {
  const iso = fechaDe(creado);
  if (!iso) return 'sin-fecha';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Rótulo legible de un día: «Hoy», «Ayer» o la fecha larga. */
export function rotuloDia(clave: string, hoy: Date = new Date()): string {
  if (clave === 'sin-fecha') return 'Sin fecha';
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  if (clave === claveDia(hoy)) return 'Hoy';
  if (clave === claveDia(ayer)) return 'Ayer';
  const [y, m, d] = clave.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Mensajes ordenados por fecha y agrupados por día (grupos en orden cronológico). */
export function agruparPorDia(mensajes: Mensaje[]): { dia: string; rotulo: string; mensajes: Mensaje[] }[] {
  const orden = [...mensajes].sort((a, b) => (fechaDe(a.creado) ?? '').localeCompare(fechaDe(b.creado) ?? '') || a.imensaje - b.imensaje);
  const grupos = new Map<string, Mensaje[]>();
  for (const m of orden) {
    const k = claveDia(m.creado);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k)!.push(m);
  }
  return [...grupos.entries()].map(([dia, lista]) => ({ dia, rotulo: rotuloDia(dia), mensajes: lista }));
}

/** ¿El mensaje lo escribió el usuario de la sesión? */
export const esPropio = (m: Mensaje, yo: string): boolean => !!yo && m.iusuario === yo;

/** Texto listo para enviar (recortado) o `null` si está vacío o excede 4000 caracteres. */
export function textoParaEnviar(texto: string): string | null {
  const t = texto.trim();
  if (!t || t.length > 4000) return null;
  return t;
}

/** Canal activo: el del id de la ruta si existe, si no el primero. */
export function canalActivo(canales: CanalMio[], id: string | null): CanalMio | null {
  const n = Number(id);
  return canales.find((c) => c.icanal === n) ?? canales[0] ?? null;
}
