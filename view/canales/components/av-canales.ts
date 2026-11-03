/**
 * <av-canales> — shell de la vista `canales` (spec 40 + 42): monta el chat en tiempo real (`<av-chat>`) contra el API
 * (`backend-avatar`: ops del plugin `avatar` + sala WebSocket). Sin sondeo: todo llega por la sala.
 *
 *   - Sin empresa activa o sin permiso `avatar.chat`, lo explica y no consulta (W-CAN-14, W-CHAT-41).
 *   - El chat abierto se refleja en la ruta (`ir('canales', icanal)`) y la ruta abre el chat (`props.id`).
 *   - Con `avatar.gestionar`, «Nuevo canal» crea un canal público o privado (`controller('canales').post`).
 *   - Si el API aún no publica las rutas del chat, cae al demo local y lo avisa.
 * Cambiar de chat o abrir el formulario nunca rehace el chat (repintado parcial).
 */
import { avisar, crearComponente, define, html } from '../../../src/js/base/componente.js';
import { type AvCanalesProps, EquipoOpcionSchema } from '../../../src/js/consts/schemas/canales.schemas.js';
import { z } from '../../../src/js/base/zod.js';
import { sinEmpresa, sinPermiso } from '../../../src/js/consts/estados.js';
import { controller, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { ACCION, puede } from '../../../src/js/core/permisos.js';
import { ir, tomarIntencion } from '../../../src/js/core/router.js';
import type { ChatBackend } from '../../../src/js/chat/backend.js';
import { crearBackendAvatar } from '../../../src/js/chat/backend-avatar.js';
import { crearBackendDemo } from '../../../src/js/chat/backend-demo.js';
import { detener, fuenteDe } from '../../../src/js/notificaciones/centro.js';
import { apiChatPendiente, chatDeRuta, estadoCanales } from '../utils/canales.js';
import './av-canal-form.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type ChatEl = ConProps & { backend: ChatBackend | null; recargar(abrir?: string | null): Promise<void>; abrirPanel(p: 'nuevo' | 'grupo'): void };
type Host = HTMLElement & { props: Partial<AvCanalesProps>; __backend?: ChatBackend | null; __empresa?: number | null; __ruta?: (e: Event) => void };

const AvCanales = crearComponente<AvCanalesProps>(
  import.meta.url,
  'av-canales',
  { id: null, formulario: false, aviso: '' },
  (root, props, hostEl) => {
    const h = hostEl as Host;
    const iempresa = empresaActiva();
    const vista = estadoCanales(iempresa, estado.perfil);
    const puedeCrear = puede(estado.perfil, ACCION.gestionar);
    const formulario = () => root.querySelector('#formulario') as ConProps | null;
    const chat = () => root.querySelector('#chat') as ChatEl | null;

    const crear = async (e: Event) => {
      if (!iempresa) return;
      const d = (e as CustomEvent<{ nombre: string; tipo: string; descripcion: string | null; iequipo: number | null }>).detail;
      const f = formulario();
      if (f) f.props = { guardando: true, error: '' };
      try {
        const canales = controller('canales');
        const creado = await canales.post(canales.pojo({ iempresa, nombre: d.nombre, tipo: d.tipo, descripcion: d.descripcion, iequipo: d.iequipo, creado_por: estado.yo?.iusuario ?? '' }));
        h.props = { formulario: false };
        const id = String(creado['icanal']);
        await chat()?.recargar(id);
        ir('canales', id);
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
      <div class="pagina" part="pagina"
        onav-canal-form-cerrar=${() => { h.props = { formulario: false }; }}
        onav-canal-crear=${crear}
        onav-chat-abierto=${(e: Event) => ir('canales', (e as CustomEvent<{ icanal: string | null }>).detail.icanal)}>
        <iswc-page-header id="cabecera">
          <av-escena slot="ilustracion" escena="canales"></av-escena>
          ${puedeCrear && vista === 'listo' ? html`<iswc-button slot="acciones" variant="soft compact" color="brand" oniswc-click=${() => { h.props = { formulario: true }; void cargarEquipos(); }}><iswc-icon slot="start" icon="mdi:pound-box-outline"></iswc-icon>Nuevo canal</iswc-button>` : null}
        </iswc-page-header>
        <iswc-callout class="aviso" color="warning" ?hidden=${!props.aviso}><strong slot="title">Chat</strong><span class="aviso-texto">${props.aviso}</span></iswc-callout>
        ${vista === 'listo' ? html`<av-chat id="chat" class="chat"></av-chat>` : html`<iswc-empty-state id="vacio"></iswc-empty-state>`}
        <av-canal-form id="formulario"></av-canal-form>
      </div>
    `);
    (root.querySelector('#cabecera') as ConProps).props = { titulo: 'Canales', subtitulo: 'Chats 1:1, grupos y canales de la empresa en tiempo real', icono: 'mdi:forum-outline' };
    (root.querySelector('#formulario') as ConProps).props = { abierto: props.formulario };
    const vacio = root.querySelector('#vacio') as ConProps | null;
    if (vacio) {
      vacio.props = vista === 'sin-empresa'
        ? { ...sinEmpresa('sus chats'), texto: 'Únete a una empresa o elígela arriba para ver sus chats.' }
        : sinPermiso('chat', 'Tu rol no incluye el chat (avatar.chat). Pídeselo a un administrador.');
      return;
    }
    const c = chat();
    if (!c || !iempresa) return;
    c.props = { titulo: 'Chats', clave: `av-canales-${iempresa}`, chat: chatDeRuta(props.id) };
    // un backend por empresa: es del centro de notificaciones, que lo mantiene vivo fuera de esta vista
    h.__empresa = iempresa;
    h.__backend = fuenteDe(`empresa-${iempresa}`, 'canales', () => crearBackendAvatar({ iempresa }));
    c.addEventListener('av-chat-error', (e) => {
      const msg = (e as CustomEvent<{ mensaje: string }>).detail.mensaje;
      if (!apiChatPendiente(msg)) {
        avisar(`Chat: ${msg}`, 'danger');
        return;
      }
      // el API aún no publica el chat: demo local, sin perder la vista
      detener();
      h.__backend = crearBackendDemo({ yo: 'ana' });
      c.backend = h.__backend;
      h.props = { aviso: 'El API del chat aún no está publicado: estás viendo el demo local (hablas como Ana Torres).' };
    });
    c.backend = h.__backend;
    // atajos de la paleta global (Ctrl+K): «Nuevo chat» y «Nuevo grupo»
    const intencion = (i: string | null | undefined) => {
      if (i === 'chat-nuevo') c.abrirPanel('nuevo');
      else if (i === 'grupo-nuevo') c.abrirPanel('grupo');
    };
    intencion(tomarIntencion('canales'));
    if (h.__ruta) removeEventListener('av-ruta', h.__ruta);
    h.__ruta = (e: Event) => {
      if (!h.isConnected) return;
      const guardada = tomarIntencion('canales');
      intencion((e as CustomEvent<{ intencion?: string | null }>).detail?.intencion ?? guardada);
    };
    addEventListener('av-ruta', h.__ruta);
  },
  // Parcial: cambiar de chat (ruta), abrir el formulario o el aviso no rehacen el chat.
  (root, props, previos) => {
    const c = root.querySelector('#chat') as ConProps | null;
    const f = root.querySelector('#formulario') as ConProps | null;
    if (!f) return false;
    if (props.id !== previos.id && c) c.props = { chat: chatDeRuta(props.id) };
    if (props.formulario !== previos.formulario) f.props = { abierto: props.formulario, guardando: false, error: '' };
    if (props.aviso !== previos.aviso) {
      const a = root.querySelector('.aviso') as HTMLElement | null;
      a?.toggleAttribute('hidden', !props.aviso);
      const txt = root.querySelector('.aviso-texto');
      if (txt) txt.textContent = props.aviso;
    }
    return true;
  },
);

define('av-canales', AvCanales);
