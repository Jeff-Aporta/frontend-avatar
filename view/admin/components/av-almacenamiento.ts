/**
 * <av-almacenamiento> — límite de tamaño por archivo y uso actual. El límite vive en la base, así que crece junto con el
 * almacenamiento sin desplegar. Emite `av-almacenamiento-guardar { max_mb }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvAlmacenamientoProps } from '../../../src/js/consts/schemas/admin.schemas.js';

type Campo = HTMLElement & { value: string };

const AvAlmacenamiento = crearComponente<AvAlmacenamientoProps>(
  import.meta.url,
  'av-almacenamiento',
  { maxMb: 30, topeMb: 95, archivos: null, bytes: null, ocupado: false },
  (root, props, host) => {
    const guardar = () => emitir(host, 'av-almacenamiento-guardar', { max_mb: Number((root.querySelector('#limite') as Campo).value) });
    root.append(html`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header"><iswc-icon icon="mdi:database-cog-outline"></iswc-icon> Archivos</strong>
        <div class="campos">
          <iswc-input id="limite" type="number" min="1" max=${String(props.topeMb)} step="1" label="Tamaño máximo por archivo (MB)" hint=${`Hasta ${props.topeMb} MB por petición en Cloudflare.`} value=${String(props.maxMb)}></iswc-input>
          <p class="uso">${props.archivos == null ? 'Calculando uso…' : html`${String(props.archivos)} archivos · <iswc-format-bytes value=${String(props.bytes ?? 0)} autofit></iswc-format-bytes> guardados en R2`}</p>
        </div>
        <iswc-button variant="compact" slot="footer" color="brand" ?loading=${props.ocupado} oniswc-click=${guardar}>Guardar límite</iswc-button>
      </iswc-card>
    `);
  },
);

define('av-almacenamiento', AvAlmacenamiento);
