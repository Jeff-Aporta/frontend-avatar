/**
 * <av-menu> — menú lateral del área privada, como el MenuCollapsed del React original: un botón «Menú» que pliega o
 * despliega, y una lista de módulos con ícono; plegado solo muestra íconos (con tooltip). Los módulos se agrupan
 * (Trabajo, Negocio, Empresa) y cada uno puede llevar un contador (p. ej. correos sin leer).
 *
 * Emite `av-menu-ir { id }` al elegir un módulo y `av-menu-plegar { plegado }` al plegar/desplegar (el shell guarda la
 * preferencia y ajusta el ancho de la barra lateral). Todo en em: escala con el font-size del contexto.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvMenuProps } from '../../consts/schemas/componentes.schemas.js';

const AvMenu = crearComponente<AvMenuProps>(
  import.meta.url,
  'av-menu',
  { items: [], activo: '', plegado: false },
  (root, props, host) => {
    const grupos = [...new Set(props.items.map((i) => i.grupo))];
    root.append(html`
      <nav class="menu" part="menu" data-plegado=${props.plegado ? '1' : '0'} aria-label="Módulos">
        <button class="plegar" part="plegar" type="button" aria-expanded=${props.plegado ? 'false' : 'true'} title=${props.plegado ? 'Desplegar menú' : 'Plegar menú'}
          onclick=${() => emitir(host, 'av-menu-plegar', { plegado: !props.plegado })}>
          <iswc-icon icon=${props.plegado ? 'mdi:menu' : 'mdi:menu-open'}></iswc-icon>
          <span class="etiqueta">Menú</span>
        </button>
        ${grupos.map((g) => html`
          <div class="grupo" role="group" aria-label=${g}>
            <span class="titulo-grupo">${g}</span>
            ${props.items.filter((i) => i.grupo === g).map((i) => html`
              <a class="item" part="item" href=${`#/${i.id}`} data-id=${i.id} aria-current=${i.id === props.activo ? 'page' : 'false'} title=${props.plegado ? i.label : ''}
                onclick=${(e: Event) => {
                  e.preventDefault();
                  emitir(host, 'av-menu-ir', { id: i.id });
                }}>
                <span class="icono"><iswc-icon icon=${i.icon}></iswc-icon>${i.contador ? html`<span class="punto" aria-hidden="true"></span>` : null}</span>
                <span class="etiqueta">${i.label}</span>
                ${i.contador ? html`<iswc-badge class="contador" color="danger" pill>${i.contador}</iswc-badge>` : null}
              </a>
            `)}
          </div>
        `)}
      </nav>
    `);
  },
  // Repintado parcial: cambiar el activo o plegar no recrea los íconos.
  (root, props, previos) => {
    if (props.items !== previos.items) return false;
    const menu = root.querySelector('.menu') as HTMLElement | null;
    if (!menu) return false;
    if (props.plegado !== previos.plegado) return false;
    for (const a of root.querySelectorAll<HTMLElement>('.item')) a.setAttribute('aria-current', a.dataset.id === props.activo ? 'page' : 'false');
    return true;
  },
);

define('av-menu', AvMenu);
