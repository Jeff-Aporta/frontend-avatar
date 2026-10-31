// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
/**
 * <av-paty-pagination> — pie de lista con página actual, selector de tamaño y navegación.
 * API calcada de `iswc-pagination`; emite `paty-page-change` y `paty-page-size-change`.
 */

import { adoptCss, define, emitir, html, precargarCss } from './_paty.js';

precargarCss(import.meta.url, 'av-paty-pagination');

/** Tamaños de página cuando ningún atributo aporta opciones válidas. */
const DEFAULT_SIZES = [15, 30, 50];
const VARIANTES = new Set(['filled', 'outlined', 'plain', 'ghost', 'soft', 'text']);
const COLORES = new Set(['brand', 'neutral', 'success', 'warning', 'danger', 'info', 'error']);

/** Tamaños positivos únicos de una lista separada por comas o espacios; `[]` si no hay ninguno válido. */
function parseSizes(raw: string | null): number[] {
  if (!raw?.trim()) return [];
  const nums = raw
    .trim()
    .split(/[\s,]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
  return nums.length ? [...new Set(nums)] : [];
}

/**
 * Paginador con pista de números desplazable (flechas, Shift+rueda, arrastre táctil) y
 * selector de tamaño opcional. Las propiedades reflejan atributos y normalizan valores inválidos.
 */
class PatyPagination extends HTMLElement {
  /** Atributos cuyo cambio repinta el paginador. */
  static get observedAttributes() {
    return ['page', 'pages', 'page-size', 'page-size-options', 'elements-per-page', 'visible-elements-per-page', 'total', 'disabled', 'label', 'compact', 'variant', 'color'];
  }

  #root: ShadowRoot;
  #abort: AbortController | null = null;
  #caja: ResizeObserver | null = null;
  #gen = 0;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  /** Pinta y recalcula la visibilidad de las flechas cuando cambia el tamaño del host. */
  connectedCallback(): void {
    this.#pintar();
    this.#caja = new ResizeObserver(() => {
      const pista = this.#root.querySelector<HTMLElement>('.pista');
      if (pista) this.#flechas(pista);
    });
    this.#caja.observe(this);
  }

  disconnectedCallback(): void {
    this.#abort?.abort();
    this.#abort = null;
    this.#caja?.disconnect();
    this.#caja = null;
  }

  /** Repinta ante cualquier atributo observado, si está conectado. */
  attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#pintar();
  }

  /** Página actual (1-based, mínimo 1). */
  get page(): number { return Math.max(1, Number(this.getAttribute('page')) || 1); }
  set page(v: number) { this.setAttribute('page', String(Math.max(1, Number(v) || 1))); }

  /** Total de páginas (mínimo 1). */
  get pages(): number { return Math.max(1, Number(this.getAttribute('pages')) || 1); }
  set pages(v: number) { this.setAttribute('pages', String(Math.max(1, Number(v) || 1))); }

  /**
   * Tamaño de página efectivo: `page-size` si es una de las opciones; si no (o si solo
   * hay una opción), la primera opción.
   */
  get pageSize(): number {
    const opciones = this.#opciones();
    if (opciones.length === 1) return opciones[0]!;
    const n = Number(this.getAttribute('page-size'));
    if (opciones.includes(n)) return n;
    return opciones[0] ?? DEFAULT_SIZES[0]!;
  }
  set pageSize(v: number) { this.setAttribute('page-size', String(Math.max(1, Number(v) || DEFAULT_SIZES[0]!))); }

  get elementsPerPage(): number[] { return this.#opciones(); }
  set elementsPerPage(v: number[] | string) {
    const list = Array.isArray(v) ? v.filter((n) => Number.isFinite(n) && n > 0) : parseSizes(String(v ?? ''));
    this.setAttribute('elements-per-page', list.join(' '));
  }

  get visibleElementsPerPage(): boolean {
    const v = (this.getAttribute('visible-elements-per-page') ?? 'true').trim().toLowerCase();
    return v !== 'false' && v !== '0' && v !== 'no';
  }
  set visibleElementsPerPage(v: boolean) { this.setAttribute('visible-elements-per-page', v ? 'true' : 'false'); }

  /** Total de elementos del catálogo. Si es menor que el mínimo de opciones, el selector no se pinta. */
  get total(): number | null {
    if (!this.hasAttribute('total')) return null;
    const n = Number(this.getAttribute('total'));
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  set total(v: number | null) {
    if (v == null || !Number.isFinite(v) || v < 0) this.removeAttribute('total');
    else this.setAttribute('total', String(Math.floor(v)));
  }

  /** Opciones de tamaño legadas (`page-size-options`); `elements-per-page` tiene prioridad. */
  get pageSizeOptions(): number[] { return parseSizes(this.getAttribute('page-size-options')); }
  set pageSizeOptions(v: number[] | string) {
    const list = Array.isArray(v) ? v : parseSizes(String(v ?? ''));
    this.setAttribute('page-size-options', list.join(','));
  }

  /** Bloquea navegación y selector de tamaño (refleja el atributo `disabled`). */
  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(v: boolean) { this.toggleAttribute('disabled', !!v); }

  /** Apariencia del número actual. `solid` es alias de `filled`. */
  get variant(): string {
    const v = (this.getAttribute('variant') || '').trim().toLowerCase();
    if (v === 'solid' || v === '') return 'filled';
    return VARIANTES.has(v) ? v : 'filled';
  }
  set variant(v: string) {
    const n = String(v ?? '').trim().toLowerCase();
    if (!n || n === 'filled' || n === 'solid') this.removeAttribute('variant');
    else this.setAttribute('variant', VARIANTES.has(n) ? n : 'filled');
  }

  /** Color del número actual y de las flechas. Sin atributo, brand. */
  get color(): string {
    const raw = (this.getAttribute('color') || '').trim();
    const n = raw.toLowerCase();
    if (!n) return 'brand';
    if (COLORES.has(n)) return n;
    if (/^(#|rgb|hsl|okl|lab|lch|color\(|color-mix\(|var\()/.test(n)) return raw;
    return 'brand';
  }
  set color(v: string) {
    const raw = String(v ?? '').trim();
    const n = raw.toLowerCase();
    if (!n || n === 'brand') this.removeAttribute('color');
    else if (COLORES.has(n)) this.setAttribute('color', n);
    else this.setAttribute('color', raw);
  }

  /** Opciones de tamaño: `elements-per-page`, si no `page-size-options`, si no `DEFAULT_SIZES`. */
  #opciones(): number[] {
    if (this.hasAttribute('elements-per-page')) {
      const lista = parseSizes(this.getAttribute('elements-per-page'));
      return lista.length ? lista : DEFAULT_SIZES;
    }
    const legado = parseSizes(this.getAttribute('page-size-options'));
    return legado.length ? legado : DEFAULT_SIZES;
  }

  #pintar(): void {
    const page = this.page;
    const pages = this.pages;
    const opciones = this.#opciones();
    const minOpcion = opciones.length ? Math.min(...opciones) : DEFAULT_SIZES[0];
    const total = this.total;
    const pocosParaSelector = total != null && total < minOpcion!;
    const muestraTamano = this.visibleElementsPerPage && opciones.length >= 2 && !pocosParaSelector;
    const pageSize = this.pageSize;
    const disabled = this.disabled;
    const label = this.getAttribute('label') || 'Paginación';
    const sizeOpts = opciones.includes(pageSize) ? opciones : [pageSize, ...opciones];

    const ir = (destino: number) => {
      if (disabled || destino === page || destino < 1 || destino > pages) return;
      this.page = destino;
      emitir(this, 'paty-page-change', { page: destino });
    };
    const variante = this.variant;
    const color = this.color;
    const numeros = Array.from({ length: pages }, (_, i) => i + 1).map((item) => {
      const actual = item === page;
      return actual
        ? html`<iswc-button class="pagina" shape="pill" variant=${variante} color=${color} aria-current="page" aria-label=${`Página ${item}`}>${item}</iswc-button>`
        : html`<iswc-button class="pagina" shape="pill" variant="text" aria-label=${`Ir a la página ${item}`} ?disabled=${disabled} oniswc-click=${() => ir(item)}>${item}</iswc-button>`;
    });

    this.#root.replaceChildren(html`
      <nav class="paginador" aria-label=${label}>
        <span class="paginador__meta" aria-live="polite" aria-atomic="true">Página ${page} de ${pages}</span>
        <div class="carril">
          <iswc-button class="flecha flecha-prev" shape="pill" variant="text" color=${color} aria-label="Desplazar páginas a la izquierda" ?disabled=${disabled} oniswc-click=${() => this.#mover(-1)}>
            <iswc-icon icon="mdi:chevron-left"></iswc-icon>
          </iswc-button>
          <div class="pista" role="group">${numeros}</div>
          <iswc-button class="flecha flecha-next" shape="pill" variant="text" color=${color} aria-label="Desplazar páginas a la derecha" ?disabled=${disabled} oniswc-click=${() => this.#mover(1)}>
            <iswc-icon icon="mdi:chevron-right"></iswc-icon>
          </iswc-button>
        </div>
        ${muestraTamano
          ? html`
            <iswc-select
              class="paginador__tamano"
              value=${String(pageSize)}
              title="Elementos por página"
              aria-label="Elementos por página"
              ?disabled=${disabled}
              onchange=${(ev: Event) => {
                const n = Number((ev.target as HTMLSelectElement).value);
                if (!Number.isFinite(n) || n <= 0) return;
                this.pageSize = n;
                emitir(this, 'paty-page-size-change', { pageSize: n });
              }}
            >
              ${sizeOpts.map((n) => html`<iswc-option value=${String(n)}>${n}</iswc-option>`)}
            </iswc-select>
          `
          : null}
      </nav>
    `);
    adoptCss(this.#root, import.meta.url, 'av-paty-pagination');
    this.#root.querySelectorAll('.pagina:not([aria-current="page"])').forEach((n) => n.removeAttribute('color'));
    this.#ligar();
  }

  // Flechas, Shift+rueda y arrastre táctil recorren la pista. El número cambia la página.
  #ligar(): void {
    this.#abort?.abort();
    const ac = new AbortController();
    this.#abort = ac;
    const gen = ++this.#gen;
    const pista = this.#root.querySelector<HTMLElement>('.pista');
    if (!pista) return;
    const sync = () => this.#flechas(pista);
    pista.addEventListener('scroll', sync, { signal: ac.signal, passive: true });
    pista.addEventListener('wheel', (ev) => {
      const lateral = ev.shiftKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY);
      if (!lateral) return;
      const dx = ev.shiftKey && Math.abs(ev.deltaY) >= Math.abs(ev.deltaX) ? ev.deltaY : ev.deltaX;
      if (!dx) return;
      ev.preventDefault();
      pista.scrollLeft += dx;
    }, { signal: ac.signal, passive: false });
    let id = -1;
    let origen = 0;
    let inicio = 0;
    let ultimoX = 0;
    let ultimoT = 0;
    let vel = 0;
    let inercia = 0;
    const frenar = () => { if (inercia) cancelAnimationFrame(inercia); inercia = 0; };
    pista.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'mouse' || this.disabled) return;
      frenar();
      id = ev.pointerId;
      origen = ultimoX = ev.clientX;
      inicio = pista.scrollLeft;
      ultimoT = ev.timeStamp;
      vel = 0;
      pista.setPointerCapture(id);
    }, { signal: ac.signal });
    pista.addEventListener('pointermove', (ev) => {
      if (ev.pointerId !== id) return;
      const dt = ev.timeStamp - ultimoT;
      if (dt > 0) vel = (ev.clientX - ultimoX) / dt;
      ultimoX = ev.clientX;
      ultimoT = ev.timeStamp;
      pista.scrollLeft = inicio - (ev.clientX - origen);
    }, { signal: ac.signal });
    const soltar = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      const movido = Math.abs(ev.clientX - origen);
      id = -1;
      if (movido > 6) {
        const cortar = (click: Event) => { click.stopPropagation(); click.preventDefault(); };
        pista.addEventListener('click', cortar, { capture: true, once: true });
      }
      if (Math.abs(vel) < 0.04) return;
      let paso = vel * 16;
      const correr = () => {
        pista.scrollLeft -= paso;
        paso *= 0.92;
        inercia = Math.abs(paso) > 0.4 ? requestAnimationFrame(correr) : 0;
      };
      inercia = requestAnimationFrame(correr);
    };
    pista.addEventListener('pointerup', soltar, { signal: ac.signal });
    pista.addEventListener('pointercancel', (ev) => { if (ev.pointerId === id) id = -1; frenar(); }, { signal: ac.signal });
    ac.signal.addEventListener('abort', frenar);
    requestAnimationFrame(() => { if (gen === this.#gen) this.#centrar(pista); });
  }

  #mover(dir: number): void {
    const pista = this.#root.querySelector<HTMLElement>('.pista');
    if (!pista || this.disabled) return;
    pista.scrollBy({ left: dir * Math.max(pista.clientWidth * 0.85, 1), behavior: 'smooth' });
  }

  #centrar(pista: HTMLElement): void {
    const actual = pista.querySelector<HTMLElement>('[aria-current="page"]');
    if (actual) {
      const caja = pista.getBoundingClientRect();
      const chip = actual.getBoundingClientRect();
      const izq = chip.left - caja.left + pista.scrollLeft;
      pista.scrollLeft = Math.max(0, izq - (pista.clientWidth - chip.width) / 2);
    }
    this.#flechas(pista);
  }

  #flechas(pista: HTMLElement): void {
    const prev = this.#root.querySelector<HTMLElement>('.flecha-prev');
    const next = this.#root.querySelector<HTMLElement>('.flecha-next');
    if (!prev || !next) return;
    const marcar = (nodo: HTMLElement, visible: boolean) => {
      nodo.classList.toggle('oculta', !visible);
      nodo.toggleAttribute('aria-hidden', !visible);
      if ('disabled' in nodo) (nodo as HTMLButtonElement).disabled = !visible || this.disabled;
    };
    marcar(prev, pista.scrollLeft > 1);
    marcar(next, pista.scrollLeft + pista.clientWidth < pista.scrollWidth - 1);
  }
}

define('av-paty-pagination', PatyPagination);
