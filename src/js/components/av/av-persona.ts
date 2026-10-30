/**
 * <av-persona> — un usuario: avatar con iniciales (`iswc-avatar`), nombre (o id) y un detalle (rol, cargo, hora).
 * Se usa en mensajes, miembros, tarjetas de tareas y comentarios.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvPersonaProps } from '../../consts/schemas/componentes.schemas.js';

/** Iniciales de un nombre (máximo 2) o del id. */
export function iniciales(nombre: string | null | undefined, iusuario: string): string {
  const base = (nombre || iusuario || '?').trim();
  const partes = base.split(/\s+/).filter(Boolean);
  const dos = partes.length > 1 ? `${partes[0]![0]}${partes[1]![0]}` : base.slice(0, 2);
  return dos.toUpperCase();
}

const AvPersona = crearComponente<AvPersonaProps>(import.meta.url, 'av-persona', { iusuario: '', nombre: null, detalle: '', compacto: false }, (root, props) => {
  const nombre = props.nombre || props.iusuario;
  root.append(html`
    <span class="persona" part="persona" title=${props.compacto ? nombre : ''}>
      <iswc-avatar class="avatar" part="avatar" initials=${iniciales(props.nombre, props.iusuario)} label=${nombre}></iswc-avatar>
      ${props.compacto ? null : html`<span class="texto"><span class="nombre" part="nombre">${nombre}</span>${props.detalle ? html`<span class="detalle" part="detalle">${props.detalle}</span>` : null}</span>`}
    </span>
  `);
});

define('av-persona', AvPersona);
