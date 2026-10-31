/**
 * <av-conversor> — conversor de monedas con la tabla de tasas de la empresa: monto, moneda origen, botón de
 * intercambio y moneda destino; el resultado grande con la tasa aplicada, y abajo las equivalencias vigentes.
 * No calcula: emite `av-conversor-convertir { monto, de, a }` en cada cambio y el shell pide la conversión al API.
 * Un refresco del resultado no repinta los campos (conserva foco y texto).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvConversorProps } from '../../../src/js/consts/schemas/finanzas.schemas.js';
import { formatoMoneda } from '../../../src/js/core/datos.js';
import { equivalencias, monedasConTasa } from '../utils/finanzas.js';

type Campo = HTMLElement & { value: string };

function pintarResultado(root: ShadowRoot, props: AvConversorProps): void {
  const caja = root.querySelector('.resultado') as HTMLElement;
  const r = props.resultado;
  caja.toggleAttribute('data-ocupado', props.ocupado);
  caja.replaceChildren(html`
    ${props.error
      ? html`<span class="error">${props.error}</span>`
      : r
        ? html`<span class="cifra" part="cifra">${formatoMoneda(r.resultado, r.a)}</span><span class="tasa">1 ${r.de} = ${formatoMoneda(r.tasa, r.a)} · ${formatoMoneda(r.monto, r.de)}</span>`
        : html`<span class="tasa">Escribe un monto para convertir</span>`}
  `);
}

const AvConversor = crearComponente<AvConversorProps>(
  import.meta.url,
  'av-conversor',
  { tasas: [], monto: 1000, de: 'USD', a: 'COP', resultado: null, ocupado: false, error: '' },
  (root, props, host) => {
    const monedas = monedasConTasa(props.tasas);
    const leer = () => ({
      monto: Number((root.querySelector('#monto') as Campo).value || 0),
      de: (root.querySelector('#de') as Campo).value || props.de,
      a: (root.querySelector('#a') as Campo).value || props.a,
    });
    const avisar = () => emitir(host, 'av-conversor-convertir', leer());
    const invertir = () => {
      const v = leer();
      (root.querySelector('#de') as Campo).value = v.a;
      (root.querySelector('#a') as Campo).value = v.de;
      avisar();
    };
    root.append(html`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon="mdi:swap-horizontal-circle-outline"></iswc-icon> Conversor de monedas</strong>
        <div class="fila" part="fila">
          <iswc-input id="monto" class="monto" type="number" min="0" step="any" label="Monto" value=${String(props.monto)} oniswc-input=${avisar}></iswc-input>
          <iswc-select id="de" class="moneda" label="De" value=${props.de} oniswc-change=${avisar}>${monedas.map((m) => html`<iswc-option value=${m}>${m}</iswc-option>`)}</iswc-select>
          <iswc-button class="invertir" variant="soft" color="brand" aria-label="Intercambiar monedas" title="Intercambiar" oniswc-click=${invertir}><iswc-icon icon="mdi:swap-horizontal"></iswc-icon></iswc-button>
          <iswc-select id="a" class="moneda" label="A" value=${props.a} oniswc-change=${avisar}>${monedas.map((m) => html`<iswc-option value=${m}>${m}</iswc-option>`)}</iswc-select>
        </div>
        <div class="resultado" part="resultado" aria-live="polite"></div>
        <div class="tasas" part="tasas">
          ${equivalencias(props.tasas).map((e) => html`<span class="equivalencia"><iswc-tag color="neutral" variant="outlined" pill>${e.moneda}</iswc-tag><span>${e.texto}</span></span>`)}
        </div>
      </iswc-card>
    `);
    pintarResultado(root, props);
  },
  (root, props, previos) => {
    if (props.tasas !== previos.tasas && JSON.stringify(props.tasas) !== JSON.stringify(previos.tasas)) return false;
    if (!root.querySelector('.resultado')) return false;
    pintarResultado(root, props);
    return true;
  },
);

define('av-conversor', AvConversor);
