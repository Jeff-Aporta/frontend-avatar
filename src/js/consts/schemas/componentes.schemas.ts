/**
 * componentes.schemas.ts — forma de las `props` de los componentes TRANSVERSALES (`src/js/components/av/`) y tipos
 * auxiliares de la base. Cada vista tiene su propio `<vista>.schemas.ts` en esta carpeta con las props de sus piezas.
 *
 * Regla: los tipos salen de `z.infer<>`; no hay `type`/`interface` sueltos fuera de `*.schemas.ts`.
 * Datos que vienen de fuera (API, URL, almacenamiento) se PARSEAN con su schema (`safeParse`), nunca se castean con `as`.
 */
import { z } from '../../base/zod.js';
import { PerfilPruebaSchema } from './api.schemas.js';

/** Ruta de la app: vista (una página real por vista) e id opcional del registro abierto (viaja en el historial). */
export const RutaSchema = z.object({ vista: z.string(), id: z.string().nullable() });
export type Ruta = z.infer<typeof RutaSchema>;

/** `<av-app>`: el shell. Recibe la ruta activa (la fija el router) y si la sesión ya se restauró. */
export const AvAppPropsSchema = z.object({
  vista: z.string().default('inicio'),
  id: z.string().nullable().default(null),
  listo: z.boolean().default(false),
  /** Sube al cambiar de empresa: remonta solo el contenido de la vista. */
  version: z.number().default(0),
});
export type AvAppProps = z.infer<typeof AvAppPropsSchema>;

/** Familia de navegación. */
export const AvLinkPropsSchema = z.object({ vista: z.string().default(''), registro: z.string().nullable().default(null) });
export type AvLinkProps = z.infer<typeof AvLinkPropsSchema>;
export const AvBotonEnlacePropsSchema = AvLinkPropsSchema.extend({ variant: z.string().default('outlined compact'), color: z.string().default('brand') });
export type AvBotonEnlaceProps = z.infer<typeof AvBotonEnlacePropsSchema>;
export const AvMenuLateralPropsSchema = z.object({ items: z.array(z.unknown()).default([]), compacto: z.boolean().default(false) });
export type AvMenuLateralProps = z.infer<typeof AvMenuLateralPropsSchema>;
export const AvPestanasPropsSchema = z.object({ vista: z.string().default('') });
export type AvPestanasProps = z.infer<typeof AvPestanasPropsSchema>;
export const AvCampanaPropsSchema = z.object({});
export type AvCampanaProps = z.infer<typeof AvCampanaPropsSchema>;
export const AvMigasPropsSchema = z.object({});
export type AvMigasProps = z.infer<typeof AvMigasPropsSchema>;
export const AvOutletPropsSchema = z.object({ vista: z.string().default(''), id: z.string().nullable().default(null), sesion: z.boolean().default(false), version: z.number().default(0) });
export type AvOutletProps = z.infer<typeof AvOutletPropsSchema>;

/** `<av-logo>`: logo de Avatar en SVG con los tokens de la paleta; `wordmark` agrega el nombre; `animado` hace orbitar el satélite. */
export const AvLogoPropsSchema = z.object({
  wordmark: z.boolean().default(false),
  animado: z.boolean().default(false),
});
export type AvLogoProps = z.infer<typeof AvLogoPropsSchema>;

/** Un indicador (KPI) para `<iswc-stat-group>`: lo que devuelven los `indicadores*` de cada vista. */
export const IndicadorSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  helper: z.string().default(''),
  icon: z.string().default(''),
  color: z.enum(['brand', 'neutral', 'success', 'warning', 'danger']).default('brand'),
  trend: z.string().default(''),
  trendDirection: z.enum(['up', 'down', 'flat', '']).default(''),
});
export type Indicador = z.infer<typeof IndicadorSchema>;

/** `<av-escena>`: ilustración Memphis por capas (`core/escenas.ts`); `etiqueta` la vuelve informativa para lectores de pantalla. */
export const AvEscenaPropsSchema = z.object({
  escena: z.string().default('bienvenida'),
  etiqueta: z.string().default(''),
});
export type AvEscenaProps = z.infer<typeof AvEscenaPropsSchema>;

/** `<av-perfil-selector>`: cambia de perfil; sin sesión guardada para ese perfil pide su PIN. */
/** <av-grafica>: tarjeta con una gráfica del kit y sus estados; `config` la arma la vista. */
export const AvGraficaPropsSchema = z.object({
  tipo: z.enum(['barras', 'dona']).default('barras'),
  titulo: z.string().default(''),
  icono: z.string().default('mdi:chart-bar'),
  detalle: z.string().default(''),
  etiqueta: z.string().default(''),
  leyenda: z.boolean().default(true),
  config: z.unknown().default(null),
  cargando: z.boolean().default(false),
  vacio: z.object({ icono: z.string(), titulo: z.string(), texto: z.string() }).default({ icono: 'mdi:chart-bar', titulo: 'Sin datos', texto: '' }),
});
export type AvGraficaProps = z.infer<typeof AvGraficaPropsSchema>;

