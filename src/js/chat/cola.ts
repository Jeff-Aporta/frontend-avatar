/**
 * cola.ts — cola local de envíos pendientes (W-CHAT-18): todo mensaje se guarda aquí ANTES de enviarlo y sale al
 * confirmarse. Al recargar, lo que quedó se reintenta: nada se pierde. Vive en `localStorage` (con try/catch: sin
 * almacenamiento la cola funciona en memoria). Los adjuntos ya subidos viajan como metadatos; un archivo que no llegó a
 * subirse no sobrevive a la recarga (queda como «no enviado»).
 */
import { z } from '../base/zod.js';
import { BorradorSchema, type Borrador } from './tipos.js';

export const PendienteSchema = BorradorSchema.extend({ ts: z.string(), autor: z.string(), intentos: z.number().default(0) });
export type Pendiente = z.infer<typeof PendienteSchema>;

type Almacen = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function almacenPorDefecto(): Almacen | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export type Cola = {
  leer(): Pendiente[];
  poner(p: Borrador & { ts: string; autor: string; intentos?: number }): void;
  quitar(clave: string): void;
  intento(clave: string): void;
  vaciar(): void;
};

/** Cola por usuario (`clave` del almacén incluye al usuario: dos personas en el mismo navegador no se mezclan). */
export function crearCola(usuario: string, almacen: Almacen | null = almacenPorDefecto(), prefijo = 'av-chat:cola'): Cola {
  const clave = `${prefijo}:${usuario}`;
  let memoria: Pendiente[] = [];
  const leer = (): Pendiente[] => {
    if (!almacen) return memoria;
    try {
      const r = z.array(PendienteSchema).safeParse(JSON.parse(almacen.getItem(clave) ?? '[]'));
      return r.success ? r.data : [];
    } catch {
      return memoria;
    }
  };
  const escribir = (lista: Pendiente[]) => {
    memoria = lista;
    if (!almacen) return;
    try {
      if (lista.length) almacen.setItem(clave, JSON.stringify(lista));
      else almacen.removeItem(clave);
    } catch {
      /* lleno o bloqueado: queda en memoria */
    }
  };
  return {
    leer,
    poner(p) {
      const lista = leer().filter((x) => x.clave !== p.clave);
      lista.push(PendienteSchema.parse({ ...p, intentos: p.intentos ?? 0 }));
      escribir(lista);
    },
    quitar(c) {
      const lista = leer();
      if (lista.some((x) => x.clave === c)) escribir(lista.filter((x) => x.clave !== c));
    },
    intento(c) {
      escribir(leer().map((x) => (x.clave === c ? { ...x, intentos: x.intentos + 1 } : x)));
    },
    vaciar() {
      escribir([]);
    },
  };
}
