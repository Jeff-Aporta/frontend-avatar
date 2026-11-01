/**
 * <av-correos> — shell de DUO eMail (`correos[/<carpeta>]`): KPIs del buzón, carpetas, lista y lector en un panel
 * dividido, y el diálogo de redacción. Es el único que habla con el API: `bandeja`, `resumenCorreo`, `marcarCorreo`,
 * `enviarCorreo` y el controller `miembros` (destinatarios y nombres). Escribir y ordenar el buzón exige
 * `avatar.correo`; sin ella la vista lo explica y deshabilita esas acciones.
 *
 * Búsqueda: `buscarCorreos` centraliza la búsqueda (hoy por texto sobre lo cargado). Es el punto donde se enchufa la
 * búsqueda semántica del API sin tocar los hijos; igual `relacionadosDe` para el hueco «Relacionados» del lector.
 */
import { crearComponente, define, html, avisar } from '../../../src/js/base/componente.js';
import { escucharIntencion } from '../../../src/js/base/intencion.js';
import { type AvCorreosProps, type Bandeja, BandejaSchema, type CorreoBandeja, type CorreoDatos, type CorreoRelacionado, type MiembroCorreo, MiembroCorreoSchema, ResumenCorreoSchema } from '../../../src/js/consts/schemas/correos.schemas.js';
import { sinEmpresa } from '../../../src/js/consts/estados.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { filas, filtrarTexto } from '../../../src/js/core/datos.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { borradorReenvio, borradorRespuesta, camposCorreo, carpetasConConteo, esCarpeta, indicadoresCorreo, nombresDe, relacionadosDe } from '../utils/correos.js';
import './av-correo-carpetas.js';
import './av-correo-lista.js';
import './av-correo-lector.js';
import './av-correo-redactar.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Detalle<T> = CustomEvent<T>;

/** Búsqueda de correos: hoy por texto (asunto, cuerpo, personas, etiquetas). Aquí se enchufa la búsqueda semántica. */
async function buscarCorreos(texto: string, correos: CorreoBandeja[], nombres: Record<string, string>): Promise<CorreoBandeja[]> {
  return filtrarTexto(correos, texto, (c) => camposCorreo(c, nombres));
}

/** Correos relacionados con el abierto: hoy, la misma conversación entre los cargados. */
async function relacionados(correo: CorreoBandeja, todos: CorreoBandeja[]): Promise<CorreoRelacionado[]> {
  return relacionadosDe(correo, todos);
}

const ANGOSTO = '(max-width: 48em)';