export const AvPerfilSelectorPropsSchema = z.object({ perfiles: z.array(PerfilPruebaSchema).default([]), activo: z.string().default('') });
export type AvPerfilSelectorProps = z.infer<typeof AvPerfilSelectorPropsSchema>;
/** `<av-perfiles-lista>`: filas de perfiles de prueba; `ocupado` es el que está entrando. */
export const AvPerfilesListaPropsSchema = z.object({ modo: z.enum(['lista', 'select']).default('lista'), perfiles: z.array(PerfilPruebaSchema).default([]), activo: z.string().default(''), ocupado: z.string().default(''), error: z.string().default('') });
export type AvPerfilesListaProps = z.infer<typeof AvPerfilesListaPropsSchema>;
/** `<av-perfiles-tabla>`: diálogo del pie con la lista de perfiles de prueba. */
export const AvPerfilesTablaPropsSchema = z.object({ abierto: z.boolean().default(false) });
export type AvPerfilesTablaProps = z.infer<typeof AvPerfilesTablaPropsSchema>;

/** Fila plana de `<av-tabla>`. */
export const FilaTablaSchema = z.record(z.string(), z.unknown());
export type FilaTabla = z.infer<typeof FilaTablaSchema>;

/** Acción por fila (botón con ícono). `mostrar` decide si aplica a esa fila. */
export const AccionFilaSchema = z.object({ accion: z.string(), label: z.string(), icono: z.string(), mostrar: z.custom<(fila: FilaTabla) => boolean>().optional() });
export type AccionFila = z.infer<typeof AccionFilaSchema>;

/** Columna: lo que la tabla usa del contrato del grid del kit, más `acciones` propias. Las funciones no llegan desde JSON. */
export const ColumnaTablaSchema = z.object({
  field: z.string(),
  headerName: z.string(),
  type: z.string().optional(),
  flex: z.number().optional(),
  minWidth: z.number().optional(),
  width: z.number().optional(),
  sortable: z.boolean().optional(),
  valueFormatter: z.custom<(p: { value: unknown }) => string>().optional(),
  renderCell: z.custom<(p: { value: unknown; row: FilaTabla }) => Node | string | { html: string }>().optional(),
  acciones: z.array(AccionFilaSchema).optional(),
});
export type ColumnaTabla = z.infer<typeof ColumnaTablaSchema>;

/** Lo que pinta un `<iswc-empty-state>`: los presets compartidos están en `consts/estados.ts`. */
export const EstadoVacioSchema = z.object({ icono: z.string(), titulo: z.string(), texto: z.string() });
export type EstadoVacio = z.infer<typeof EstadoVacioSchema>;

/** `<av-tabla>`: buscador + grid + vacío. La configuración es fija por tabla; `filas`, `cargando` y `texto` refrescan sin repintar. */
export const AvTablaPropsSchema = z.object({
  prefijo: z.string().default('av-tabla'),
  entidad: z.string().default(''),
  columnas: z.array(ColumnaTablaSchema).default([]),
  idCampo: z.string().default('id'),
  buscador: z.string().default('Buscar…'),
  vacio: EstadoVacioSchema.default({ icono: 'mdi:inbox-outline', titulo: 'Nada por aquí', texto: '' }),
  porPagina: z.number().default(10),
  filas: z.array(FilaTablaSchema).default([]),
  cargando: z.boolean().default(false),
  texto: z.string().default(''),
  puedeEscribir: z.boolean().default(false),
});
export type AvTablaProps = z.infer<typeof AvTablaPropsSchema>;
/** Configuración fija de una tabla: lo que cada vista declara en sus `utils`. */
export type ConfigTabla = Pick<AvTablaProps, 'prefijo' | 'entidad' | 'columnas' | 'idCampo' | 'buscador' | 'vacio'> & { porPagina?: number };

/** Props de los transversales, por tag (lo lee `props-registro.ts`). */
export const APP_PROPS = {
  'av-app': AvAppPropsSchema,
  'av-logo': AvLogoPropsSchema,
  'av-link': AvLinkPropsSchema,
  'av-boton-enlace': AvBotonEnlacePropsSchema,
  'av-menu-lateral': AvMenuLateralPropsSchema,
  'av-pestanas': AvPestanasPropsSchema,
  'av-migas': AvMigasPropsSchema,
  'av-campana': AvCampanaPropsSchema,
  'av-outlet': AvOutletPropsSchema,
  'av-escena': AvEscenaPropsSchema,
  'av-grafica': AvGraficaPropsSchema,
  'av-perfil-selector': AvPerfilSelectorPropsSchema,
  'av-perfiles-lista': AvPerfilesListaPropsSchema,
  'av-perfiles-tabla': AvPerfilesTablaPropsSchema,
  'av-tabla': AvTablaPropsSchema,
} as const;

/** Base (`componente.ts`): atributos e hijos del helper `el()`. */
export type Atributos = Record<string, unknown>;
export type Hijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
