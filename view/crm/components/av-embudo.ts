/**
 * <av-embudo> — fila de tarjetas por etapa (conteo y valor). Clic en una tarjeta emite `av-crm-filtrar { etapa }`;
 * clic en la activa la desactiva (`etapa: null`).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvEmbudoProps } from '../../../src/js/consts/schemas/crm.schemas.js';
import { colorEtapa, moneda } from '../utils/crm.js';

const AvEmbudo = crearComponente<AvEmbudoProps>(import.meta.url, 'av-embudo', { etapas: [], activa: null }, (root, props, host) => {
  root.append(html`
    <div class="fila" part="fila" role="group" aria-label="Embudo por etapa">
      ${props.etapas.map((e) => html`
        <iswc-button class="etapa" variant=${props.activa === e.etapa ? 'soft' : 'outlined'} color=${colorEtapa(e.etapa)} data-etapa=${e.etapa} aria-pressed=${props.activa === e.etapa ? 'true' : 'false'}
          oniswc-click=${() => emitir(host, 'av-crm-filtrar', { etapa: props.activa === e.etapa ? null : e.etapa })}>
          <span class="contenido"><span class="label">${e.label}</span><strong class="cantidad">${e.cantidad}</strong><span class="valor">${moneda(e.valor)}</span></span>
        </iswc-button>
      `)}
    </div>
  `);
});

define('av-embudo', AvEmbudo);
