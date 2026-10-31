/**
 * <av-inventario-tabla> — tabla de `productos`, `movimientos`, `pedidos` o `proveedores` (buscador + `iswc-data-grid`
 * del kit, vía `base/grilla.ts`). Los productos traen acciones Entrada / Salida por fila solo con permiso. Emite
 * `av-inventario-buscar { entidad, texto }`, `av-inventario-abrir { entidad, id }` y
 * `av-inventario-accion { entidad, accion, id }`. Un refresco reasigna filas sin repintar.
 */
import { crearComponente, define } from '../../../src/js/base/componente.js';
import { montarGrilla, refrescarGrilla } from '../../../src/js/base/grilla.js';
import type { AvInventarioTablaProps } from '../../../src/js/consts/schemas/inventario.schemas.js';
import { columnasInventario, TABLAS_INVENTARIO } from '../utils/inventario.js';

const AvInventarioTabla = crearComponente<AvInventarioTablaProps>(
  import.meta.url,
  'av-inventario-tabla',
  { entidad: 'productos', filas: [], cargando: false, texto: '', puedeEscribir: false },
  (root, props, host) => {
    const t = TABLAS_INVENTARIO[props.entidad]!;
    montarGrilla(root, { host, prefijo: 'av-inventario', entidad: props.entidad, columnas: columnasInventario(props.entidad), filas: props.filas, idCampo: t.idCampo, cargando: props.cargando, texto: props.texto, buscador: t.buscador, vacio: t.vacio, conAcciones: props.puedeEscribir });
  },
  (root, props, previos) => {
    if (props.entidad !== previos.entidad || props.puedeEscribir !== previos.puedeEscribir) return false;
    refrescarGrilla(root, props.filas, props.cargando, props.texto);
    return true;
  },
);

define('av-inventario-tabla', AvInventarioTabla);
