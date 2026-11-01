/**
 * <av-chat-mensajes> — la conversación (W-CHAT-09..14/19/23/29/40):
 *   - Separadores por día (flotantes), ráfagas por autor (5 min), línea «N mensajes no leídos» y arranque en ella.
 *   - Reconciliación por clave (HW-CHAT-03): cada mensaje es un `av-chat-burbuja` que se agrega, actualiza, mueve o
 *     quita uno a uno; la conversación NUNCA se repinta entera (sin parpadeo).
 *   - Al subir hasta el principio pide anteriores (`av-chat-cargar-anteriores`) y conserva la posición de lectura.
 *   - Si no está abajo y llega un mensaje, no mueve la vista: botón «bajar» con el número de nuevos.
 *   - Franja del mensaje fijado; un solo menú contextual (respuestas rápidas + acciones) para todas las burbujas.
 *   - Anuncia los mensajes nuevos con `aria-live`; soltar archivos encima → `av-chat-soltar { archivos }`.
 * Emite `av-chat-accion { accion, imensaje }`, `av-chat-reaccionar { imensaje, emoji }`, `av-chat-cargar-anteriores`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatMensajesProps, CitaVista, ReaccionVista } from '../../consts/schemas/chat.schemas.js';
import { agrupar, type ItemConversacion, marcaDe, puedeEditar, puedeEliminarParaTodos, REACCIONES_RAPIDAS, resumenMensaje } from '../../chat/formato.js';
import { textos } from '../../chat/textos.js';
import { coincide, type MensajeChat } from '../../chat/tipos.js';
import './av-chat-burbuja.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type Desplegable = HTMLElement & { show(): void; hide(): void; open: boolean };

const CERCA_PX = 96;

function montar(root: ShadowRoot, inicial: AvChatMensajesProps, host: HTMLElement): (p: AvChatMensajesProps, previo: AvChatMensajesProps | null) => void {
  const t = textos();
  root.append(html`
    <section class="conversacion" part="conversacion">
      <iswc-button class="fijado" variant="row" color="neutral" shape="rect" hidden><iswc-icon icon="mdi:pin"></iswc-icon><span class="fijado-texto"><strong>${t.fijadoArriba}</strong><span></span></span></iswc-button>
      <div class="scroll" part="scroll" tabindex="-1">
        <div class="inicio"><iswc-spinner class="cargando" hidden></iswc-spinner><span class="tope" hidden>${t.inicioConversacion}</span></div>
        <div class="items" role="log" aria-label=${t.chats} aria-live="off"></div>
      </div>
      <iswc-button class="bajar" variant="glyph" color="neutral" shape="pill" hidden title=${t.bajar} aria-label=${t.bajar}><iswc-icon icon="mdi:chevron-double-down"></iswc-icon><span class="nuevos" hidden></span></iswc-button>
      <div class="anuncio" aria-live="polite" aria-atomic="true"></div>
      <div class="soltar" hidden><iswc-icon icon="mdi:tray-arrow-down"></iswc-icon><span>${t.soltarAqui}</span></div>
      <iswc-dropdown class="menu" placement="bottom-start">
        <span class="ancla" slot="trigger" aria-hidden="true"></span>
      </iswc-dropdown>
      <div class="vacio" hidden><iswc-icon icon="mdi:message-flash-outline"></iswc-icon><strong>${t.eligeChat}</strong><span>${t.eligeChatTexto}</span></div>
    </section>
  `);
  const seccion = root.querySelector('.conversacion') as HTMLElement;
  const scroll = root.querySelector('.scroll') as HTMLElement;
  const lista = root.querySelector('.items') as HTMLElement;
  const bajar = root.querySelector('.bajar') as HTMLElement;
  const nuevosEl = root.querySelector('.nuevos') as HTMLElement;
  const anuncio = root.querySelector('.anuncio') as HTMLElement;
  const fijado = root.querySelector('.fijado') as HTMLElement;
  const menu = root.querySelector('.menu') as Desplegable;
  const ancla = root.querySelector('.ancla') as HTMLElement;
  const soltar = root.querySelector('.soltar') as HTMLElement;
  let p = inicial;
  let nuevos = 0;
  let pidiendo = false;
  let menuRef: string | null = null;

  const distanciaAbajo = () => scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight;
  const alFondo = (suave = false) => scroll.scrollTo({ top: scroll.scrollHeight, behavior: suave && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
  const pintarBajar = () => {
    const lejos = distanciaAbajo() > CERCA_PX * 2;
    bajar.hidden = !lejos && nuevos === 0;
    nuevosEl.hidden = nuevos === 0;
    nuevosEl.textContent = nuevos > 99 ? '99+' : String(nuevos);
  };

  scroll.addEventListener('scroll', () => {
    if (distanciaAbajo() < CERCA_PX && nuevos) {
      nuevos = 0;
      emitir(host, 'av-chat-al-fondo');
    }
    pintarBajar();
    if (scroll.scrollTop < CERCA_PX && p.hayMas && !p.cargandoAnteriores && !pidiendo && p.chat) {
      pidiendo = true;
      emitir(host, 'av-chat-cargar-anteriores', { icanal: p.chat.id });
    }
  }, { passive: true });
  bajar.addEventListener('click', () => {
    nuevos = 0;
    alFondo(true);
    pintarBajar();
    emitir(host, 'av-chat-al-fondo');
  });
  fijado.addEventListener('click', () => {
    if (p.chat?.mensajeFijado) emitir(host, 'av-chat-accion', { accion: 'ir', imensaje: p.chat.mensajeFijado });
  });

  /* arrastrar y soltar archivos */
  let arrastres = 0;
  seccion.addEventListener('dragenter', (e) => {
    if (!p.chat || !e.dataTransfer?.types.includes('Files')) return;
    arrastres++;
    soltar.hidden = false;
  });
  seccion.addEventListener('dragover', (e) => {
    if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
  });
  seccion.addEventListener('dragleave', () => {
    arrastres = Math.max(0, arrastres - 1);
    if (!arrastres) soltar.hidden = true;
  });
  seccion.addEventListener('drop', (e) => {
    arrastres = 0;
    soltar.hidden = true;
    const files = [...(e.dataTransfer?.files ?? [])];
    if (!files.length || !p.chat) return;
    e.preventDefault();
    emitir(host, 'av-chat-soltar', { archivos: files });
  });

  /* menú contextual único */
  seccion.addEventListener('av-chat-menu', (e) => {
    e.stopPropagation();
    const d = (e as CustomEvent<{ imensaje: string; x: number; y: number }>).detail;
    const m = p.mensajes.find((x) => coincide(x, d.imensaje));
    if (!m) return;
    menuRef = m.clave;
    const r = seccion.getBoundingClientRect();
    ancla.style.left = `${Math.max(0, d.x - r.left)}px`;
    ancla.style.top = `${Math.max(0, d.y - r.top)}px`;
    const propio = m.autor === p.yo;
    const mia = m.reacciones.find((x) => x.usuario === p.yo)?.emoji ?? null;
    const items: Node[] = [];
    if (!m.eliminado && m.estado === 'enviado') {
      items.push(html`<div class="rapidas" role="group" aria-label=${t.reaccionar}>${REACCIONES_RAPIDAS.map((emo) => html`<iswc-button class="rapida" variant="glyph" shape="pill" data-mia=${mia === emo ? '1' : '0'} aria-label=${emo} data-emoji=${emo}>${emo}</iswc-button>`)}<iswc-button class="rapida mas" variant="glyph" color="neutral" shape="pill" data-emoji="+" aria-label=${t.masReacciones} title=${t.masReacciones}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button></div>`);
    }
    const item = (valor: string, icono: string, texto: string, color = '') => html`<iswc-dropdown-item value=${valor} color=${color || null}><iswc-icon slot="icon" icon=${icono}></iswc-icon>${texto}</iswc-dropdown-item>`;
    if (!m.eliminado && m.estado === 'enviado') {
      items.push(item('responder', 'mdi:reply-outline', t.responder));
      if (m.texto) items.push(item('copiar', 'mdi:content-copy', t.copiar));
      items.push(item('reenviar', 'mdi:share-outline', t.reenviar));
      items.push(item('destacar', m.destacado ? 'mdi:star-off-outline' : 'mdi:star-outline', m.destacado ? t.quitarDestacado : t.destacar));
      const esFijado = p.chat?.mensajeFijado != null && coincide(m, p.chat.mensajeFijado);
      items.push(item(esFijado ? 'desfijar' : 'fijar', esFijado ? 'mdi:pin-off-outline' : 'mdi:pin-outline', esFijado ? t.desfijar : t.fijar));
      if (propio) items.push(item('info', 'mdi:information-outline', t.info));
      if (puedeEditar(m, p.yo)) items.push(item('editar', 'mdi:pencil-outline', t.editar));
    }
    if (m.estado === 'fallido') items.push(item('reintentar', 'mdi:refresh', t.reintentar));
    items.push(item('eliminar-mi', 'mdi:delete-outline', t.eliminarParaMi, 'danger'));
    if (puedeEliminarParaTodos(m, p.yo) && m.estado === 'enviado') items.push(item('eliminar-todos', 'mdi:delete-forever-outline', t.eliminarParaTodos, 'danger'));
    for (const n of [...menu.children]) if (n !== ancla) n.remove();
    menu.append(...items);
    requestAnimationFrame(() => menu.show());
  });
  menu.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.rapida');
    if (!b || !menuRef) return;
    const emoji = b.dataset['emoji'] ?? '';
    menu.hide();
    if (emoji === '+') emitir(host, 'av-chat-accion', { accion: 'reaccionar-mas', imensaje: menuRef });
    else emitir(host, 'av-chat-reaccionar', { imensaje: menuRef, emoji: b.dataset['mia'] === '1' ? null : emoji });
  });
  menu.addEventListener('iswc-select', (e) => {
    const v = (e as CustomEvent<{ item?: { value?: string } }>).detail?.item?.value;
    if (v && menuRef) emitir(host, 'av-chat-accion', { accion: v, imensaje: menuRef });
  });

  /* modelos de vista */
  const grupal = () => p.chat?.tipo !== 'directo';
  const nombre = (id: string) => (id === p.yo ? t.tu : p.autores[id]?.nombre ?? id);
  const citaDe = (m: MensajeChat): CitaVista | null => {
    if (!m.respuestaA) return null;
    const o = p.mensajes.find((x) => coincide(x, m.respuestaA));
    if (!o) {
      // el citado no está cargado: lo que trae el mensaje (el API manda `cita`)
      const c = m.meta['cita'] as { iusuario?: string; autor?: string | null; contenido?: string; eliminado?: boolean } | undefined;
      return { ref: m.respuestaA, autor: c?.iusuario ? nombre(c.iusuario) : c?.autor ?? '…', color: c?.iusuario ? p.autores[c.iusuario]?.color ?? 0 : 0, texto: c?.eliminado ? t.eliminado : c?.contenido ?? '…', miniatura: null };
    }
    const img = !o.eliminado && o.adjunto && o.adjunto.mime.startsWith('image/') ? o.adjunto.url : null;
    return { ref: o.clave, autor: nombre(o.autor), color: p.autores[o.autor]?.color ?? 0, texto: resumenMensaje(o, t), miniatura: img };
  };
  const reaccionesDe = (m: MensajeChat): ReaccionVista[] => {
    const grupos = new Map<string, ReaccionVista>();
    for (const r of m.reacciones) {
      const g = grupos.get(r.emoji) ?? { emoji: r.emoji, n: 0, nombres: [], mia: false };
      g.n++;
      g.nombres.push(nombre(r.usuario));
      if (r.usuario === p.yo) g.mia = true;
      grupos.set(r.emoji, g);
    }
    return [...grupos.values()].sort((a, b) => b.n - a.n);
  };
  const menciones = () => (p.chat?.miembros ?? []).map((x) => p.autores[x.id]?.nombre ?? x.id);

  const nodoDe = (it: ItemConversacion, existente: HTMLElement | undefined): HTMLElement => {
    if (it.tipo === 'dia') {
      const el = existente ?? Object.assign(document.createElement('div'), { className: 'dia' });
      el.dataset['clave'] = it.clave;
      if (el.textContent !== it.rotulo) el.replaceChildren(Object.assign(document.createElement('span'), { textContent: it.rotulo }));
      return el;
    }
    if (it.tipo === 'noleidos') {
      const el = existente ?? Object.assign(document.createElement('div'), { className: 'noleidos' });
      el.dataset['clave'] = it.clave;
      const txt = t.mensajesNoLeidos(it.n);
      if (el.textContent !== txt) el.replaceChildren(Object.assign(document.createElement('span'), { textContent: txt }));
      return el;
    }
    const m = it.mensaje;
    const el = (existente ?? document.createElement('av-chat-burbuja')) as ConProps;
    el.dataset['clave'] = it.clave;
    el.dataset['ref'] = m.clave;
    const propio = m.autor === p.yo;
    el.props = {
      mensaje: m, propio, primero: it.primero, ultimo: it.ultimo,
      autor: grupal() && !propio && it.primero ? { nombre: nombre(m.autor), color: p.autores[m.autor]?.color ?? 0 } : null,
      marca: p.chat ? marcaDe(m, p.chat, p.yo) : null, cita: citaDe(m), menciones: menciones(), reacciones: reaccionesDe(m),
      resaltado: !!p.resaltar && coincide(m, p.resaltar),
    };
    return el;
  };

  /** Reconciliación por clave + manejo del scroll. */
  const aplicar = (sig: AvChatMensajesProps, previo: AvChatMensajesProps | null) => {
    p = sig;
    const cambioChat = !previo || previo.chat?.id !== sig.chat?.id;
    (root.querySelector('.vacio') as HTMLElement).hidden = !!sig.chat;
    scroll.hidden = !sig.chat;
    if (!sig.cargandoAnteriores) pidiendo = false;
    (root.querySelector('.cargando') as HTMLElement).hidden = !sig.cargandoAnteriores;
    (root.querySelector('.tope') as HTMLElement).hidden = sig.hayMas || sig.cargandoAnteriores || sig.mensajes.length === 0;
    const fij = sig.chat?.mensajeFijado ? sig.mensajes.find((x) => coincide(x, sig.chat!.mensajeFijado)) : null;
    fijado.hidden = !fij;
    if (fij) (fijado.querySelector('.fijado-texto > span') as HTMLElement).textContent = resumenMensaje(fij, t);
    if (cambioChat) {
      lista.replaceChildren(); // otro chat: se parte de cero (no es un repintado del mismo)
      nuevos = 0;
      menu.hide?.();
    }
    if (!sig.chat) return;

    const cerca = distanciaAbajo() < CERCA_PX;
    const altoAntes = scroll.scrollHeight;
    const topAntes = scroll.scrollTop;
    const primeraAntes = lista.querySelector('av-chat-burbuja')?.getAttribute('data-clave') ?? null;
    const items = agrupar(sig.mensajes, { primerNoLeido: sig.primerNoLeido, t, yo: sig.yo });
    const existentes = new Map<string, HTMLElement>();
    for (const n of [...lista.children] as HTMLElement[]) existentes.set(n.dataset['clave'] ?? '', n);
    const previos = new Set(existentes.keys());
    const agregadosAjenos: MensajeChat[] = [];
    let propioNuevo = false;
    items.forEach((it, i) => {
      const ya = existentes.get(it.clave);
      existentes.delete(it.clave);
      const el = nodoDe(it, ya);
      if (!ya && it.tipo === 'mensaje' && !cambioChat && previos.size) {
        if (it.mensaje.autor === sig.yo) propioNuevo = true;
        else if (it.mensaje.tipo !== 'sistema') agregadosAjenos.push(it.mensaje);
      }
      if (lista.children[i] !== el) lista.insertBefore(el, lista.children[i] ?? null);
    });
    for (const el of existentes.values()) el.remove();

    if (cambioChat || previos.size === 0) {
      // arranque: en la línea de no leídos o abajo (W-CHAT-10)
      requestAnimationFrame(() => {
        const linea = lista.querySelector('.noleidos') as HTMLElement | null;
        if (linea) scroll.scrollTop = Math.max(0, linea.offsetTop - scroll.clientHeight * 0.25);
        else alFondo();
        pintarBajar();
      });
      return;
    }
    const primeraAhora = lista.querySelector('av-chat-burbuja')?.getAttribute('data-clave') ?? null;
    if (primeraAntes && primeraAhora !== primeraAntes && lista.querySelector(`[data-clave="${CSS.escape(primeraAntes)}"]`)) {
      // llegaron anteriores arriba: se conserva la posición de lectura (W-CHAT-11)
      scroll.scrollTop = topAntes + (scroll.scrollHeight - altoAntes);
    } else if (propioNuevo || (cerca && agregadosAjenos.length)) {
      requestAnimationFrame(() => alFondo(true));
    } else if (agregadosAjenos.length) {
      nuevos += agregadosAjenos.length; // no se mueve la vista (W-CHAT-12)
    } else if (cerca && scroll.scrollHeight !== altoAntes) {
      requestAnimationFrame(() => alFondo()); // creció (reacción, imagen, edición) estando abajo: sigue abajo
    }
    if (agregadosAjenos.length) {
      const u = agregadosAjenos[agregadosAjenos.length - 1]!;
      anuncio.textContent = t.anuncioNuevo(nombre(u.autor), resumenMensaje(u, t));
    }
    if (sig.resaltar && sig.resaltar !== previo?.resaltar) {
      const destino = [...lista.querySelectorAll<HTMLElement>('av-chat-burbuja')].find((b) => b.dataset['ref'] === sig.resaltar || sig.mensajes.some((m) => m.clave === b.dataset['ref'] && coincide(m, sig.resaltar)));
      destino?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    pintarBajar();
  };
  aplicar(inicial, null);
  return aplicar;
}

const AvChatMensajes = crearComponente<AvChatMensajesProps>(
  import.meta.url,
  'av-chat-mensajes',
  { chat: null, mensajes: [], yo: '', autores: {}, primerNoLeido: null, hayMas: false, cargandoAnteriores: false, resaltar: null },
  (root, props, host) => {
    (host as HTMLElement & { __aplicar?: unknown }).__aplicar = montar(root, props, host);
  },
  (_root, props, previos, host) => {
    const fn = (host as HTMLElement & { __aplicar?: (p: AvChatMensajesProps, q: AvChatMensajesProps) => void }).__aplicar;
    if (!fn) return false;
    fn(props, previos);
    return true;
  },
);

define('av-chat-mensajes', AvChatMensajes);
