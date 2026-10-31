/**
 * <av-equipos> — tarjetas de equipos (color, descripción, integrantes como personas compactas) con, si hay permiso,
 * crear/editar equipo (diálogo propio), eliminar (popconfirm), agregar integrante (select de miembros que faltan) y
 * quitar integrante. Emite `av-equipo-guardar { iequipo, nombre, descripcion, color }`, `av-equipo-eliminar { iequipo }`,
 * `av-integrante-agregar { iequipo, iusuario, rol }` y `av-integrante-quitar { iequipo, iusuario }`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvEquiposProps, Equipo } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { ROLES_EQUIPO } from '../../../src/js/consts/schemas/organizacion.schemas.js';
import { candidatos, colorEquipo, etiquetaRol, nombreDe } from '../utils/organizacion.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Campo = HTMLElement & { value: string };
type Dialogo = HTMLElement & { open: boolean; show(): void; hide(): void };

const AvEquipos = crearComponente<AvEquiposProps>(import.meta.url, 'av-equipos', { items: [], miembros: [], cargando: false, puedeGestionar: false, ocupado: false, error: '' }, (root, props, host) => {
  let editando: Equipo | null = null;
  const abrirForm = (e: Equipo | null) => {
    editando = e;
    (root.querySelector('#f-titulo') as HTMLElement).textContent = e ? 'Editar equipo' : 'Nuevo equipo';
    (root.querySelector('#f-nombre') as Campo).value = e?.nombre ?? '';
    (root.querySelector('#f-descripcion') as Campo).value = e?.descripcion ?? '';
    (root.querySelector('#f-color') as Campo).value = e?.color && /^#[0-9a-fA-F]{6}$/.test(e.color) ? e.color : '#2563eb';
    (root.querySelector('#f-aviso') as HTMLElement).hidden = true;
    (root.querySelector('#form') as Dialogo).show();
  };
  const guardar = () => {
    const nombre = (root.querySelector('#f-nombre') as Campo).value.trim();
    const aviso = root.querySelector('#f-aviso') as HTMLElement;
    if (!nombre) {
      aviso.textContent = 'El nombre es obligatorio';
      aviso.hidden = false;
      return;
    }
    aviso.hidden = true;
    emitir(host, 'av-equipo-guardar', { iequipo: editando?.iequipo ?? null, nombre, descripcion: (root.querySelector('#f-descripcion') as Campo).value.trim() || null, color: (root.querySelector('#f-color') as Campo).value || null });
  };
  const agregar = (e: Equipo, i: number) => {
    const iusuario = (root.querySelector(`#cand-${i}`) as Campo | null)?.value;
    const rol = (root.querySelector(`#rolc-${i}`) as Campo | null)?.value ?? 'integrante';
    if (!iusuario) return;
    emitir(host, 'av-integrante-agregar', { iequipo: e.iequipo, iusuario, rol: ROLES_EQUIPO.includes(rol as (typeof ROLES_EQUIPO)[number]) ? rol : 'integrante' });
  };
  root.append(html`
    <section class="equipos" part="equipos">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Equipos <iswc-badge color="neutral" pill>${props.items.length}</iswc-badge></strong>
        ${props.puedeGestionar ? html`<iswc-button id="nuevo" color="brand" oniswc-click=${() => abrirForm(null)}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nuevo equipo</iswc-button>` : null}
      </div>
      ${props.error ? html`<iswc-callout tone="danger">${props.error}</iswc-callout>` : null}
      ${props.cargando
        ? html`<iswc-empty-state id="cargando"></iswc-empty-state>`
        : props.items.length === 0
        ? html`<iswc-empty-state id="vacio">${props.puedeGestionar ? html`<iswc-button color="brand" oniswc-click=${() => abrirForm(null)}>Crear el primero</iswc-button>` : null}</iswc-empty-state>`
        : html`<div class="rejilla" part="rejilla">
            ${props.items.map((e, i) => {
              const libres = candidatos(props.miembros, e.integrantes);
              return html`
                <iswc-card variant="outlined" class="equipo" data-iequipo=${String(e.iequipo)} style=${`--equipo: ${colorEquipo(e.color)}`}>
                  <strong slot="header" class="cabeza"><span class="punto"></span>${e.nombre}</strong>
                  ${props.puedeGestionar
                    ? html`<span slot="header-actions" class="acciones">
                        <iswc-button variant="plain" color="neutral" title="Editar" oniswc-click=${() => abrirForm(e)}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>
                        <iswc-button id=${`del-${i}`} variant="plain" color="danger" title="Eliminar"><iswc-icon icon="mdi:delete-outline"></iswc-icon></iswc-button>
                        <iswc-popconfirm for=${`del-${i}`} message=${`¿Eliminar el equipo ${e.nombre}?`} oniswc-popconfirm-confirm=${() => emitir(host, 'av-equipo-eliminar', { iequipo: e.iequipo })}>
                          <iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button>
                          <iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button>
                        </iswc-popconfirm>
                      </span>`
                    : null}
                  ${e.descripcion ? html`<p class="descripcion">${e.descripcion}</p>` : null}
                  <ul class="integrantes">
                    ${e.integrantes.length === 0 ? html`<li class="nadie">Sin integrantes</li>` : null}
                    ${e.integrantes.map((it) => html`
                      <li class="integrante">
                        <iswc-person class="persona" data-iusuario=${it.iusuario}></iswc-person>
                        ${it.rol === 'lider' ? html`<iswc-tag color="brand" pill>${etiquetaRol('lider')}</iswc-tag>` : null}
                        ${props.puedeGestionar ? html`<iswc-button variant="plain" color="neutral" class="quitar" title=${`Quitar a ${nombreDe(it)}`} oniswc-click=${() => emitir(host, 'av-integrante-quitar', { iequipo: e.iequipo, iusuario: it.iusuario })}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>` : null}
                      </li>
                    `)}
                  </ul>
                  ${props.puedeGestionar && libres.length
                    ? html`<div slot="footer" class="agregar">
                        <iswc-select id=${`cand-${i}`} placeholder="Agregar miembro" aria-label="Miembro a agregar">${libres.map((m) => html`<iswc-option value=${m.iusuario}>${nombreDe(m)}</iswc-option>`)}</iswc-select>
                        <iswc-select id=${`rolc-${i}`} value="integrante" aria-label="Rol en el equipo">${ROLES_EQUIPO.map((r) => html`<iswc-option value=${r}>${etiquetaRol(r)}</iswc-option>`)}</iswc-select>
                        <iswc-button variant="outlined" color="brand" oniswc-click=${() => agregar(e, i)}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>
                      </div>`
                    : null}
                </iswc-card>
              `;
            })}
          </div>`}
      <iswc-dialog id="form" backdrop-variant="basic">
        <span slot="label" id="f-titulo">Nuevo equipo</span>
        <div class="campos">
          <iswc-input id="f-nombre" label="Nombre" required maxlength="120"></iswc-input>
          <iswc-textarea id="f-descripcion" label="Descripción" rows="2"></iswc-textarea>
          <iswc-input id="f-color" type="color" label="Color" value="#2563eb"></iswc-input>
          <iswc-callout id="f-aviso" tone="danger" hidden></iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${() => (root.querySelector('#form') as Dialogo).hide()}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="f-guardar" color="brand" ?loading=${props.ocupado} oniswc-click=${guardar}>Guardar</iswc-button>
      </iswc-dialog>
    </section>
  `);
  for (const p of root.querySelectorAll<ConProps>('iswc-person')) {
    const iusuario = p.dataset['iusuario'] ?? '';
    const it = props.items.flatMap((e) => e.integrantes).find((x) => x.iusuario === iusuario);
    p.props = { usuario: iusuario, nombre: it?.usuario?.nombre ?? null, detalle: it ? etiquetaRol(it.rol) : '' };
  }
  const cargando = root.querySelector('#cargando') as ConProps | null;
  if (cargando) cargando.props = { estado: 'cargando' };
  const vacio = root.querySelector('#vacio') as ConProps | null;
  if (vacio) vacio.props = { icono: 'mdi:account-multiple-outline', titulo: 'Sin equipos', texto: 'Crea equipos para agrupar canales y proyectos.' };
});

define('av-equipos', AvEquipos);
