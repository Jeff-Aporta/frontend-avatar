/**
 * <av-chat-info> — panel lateral de información (W-CHAT-28/29/34/35):
 *   - Chat: foto, nombre, descripción o presencia; silenciar, fijar y archivar; pestañas Multimedia, Archivos, Enlaces y
 *     Destacados; en grupos los integrantes con su rol y, para administradores, agregar, quitar, nombrar o quitar
 *     administrador y editar el grupo; cualquiera puede salir.
 *   - Mensaje: quién lo recibió y quién lo leyó, con hora.
 * Emite `av-chat-panel-cerrar { panel: 'info' }`, `av-chat-preferencias`, `av-chat-miembros { accion, usuarios }`,
 * `av-chat-panel { panel: 'grupo-editar' | 'grupo-agregar' }`, `av-chat-directo { iusuario }`, `av-chat-accion
 * { accion: 'ver', imensaje }` y `av-chat-abrir { icanal, imensaje }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatInfoProps, ElementoInfo } from '../../consts/schemas/chat.schemas.js';
import { claveDia, horaCorta, iniciales, rotuloDia } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';
import { iconoArchivo } from './av-chat-adjunto.js';

type Host = HTMLElement & { __tab?: string };

const AvChatInfo = crearComponente<AvChatInfoProps>(
  import.meta.url,
  'av-chat-info',
  {
    abierto: false, tema: null, modo: 'chat', id: null, tipo: 'directo', nombre: '', descripcion: '', foto: null, iniciales: '', color: 0, estado: '', yo: '', soyAdmin: false,
    miembros: [], fijado: false, silenciado: false, archivado: false, multimedia: [], archivos: [], enlaces: [], destacados: [], mensaje: null,
  },
  (root, props, hostEl) => {
    const host = hostEl as Host;
    if (!props.id) return;
    const t = textos();
    const cerrar = () => emitir(host, 'av-chat-panel-cerrar', { panel: 'info' });
    const fecha = (iso: string | null) => (iso ? `${rotuloDia(claveDia(iso), t)} · ${horaCorta(iso)}` : '');
    if (props.modo === 'mensaje' && props.mensaje) {
      const m = props.mensaje;
      const leidos = m.filas.filter((f) => f.leido);
      const entregados = m.filas.filter((f) => !f.leido && f.entregado);
      const pendientes = m.filas.filter((f) => !f.leido && !f.entregado);
      const bloque = (titulo: string, icono: string, filas: typeof m.filas, campo: 'leido' | 'entregado' | null, clase: string) => filas.length ? html`
        <section class="bloque ${clase}">
          <iswc-heading level="4"><iswc-icon icon=${icono}></iswc-icon>${titulo}</iswc-heading>
          <ul class="gente">${filas.map((f) => html`<li><span class="foto" data-color=${String(f.color)}><iswc-avatar initials=${iniciales(f.nombre)} label=${f.nombre}></iswc-avatar></span><span class="datos"><strong>${f.nombre}</strong>${campo ? html`<span>${fecha(f[campo])}</span>` : null}</span></li>`)}</ul>
        </section>` : null;
      root.append(html`
        <aside class="info" part="info">
          <header class="cabeza"><iswc-button variant="plain compact" color="neutral" title=${t.cerrar} aria-label=${t.cerrar} oniswc-click=${cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button><iswc-heading level="3">${t.infoMensaje}</iswc-heading></header>
          <div class="cuerpo">
            <blockquote class="previa"><p>${m.texto}</p><span>${fecha(m.ts)}</span></blockquote>
            ${bloque(t.leidoPor, 'mdi:check-all', leidos, 'leido', 'leidos')}
            ${bloque(t.entregadoA, 'mdi:check-all', entregados, 'entregado', 'entregados')}
            ${bloque(t.pendienteDe, 'mdi:clock-outline', pendientes, null, 'pendientes')}
          </div>
        </aside>
      `);
      return;
    }
    const grupal = props.tipo !== 'directo';
    const pref = (p: Record<string, boolean>) => emitir(host, 'av-chat-preferencias', { icanal: props.id, ...p });
    const vacio = () => html`<p class="nada">${t.sinElementos}</p>`;
    const multimedia = (xs: ElementoInfo[]) => xs.length ? html`<div class="mosaico">${xs.map((x) => html`<iswc-button class="mini" variant="row" color="neutral" title=${x.titulo} onclick=${() => emitir(host, 'av-chat-accion', { accion: 'ver', imensaje: x.ref })}>${x.tipo === 'video' ? html`<video src=${x.url} preload="metadata" muted></video><iswc-icon class="play" icon="mdi:play-circle"></iswc-icon>` : html`<img src=${x.url} alt=${x.titulo} loading="lazy">`}</iswc-button>`)}</div>` : vacio();
    const archivos = (xs: ElementoInfo[]) => xs.length ? html`<ul class="filas">${xs.map((x) => html`<li><iswc-icon class="ico" icon=${iconoArchivo(x.titulo, x.tipo)}></iswc-icon><span class="datos"><strong>${x.titulo}</strong><span><iswc-format-bytes value=${String(x.bytes)} autofit></iswc-format-bytes> · ${x.detalle}</span></span><iswc-button variant="plain compact" color="neutral" href=${x.url} download=${x.titulo} title=${t.descargar} aria-label=${t.descargar}><iswc-icon icon="mdi:download"></iswc-icon></iswc-button></li>`)}</ul>` : vacio();
    const enlaces = (xs: ElementoInfo[]) => xs.length ? html`<ul class="filas">${xs.map((x) => html`<li><iswc-icon class="ico" icon="mdi:link-variant"></iswc-icon><span class="datos"><a href=${x.url} target="_blank" rel="noopener noreferrer">${x.url}</a><span>${x.detalle}</span></span></li>`)}</ul>` : vacio();
    const destacados = (xs: ElementoInfo[]) => xs.length ? html`<ul class="filas">${xs.map((x) => html`<li><iswc-button class="destacado" variant="row" color="neutral" onclick=${() => emitir(host, 'av-chat-abrir', { icanal: props.id, imensaje: x.ref })}><iswc-icon class="ico estrella" icon="mdi:star"></iswc-icon><span class="datos"><strong data-color=${String(x.color)}>${x.titulo}</strong><span>${x.detalle}</span></span></iswc-button></li>`)}</ul>` : vacio();
    const tab = host.__tab ?? 'multimedia';
    root.append(html`
      <aside class="info" part="info">
        <header class="cabeza">
          <iswc-button variant="plain compact" color="neutral" title=${t.cerrar} aria-label=${t.cerrar} oniswc-click=${cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
          <iswc-heading level="3">${grupal ? t.infoGrupo : t.infoContacto}</iswc-heading>
          ${grupal && props.soyAdmin ? html`<iswc-button variant="plain compact" color="neutral" title=${t.editarGrupo} aria-label=${t.editarGrupo} oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'grupo-editar' })}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>` : null}
        </header>
        <div class="cuerpo">
          <section class="heroe">
            <span class="foto grande" data-color=${String(props.color)}><iswc-avatar initials=${props.iniciales} image=${props.foto ?? ''} label=${props.nombre}></iswc-avatar></span>
            <iswc-heading level="2">${props.nombre}</iswc-heading>
            <p class="estado">${grupal ? `${props.miembros.length} ${t.integrantes}` : props.estado}</p>
            ${props.descripcion ? html`<p class="descripcion">${props.descripcion}</p>` : null}
          </section>
          <section class="interruptores">
            <iswc-button variant=${props.silenciado ? 'soft' : 'plain'} color=${props.silenciado ? 'brand' : 'neutral'} oniswc-click=${() => pref({ silenciado: !props.silenciado })}><iswc-icon slot="start" icon=${props.silenciado ? 'mdi:bell-off' : 'mdi:bell-outline'}></iswc-icon>${props.silenciado ? t.activarSonido : t.silenciar}</iswc-button>
            <iswc-button variant=${props.fijado ? 'soft' : 'plain'} color=${props.fijado ? 'brand' : 'neutral'} oniswc-click=${() => pref({ fijado: !props.fijado })}><iswc-icon slot="start" icon="mdi:pin-outline"></iswc-icon>${props.fijado ? t.desfijarChat : t.fijarChat}</iswc-button>
            <iswc-button variant=${props.archivado ? 'soft' : 'plain'} color=${props.archivado ? 'brand' : 'neutral'} oniswc-click=${() => pref({ archivado: !props.archivado })}><iswc-icon slot="start" icon="mdi:archive-outline"></iswc-icon>${props.archivado ? t.desarchivar : t.archivar}</iswc-button>
          </section>
          <av-chat-tema class="tema"></av-chat-tema>
          <iswc-tab-group class="pestanas" active=${tab} oniswc-tab-show=${(e: Event) => { host.__tab = (e as CustomEvent<{ name: string }>).detail?.name ?? tab; }}>
            <iswc-tab slot="nav" panel="multimedia">${t.multimedia} <small>${props.multimedia.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="archivos">${t.archivos} <small>${props.archivos.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="enlaces">${t.enlaces} <small>${props.enlaces.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="destacados">${t.destacados} <small>${props.destacados.length}</small></iswc-tab>
            <iswc-tab-panel name="multimedia">${multimedia(props.multimedia)}</iswc-tab-panel>
            <iswc-tab-panel name="archivos">${archivos(props.archivos)}</iswc-tab-panel>
            <iswc-tab-panel name="enlaces">${enlaces(props.enlaces)}</iswc-tab-panel>
            <iswc-tab-panel name="destacados">${destacados(props.destacados)}</iswc-tab-panel>
          </iswc-tab-group>
          ${grupal ? html`
            <section class="integrantes">
              <iswc-heading level="4"><span>${props.miembros.length} ${t.integrantes}</span>
                ${props.soyAdmin ? html`<iswc-button variant="soft compact" color="brand" pill oniswc-click=${() => emitir(host, 'av-chat-panel', { panel: 'grupo-agregar' })}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>${t.agregarIntegrantes}</iswc-button>` : null}
              </iswc-heading>
              <ul class="gente">
                ${props.miembros.map((mi) => html`
                  <li>
                    <iswc-button class="persona" variant="row" color="neutral" ?disabled=${mi.id === props.yo} onclick=${() => emitir(host, 'av-chat-directo', { iusuario: mi.id })}>
                      <span class="foto" data-color=${String(mi.color)}><iswc-avatar initials=${iniciales(mi.nombre)} image=${mi.foto ?? ''} label=${mi.nombre}></iswc-avatar>${mi.enLinea ? html`<span class="presencia"></span>` : null}</span>
                      <span class="datos"><strong>${mi.id === props.yo ? `${mi.nombre} (${t.tu})` : mi.nombre}</strong><span>${mi.detalle}</span></span>
                      ${mi.rol === 'admin' ? html`<iswc-tag class="rol" color="brand" pill>${t.admin}</iswc-tag>` : null}
                    </iswc-button>
                    ${props.soyAdmin && mi.id !== props.yo ? html`
                      <iswc-dropdown placement="bottom-end" oniswc-select=${(e: Event) => {
                        const v = (e as CustomEvent<{ item?: { value?: string } }>).detail?.item?.value;
                        if (v) emitir(host, 'av-chat-miembros', { accion: v, usuarios: [mi.id] });
                      }}>
                        <iswc-button slot="trigger" variant="plain compact" color="neutral" title=${t.menu} aria-label=${t.menu}><iswc-icon icon="mdi:dots-vertical"></iswc-icon></iswc-button>
                        ${mi.rol === 'admin'
                          ? html`<iswc-dropdown-item value="miembro"><iswc-icon slot="icon" icon="mdi:shield-off-outline"></iswc-icon>${t.quitarAdmin}</iswc-dropdown-item>`
                          : html`<iswc-dropdown-item value="admin"><iswc-icon slot="icon" icon="mdi:shield-account-outline"></iswc-icon>${t.hacerAdmin}</iswc-dropdown-item>`}
                        <iswc-dropdown-item value="quitar" color="danger"><iswc-icon slot="icon" icon="mdi:account-remove-outline"></iswc-icon>${t.quitarDelGrupo}</iswc-dropdown-item>
                      </iswc-dropdown>` : null}
                  </li>`)}
              </ul>
              <iswc-button class="salir" variant="soft compact" color="danger" oniswc-click=${() => emitir(host, 'av-chat-miembros', { accion: 'salir', usuarios: [] })}><iswc-icon slot="start" icon="mdi:exit-run"></iswc-icon>${t.salirDelGrupo}</iswc-button>
            </section>` : null}
        </div>
      </aside>
    `);
    const selectorTema = root.querySelector('av-chat-tema') as (HTMLElement & { props: { tema: unknown } }) | null;
    if (selectorTema) selectorTema.props = { tema: props.tema };
  },
);

define('av-chat-info', AvChatInfo);
