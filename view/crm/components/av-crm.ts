/**
 * <av-crm> — shell del CRM (`/crm/` (id `icliente` en el historial)): embudo por etapa, tabla de clientes y diálogo de cliente. Carga
 * clientes y miembros de la empresa activa con los controllers de DER (`clientes`, `miembros`) y escribe solo con
 * `avatar.gestionar`. Con id en la ruta abre ese cliente.
 */
import type { z } from '../../../src/js/base/zod.js';
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { type AvCrmProps, type Cliente, type ClienteDatos, ClienteSchema, type MiembroCrm, MiembroCrmSchema } from '../../../src/js/consts/schemas/crm.schemas.js';
import { sinEmpresa } from '../../../src/js/consts/estados.js';
import { controller, mensajeDe } from '../../../src/js/core/api.js';
import { filtrarTexto } from '../../../src/js/core/datos.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { ir, tomarIntencion } from '../../../src/js/core/router.js';
import { camposCliente, filasClientes, filtrarPorEtapa, moneda, tablaClientes, totalesPorEtapa, valorPipeline } from '../utils/crm.js';
import './av-embudo.js';
import '../../../src/js/components/av/av-tabla.js';
import './av-cliente-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

/** Filas de un `query` de DER como JSON plano validado. */
function filas<T>(schema: z.ZodType<T>, rows: unknown[]): T[] {
  const out: T[] = [];
  for (const r of rows) {
    const j = r && typeof (r as { toJSON?: unknown }).toJSON === 'function' ? (r as { toJSON(): unknown }).toJSON() : r;
    const p = schema.safeParse(j);
    if (p.success) out.push(p.data);
  }
  return out;
}

const AvCrm = crearComponente<AvCrmProps>(import.meta.url, 'av-crm', { id: null, version: 0 }, (root, props, host) => {
  const h = host as unknown as ConProps;
  const iempresa = empresaActiva();
  const puedeEscribir = puede(estado.perfil, ACCION.gestionar);
  let clientes: Cliente[] = [];
  let miembros: MiembroCrm[] = [];
  let etapa: string | null = null;
  let texto = '';
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;

  const pintar = () => {
    $('embudo').props = { etapas: totalesPorEtapa(clientes), activa: etapa };
    $('grid').props = { filas: filasClientes(filtrarTexto(filtrarPorEtapa(clientes, etapa), texto, camposCliente)), cargando: false, texto };
    $('cabecera').props = { subtitulo: `${clientes.length} cliente${clientes.length === 1 ? '' : 's'} · pipeline ${moneda(valorPipeline(clientes))}` };
  };
  const cargar = async () => {
    if (!iempresa) return;
    $('grid').props = { cargando: true };
    try {
      clientes = filas(ClienteSchema, await controller('clientes').query({ where: { iempresa }, orderBy: '-creado', pageSize: 200 }));
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
    pintar();
  };
  const abrir = (cliente: Cliente | null) => {
    $('form').props = { abierto: true, cliente, miembros, puedeEscribir, error: '' };
  };
  const alGuardar = async (e: Event) => {
    const { datos } = (e as CustomEvent<{ datos: ClienteDatos }>).detail;
    const ctrl = controller('clientes');
    $('form').props = { ocupado: true, error: '' };
    try {
      const { icliente, ...resto } = datos;
      if (icliente) await ctrl.put(ctrl.pojo({ icliente, ...resto }));
      else await ctrl.post(ctrl.pojo({ ...resto, iempresa }));
      $('form').props = { abierto: false, ocupado: false };
      avisar(icliente ? 'Cliente guardado' : 'Cliente creado', 'success');
      if (props.id) ir('crm');
      await cargar();
    } catch (err) {
      $('form').props = { ocupado: false, error: mensajeDe(err) };
    }
  };
  const alEliminar = async (e: Event) => {
    const { icliente } = (e as CustomEvent<{ icliente: number }>).detail;
    const ctrl = controller('clientes');
    try {
      await ctrl.delete(ctrl.pojo({ icliente }));
      $('form').props = { abierto: false };
      avisar('Cliente eliminado', 'success');
      if (props.id) ir('crm');
      await cargar();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };

  root.append(html`
    <div class="pagina" part="pagina"
      onav-crm-filtrar=${(e: Event) => { etapa = (e as CustomEvent<{ etapa: string | null }>).detail.etapa; pintar(); }}
      onav-crm-buscar=${(e: Event) => { texto = (e as CustomEvent<{ texto: string }>).detail.texto; pintar(); }}
      onav-crm-abrir=${(e: Event) => abrir(clientes.find((c) => c.icliente === Number((e as CustomEvent<{ id: unknown }>).detail.id)) ?? null)}
      onav-cliente-guardar=${alGuardar} onav-cliente-eliminar=${alEliminar}
      onav-cliente-form-cerrar=${() => { $('form').props = { abierto: false }; if (props.id) ir('crm'); }}
      onav-cliente-form-error=${(e: Event) => avisar((e as CustomEvent<{ mensaje: string }>).detail.mensaje, 'warning')}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${() => (h.props = { version: (props.version ?? 0) + 1 })}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        ${puedeEscribir ? html`<iswc-button variant="compact" slot="acciones" color="brand" oniswc-click=${() => abrir(null)}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Nuevo cliente</iswc-button>` : null}
      </iswc-page-header>
      ${iempresa ? html`<av-embudo id="embudo"></av-embudo><av-tabla id="grid"></av-tabla>` : html`<iswc-empty-state id="sin-empresa"></iswc-empty-state>`}
      <av-cliente-form id="form"></av-cliente-form>
    </div>
  `);
  $('cabecera').props = { titulo: 'CRM', subtitulo: 'Clientes y embudo de ventas', icono: 'mdi:account-heart-outline' };
  if (!iempresa) {
    $('sin-empresa').props = sinEmpresa('su CRM');
    return;
  }
  $('grid').props = { ...tablaClientes(), cargando: true };
  void (async () => {
    try {
      miembros = filas(MiembroCrmSchema, await controller('miembros').query({ where: { iempresa }, include: { usuario: true }, pageSize: 200 }));
    } catch {
      miembros = [];
    }
    $('form').props = { miembros };
    await cargar();
    if (props.id) {
      const c = clientes.find((x) => x.icliente === Number(props.id));
      if (c) abrir(c);
    }
    // Paleta global (Ctrl+K) → «Nuevo cliente».
    if (tomarIntencion('crm') === 'cliente-nuevo' && puedeEscribir) abrir(null);
  })();
});

define('av-crm', AvCrm);
