/**
 * <av-roles> — roles del grupo con sus acciones (valor legible como tag) y formularios para crear un rol y para poner
 * una acción del catálogo a un rol con valor permite/niega; cada acción se quita con su ×.
 * Emite `av-rol-crear { irol, nombre }`, `av-accion-poner { irol, iaccion, valor }` y `av-accion-quitar { irol, iaccion }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvRolesProps } from '../../../src/js/consts/schemas/admin.schemas.js';
import { accionesDe, colorValor, etiquetaRol, normalizarIrol, valorLegible } from '../utils/admin.js';

type Campo = HTMLElement & { value: string };

const AvRoles = crearComponente<AvRolesProps>(import.meta.url, 'av-roles', { roles: [], acciones: [], catalogo: [], cargando: false, ocupado: false, error: '' }, (root, props, host) => {
  const v = (sel: string) => (root.querySelector(sel) as Campo | null)?.value ?? '';
  const crear = () => {
    const irol = normalizarIrol(v('#nuevo-irol'));
    if (!irol) return;
    emitir(host, 'av-rol-crear', { irol, nombre: v('#nuevo-nombre').trim() || irol });
  };
  const poner = () => {
    const irol = v('#p-rol');
    const iaccion = v('#p-accion');
    if (!irol || !iaccion) return;
    emitir(host, 'av-accion-poner', { irol, iaccion, valor: v('#p-valor') !== 'niega' });
  };
  root.append(html`
    <section class="roles" part="roles">
      ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
      <div class="formularios">
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:shield-plus-outline"></iswc-icon> Nuevo rol</strong>
          <div class="fila">
            <iswc-input id="nuevo-irol" label="Id" placeholder="SOPORTE" maxlength="30" hint="Mayúsculas, sin espacios"></iswc-input>
            <iswc-input id="nuevo-nombre" label="Nombre" maxlength="120"></iswc-input>
            <iswc-button variant="compact" id="crear" color="brand" ?loading=${props.ocupado} oniswc-click=${crear}>Crear</iswc-button>
          </div>
        </iswc-card>
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:key-plus"></iswc-icon> Dar o negar una acción</strong>
          <div class="fila">
            <iswc-select id="p-rol" label="Rol">${props.roles.map((r) => html`<iswc-option value=${r.irol}>${etiquetaRol(r.irol)}</iswc-option>`)}</iswc-select>
            <iswc-select id="p-accion" label="Acción" max-visible="10">
              <iswc-option value="*">* (todas)</iswc-option>
              ${props.catalogo.map((c) => html`<iswc-option value=${c.id}>${c.id}</iswc-option>`)}
            </iswc-select>
            <iswc-select id="p-valor" label="Valor" value="permite"><iswc-option value="permite">Permite</iswc-option><iswc-option value="niega">Niega</iswc-option></iswc-select>
            <iswc-button variant="compact" id="poner" color="brand" ?loading=${props.ocupado} oniswc-click=${poner}>Aplicar</iswc-button>
          </div>
        </iswc-card>
      </div>
      ${props.cargando
        ? html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`
        : html`<div class="rejilla" part="rejilla">
            ${props.roles.map((r) => html`
              <iswc-card variant="outlined" class="rol" data-irol=${r.irol}>
                <strong slot="header">${etiquetaRol(r.irol)} <iswc-tag color="neutral" pill>${r.irol}</iswc-tag></strong>
                ${r.nombre ? html`<p class="descripcion">${r.nombre}</p>` : null}
                <ul class="acciones">
                  ${accionesDe(r.irol, props.acciones).length === 0 ? html`<li class="nada">${r.irol === 'ADMIN' ? 'Todo permitido (*)' : 'Hereda del rol base'}</li>` : null}
                  ${accionesDe(r.irol, props.acciones).map((a) => html`
                    <li class="accion">
                      <code class="id">${a.iaccion}</code>
                      <iswc-tag color=${colorValor(a.valor)}>${valorLegible(a.valor)}</iswc-tag>
                      <iswc-button variant="plain compact" color="neutral" class="quitar" title="Quitar acción" oniswc-click=${() => emitir(host, 'av-accion-quitar', { irol: r.irol, iaccion: a.iaccion })}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
                    </li>
                  `)}
                </ul>
              </iswc-card>
            `)}
          </div>`}
    </section>
  `);
});

define('av-roles', AvRoles);
