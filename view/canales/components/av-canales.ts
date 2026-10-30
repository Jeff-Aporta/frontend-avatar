/**
 * <av-canales> — shell de la vista `canales` (`#/canales/<icanal>`): dos columnas (lista | conversación), una en móvil.
 * Carga `canales/mios` de la empresa activa (plugin `avatar` de DER), los mensajes del canal abierto con el
 * `ClientController` de mensajes, marca leído al abrir, refresca cada 8 s mientras está montado y envía con
 * `enviar(icanal, { contenido })`. Crear canal: `controller('canales').post(...)` (solo con `avatar.gestionar`).
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { CanalMioSchema } from '../../../src/js/consts/schemas/api.schemas.js';
import { type AvCanalesProps, EquipoOpcionSchema, MensajeSchema } from '../../../src/js/consts/schemas/canales.schemas.js';
import { z } from '../../../src/js/base/zod.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { ir } from '../../../src/js/core/router.js';
import { canalActivo, totalSinLeer } from '../utils/chat.js';
import './av-canal-lista.js';
import './av-conversacion.js';
import './av-canal-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Host = HTMLElement & { props: Partial<AvCanalesProps>; __temporizador?: ReturnType<typeof setInterval> | undefined };

const INTERVALO_MS = 8000;

const AvCanales = crearComponente<AvCanalesProps>(
  import.meta.url,
  'av-canales',
  { id: null, version: 0, canales: [], cargando: true, error: '', formulario: false },
  (root, props, host) => {
    const h = host as Host;
    const iempresa = empresaActiva();
    const yo = estado.yo?.iusuario ?? '';
    const puedeCrear = puede(estado.perfil, ACCION.gestionar);
    const puedeEscribir = puede(estado.perfil, ACCION.chat);
    const activo = canalActivo(props.canales, props.id);
    const conversacion = () => root.querySelector('#conversacion') as ConProps | null;
    const formulario = () => root.querySelector('#formulario') as ConProps | null;

    const cargarCanales = async () => {
      if (!iempresa) return;
      try {
        const r = z.array(CanalMioSchema).safeParse(await dominio()['mios'](iempresa));
        h.props = { canales: r.success ? r.data : [], cargando: false, error: r.success ? '' : 'Canales con forma inesperada' };
      } catch (err) {
        h.props = { cargando: false, error: mensajeDe(err) };
      }
    };
    const cargarMensajes = async (icanal: number, silencioso = false) => {
      const c = conversacion();
      if (!c) return;
      if (!silencioso) c.props = { cargando: true };
      try {
        const filas = await controller('mensajes').query({ where: { icanal }, orderBy: 'creado', pageSize: 100, include: { autor: true } });
        const r = z.array(MensajeSchema).safeParse(filas.map((f: { toJSON?: () => unknown }) => (typeof f.toJSON === 'function' ? f.toJSON() : f)));
        c.props = { mensajes: r.success ? r.data : [], cargando: false };
      } catch (err) {
        c.props = { cargando: false };
        if (!silencioso) h.props = { error: mensajeDe(err) };
      }
    };
    const marcarLeido = async (icanal: number) => {
      try {
        await dominio()['leido'](icanal);
        h.props = { canales: props.canales.map((c) => (c.icanal === icanal ? { ...c, sin_leer: 0 } : c)) };
      } catch {
        /* sin permiso o sin red: la lista se corrige en el próximo refresco */
      }
    };
    const enviar = async (e: Event) => {
      if (!activo) return;
      const { contenido } = (e as CustomEvent<{ contenido: string }>).detail;
      const c = conversacion();
      if (c) c.props = { enviando: true };
      try {
        await dominio()['enviar'](activo.icanal, { contenido });
        await cargarMensajes(activo.icanal, true);
      } catch (err) {
        h.props = { error: mensajeDe(err) };
      } finally {
        if (c) c.props = { enviando: false };
      }
    };
    const crear = async (e: Event) => {
      if (!iempresa) return;
      const d = (e as CustomEvent<{ nombre: string; tipo: string; descripcion: string | null; iequipo: number | null }>).detail;
      const f = formulario();
      if (f) f.props = { guardando: true, error: '' };
      try {
        const canales = controller('canales');
        const creado = await canales.post(canales.pojo({ iempresa, nombre: d.nombre, tipo: d.tipo, descripcion: d.descripcion, iequipo: d.iequipo, creado_por: yo }));
        h.props = { formulario: false };
        await cargarCanales();
        ir('canales', Number(creado['icanal']));
      } catch (err) {
        if (f) f.props = { guardando: false, error: mensajeDe(err) };
      }
    };
    const cargarEquipos = async () => {
      const f = formulario();
      if (!f || !iempresa) return;
      try {
        const filas = await controller('equipos').query({ where: { iempresa }, pageSize: 100 }, { include: {} });
        const r = z.array(EquipoOpcionSchema).safeParse(filas);
        f.props = { equipos: r.success ? r.data : [] };
      } catch {
        f.props = { equipos: [] };
      }
    };

    root.append(html`
      <div class="pagina" part="pagina" data-abierto=${props.id ? '1' : '0'}
        onav-canal-elegido=${(e: Event) => ir('canales', (e as CustomEvent<{ icanal: number }>).detail.icanal)}
        onav-canal-nuevo=${() => { h.props = { formulario: true }; }}
        onav-canal-form-cerrar=${() => { h.props = { formulario: false }; }}
        onav-canal-crear=${crear}
        onav-conversacion-volver=${() => ir('canales')}
        onav-conversacion-refrescar=${() => { void cargarCanales(); if (activo) void cargarMensajes(activo.icanal); }}
        onav-mensaje-enviar=${enviar}>
        <av-cabecera id="cabecera"></av-cabecera>
        ${props.error ? html`<iswc-callout tone="danger"><strong slot="title">Canales</strong>${props.error}</iswc-callout>` : null}
        ${!iempresa ? html`<av-vacio id="sin-empresa"></av-vacio>` : html`
          <div class="columnas" part="columnas">
            <av-canal-lista id="lista" class="lista"></av-canal-lista>
            <av-conversacion id="conversacion" class="conversacion"></av-conversacion>
          </div>
          <av-canal-form id="formulario"></av-canal-form>
        `}
      </div>
    `);
    (root.querySelector('#cabecera') as ConProps).props = { titulo: 'Canales', subtitulo: props.canales.length ? `${props.canales.length} canales · ${totalSinLeer(props.canales)} sin leer` : 'Conversación por empresa y equipo', icono: 'mdi:forum-outline' };
    const sinEmpresa = root.querySelector('#sin-empresa') as ConProps | null;
    if (sinEmpresa) sinEmpresa.props = { icono: 'mdi:domain', titulo: 'Sin empresa activa', texto: 'Únete a una empresa para ver sus canales.' };
    if (!iempresa) return;
    (root.querySelector('#lista') as ConProps).props = { canales: props.canales, activo: activo?.icanal ?? null, cargando: props.cargando, puedeCrear };
    (root.querySelector('#conversacion') as ConProps).props = { canal: activo, yo, puedeEscribir, cargando: props.cargando, mensajes: [] };
    (root.querySelector('#formulario') as ConProps).props = { abierto: props.formulario };
    if (props.formulario) void cargarEquipos();
    if (props.cargando && props.canales.length === 0) void cargarCanales();
    if (activo) {
      void cargarMensajes(activo.icanal);
      if (activo.sin_leer > 0) void marcarLeido(activo.icanal);
    }
    // refresco periódico mientras la vista está montada (un solo temporizador por host)
    if (h.__temporizador) clearInterval(h.__temporizador);
    h.__temporizador = setInterval(() => {
      if (!h.isConnected) {
        clearInterval(h.__temporizador);
        h.__temporizador = undefined;
        return;
      }
      void cargarCanales();
      if (activo) void cargarMensajes(activo.icanal, true);
    }, INTERVALO_MS);
  },
  // Repintado parcial: abrir/cerrar el formulario no rehace las columnas.
  (root, props, previos) => {
    if (props.formulario === previos.formulario || props.canales !== previos.canales || props.id !== previos.id || props.error !== previos.error) return false;
    const f = root.querySelector('#formulario') as ConProps | null;
    if (!f) return false;
    f.props = { abierto: props.formulario, guardando: false, error: '' };
    return true;
  },
);

define('av-canales', AvCanales);
