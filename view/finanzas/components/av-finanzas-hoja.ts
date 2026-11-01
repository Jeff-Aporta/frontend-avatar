/**
 * <av-finanzas-hoja> — hoja de cuadre (`iswc-spreadsheet`): vuelca las transacciones y totaliza por moneda con fórmulas.
 * Es un borrador: lo que se edite aquí no toca los libros ni se guarda.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import type { AvFinanzasHojaProps } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { filasHoja } from '../utils/finanzas.js';

type Hoja = HTMLElement & { value: unknown };

const AvFinanzasHoja = crearComponente<AvFinanzasHojaProps>(
  import.meta.url,
  'av-finanzas-hoja',
  { transacciones: [] },
  (root, props) => {
    const matriz = filasHoja(props.transacciones);
    root.append(html`
      <p class="nota">Borrador para cuadrar cifras: lo que edites aquí no cambia las transacciones ni se guarda.</p>
      <iswc-spreadsheet class="hoja" part="hoja" locale="es" rows=${matriz.length + 5} cols="12" without-tabs></iswc-spreadsheet>
    `);
    (root.querySelector('.hoja') as Hoja).value = matriz;
  },
);

define('av-finanzas-hoja', AvFinanzasHoja);
