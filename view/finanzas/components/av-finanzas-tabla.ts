/**
 * <av-finanzas-tabla> — tabla de `transacciones` o `facturas` (buscador + `iswc-data-grid` del kit, vía
 * `base/grilla.ts`). Las facturas traen acciones por fila (Emitir en borrador, Pagar en emitida/vencida) solo con
 * permiso. Emite `av-finanzas-buscar { entidad, texto }`, `av-finanzas-abrir { entidad, id }` y
 * `av-finanzas-accion { entidad, accion, id }`. Un refresco reasigna filas sin repintar.
 */
import { crearComponente, define } from '../../../src/js/base/componente.js';
import { montarGrilla, refrescarGrilla } from '../../../src/js/base/grilla.js';
import type { AvFinanzasTablaProps } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { columnasFinanzas, TABLAS_FINANZAS } from '../utils/finanzas.js';

const AvFinanzasTabla = crearComponente<AvFinanzasTablaProps>(
  import.meta.url,
  'av-finanzas-tabla',
  { entidad: 'transacciones', filas: [], cargando: false, texto: '', puedeEscribir: false },
  (root, props, host) => {
    const t = TABLAS_FINANZAS[props.entidad]!;
    montarGrilla(root, { host, prefijo: 'av-finanzas', entidad: props.entidad, columnas: columnasFinanzas(props.entidad), filas: props.filas, idCampo: t.idCampo, cargando: props.cargando, texto: props.texto, buscador: t.buscador, vacio: t.vacio, conAcciones: props.puedeEscribir });
  },
  (root, props, previos) => {
    if (props.entidad !== previos.entidad || props.puedeEscribir !== previos.puedeEscribir) return false;
    refrescarGrilla(root, props.filas, props.cargando, props.texto);
    return true;
  },
);

define('av-finanzas-tabla', AvFinanzasTabla);
