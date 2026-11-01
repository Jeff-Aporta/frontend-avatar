/**
 * <av-migas> — migas de la ruta actual (`iswc-breadcrumb`): Panel › vista › parte. Sigue a la URL.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import { paginaDe } from '../../consts/paginas.js';
import type { AvMigasProps } from '../../consts/schemas/componentes.schemas.js';
import { escuchar, hrefDe, rutaActual, VISTA_SESION } from '../../core/router.js';

const AvMigas = crearComponente<AvMigasProps>(import.meta.url, 'av-migas', {}, (root, _props, host) => {
  root.append(html`<iswc-breadcrumb part="migas" label="Ubicación"></iswc-breadcrumb>`);
  const lista = root.querySelector('iswc-breadcrumb') as HTMLElement;
  const item = (texto: string, href: string) => html`<iswc-breadcrumb-item href=${href}>${texto}</iswc-breadcrumb-item>`;
  const pintar = () => {
    const { vista, id } = rutaActual();
    const p = paginaDe(vista);
    const parte = p?.partes?.find((x) => x.id === id);
    const piezas = [item(paginaDe(VISTA_SESION)!.titulo, hrefDe(VISTA_SESION))];
    if (p && vista !== VISTA_SESION) piezas.push(item(p.titulo, parte ? hrefDe(vista) : ''));
    if (parte) piezas.push(item(parte.titulo, ''));
    host.toggleAttribute('hidden', piezas.length < 2);
    lista.replaceChildren(...piezas);
  };
  const fin = escuchar(() => (host.isConnected ? pintar() : fin()));
  pintar();
});

define('av-migas', AvMigas);
