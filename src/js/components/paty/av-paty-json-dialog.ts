// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
/**
 * <av-paty-json-dialog> — ver y editar una configuración como JSON (config OpenAI del pane Sistema).
 * Valida mientras se escribe, no al aceptar, para que los errores se vean junto al editor
 * y «Aplicar» solo se encienda con JSON válido.
 */

import { adoptCss, define, emitir, html, precargarCss, adoptarPropsTardias } from './_paty.js';
import type { PatyJsonValidacion, PatyJsonDialogProps } from '../../consts/schemas/paty.schemas.js';
import { revisarProps } from '../../base/props-registro.js';

precargarCss(import.meta.url, 'av-paty-json-dialog');

/**
 * Diálogo modal con editor JSON, modo solo lectura y validador inyectado por props.
 * Emite `paty-json-cerrar` al cerrar/cancelar y `paty-json-aplicar` con `{ valor }` (el JSON normalizado por el validador).
 */
class PatyJsonDialog extends HTMLElement {
  #root: ShadowRoot;
  #props: PatyJsonDialogProps = { open: false, titulo: 'JSON', valor: '{}', readonly: true };
  /** Texto en edición; se toma de `valor` solo al abrir, separado de las props. */
  #texto = '';
  /** Errores del último paso por el validador, mostrados junto al editor. */
  #errores: string[] = [];

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  /** Props `open`, `titulo`, `valor`, `readonly` y `validar` (opcional); se fusionan con las actuales. */
  set props(v: Partial<PatyJsonDialogProps> | null | undefined) {
    if (v && typeof v === "object") revisarProps(this.tagName.toLowerCase(), v);
    const abriendo = Boolean(v?.open) && !this.#props.open;
    this.#props = { ...this.#props, ...(v ?? {}) };
    // El texto se toma al abrir: si se refrescara en cada sincronización, una edición a medias
    // se perdería en cuanto el formulario de detrás guardara cualquier otro campo.
    if (abriendo) {
      this.#texto = this.#props.valor ?? '{}';
      this.#errores = [];
    }
    if (this.isConnected) this.#render();
  }

  get props(): PatyJsonDialogProps { return this.#props; }

  connectedCallback(): void { this.#render(); adoptarPropsTardias(this); }

  /** Pasa el texto por el validador del consumidor y guarda sus errores; `null` si no hay validador. */
  #validar(texto: string): PatyJsonValidacion | null {
    const validar = this.#props.validar;
    if (!validar) return null;
    const resultado = validar(texto);
    this.#errores = resultado.errors ?? [];
    return resultado;
  }

  /** Pinta el diálogo según props, texto y errores actuales; «Aplicar» solo existe fuera de solo lectura. */
  #render(): void {
    const { open, titulo, readonly } = this.#props;
    const validacion = this.#props.validar ? this.#props.validar(this.#texto) : null;
    const puedeAplicar = !readonly && Boolean(validacion?.ok);
    const cerrar = () => emitir(this, 'paty-json-cerrar');

    this.#root.replaceChildren(html`
      <iswc-dialog class="dialogo" backdrop-variant="basic" label=${titulo} ?open=${open} oniswc-hide=${cerrar}>
        ${this.#errores.length
          ? html`
              <iswc-callout color="warning" role="alert">
                <ul class="errores">
                  ${this.#errores.map((e) => html`<li>${e}</li>`)}
                </ul>
              </iswc-callout>
            `
          : null}

        <iswc-code
          class="editor"
          lang="json"
          ?readonly=${readonly}
          placeholder="{}"
          oniswc-input=${(ev: Event) => {
            this.#texto = (ev.target as HTMLElement & { value: string }).value;
            const antes = this.#errores.join('|');
            this.#validar(this.#texto);
            // Solo se repinta si cambia la lista de errores: repintar en cada tecla recrearía
            // el editor y se perdería el cursor.
            if (this.#errores.join('|') !== antes) this.#render();
          }}
        ></iswc-code>

        <iswc-button slot="footer" variant="plain" oniswc-click=${cerrar}>
          ${readonly ? 'Cerrar' : 'Cancelar'}
        </iswc-button>
        ${readonly
          ? null
          : html`
              <iswc-button
                slot="footer"
                variant="filled"
                color="brand"
                ?disabled=${!puedeAplicar}
                oniswc-click=${() => emitir(this, 'paty-json-aplicar', { valor: validacion?.normalized })}
              >Aplicar JSON</iswc-button>
            `}
      </iswc-dialog>
    `);

    const editor = this.#root.querySelector('.editor') as (HTMLElement & { value?: string }) | null;
    if (editor && editor.value !== this.#texto) editor.value = this.#texto;

    adoptCss(this.#root, import.meta.url, 'av-paty-json-dialog');
  }
}

define('av-paty-json-dialog', PatyJsonDialog);
