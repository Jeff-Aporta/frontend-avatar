/**
 * <av-chat-emojis> — selector de emojis (W-CHAT-19/24): recientes, categorías con atajos y scrollspy, búsqueda que reordena
 * por significado y cuadrícula navegable con flechas. Emite `av-chat-emoji { emoji, destino }`.
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatEmojisProps } from '../../consts/schemas/chat.schemas.js';
import { cargarCatalogoEmojis, CATEGORIAS_EMOJI, type Emoji, ordenarEmojis, ordenarEmojisPorSentido, ordenarEmojisTolerante, recientes, usarEmoji } from '../../chat/emojis.js';
import { textos } from '../../chat/textos.js';

type Campo = HTMLElement & { value: string; focus(): void };
type Signo = { e: string; k: string };
type Pendiente = { grupo: HTMLElement; signos: Signo[] };
type Host = HTMLElement & { enfocar?: () => void };

const COLUMNAS = 10;
const ESPERA_MS = 250;
/** Botones por tramo: la rejilla completa son casi 2000 `iswc-button` y pintarlos de un golpe bloquea el hilo principal. */
const TRAMO = 48;
/** En reposo van menos por vuelta: 8 `iswc-button` caben en un cuadro; con 24 cada vuelta era una tarea larga (>50 ms). */
const TRAMO_FONDO = 8;
const filas = (n: number) => `--filas:${Math.ceil(n / COLUMNAS)}`;

