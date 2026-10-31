// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
/* Aviso único cuando la vista exige JWT. Cada sitio pasa icono, título y texto. */

import { adoptCss, define, html, precargarCss } from './_paty.js';

precargarCss(import.meta.url, "av-paty-sin-sesion");

/** Título por defecto si no llega el atributo `titulo`. */
const TITULO = "Inicia sesión para conversar con PatyIA";
/** Texto por defecto si no llega el atributo `texto`. */
const TEXTO = "Con tu cuenta ContaPyme puedes consultar al asistente, revisar tus conversaciones y seguir la trazabilidad de cada respuesta.";

/**
 * `<av-paty-sin-sesion>`: tarjeta que pide iniciar sesión en vistas que exigen JWT.
 * Atributos `icon`, `titulo` y `texto` (con valores por defecto); se repinta al cambiar cualquiera.
 */
class PatySinSesion extends HTMLElement {
  #root: ShadowRoot;

  static get observedAttributes(): string[] { return ["icon", "titulo", "texto"]; }

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void { this.#pintar(); }

  attributeChangedCallback(): void { if (this.isConnected) this.#pintar(); }

  /** Pinta la tarjeta con los atributos actuales o sus valores por defecto. */
  #pintar(): void {
    const icon = this.getAttribute("icon") || "solar:chat-round-line-bold-duotone";
    const titulo = this.getAttribute("titulo") || TITULO;
    const texto = this.getAttribute("texto") || TEXTO;
    this.#root.replaceChildren(html`
      <iswc-card class="tarjeta">
        <iswc-icon class="icono" icon=${icon}></iswc-icon>
        <h2 class="titulo">${titulo}</h2>
        <p class="texto">${texto}</p>
      </iswc-card>
    `);
    adoptCss(this.#root, import.meta.url, "av-paty-sin-sesion");
  }
}

define("av-paty-sin-sesion", PatySinSesion);
