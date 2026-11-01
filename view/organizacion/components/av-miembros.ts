/**
 * <av-miembros> — lista de miembros de la empresa: persona, rol (tag), cargo y, con permiso, quitar (popconfirm) e
 * «Invitar». Emite `av-miembro-quitar { iusuario }` y `av-miembros-invitar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvMiembrosProps } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { colorRol, etiquetaRol, nombreDe, ordenarMiembros } from '../utils/organizacion.js';

const AvMiembros = crearComponente<AvMiembrosProps>(import.meta.url, 'av-miembros', { items: [], cargando: false, puedeGestionar: false }, (root, props, host) => {
  const lista = ordenarMiembros(props.items);
  root.append(html`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Miembros <iswc-badge color="neutral" pill>${lista.length}</iswc-badge></strong>
      ${props.puedeGestionar ? html`<iswc-button variant="compact" slot="header-actions" color="brand" id="invitar" oniswc-click=${() => emitir(host, 'av-miembros-invitar', {})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>` : null}
      ${props.cargando
        ? html`<iswc-empty-state estado="cargando"></iswc-empty-state>`
        : lista.length === 0
        ? html`<iswc-empty-state icono="mdi:account-group-outline" titulo="Sin miembros" texto="Invita usuarios para que trabajen en esta empresa."></iswc-empty-state>`
        : html`<ul class="lista" part="lista">
            ${lista.map((m, i) => html`
              <li class="fila" data-iusuario=${m.iusuario}>
                <iswc-person class="persona" usuario=${m.iusuario} nombre=${m.usuario?.nombre ?? ''} detalle=${m.usuario?.email ?? m.iusuario}></iswc-person>
                <iswc-tag color=${colorRol(m.rol)} pill>${etiquetaRol(m.rol)}</iswc-tag>
                <span class="cargo">${m.cargo ?? ''}</span>
                ${props.puedeGestionar && m.rol !== 'propietario'
                  ? html`<iswc-button id=${`quitar-${i}`} variant="plain compact" color="danger" class="quitar" title="Quitar de la empresa"><iswc-icon icon="mdi:account-remove-outline"></iswc-icon></iswc-button>
                    <iswc-popconfirm for=${`quitar-${i}`} message=${`¿Quitar a ${nombreDe(m)} de la empresa?`} oniswc-popconfirm-confirm=${() => emitir(host, 'av-miembro-quitar', { iusuario: m.iusuario })}>
                      <iswc-button variant="compact" slot="confirm" color="danger">Sí, quitar</iswc-button>
                      <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
                    </iswc-popconfirm>`
                  : html`<span></span>`}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);
});

define('av-miembros', AvMiembros);
