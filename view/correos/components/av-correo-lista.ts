/**
 * <av-correo-lista> — los correos de la carpeta: buscador arriba y una fila por correo (persona, asunto, vista previa,
 * etiquetas, hora relativa, estrella). Sin leer = resaltado. Emite `av-correos-buscar { texto }` (el shell busca),
 * `av-correo-abrir { ibuzon }` y `av-correo-marcar { ibuzon, cambios: { destacado } }`. Un refresco solo rehace las
 * filas: el buscador conserva foco y texto.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCorreoListaProps, CorreoBandeja } from '../../../src/js/consts/schemas/correos.schemas.js';
import { iniciales } from '../../../src/js/core/datos.js';
import { CARPETA_INFO, vistaPrevia } from '../utils/correos.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Campo = HTMLElement & { value: string };

/** Persona que se muestra en la fila: en enviados, los destinatarios. */
function quien(c: CorreoBandeja, carpeta: string, nombres: Record<string, string>): string {
  if (carpeta === 'enviados') {
    const p = c.destinatarios.map((u) => nombres[u] ?? u);
    return `Para: ${p.slice(0, 2).join(', ')}${p.length > 2 ? ` +${p.length - 2}` : ''}`;
  }
  return nombres[c.remitente] ?? c.remitente;
}

function pintarFilas(root: ShadowRoot, props: AvCorreoListaProps, host: HTMLElement): void {
  const items = root.querySelector('.items') as HTMLElement;
  const vacio = root.querySelector('.vacio') as ConProps;
  const conteo = root.querySelector('.conteo') as HTMLElement;
  conteo.textContent = props.cargando ? '' : `${props.correos.length} ${props.correos.length === 1 ? 'correo' : 'correos'}`;
  if (props.cargando && !props.correos.length) {
    items.replaceChildren(html`${[1, 2, 3, 4].map(() => html`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}`);
    vacio.hidden = true;
    return;
  }
  vacio.hidden = props.correos.length > 0;
  if (!props.correos.length) {
    const info = CARPETA_INFO[props.carpeta];
    vacio.props = props.texto.trim()
      ? { icono: 'mdi:email-search-outline', titulo: 'Sin resultados', texto: `Ningún correo coincide con «${props.texto.trim()}».`, estado: 'vacio' }
      : { icono: info?.icono ?? 'mdi:email-outline', titulo: `${info?.label ?? 'Carpeta'} vacía`, texto: props.carpeta === 'entrada' ? 'Cuando te escriban, los correos llegarán aquí.' : 'No hay correos en esta carpeta.', estado: 'vacio' };
  }
  const abrir = (ibuzon: number) => emitir(host, 'av-correo-abrir', { ibuzon });
  const tecla = (ibuzon: number) => (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    abrir(ibuzon);
  };
  const estrella = (c: CorreoBandeja) => (e: Event) => {
    e.stopPropagation();
    emitir(host, 'av-correo-marcar', { ibuzon: c.ibuzon, cambios: { destacado: !c.destacado } });
  };
  items.replaceChildren(html`${props.correos.map((c) => {
    const nombre = quien(c, props.carpeta, props.nombres);
    const inicial = props.carpeta === 'enviados' ? (props.nombres[c.destinatarios[0] ?? ''] ?? c.destinatarios[0] ?? '?') : nombre;
    return html`
      <div class="correo" part="correo" role="option" tabindex="0" data-ibuzon=${String(c.ibuzon)} data-leido=${c.leido ? 'si' : 'no'} aria-selected=${props.activo === c.ibuzon ? 'true' : 'false'}
        onclick=${() => abrir(c.ibuzon)} onkeydown=${tecla(c.ibuzon)}>
        <iswc-avatar class="avatar" initials=${iniciales(inicial)} label=${nombre}></iswc-avatar>
        <div class="cuerpo">
          <div class="linea">
            <span class="quien">${nombre}</span>
            <iswc-relative-time class="hora" date=${c.creado} format="short"></iswc-relative-time>
          </div>
          <div class="asunto">${c.asunto}</div>
          <div class="previa">${vistaPrevia(c.cuerpo)}</div>
          ${c.etiquetas.length ? html`<div class="etiquetas">${c.etiquetas.map((t) => html`<iswc-tag color=${t === 'urgente' ? 'danger' : 'brand'} variant="outlined" pill>${t}</iswc-tag>`)}</div>` : null}
        </div>
        <iswc-button class="estrella" variant="plain compact" color=${c.destacado ? 'warning' : 'neutral'} aria-label=${c.destacado ? 'Quitar destacado' : 'Destacar'} aria-pressed=${c.destacado ? 'true' : 'false'} ?disabled=${!props.puedeMarcar} oniswc-click=${estrella(c)}>
          <iswc-icon icon=${c.destacado ? 'mdi:star' : 'mdi:star-outline'}></iswc-icon>
        </iswc-button>
      </div>`;
  })}`);
}

const AvCorreoLista = crearComponente<AvCorreoListaProps>(
  import.meta.url,
  'av-correo-lista',
  { correos: [], activo: null, carpeta: 'entrada', nombres: {}, texto: '', cargando: false, puedeMarcar: false },
  (root, props, host) => {
    const buscar = (e: Event) => emitir(host, 'av-correos-buscar', { texto: (e.target as Campo).value ?? '' });
    root.append(html`
      <div class="lista" part="lista">
        <div class="barra" part="barra">
          <iswc-input class="buscador" type="search" clearable placeholder="Buscar en el correo" aria-label="Buscar en el correo" value=${props.texto} oniswc-input=${buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
          <span class="conteo" part="conteo"></span>
        </div>
        <div class="items" part="items" role="listbox" aria-label="Correos"></div>
        <iswc-empty-state class="vacio" hidden></iswc-empty-state>
      </div>
    `);
    pintarFilas(root, props, host);
  },
  (root, props, _previos, host) => {
    if (!root.querySelector('.items')) return false;
    pintarFilas(root, props, host);
    const campo = root.querySelector('.buscador') as Campo | null;
    if (campo && campo.value !== props.texto && root.activeElement !== campo) campo.value = props.texto;
    return true;
  },
);

define('av-correo-lista', AvCorreoLista);