const AvChatEmojis = crearComponente<AvChatEmojisProps>(import.meta.url, 'av-chat-emojis', { destino: '' }, (root, props, host) => {
  const t = textos();
  const elegir = (e: string) => {
    usarEmoji(e);
    emitir(host, 'av-chat-emoji', { emoji: e, destino: props.destino });
  };
  const boton = ({ e, k }: Signo) => html`<iswc-button class="emoji" variant="glyph" tabindex="-1" title=${k} aria-label=${k || e} data-e=${e}>${e}</iswc-button>`;
  const rec = recientes().map((e) => ({ e, k: '' }));
  root.append(html`
    <div class="selector" part="selector" role="dialog" aria-label=${t.emojis}>
      <iswc-input class="buscar" type="search" clearable placeholder=${t.buscar} aria-label=${t.buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
      <iswc-scrollspy class="categorias" target=".rejilla" root-margin="-5% 0px -80% 0px" aria-label=${t.emojis}>
        ${rec.length ? html`<a class="cat" href="#recientes" title="Recientes" aria-label="Recientes"><iswc-icon icon="mdi:clock-outline"></iswc-icon></a>` : null}
        ${CATEGORIAS_EMOJI.map((c) => html`<a class="cat" href=${`#${c.id}`} title=${c.nombre} aria-label=${c.nombre}><iswc-icon icon=${c.icono}></iswc-icon></a>`)}
      </iswc-scrollspy>
      <div class="rejilla" role="grid">
        <div class="resultados" hidden></div>
        <div class="secciones">
          ${rec.length ? html`<section id="recientes"><iswc-heading level="3">Recientes</iswc-heading><div class="grupo" style=${filas(rec.length)}></div></section>` : null}
          ${CATEGORIAS_EMOJI.map((c) => html`<section id=${c.id}><iswc-heading level="3">${c.nombre}</iswc-heading><div class="grupo"></div></section>`)}
        </div>
      </div>
    </div>
  `);
  const rejilla = root.querySelector('.rejilla') as HTMLElement;
  const resultados = root.querySelector('.resultados') as HTMLElement;
  const secciones = root.querySelector('.secciones') as HTMLElement;
  const visibles = () => [...(resultados.hidden ? secciones : resultados).querySelectorAll<HTMLElement>('.emoji')];
  const grupos = [...secciones.querySelectorAll<HTMLElement>('.grupo')];
  const pendientes: Pendiente[] = rec.length ? [{ grupo: grupos[0]!, signos: rec }] : [];
  const gruposCategoria = grupos.slice(rec.length ? 1 : 0);
  const itinerante = () => {
    const lista = visibles();
    if (lista[0] && !lista.some((b) => b.tabIndex === 0)) lista[0].tabIndex = 0;
  };
  const llenar = (tope = TRAMO) => {
    let queda = tope;
    while (queda > 0 && pendientes[0]) {
      const p = pendientes[0];
      const trozo = p.signos.splice(0, queda);
      p.grupo.append(html`${trozo.map(boton)}`);
      queda -= trozo.length;
      if (!p.signos.length) pendientes.shift();
    }
    itinerante();
  };
  let programado = false;
  const seguir = () => {
    if (programado || !pendientes.length) return;
    programado = true;
    // Con tiempo ocioso de sobra se meten varios tramos chicos en la misma vuelta; cada tramo es corto, así nunca se bloquea.
    const siguiente = (ocio?: IdleDeadline) => {
      programado = false;
      do llenar(TRAMO_FONDO); while (ocio && !ocio.didTimeout && ocio.timeRemaining() > 4 && pendientes.length);
      seguir();
    };
    if (typeof requestIdleCallback === 'function') requestIdleCallback(siguiente, { timeout: 120 });
    else setTimeout(siguiente, 16);
  };
  let carga: Promise<void> | null = null;
  // El catálogo solo se pide al abrir: la altura de cada grupo se fija al llegar, para que el scroll no salte al irse llenando.
  // La sección que entra en vista pasa al frente de la cola: saltar a Símbolos no espera a que se llenen las anteriores.
  const adelantar = (grupo: HTMLElement) => {
    const i = pendientes.findIndex((p) => p.grupo === grupo);
    if (i > 0) pendientes.unshift(...pendientes.splice(i, 1));
    if (i >= 0) {
      llenar();
      seguir();
    }
  };
  const vigiaSecciones = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((vistos) => vistos.filter((v) => v.isIntersecting).forEach((v) => adelantar(v.target as HTMLElement)), { root: rejilla, rootMargin: '50% 0px' })
    : null;
  const cargar = () => carga ??= cargarCatalogoEmojis().then((c) => {
    CATEGORIAS_EMOJI.forEach((cat, i) => {
      const signos = c[cat.id] ?? [];
      gruposCategoria[i]!.setAttribute('style', filas(signos.length));
      pendientes.push({ grupo: gruposCategoria[i]!, signos: [...signos] });
      vigiaSecciones?.observe(gruposCategoria[i]!);
    });
  }).catch(() => {
    carga = null;
  });
  const empezar = () => {
    void cargar().then(() => {
      if (!visibles().length) llenar();
      seguir();
    });
  };
  // Mientras el panel está oculto no se crea ningún botón: montar el chat no paga la rejilla.
  if (typeof IntersectionObserver === 'function') {
    const vigia = new IntersectionObserver((visto) => {
      if (!visto.some((v) => v.isIntersecting)) return;
      vigia.disconnect();
      empezar();
    });
    vigia.observe(rejilla);
  } else empezar();
  (host as Host).enfocar = () => {
    empezar();
    visibles().find((b) => b.tabIndex === 0)?.focus();
  };
  rejilla.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.emoji');
    if (b?.dataset['e']) elegir(b.dataset['e']);
  });
  rejilla.addEventListener('keydown', (e) => {
    let lista = visibles();
    const i = lista.indexOf(root.activeElement as HTMLElement);
    if (i < 0) return;
    if (i + COLUMNAS >= lista.length && pendientes.length) {
      llenar();
      lista = visibles();
    }
    const pasos: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLUMNAS, ArrowUp: -COLUMNAS };
    const paso = pasos[e.key];
    if (paso === undefined) return;
    e.preventDefault();
    const d = lista[Math.max(0, Math.min(lista.length - 1, i + paso))];
    if (!d) return;
    lista[i]!.tabIndex = -1;
    d.tabIndex = 0;
    d.focus();
  });
  const buscar = root.querySelector('.buscar') as Campo;
  let busqueda: Pendiente | null = null;
  const soltarBusqueda = () => {
    const i = busqueda ? pendientes.indexOf(busqueda) : -1;
    if (i >= 0) pendientes.splice(i, 1);
    busqueda = null;
  };
  const pintar = (lista: Emoji[]) => {
    soltarBusqueda();
    const grupo = document.createElement('div');
    grupo.className = 'grupo';
    grupo.setAttribute('style', filas(lista.length));
    resultados.replaceChildren(grupo);
    busqueda = { grupo, signos: lista.map(({ e, k }) => ({ e, k })) };
    pendientes.unshift(busqueda);
    rejilla.scrollTop = 0;
    llenar();
    seguir();
  };
  let turno = 0;
  buscar.addEventListener('iswc-input', () => {
    const q = (buscar.value ?? '').trim();
    const este = ++turno;
    resultados.hidden = !q;
    secciones.hidden = !!q;
    if (!q) {
      soltarBusqueda();
      return resultados.replaceChildren();
    }
    // Buscar ordena, nunca oculta: la palabra responde al instante, la pasada tolerante (errores, inglés) sigue sin esperar
    // al modelo, y el significado reordena al final solo si llega el vector y sigue siendo la misma búsqueda.
    void cargar().then(() => {
      if (este === turno) pintar(ordenarEmojis(q));
    });
    setTimeout(async () => {
      if (este !== turno) return;
      const tolerante = await ordenarEmojisTolerante(q).catch(() => null);
      if (tolerante && este === turno) pintar(tolerante);
      const lista = await ordenarEmojisPorSentido(q).catch(() => null);
      if (lista && este === turno) pintar(lista);
    }, ESPERA_MS);
  });
});

define('av-chat-emojis', AvChatEmojis);
