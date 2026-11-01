/**
 * crm.ts — dominio de la vista `crm` (sin DOM): totales por etapa, filtro, columnas del grid, color por etapa y formato
 * de moneda. Los componentes solo pintan lo que esto devuelve.
 */
import type { ColumnaTabla, ConfigTabla } from '../../../src/js/consts/schemas/componentes.schemas.js';
import { type Cliente, ETAPAS_CRM, type EtapaTotal } from '../../../src/js/consts/schemas/crm.schemas.js';

/** Etiquetas legibles por etapa. */
export const ETAPA_LABEL: Record<string, string> = { contacto: 'Contacto', propuesta: 'Propuesta', negociacion: 'Negociación', cerrado: 'Cerrado', perdido: 'Perdido' };

/** Color del kit por etapa. */
export function colorEtapa(etapa: string): 'neutral' | 'brand' | 'warning' | 'success' | 'danger' {
  if (etapa === 'propuesta') return 'brand';
  if (etapa === 'negociacion') return 'warning';
  if (etapa === 'cerrado') return 'success';
  if (etapa === 'perdido') return 'danger';
  return 'neutral';
}

/** Moneda es-CO sin decimales. */
export const moneda = (n: number): string => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

/** Conteo y suma de valor por etapa, en el orden del embudo (0 donde no hay clientes). */
export function totalesPorEtapa(clientes: Cliente[]): EtapaTotal[] {
  return ETAPAS_CRM.map((etapa) => {
    const de = clientes.filter((c) => c.etapa === etapa);
    return { etapa, label: ETAPA_LABEL[etapa]!, cantidad: de.length, valor: de.reduce((s, c) => s + Number(c.valor ?? 0), 0) };
  });
}

/** Clientes de una etapa (sin etapa = todos). */
export function filtrarPorEtapa(clientes: Cliente[], etapa: string | null): Cliente[] {
  return etapa ? clientes.filter((c) => c.etapa === etapa) : clientes;
}

/** Valor del pipeline: todo menos lo perdido. */
export function valorPipeline(clientes: Cliente[]): number {
  return clientes.filter((c) => c.etapa !== 'perdido').reduce((s, c) => s + Number(c.valor ?? 0), 0);
}

/** Columnas del grid de clientes, en orden. */
export function columnasClientes(): ColumnaTabla[] {
  return [
    { field: 'nombre', headerName: 'Nombre', flex: 1.2, minWidth: 160 },
    { field: 'organizacion', headerName: 'Organización', flex: 1.2, minWidth: 160 },
    { field: 'email', headerName: 'Correo', flex: 1.2, minWidth: 180 },
    { field: 'telefono', headerName: 'Teléfono', flex: 0.8, minWidth: 120 },
    { field: 'etapa', headerName: 'Etapa', flex: 0.8, minWidth: 120 },
    { field: 'valor', headerName: 'Valor', type: 'number', flex: 0.8, minWidth: 120, valueFormatter: (p) => moneda(Number(p.value ?? 0)) },
    { field: 'responsable', headerName: 'Responsable', flex: 0.8, minWidth: 120 },
  ];
}

/** Campos de búsqueda de un cliente. */
export const camposCliente = (c: Cliente): unknown[] => [c.nombre, c.organizacion, c.email, c.telefono, ETAPA_LABEL[c.etapa], c.responsable];

/** Configuración de `<av-tabla>` para los clientes. */
export function tablaClientes(): ConfigTabla {
  return { prefijo: 'av-crm', entidad: 'clientes', columnas: columnasClientes(), idCampo: 'icliente', buscador: 'Buscar por nombre, organización, correo…', vacio: { icono: 'mdi:account-search-outline', titulo: 'Sin clientes', texto: 'No hay clientes para mostrar con este filtro.' }, porPagina: 25 };
}

/** Filas del grid (JSON plano; etapa legible). */
export function filasClientes(clientes: Cliente[]): Record<string, unknown>[] {
  return clientes.map((c) => ({ ...c, id: c.icliente, etapa: ETAPA_LABEL[c.etapa] ?? c.etapa, etapaClave: c.etapa, valor: Number(c.valor ?? 0) }));
}
