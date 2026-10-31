/**
 * correos.ts — dominio de la vista `correos` (sin DOM): carpetas con conteo, indicadores del resumen, borradores de
 * respuesta y reenvío, vista previa, etiquetas y correos relacionados. Los componentes solo pintan lo que esto devuelve.
 */
import type { Indicador } from '../../../src/js/consts/schemas/componentes.schemas.js';
import { type Bandeja, type BorradorCorreo, CARPETAS_CORREO, type CarpetaInfo, type CorreoBandeja, type CorreoRelacionado, type MiembroCorreo, type ResumenCorreo } from '../../../src/js/consts/schemas/correos.schemas.js';
import { formatoNumero, normalizar } from '../../../src/js/core/datos.js';

/** Etiqueta e ícono por carpeta. */
export const CARPETA_INFO: Record<string, { label: string; icono: string }> = {
  entrada: { label: 'Entrada', icono: 'mdi:inbox-arrow-down' },
  enviados: { label: 'Enviados', icono: 'mdi:send-outline' },
  archivados: { label: 'Archivados', icono: 'mdi:archive-outline' },
  papelera: { label: 'Papelera', icono: 'mdi:trash-can-outline' },
};

/** ¿Es una carpeta válida? */
export const esCarpeta = (s: unknown): s is (typeof CARPETAS_CORREO)[number] => (CARPETAS_CORREO as readonly string[]).includes(String(s));

/** Carpetas en orden con su total; los no leídos solo cuentan en la entrada. */
export function carpetasConConteo(bandeja: Bandeja | null): CarpetaInfo[] {
  return CARPETAS_CORREO.map((carpeta) => ({
    carpeta,
    label: CARPETA_INFO[carpeta]!.label,
    icono: CARPETA_INFO[carpeta]!.icono,
    total: bandeja?.por_carpeta[carpeta] ?? 0,
    noLeidos: carpeta === 'entrada' ? (bandeja?.no_leidos ?? 0) : 0,
  }));
}

/** KPIs del correo del usuario. */
export function indicadoresCorreo(r: ResumenCorreo): Indicador[] {
  return [
    { id: 'no-leidos', label: 'Sin leer', value: formatoNumero(r.no_leidos), helper: r.no_leidos ? 'esperan tu respuesta' : 'bandeja al día', icon: 'mdi:email-alert-outline', color: r.no_leidos ? 'warning' : 'success', trend: '', trendDirection: '' },
    { id: 'entrada', label: 'En la entrada', value: formatoNumero(r.entrada), helper: 'correos recibidos', icon: 'mdi:inbox-arrow-down', color: 'brand', trend: '', trendDirection: '' },
    { id: 'destacados', label: 'Destacados', value: formatoNumero(r.destacados), helper: 'marcados con estrella', icon: 'mdi:star-outline', color: 'neutral', trend: '', trendDirection: '' },
    { id: 'enviados-hoy', label: 'Enviados hoy', value: formatoNumero(r.enviados_hoy), helper: 'desde tu buzón', icon: 'mdi:send-check-outline', color: 'brand', trend: '', trendDirection: '' },
  ];
}

/** Nombre legible por usuario a partir de los miembros (el id si no hay nombre). */
export function nombresDe(miembros: MiembroCorreo[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of miembros) out[m.iusuario] = m.usuario?.nombre || m.iusuario;
  return out;
}

/** Primeros `n` caracteres del cuerpo en una línea. */
export function vistaPrevia(cuerpo: string, n = 110): string {
  const plano = cuerpo.replace(/\s+/g, ' ').trim();
  return plano.length > n ? `${plano.slice(0, n - 1)}…` : plano;
}

/** Asunto sin prefijos `Re:`/`Rv:`/`Fwd:` (para agrupar conversación). */
export const asuntoBase = (asunto: string): string => asunto.replace(/^\s*((re|rv|fw|fwd)\s*:\s*)+/i, '').trim();

/** Texto del cuerpo citado (cada línea con `> `). */
function citar(c: CorreoBandeja, nombres: Record<string, string>): string {
  const fecha = new Date(c.creado).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  return `\n\n— El ${fecha}, ${nombres[c.remitente] ?? c.remitente} escribió:\n${c.cuerpo.split('\n').map((l) => `> ${l}`).join('\n')}`;
}

/** Borrador de respuesta: al remitente (o a todos, sin mí), `Re:` y el original citado. */
export function borradorRespuesta(c: CorreoBandeja, yo: string, nombres: Record<string, string>, todos = false): BorradorCorreo {
  const para = todos ? [...new Set([c.remitente, ...c.destinatarios])].filter((u) => u !== yo) : [c.remitente === yo ? (c.destinatarios[0] ?? '') : c.remitente];
  const cc = todos ? c.cc.filter((u) => u !== yo && !para.includes(u)) : [];
  return { destinatarios: para.filter(Boolean), cc, asunto: `Re: ${asuntoBase(c.asunto)}`, cuerpo: citar(c, nombres), etiquetas: c.etiquetas, respuesta_a: c.icorreo };
}

/** Borrador de reenvío: sin destinatarios, `Rv:` y el original citado. */
export function borradorReenvio(c: CorreoBandeja, nombres: Record<string, string>): BorradorCorreo {
  return { destinatarios: [], cc: [], asunto: `Rv: ${asuntoBase(c.asunto)}`, cuerpo: citar(c, nombres), etiquetas: c.etiquetas, respuesta_a: null };
}

/** `"crm, Urgente ,  crm"` → `['crm', 'urgente']` (minúsculas, sin repetir, máx. 10). */
export function etiquetasDe(texto: string): string[] {
  return [...new Set(texto.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10).map((t) => t.slice(0, 40));
}

/** Campos de texto de un correo para la búsqueda (asunto, cuerpo, personas y etiquetas). */
export function camposCorreo(c: CorreoBandeja, nombres: Record<string, string>): unknown[] {
  return [c.asunto, c.cuerpo, c.remitente, nombres[c.remitente], ...c.destinatarios, ...c.destinatarios.map((u) => nombres[u]), ...c.etiquetas];
}

/** Relacionados por defecto: misma conversación (respuesta o mismo asunto base) entre los correos cargados. Máx. 4. */
export function relacionadosDe(c: CorreoBandeja, todos: CorreoBandeja[]): CorreoRelacionado[] {
  const base = normalizar(asuntoBase(c.asunto));
  return todos
    .filter((x) => x.ibuzon !== c.ibuzon && (x.icorreo === c.respuesta_a || x.respuesta_a === c.icorreo || (base && normalizar(asuntoBase(x.asunto)) === base)))
    .slice(0, 4)
    .map((x) => ({ ibuzon: x.ibuzon, asunto: x.asunto, remitente: x.remitente, creado: x.creado }));
}

/** Acciones de mover disponibles desde una carpeta. */
export function movimientosDesde(carpeta: string): { carpeta: string; label: string; icono: string }[] {
  if (carpeta === 'papelera') return [{ carpeta: 'entrada', label: 'Restaurar', icono: 'mdi:inbox-arrow-up' }];
  if (carpeta === 'archivados') return [{ carpeta: 'entrada', label: 'A la entrada', icono: 'mdi:inbox-arrow-up' }, { carpeta: 'papelera', label: 'Papelera', icono: 'mdi:trash-can-outline' }];
  return [{ carpeta: 'archivados', label: 'Archivar', icono: 'mdi:archive-arrow-down-outline' }, { carpeta: 'papelera', label: 'Papelera', icono: 'mdi:trash-can-outline' }];
}
