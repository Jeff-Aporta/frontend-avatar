/**
 * <av-empresa-selector> — la empresa activa del usuario (un `iswc-select` con sus empresas). Cambiarla escribe el estado
 * (`fijar({ empresa })`) y emite `av-empresa-cambio { iempresa }`; las vistas privadas se recargan con la nueva empresa.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvEmpresaSelectorProps } from '../../consts/schemas/componentes.schemas.js';
import { fijar } from '../../core/estado.js';

type SelectEl = HTMLElement & { value: string };

const AvEmpresaSelector = crearComponente<AvEmpresaSelectorProps>(import.meta.url, 'av-empresa-selector', { empresas: [], activa: null }, (root, props, host) => {
  if (props.empresas.length === 0) {
    root.append(html`<iswc-tag color="neutral" part="sin-empresa">Sin empresa</iswc-tag>`);
    return;
  }
  const cambiar = (e: Event) => {
    const iempresa = Number((e.target as SelectEl).value);
    if (!iempresa || iempresa === props.activa) return;
    fijar({ empresa: iempresa });
    emitir(host, 'av-empresa-cambio', { iempresa });
  };
  root.append(html`
    <iswc-select class="selector" part="selector" aria-label="Empresa activa" value=${String(props.activa ?? props.empresas[0]!.iempresa)} oniswc-change=${cambiar}>
      <iswc-icon slot="start" icon="mdi:domain"></iswc-icon>
      ${props.empresas.map((e) => html`<iswc-option value=${String(e.iempresa)}>${e.nombre}</iswc-option>`)}
    </iswc-select>
  `);
});

define('av-empresa-selector', AvEmpresaSelector);
