/**
 * <av-chat-demo> — shell de la vista `chat-demo` (W-CHAT-39): el chat completo con el backend de memoria
 * (`backend-demo`), sin API. Barra con «Hablar como» (personas de muestra), «Otra pestaña» (abre la misma página como
 * la siguiente persona libre: las dos conversan en tiempo real), «Reiniciar demo» y, si hay sesión, el interruptor
 * «API real» que conecta el mismo chat al API (`backend-avatar`).
 */
import { avisar, crearComponente, define, html } from '../../../src/js/base/componente.js';
import { apiUrl } from '../../../src/js/consts/config.js';
import type { AvChatDemoProps } from '../../../src/js/consts/schemas/chat.schemas.js';
import type { ChatBackend } from '../../../src/js/chat/backend.js';
import { type BackendDemo, crearBackendDemo, personasDemo } from '../../../src/js/chat/backend-demo.js';
import { fuenteDe } from '../../../src/js/notificaciones/centro.js';
import { personaInicial, personaPedida, primeraLibre, raizSala, recordarPersona, urlComo } from '../utils/demo.js';

type ChatEl = HTMLElement & { backend: ChatBackend | null; props: Record<string, unknown> };
type Campo = HTMLElement & { value: string };
type Host = HTMLElement & { __backend?: ChatBackend | null };

function montar(root: ShadowRoot, props: AvChatDemoProps, hostEl: HTMLElement): void {
  const host = hostEl as Host;
  const personas = personasDemo();
  const conSesion = (() => {
    try {
      return !!localStorage.getItem('avatar:token');
    } catch {
      return false;
    }
  })();
  root.append(html`
    <div class="demo" part="demo">
      <header class="barra" part="barra">
        <span class="marca"><span class="titulo">Chat <em>en vivo</em></span><iswc-tag class="etiqueta" color="brand" pill>demo</iswc-tag></span>
        <span class="ayuda" title="Sala pública: quien abra el demo ve lo que escribas. Funciona entre pestañas, perfiles y navegadores.">Abre otra pestaña o navegador y habla como otra persona. Sala pública: no escribas nada privado.</span>
        <span class="acciones"><span class="rotulo">Hablar como</span>
          <iswc-select class="como" aria-label="Hablar como" title="Hablar como">
            ${personas.map((p) => html`<iswc-option value=${p.id}>${p.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-button class="otra" variant="soft compact" color="brand" title="Abrir otra pestaña como otra persona"><iswc-icon slot="start" icon="mdi:tab-plus"></iswc-icon><span class="texto">Otra pestaña</span></iswc-button>
          <iswc-button class="simular" variant="plain compact" color="neutral" title="Envía a otra persona un aviso de tarea, correo o solicitud"><iswc-icon slot="start" icon="mdi:bell-plus-outline"></iswc-icon><span class="texto">Simular aviso</span></iswc-button>
          <iswc-button class="reiniciar" variant="plain compact" color="neutral" title="Volver a los datos de muestra"><iswc-icon slot="start" icon="mdi:restore"></iswc-icon><span class="texto">Reiniciar</span></iswc-button>
          ${conSesion ? html`<iswc-switch class="api" title="Conectar este chat al API real">API real</iswc-switch>` : null}
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </header>
      <av-chat id="chat" class="chat"></av-chat>
    </div>
  `);
  const chat = root.querySelector('#chat') as ChatEl;
  const como = root.querySelector('.como') as Campo;
  chat.props = { titulo: 'Chats', clave: 'av-chat-demo', chat: props.id };
  const usar = (b: ChatBackend) => {
    host.__backend = b;
    chat.backend = b;
  };
  const hablarComo = (id: string) => {
    como.value = id;
    try {
      history.replaceState(history.state, '', urlComo(id));
    } catch {
      /* sin historial */
    }
    recordarPersona(id);
    // el centro de notificaciones es su dueño: sigue vivo al navegar a otras vistas
    usar(fuenteDe(`demo-${id}`, 'chat-demo', () => crearBackendDemo({ yo: id, sala: raizSala(apiUrl()) })));
  };
  void personaInicial(props.como ?? personaPedida()).then(hablarComo);
  como.addEventListener('iswc-change', () => {
    const id = como.value;
    if (id && id !== host.__backend?.yo) hablarComo(id);
  });
  root.querySelector('.otra')?.addEventListener('iswc-click', () => {
    const b = host.__backend as BackendDemo | null;
    const ocupadas = new Set([...(b?.enLinea?.() ?? []), b?.yo ?? '']);
    window.open(urlComo(primeraLibre(personas.map((p) => p.id), ocupadas)), '_blank', 'noopener');
  });
  root.querySelector('.reiniciar')?.addEventListener('iswc-click', () => {
    (host.__backend as BackendDemo | null)?.reiniciar?.();
    avisar('Demo reiniciado con los datos de muestra', 'success');
  });
  let aviso = 0;
  root.querySelector('.simular')?.addEventListener('iswc-click', () => {
    const b = host.__backend as BackendDemo | null;
    if (!b?.simular) return;
    const tipo = (['tarea', 'correo', 'solicitud'] as const)[aviso++ % 3]!;
    const otros = b.enLinea().filter((u) => u !== b.yo && personas.some((p) => p.id === u));
    const para = otros[0] ?? personas.find((p) => p.id !== b.yo)!.id;
    b.simular(tipo, para);
    avisar(`Aviso de ${tipo} enviado a ${personas.find((p) => p.id === para)?.nombre ?? para}`, 'success');
  });
  root.querySelector('.api')?.addEventListener('iswc-change', async (e) => {
    const on = (e as CustomEvent<{ checked: boolean }>).detail?.checked;
    if (!on) return hablarComo(como.value || personas[0]!.id);
    try {
      const { conectar, cargarPerfil } = await import('../../../src/js/core/api.js');
      const { empresaActiva } = await import('../../../src/js/core/estado.js');
      const { crearBackendAvatar } = await import('../../../src/js/chat/backend-avatar.js');
      conectar();
      await cargarPerfil();
      const iempresa = empresaActiva();
      if (!iempresa) throw new Error('Sin empresa activa');
      usar(fuenteDe(`empresa-${iempresa}`, 'canales', () => crearBackendAvatar({ iempresa })));
    } catch (err) {
      avisar(`API real: ${err instanceof Error ? err.message : String(err)}`, 'danger');
      hablarComo(como.value || personas[0]!.id);
    }
  });
}

const AvChatDemo = crearComponente<AvChatDemoProps>(
  import.meta.url,
  'av-chat-demo',
  { como: null, id: null },
  (root, props, host) => montar(root, props, host),
  // nunca se repinta: cambiar de persona se hace por dentro (el chat conserva su estado de diseño); el id abre ese chat
  (root, props, previos) => {
    const chat = root.querySelector('#chat') as ChatEl | null;
    if (chat && props.id !== previos.id) chat.props = { chat: props.id };
    return true;
  },
);

define('av-chat-demo', AvChatDemo);
