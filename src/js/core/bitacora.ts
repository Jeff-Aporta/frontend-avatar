/**
 * bitacora.ts — últimos errores del navegador en esta página, para adjuntarlos a un reporte: `error`, promesas rechazadas y
 * `console.error`/`console.warn`. Se instala al arrancar y no toca lo que ya hacen esos canales. Sin tokens: se limpian al leer.
 */
const MAXIMO = 50;
const LARGO = 800;
const JWT = /eyJ[\w-]+\.[\w-]+\.[\w-]+/g;

export type Entrada = { nivel: 'error' | 'warn' | 'rechazo'; texto: string; ts: string };

const entradas: Entrada[] = [];

const texto = (v: unknown): string => {
  if (v instanceof Error) return `${v.name}: ${v.message}${v.stack ? `\n${v.stack}` : ''}`;
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

function anotar(nivel: Entrada['nivel'], partes: unknown[]): void {
  entradas.push({ nivel, texto: partes.map(texto).join(' ').slice(0, LARGO), ts: new Date().toISOString() });
  if (entradas.length > MAXIMO) entradas.shift();
}

/** Empieza a escuchar. Una sola vez por página. */
export function iniciarBitacora(): void {
  addEventListener('error', (e) => anotar('error', [e.message, `${e.filename}:${e.lineno}:${e.colno}`]));
  addEventListener('unhandledrejection', (e) => anotar('rechazo', [e.reason]));
  for (const nivel of ['error', 'warn'] as const) {
    const original = console[nivel].bind(console);
    console[nivel] = (...args: unknown[]) => {
      anotar(nivel, args);
      original(...args);
    };
  }
}

/** Copia de lo anotado, sin tokens. */
export function leerBitacora(): Entrada[] {
  return entradas.map((e) => ({ ...e, texto: e.texto.replace(JWT, '[token]') }));
}
