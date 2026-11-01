/**
 * <av-notificaciones> — tarjeta con las notificaciones del usuario (título, cuerpo, hace cuánto) y «Marcar leídas».
 * Emite `av-notificaciones-leer { ids }` (vacío = todas); el shell llama al API y repinta.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvNotificacionesProps } from '../../../src/js/consts/schemas/panel.schemas.js';

const ICONO: Record<string, string> = { invitacion: 'mdi:account-plus-outline', tarea: 'mdi:checkbox-marked-circle-outline', mensaje: 'mdi:forum-outline' };

const AvNotificaciones = crearComponente<AvNotificacionesProps>(import.meta.url, 'av-notificaciones', { items: [], cargando: false }, (root, props, host) => {
  const sinLeer = props.items.filter((n) => !n.leida);
  root.append(html`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:bell-outline"></iswc-icon> Notificaciones ${sinLeer.length ? html`<iswc-badge color="danger" pill>${sinLeer.length}</iswc-badge>` : null}</strong>
      ${sinLeer.length ? html`<iswc-button slot="header-actions" variant="plain compact" color="neutral" class="leer" oniswc-click=${() => emitir(host, 'av-notificaciones-leer', { ids: [] })}>Marcar leídas</iswc-button>` : null}
      ${props.cargando
        ? html`<iswc-empty-state class="vacio" estado="cargando"></iswc-empty-state>`
        : props.items.length === 0
        ? html`<iswc-empty-state class="vacio" icono="mdi:bell-check-outline" titulo="Al día" texto="No tienes notificaciones."></iswc-empty-state>`
        : html`<ul class="lista" part="lista">
            ${props.items.slice(0, 8).map((n) => html`
              <li class="item" data-leida=${n.leida ? '1' : '0'}>
                <iswc-icon class="icono" icon=${ICONO[n.tipo] ?? 'mdi:information-outline'}></iswc-icon>
                <span class="texto"><strong class="titulo">${n.titulo}</strong>${n.cuerpo ? html`<span class="cuerpo">${n.cuerpo}</span>` : null}</span>
                ${n.creado ? html`<iswc-relative-time class="cuando" date=${typeof n.creado === 'string' ? n.creado : n.creado.toISOString()} format="short"></iswc-relative-time>` : null}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);
});

define('av-notificaciones', AvNotificaciones);
