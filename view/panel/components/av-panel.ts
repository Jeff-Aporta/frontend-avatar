/**
 * <av-panel> — shell del dashboard: cabecera, KPIs, gráficas de tareas y CRM y notificaciones. Carga el resumen de la
 * empresa activa (`empresa/{id}/resumen`) y las notificaciones (`notificaciones/mias`) con el plugin `avatar` de DER;
 * escucha `av-notificaciones-leer` para recargar; un cambio de empresa remonta la vista.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { NotificacionSchema, ResumenSchema } from '../../../src/js/consts/schemas/api.schemas.js';
import type { AvPanelProps } from '../../../src/js/consts/schemas/panel.schemas.js';
import { dominio, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ir } from '../../../src/js/core/router.js';
import { z } from '../../../src/js/base/zod.js';
import './av-kpis.js';
import './av-tareas-grafica.js';
import './av-embudo-grafica.js';
import './av-notificaciones.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Host = HTMLElement & { props: Partial<AvPanelProps> };

const AvPanel = crearComponente<AvPanelProps>(import.meta.url, 'av-panel', { resumen: null, error: '', version: 0 }, (root, props, host) => {
  const h = host as Host;
  const iempresa = empresaActiva();
  const notificaciones = () => root.querySelector('#notificaciones') as ConProps | null;
  const cargarNotificaciones = async () => {
    const n = notificaciones();
    if (!n) return;
    n.props = { cargando: true };
    try {
      const items = z.array(NotificacionSchema).safeParse(await dominio()['mias']());
      n.props = { items: items.success ? items.data : [], cargando: false };
    } catch {
      n.props = { items: [], cargando: false };
    }
  };
  const leer = async (e: Event) => {
    const { ids } = (e as CustomEvent<{ ids: number[] }>).detail;
    await dominio()['leer'](ids.length ? { ids } : {});
    await cargarNotificaciones();
  };
  root.append(html`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${leer}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${() => { h.props = { resumen: null, error: '', version: (props.version ?? 0) + 1 }; }}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" color="brand" oniswc-click=${() => ir('proyectos')}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </iswc-page-header>
      ${props.error ? html`<iswc-callout tone="danger"><strong slot="title">No se pudo cargar el panel</strong>${props.error}</iswc-callout>` : null}
      ${!iempresa ? html`<iswc-empty-state id="sin-empresa"><iswc-button color="brand" oniswc-click=${() => ir('organizacion')}>Ir a organización</iswc-button></iswc-empty-state>` : html`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `}
    </div>
  `);
  const nombre = estado.yo?.empresas.find((e) => e.iempresa === iempresa)?.nombre ?? 'Avatar';
  (root.querySelector('#cabecera') as ConProps).props = { titulo: 'Panel', subtitulo: `${nombre} · hola, ${estado.yo?.nombre ?? estado.yo?.iusuario ?? ''}`, icono: 'mdi:view-dashboard-outline' };
  const sinEmpresa = root.querySelector('#sin-empresa') as ConProps | null;
  if (sinEmpresa) sinEmpresa.props = { icono: 'mdi:domain', titulo: 'Aún no perteneces a una empresa', texto: 'Pide a un gestor que te invite, o crea la tuya si tienes permiso.' };
  if (!iempresa) return;
  (root.querySelector('#kpis') as ConProps).props = { resumen: props.resumen };
  (root.querySelector('#tareas') as ConProps).props = { tareas: props.resumen?.tareas ?? null };
  (root.querySelector('#embudo') as ConProps).props = { clientes: props.resumen?.clientes ?? null };
  void cargarNotificaciones();
  if (props.resumen) return;
  void (async () => {
    try {
      const r = ResumenSchema.safeParse(await dominio()['resumen'](iempresa));
      if (!r.success) throw new Error('Resumen con forma inesperada');
      h.props = { resumen: r.data, error: '' };
    } catch (err) {
      h.props = { error: mensajeDe(err) };
    }
  })();
});

define('av-panel', AvPanel);
