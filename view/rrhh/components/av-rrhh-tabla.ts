/**
 * <av-rrhh-tabla> — tabla de `empleados` o `asistencias` (buscador + `iswc-data-grid` del kit, vía `base/grilla.ts`).
 * Emite `av-rrhh-buscar { entidad, texto }` y `av-rrhh-abrir { entidad, id }`. Un refresco reasigna filas sin repintar.
 */
import { crearComponente, define } from '../../../src/js/base/componente.js';
import { montarGrilla, refrescarGrilla } from '../../../src/js/base/grilla.js';
import type { AvRrhhTablaProps } from '../../../src/js/consts/schemas/rrhh.schemas.js';
import { columnasRrhh, TABLAS_RRHH } from '../utils/rrhh.js';

const AvRrhhTabla = crearComponente<AvRrhhTablaProps>(
  import.meta.url,
  'av-rrhh-tabla',
  { entidad: 'empleados', filas: [], cargando: false, texto: '', puedeEscribir: false },
  (root, props, host) => {
    const t = TABLAS_RRHH[props.entidad]!;
    montarGrilla(root, { host, prefijo: 'av-rrhh', entidad: props.entidad, columnas: columnasRrhh(props.entidad), filas: props.filas, idCampo: t.idCampo, cargando: props.cargando, texto: props.texto, buscador: t.buscador, vacio: t.vacio, conAcciones: props.puedeEscribir });
  },
  (root, props, previos) => {
    if (props.entidad !== previos.entidad || props.puedeEscribir !== previos.puedeEscribir) return false;
    refrescarGrilla(root, props.filas, props.cargando, props.texto);
    return true;
  },
);

define('av-rrhh-tabla', AvRrhhTabla);