const AvCorreos = crearComponente<AvCorreosProps>(import.meta.url, 'av-correos', { id: null, version: 0 }, (root, props, host) => {
  const iempresa = empresaActiva();
  const yo = estado.yo?.iusuario ?? '';
  const puedeMarcar = puede(estado.perfil, ACCION.correo);
  let carpeta: string = esCarpeta(props.id) ? props.id! : 'entrada';
  let bandeja: Bandeja | null = null;
  let miembros: MiembroCorreo[] = [];
  let nombres: Record<string, string> = {};
  let texto = '';
  let activo: number | null = null;
  let consulta = 0;
  const $ = (id: string) => root.querySelector(`#${id}`) as ConProps;

  /** En angosto: sin correo abierto se ve la lista; con correo, el lector. */
  const acomodar = () => {
    const split = root.querySelector('#split') as HTMLElement | null;
    if (!split) return;
    if (matchMedia(ANGOSTO).matches) split.setAttribute('collapse', activo ? 'start' : 'end');
    else split.removeAttribute('collapse');
  };
  const correoActivo = () => bandeja?.correos.find((c) => c.ibuzon === activo) ?? null;

  const pintarLista = async () => {
    const lista = await buscarCorreos(texto, bandeja?.correos ?? [], nombres);
    $('lista').props = { correos: lista, activo, carpeta, nombres, texto, cargando: !bandeja, puedeMarcar };
    $('carpetas').props = { carpetas: carpetasConConteo(bandeja), activa: carpeta };
  };
  const pintarLector = async () => {
    const c = correoActivo();
    $('lector').props = { correo: c, nombres, puedeMarcar, relacionados: c ? await relacionados(c, bandeja?.correos ?? []) : [] };
    acomodar();
  };
  const cargarResumen = async () => {
    if (!iempresa) return;
    try {
      const r = ResumenCorreoSchema.safeParse(await dominio()['resumenCorreo'](iempresa));
      if (r.success) $('kpis').props = { items: indicadoresCorreo(r.data) };
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
    }
  };
  const cargarBandeja = async (limpiar = false) => {
    if (!iempresa) return;
    const n = ++consulta;
    if (limpiar) {
      bandeja = null;
      await pintarLista();
    }
    try {
      const b = BandejaSchema.safeParse(await dominio()['bandeja'](iempresa, carpeta));
      if (n !== consulta) return;
      if (!b.success) throw new Error('La bandeja llegó con una forma inesperada');
      bandeja = b.data;
    } catch (err) {
      if (n !== consulta) return;
      bandeja = { iempresa: iempresa ?? 0, carpeta, no_leidos: 0, por_carpeta: {}, correos: [] };
      avisar(mensajeDe(err), 'danger');
    }
    if (activo && !correoActivo()) activo = null;
    await pintarLista();
    await pintarLector();
  };

  /** Aplica marcas en local (sin esperar al API) y devuelve si el correo sale de la carpeta. */
  const aplicarLocal = (c: CorreoBandeja, cambios: { leido?: boolean; destacado?: boolean; carpeta?: string }): boolean => {
    if (!bandeja) return false;
    if (cambios.leido !== undefined && c.carpeta === 'entrada' && cambios.leido !== c.leido) bandeja.no_leidos += cambios.leido ? -1 : 1;
    if (cambios.leido !== undefined) c.leido = cambios.leido;
    if (cambios.destacado !== undefined) c.destacado = cambios.destacado;
    if (cambios.carpeta && cambios.carpeta !== c.carpeta) {
      bandeja.por_carpeta[c.carpeta] = Math.max(0, (bandeja.por_carpeta[c.carpeta] ?? 1) - 1);
      bandeja.por_carpeta[cambios.carpeta] = (bandeja.por_carpeta[cambios.carpeta] ?? 0) + 1;
      if (c.carpeta === 'entrada' && !c.leido) bandeja.no_leidos = Math.max(0, bandeja.no_leidos - 1);
      bandeja.correos = bandeja.correos.filter((x) => x.ibuzon !== c.ibuzon);
      return true;
    }
    bandeja.correos = [...bandeja.correos];
    return false;
  };
  const marcar = async (ibuzon: number, cambios: { leido?: boolean; destacado?: boolean; carpeta?: string }, aviso = '') => {
    const c = bandeja?.correos.find((x) => x.ibuzon === ibuzon);
    if (!c || !puedeMarcar) return;
    const sale = aplicarLocal(c, cambios);
    if (sale && activo === ibuzon) activo = null;
    await pintarLista();
    await pintarLector();
    try {
      await dominio()['marcarCorreo'](ibuzon, cambios);
      if (aviso) avisar(aviso, 'success');
      void cargarResumen();
    } catch (err) {
      avisar(mensajeDe(err), 'danger');
      await cargarBandeja();
    }
  };
  const abrir = async (ibuzon: number) => {
    activo = ibuzon;
    const c = correoActivo();
    await pintarLista();
    await pintarLector();
    if (c && !c.leido && puedeMarcar) await marcar(ibuzon, { leido: true });
  };

  const redactar = (borrador = { destinatarios: [] as string[], cc: [] as string[], asunto: '', cuerpo: '', etiquetas: [] as string[], respuesta_a: null as number | null }) => {
    $('redactar').props = { abierto: true, borrador, miembros, yo, ocupado: false, error: '' };
  };
  const enviar = async (e: Event) => {
    const { datos } = (e as Detalle<{ datos: CorreoDatos }>).detail;
    $('redactar').props = { ocupado: true, error: '' };
    try {
      const { respuesta_a, cc, etiquetas, ...resto } = datos;
      await dominio()['enviarCorreo']({ iempresa, ...resto, ...(cc.length ? { cc } : {}), ...(etiquetas.length ? { etiquetas } : {}), ...(respuesta_a ? { respuesta_a } : {}) });
      $('redactar').props = { abierto: false, ocupado: false };
      avisar('Correo enviado', 'success');
      void cargarResumen();
      if (carpeta === 'enviados') await cargarBandeja();
      else if (bandeja) {
        bandeja.por_carpeta['enviados'] = (bandeja.por_carpeta['enviados'] ?? 0) + 1;
        $('carpetas').props = { carpetas: carpetasConConteo(bandeja), activa: carpeta };
      }
    } catch (err) {
      $('redactar').props = { ocupado: false, error: mensajeDe(err) };
    }
  };

  const conBuzon = (fn: (c: CorreoBandeja) => void) => (e: Event) => {
    const c = bandeja?.correos.find((x) => x.ibuzon === (e as Detalle<{ ibuzon: number }>).detail.ibuzon);
    if (c) fn(c);
  };
  const responder = (e: Event) => {
    const d = (e as Detalle<{ ibuzon: number; todos: boolean }>).detail;
    const c = bandeja?.correos.find((x) => x.ibuzon === d.ibuzon);
    if (c) redactar(borradorRespuesta(c, yo, nombres, d.todos));
  };
  const etiquetaMover: Record<string, string> = { archivados: 'Correo archivado', papelera: 'Enviado a la papelera', entrada: 'Devuelto a la entrada' };

  root.append(html`
    <div class="pagina" part="pagina"
      onav-correos-carpeta=${(e: Event) => { carpeta = (e as Detalle<{ carpeta: string }>).detail.carpeta; activo = null; void cargarBandeja(true); }}
      onav-correos-buscar=${(e: Event) => { texto = (e as Detalle<{ texto: string }>).detail.texto; void pintarLista(); }}
      onav-correo-abrir=${(e: Event) => void abrir((e as Detalle<{ ibuzon: number }>).detail.ibuzon)}
      onav-correo-cerrar=${() => { activo = null; void pintarLista(); void pintarLector(); }}
      onav-correo-marcar=${(e: Event) => { const d = (e as Detalle<{ ibuzon: number; cambios: { carpeta?: string } }>).detail; void marcar(d.ibuzon, d.cambios, d.cambios.carpeta ? etiquetaMover[d.cambios.carpeta] ?? '' : ''); }}
      onav-correo-responder=${responder}
      onav-correo-reenviar=${conBuzon((c) => redactar(borradorReenvio(c, nombres)))}
      onav-correo-enviar=${enviar}
      onav-correo-redactar-cerrar=${() => ($('redactar').props = { abierto: false })}
      onav-correo-redactar-error=${(e: Event) => avisar((e as Detalle<{ mensaje: string }>).detail.mensaje, 'warning')}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${() => { void cargarResumen(); void cargarBandeja(); }}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button variant="compact" slot="acciones" color="brand" ?disabled=${!puedeMarcar || !iempresa} oniswc-click=${() => redactar()}><iswc-icon slot="start" icon="mdi:email-edit-outline"></iswc-icon>Redactar</iswc-button>
      </iswc-page-header>
      ${!iempresa ? html`<iswc-empty-state id="sin-empresa"></iswc-empty-state>` : html`
        ${puedeMarcar ? null : html`<iswc-callout color="warning" class="permiso"><strong>Solo lectura.</strong> Tu rol no incluye el permiso de correo (avatar.correo). Puedes leer tu buzón, pero no redactar, responder ni moverlo de carpeta.</iswc-callout>`}
        <iswc-stat-group id="kpis"></iswc-stat-group>
        <section class="buzon" part="buzon" aria-label="Buzón">
          <av-correo-carpetas id="carpetas" class="carpetas"></av-correo-carpetas>
          <iswc-split-panel id="split" class="split" position="42" storage-key="av-correos-split">
            <av-correo-lista id="lista" slot="start"></av-correo-lista>
            <av-correo-lector id="lector" slot="end"></av-correo-lector>
          </iswc-split-panel>
        </section>
      `}
      <av-correo-redactar id="redactar"></av-correo-redactar>
    </div>
  `);
  const nombreEmpresa = estado.yo?.empresas.find((e) => e.iempresa === iempresa)?.nombre ?? 'Avatar';
  $('cabecera').props = { titulo: 'Correos', subtitulo: `DUO eMail · ${nombreEmpresa}`, icono: 'mdi:email-fast-outline' };
  if (!iempresa) {
    $('sin-empresa').props = sinEmpresa('tu correo');
    return;
  }
  const mq = matchMedia(ANGOSTO);
  const alCambiarAncho = () => (host.isConnected ? acomodar() : mq.removeEventListener('change', alCambiarAncho));
  mq.addEventListener('change', alCambiarAncho);
  void pintarLista();
  void pintarLector();
  void cargarResumen();
  void (async () => {
    try {
      miembros = filas(MiembroCorreoSchema, await controller('miembros').query({ where: { iempresa }, include: { usuario: true }, pageSize: 200 }));
    } catch {
      miembros = [];
    }
    nombres = nombresDe(miembros);
    $('redactar').props = { miembros };
    await cargarBandeja();
  })();
  escucharIntencion(host, 'correos', (intencion) => {
    if (intencion !== 'correo-nuevo') return;
    if (puedeMarcar) redactar();
    else avisar('Tu rol no tiene permiso de correo (avatar.correo) para redactar', 'warning');
  });
});

define('av-correos', AvCorreos);
