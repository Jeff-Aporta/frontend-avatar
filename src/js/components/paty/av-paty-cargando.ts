// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
/* Caja de «cargando»: spinner + texto opcional, anunciada como estado. */

import { adoptCss, define, html, precargarCss } from './_paty.js';

precargarCss(import.meta.url, "av-paty-cargando");

/**
 * `<av-paty-cargando>`: indicador de carga en línea (spinner del kit + texto opcional).
 * Atributo `texto`; el host es `role="status"` con `aria-live="polite"`. Se repinta al cambiar `texto`.
 */
class PatyCargando extends HTMLElement {
  #root: ShadowRoot;

  static get observedAttributes(): string[] { return ["texto"]; }

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    if (!this.hasAttribute("role")) this.setAttribute("role", "status");
    if (!this.hasAttribute("aria-live")) this.setAttribute("aria-live", "polite");
    this.#pintar();
  }

  attributeChangedCallback(): void { if (this.isConnected) this.#pintar(); }

  /** Pinta el spinner y, si hay `texto`, el rótulo. */
  #pintar(): void {
    const texto = this.getAttribute("texto") ?? "";
    this.#root.replaceChildren(html`
      <iswc-spinner part="spinner"></iswc-spinner>
      ${texto ? html`<span class="texto" part="texto">${texto}</span>` : null}
    `);
    adoptCss(this.#root, import.meta.url, "av-paty-cargando");
  }
}

define("av-paty-cargando", PatyCargando);
