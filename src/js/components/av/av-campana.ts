/**
 * <av-campana> — campana de la barra y centro de notificaciones: contador, lista (chats con no leídos + avisos del API), marcar
 * leídas, sonido y permiso del navegador. Solo pinta: todo el estado vive en `notificaciones/centro.ts`.
 */
import { crearComponente, define, html } from '../../base/componente.js';
import type { AvCampanaProps } from '../../consts/schemas/componentes.schemas.js';
import { abrir, alCambio, fijarPreferencia, marcarLeida, marcarTodas, pedirPermisoNavegador, type VistaCentro } from '../../notificaciones/centro.js';
import { arrancar } from '../../notificaciones/arranque.js';
import { type Entrada, TIPOS_AVISO } from '../../notificaciones/avisos.js';

type Cajon = HTMLElement & { open: boolean };
type Interruptor = HTMLElement & { checked: boolean };

const fila = (x: Entrada) => html`
  <li class="entrada" data-id=${x.id} data-leida=${x.leida ? '1' : '0'} data-tipo=${x.tipo}>
    <button class="abrir" type="button" onclick=${() => abrir(x)}>
      <iswc-icon class="icono" icon=${TIPOS_AVISO[x.tipo].icono} aria-hidden="true"></iswc-icon>
      <span class="texto">
        <strong class="titulo">${x.titulo}</strong>
        <span class="cuerpo">${x.cuerpo}</span>
        <iswc-relative-time class="cuando" date=${x.ts} format="short"></iswc-relative-time>
      </span>
      ${x.cuenta > 1 ? html`<iswc-badge color="brand" pill>${x.cuenta}</iswc-badge>` : null}
    </button>
    ${x.leida ? null : html`<iswc-button class="leer" variant="plain compact" color="neutral" title="Marcar leída" oniswc-click=${() => void marcarLeida(x)}><iswc-icon icon="mdi:check" aria-hidden="true"></iswc-icon></iswc-button>`}
  </li>`;

function pintar(root: ShadowRoot, v: VistaCentro): void {
  const host = (root.host as HTMLElement);
  host.hidden = !v.activo;
  const boton = root.querySelector('.campana') as HTMLElement;
  boton.setAttribute('aria-label', v.total ? `Notificaciones, ${v.total} sin leer` : 'Notificaciones');
  const cifra = root.querySelector('.cifra') as HTMLElement;
  cifra.hidden = v.total === 0;
  cifra.textContent = v.total > 99 ? '99+' : String(v.total);
  (root.querySelector('.conexion') as HTMLElement).hidden = v.conexion === 'conectado';
  const lista = root.querySelector('.lista') as HTMLElement;
  lista.replaceChildren(...v.entradas.slice(0, 80).map(fila));
  (root.querySelector('.vacio') as HTMLElement).hidden = v.entradas.length > 0;
  (root.querySelector('.todas') as HTMLElement).toggleAttribute('disabled', v.total === 0);
  (root.querySelector('.sonido') as Interruptor).checked = v.preferencias.sonido;
  (root.querySelector('.navegador') as Interruptor).checked = v.preferencias.navegador;
}

const AvCampana = crearComponente<AvCampanaProps>(
  import.meta.url,
  'av-campana',
  {},
  (root, _props, host) => {
    root.append(html`
      <iswc-button class="campana" variant="plain compact" color="neutral" title="Notificaciones" oniswc-click=${() => { (root.querySelector('.cajon') as Cajon).open = true; }}>
        <iswc-icon icon="mdi:bell-outline" aria-hidden="true"></iswc-icon>
        <span class="cifra" hidden></span>
      </iswc-button>
      <iswc-drawer class="cajon" label="Notificaciones" placement="end">
        <div class="panel" part="panel">
          <div class="acciones">
            <iswc-button class="todas" variant="soft compact" color="brand" oniswc-click=${() => void marcarTodas()}><iswc-icon slot="start" icon="mdi:check-all"></iswc-icon>Marcar todas</iswc-button>
            <span class="conexion" hidden><iswc-spinner></iswc-spinner>Reconectando…</span>
          </div>
          <ul class="lista"></ul>
          <iswc-empty-state class="vacio" icono="mdi:bell-check-outline" titulo="Al día" texto="No tienes notificaciones."></iswc-empty-state>
          <div class="ajustes">
            <iswc-switch class="sonido" oniswc-change=${(e: Event) => fijarPreferencia({ sonido: (e as CustomEvent<{ checked: boolean }>).detail.checked })}>Sonido</iswc-switch>
            <iswc-switch class="navegador" oniswc-change=${async (e: Event) => {
              const interruptor = e.currentTarget as Interruptor;
              const si = (e as CustomEvent<{ checked: boolean }>).detail.checked;
              if (!si) return fijarPreferencia({ navegador: false });
              if ((await pedirPermisoNavegador()) !== 'granted') interruptor.checked = false;
            }}>Avisos del navegador</iswc-switch>
          </div>
        </div>
      </iswc-drawer>
    `);
    const fin = alCambio((v) => {
      if (!host.isConnected) return fin();
      pintar(root, v);
    });
    arrancar();
  },
);

define('av-campana', AvCampana);
