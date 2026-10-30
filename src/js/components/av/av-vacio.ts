/**
 * <av-vacio> — caja de estado: vacío (ícono + título + texto + acción opcional en el slot), cargando (spinner) o error.
 * Toda lista o panel sin datos usa esta pieza en vez de HTML suelto.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvVacioProps } from '../../consts/schemas/componentes.schemas.js';

const AvVacio = crearComponente<AvVacioProps>(import.meta.url, 'av-vacio', { icono: 'mdi:inbox-outline', titulo: 'Nada por aquí', texto: '', estado: 'vacio' }, (root, props) => {
  root.append(html`
    <div class="caja" part="caja" data-estado=${props.estado} role=${props.estado === 'error' ? 'alert' : 'status'}>
      ${props.estado === 'cargando' ? html`<iswc-spinner class="icono"></iswc-spinner>` : html`<iswc-icon class="icono" part="icono" icon=${props.estado === 'error' ? 'mdi:alert-circle-outline' : props.icono}></iswc-icon>`}
      <strong class="titulo" part="titulo">${props.estado === 'cargando' ? 'Cargando…' : props.titulo}</strong>
      ${props.texto ? html`<p class="texto" part="texto">${props.texto}</p>` : null}
      <div class="accion"><slot></slot></div>
    </div>
  `);
});

define('av-vacio', AvVacio);
