/**
 * <av-correo-lector> — panel de lectura: asunto, etiquetas, remitente, destinatarios, hora, cuerpo y la barra de
 * acciones (responder, responder a todos, reenviar, destacar, marcar como no leído, archivar / papelera / restaurar).
 * Abajo, «Relacionados» (misma conversación o parecidos), que se oculta si no hay ninguno. Sin correo: estado vacío.
 * Emite `av-correo-responder { ibuzon, todos }`, `av-correo-reenviar { ibuzon }`, `av-correo-marcar { ibuzon, cambios }`,
 * `av-correo-abrir { ibuzon }` (un relacionado) y `av-correo-cerrar` (volver a la lista en pantallas angostas).
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvCorreoLectorProps } from '../../../src/js/consts/schemas/correos.schemas.js';
import { movimientosDesde } from '../utils/correos.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };

const AvCorreoLector = crearComponente<AvCorreoLectorProps>(import.meta.url, 'av-correo-lector', { correo: null, nombres: {}, puedeMarcar: false, relacionados: [] }, (root, props, host) => {
  const c = props.correo;
  if (!c) {
    root.append(html`<div class="nada" part="nada"><av-vacio id="vacio"></av-vacio></div>`);
    (root.querySelector('#vacio') as ConProps).props = { icono: 'mdi:email-open-outline', titulo: 'Elige un correo', texto: 'Ábrelo desde la lista para leerlo y responder.' };
    return;
  }
  const n = (u: string) => props.nombres[u] ?? u;
  const marcar = (cambios: Record<string, unknown>) => emitir(host, 'av-correo-marcar', { ibuzon: c.ibuzon, cambios });
  const ro = !props.puedeMarcar;
  root.append(html`
    <article class="lector" part="lector">
      <header class="cabeza" part="cabeza">
        <div class="barra" part="barra" role="toolbar" aria-label="Acciones del correo">
          <iswc-button class="volver" variant="plain" color="neutral" size="small" aria-label="Volver a la lista" oniswc-click=${() => emitir(host, 'av-correo-cerrar', {})}><iswc-icon slot="start" icon="mdi:arrow-left"></iswc-icon>Volver</iswc-button>
          <iswc-button variant="soft" color="brand" size="small" ?disabled=${ro} oniswc-click=${() => emitir(host, 'av-correo-responder', { ibuzon: c.ibuzon, todos: false })}><iswc-icon slot="start" icon="mdi:reply"></iswc-icon>Responder</iswc-button>
          <iswc-button variant="outlined" color="neutral" size="small" ?disabled=${ro} aria-label="Responder a todos" title="Responder a todos" oniswc-click=${() => emitir(host, 'av-correo-responder', { ibuzon: c.ibuzon, todos: true })}><iswc-icon slot="start" icon="mdi:reply-all"></iswc-icon><span class="txt">A todos</span></iswc-button>
          <iswc-button variant="outlined" color="neutral" size="small" ?disabled=${ro} aria-label="Reenviar" title="Reenviar" oniswc-click=${() => emitir(host, 'av-correo-reenviar', { ibuzon: c.ibuzon })}><iswc-icon slot="start" icon="mdi:share-outline"></iswc-icon><span class="txt">Reenviar</span></iswc-button>
          <span class="separador"></span>
          <iswc-button variant="plain" color=${c.destacado ? 'warning' : 'neutral'} size="small" ?disabled=${ro} aria-pressed=${c.destacado ? 'true' : 'false'} aria-label=${c.destacado ? 'Quitar destacado' : 'Destacar'} oniswc-click=${() => marcar({ destacado: !c.destacado })}><iswc-icon icon=${c.destacado ? 'mdi:star' : 'mdi:star-outline'}></iswc-icon></iswc-button>
          <iswc-button variant="plain" color="neutral" size="small" ?disabled=${ro} aria-label="Marcar como no leído" title="Marcar como no leído" oniswc-click=${() => marcar({ leido: false })}><iswc-icon icon="mdi:email-mark-as-unread"></iswc-icon></iswc-button>
          ${movimientosDesde(c.carpeta).map((m) => html`<iswc-button variant="plain" color=${m.carpeta === 'papelera' ? 'danger' : 'neutral'} size="small" ?disabled=${ro} aria-label=${m.label} title=${m.label} oniswc-click=${() => marcar({ carpeta: m.carpeta })}><iswc-icon icon=${m.icono}></iswc-icon></iswc-button>`)}
        </div>
        <h2 class="asunto" part="asunto">${c.asunto}</h2>
        ${c.etiquetas.length ? html`<div class="etiquetas">${c.etiquetas.map((t) => html`<iswc-tag color=${t === 'urgente' ? 'danger' : 'brand'} variant="outlined" pill>${t}</iswc-tag>`)}</div>` : null}
        <div class="meta" part="meta">
          <av-persona id="remitente"></av-persona>
          <iswc-relative-time class="hora" date=${c.creado}></iswc-relative-time>
        </div>
        <dl class="para">
          <dt>Para</dt><dd>${c.destinatarios.map(n).join(', ')}</dd>
          ${c.cc.length ? html`<dt>CC</dt><dd>${c.cc.map(n).join(', ')}</dd>` : null}
        </dl>
      </header>
      <div class="cuerpo" part="cuerpo">${c.cuerpo}</div>
      ${props.relacionados.length ? html`
        <section class="relacionados" part="relacionados" aria-label="Relacionados">
          <h3 class="rotulo"><iswc-icon icon="mdi:link-variant"></iswc-icon> Relacionados</h3>
          ${props.relacionados.map((r) => html`<iswc-button class="relacionado" variant="plain" color="neutral" oniswc-click=${() => emitir(host, 'av-correo-abrir', { ibuzon: r.ibuzon })}><iswc-icon slot="start" icon="mdi:email-outline"></iswc-icon><span class="r-asunto">${r.asunto}</span><span slot="end" class="r-quien">${n(r.remitente)}</span></iswc-button>`)}
        </section>` : null}
      ${ro ? html`<iswc-callout color="brand" class="aviso">Tu rol no tiene permiso de correo (avatar.correo): puedes leer, pero no responder ni ordenar el buzón.</iswc-callout>` : null}
    </article>
  `);
  (root.querySelector('#remitente') as ConProps).props = { iusuario: c.remitente, nombre: props.nombres[c.remitente] ?? null, detalle: `<${c.remitente}>` };
});

define('av-correo-lector', AvCorreoLector);
