/**
 * <av-cabecera> — cabecera de página: ícono, título, subtítulo y un slot `acciones` para botones.
 * Es la fila de arriba de toda vista privada (panel, canales, proyectos…): así todas se ven igual.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvCabeceraProps } from '../../consts/schemas/componentes.schemas.js';

const AvCabecera = crearComponente<AvCabeceraProps>(import.meta.url, 'av-cabecera', { titulo: '', subtitulo: '', icono: '' }, (root, props) => {
  root.append(html`
    <header class="cabecera" part="cabecera">
      <div class="texto">
        <h1 class="titulo" part="titulo">${props.icono ? html`<iswc-icon icon=${props.icono}></iswc-icon>` : null}<span>${props.titulo}</span></h1>
        ${props.subtitulo ? html`<p class="subtitulo" part="subtitulo">${props.subtitulo}</p>` : null}
      </div>
      <div class="acciones" part="acciones"><slot name="acciones"></slot></div>
    </header>
  `);
});

define('av-cabecera', AvCabecera);
