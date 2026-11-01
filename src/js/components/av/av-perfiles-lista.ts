/**
 * <av-perfiles-lista> — ÚNICA lista de perfiles de prueba: nombre, rol y PIN público. El clic pide entrar con el evento
 * `av-perfil-elegir { usuario, fin }` en `window`; lo resuelve `<av-perfil-selector>`, dueño del cambio de perfil. La usan
 * la pestaña «Entrar como…» de `/acceso/`. Con `modo: 'select'` es un select con «Entrar»: el dropdown de la barra y el diálogo del pie.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvPerfilesListaProps } from '../../consts/schemas/componentes.schemas.js';
import { mensajeDe, perfilesPrueba } from '../../core/api.js';

type Host = HTMLElement & { props: Partial<AvPerfilesListaProps> };

const AvPerfilesLista = crearComponente<AvPerfilesListaProps>(
  import.meta.url,
  'av-perfiles-lista',
  { perfiles: [], activo: '', ocupado: '', error: '', modo: 'lista' },
  (root, props, host) => {
    const h = host as Host;
    const usar = (usuario: string) => {
      h.props = { ocupado: usuario };
      emitir(host, 'av-perfil-usar', { usuario });
      dispatchEvent(new CustomEvent('av-perfil-elegir', { detail: { usuario, fin: () => (h.props = { ocupado: '' }) } }));
    };
    if (props.error) {
      root.append(html`<iswc-callout color="danger">${props.error}</iswc-callout>`);
      return;
    }
    if (!props.perfiles.length) {
      root.append(html`<iswc-spinner class="carga"></iswc-spinner>`);
      void perfilesPrueba().then((perfiles) => (h.props = { perfiles })).catch((err: unknown) => (h.props = { error: mensajeDe(err) }));
      return;
    }
    if ((host.getAttribute('modo') ?? props.modo) === 'select') {
      root.append(html`
        <div class="elegir" part="elegir">
          <iswc-select class="cuenta" label="Cuenta de prueba" placeholder="Elige una cuenta" density="compact">
            ${props.perfiles.map((p) => html`<iswc-option value=${p.iusuario} ?disabled=${p.iusuario === props.activo}>${p.nombre} · ${p.rol} · PIN ${p.pin}</iswc-option>`)}
          </iswc-select>
          <iswc-button variant="compact" class="entrar" color="brand" ?loading=${Boolean(props.ocupado)}>Entrar con esta cuenta</iswc-button>
        </div>
      `);
      const cuenta = root.querySelector('.cuenta') as HTMLElement & { value: string };
      root.querySelector('.entrar')?.addEventListener('iswc-click', () => {
        if (cuenta.value) usar(cuenta.value);
      });
      return;
    }
    root.append(html`
      <div class="lista" part="lista">
        ${props.perfiles.map((p) => html`
          <iswc-button class="fila" part="fila" variant="plain compact" color="neutral" title=${p.descripcion} data-usuario=${p.iusuario}
            ?loading=${props.ocupado === p.iusuario} ?disabled=${Boolean(props.ocupado) || p.iusuario === props.activo} oniswc-click=${() => usar(p.iusuario)}>
            <iswc-person class="persona" usuario=${p.iusuario} nombre=${p.nombre} detalle=${p.rol}></iswc-person>
            <code slot="end" class="pin" title="PIN de prueba">${p.pin}</code>
          </iswc-button>`)}
      </div>
    `);
  },
);

define('av-perfiles-lista', AvPerfilesLista);
