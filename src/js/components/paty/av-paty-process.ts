// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
// `<av-paty-process>` — webcomponent que renderiza UNA tarjeta del "feed de procesos" paralelos
// que el backend PatyIA emite por SSE (`event: process`) cuando el chat viaja en modo XML.
//
// Por cada `event: process` que llega del stream el chat-message apila una tarjeta nueva.
// El orden de llegada es el orden visual (los procesos paralelos se pintan en cascada).
//
// Atributos:
//   - xml   : el texto XML crudo del proceso (ej. `<av-paty-process>Recibiendo respuesta de OpenAI|openai</av-paty-process>`).
//              Se conserva accesible en el DOM por si el llamador quiere inspeccionarlo.
//   - step  : identificador lógico del paso (`classifier-wait`, `llm-stream`, ...).
//   - status: `pending` (default), `done`, `error`.
//   - ts    : timestamp ISO 8601 en que llegó el evento (lo rellena el front al recibirlo).
//
// El aspecto es deliberadamente compacto y se apila verticalmente dentro del chat-message;
// cada tarjeta es independiente para que varias corriendo en paralelo se lean como pasos
// discretos sin mezclarse.
//
// Paty family S-K1: el front ya puede crear nuevos componentes `paty-*` sin promoverlos
// al kit. El kit los expone por dist/cdn cuando hay pedido explícito del usuario.
import type { PatyProcessEstado as Estado, PatyProcessProps as Props } from '../../consts/schemas/paty.schemas.js';
import { adoptCss, define, emitir, html } from './_paty.js';

/** Atributos que repintan la tarjeta al cambiar. */
const OBSERVADOS = ["xml", "text", "step", "status", "ts"] as const;

/** Etiqueta humana por step conocido (best-effort, fallback al step crudo). */
const STEP_LABELS: Record<string, { label: string; icon: string }> = {
    // Contrato vigente del ISS (conversationChat.controller: proceso(texto, step)).
    "classifier": { label: "Clasificador", icon: "mdi:tag-outline" },
    "llm-receive": { label: "Modelo", icon: "mdi:creation" },
    "audio-transcribe": { label: "Audio", icon: "mdi:microphone-outline" },
    // Nombres anteriores: los usan el fixture del kit XML y logs viejos.
    "classifier-wait": { label: "Clasificador", icon: "mdi:tag-outline" },
    "llm-stream": { label: "Modelo", icon: "mdi:creation" },
    "openai-stream": { label: "OpenAI", icon: "simple-icons:openai" },
    "minimax-stream": { label: "MiniMax", icon: "mdi:creation" },
    "tool-call": { label: "Herramienta", icon: "mdi:tools" },
    "file-search": { label: "Búsqueda docs", icon: "mdi:file-search-outline" },
    "mcp-poll": { label: "MCP ContaPyme", icon: "mdi:cloud-sync-outline" },
};

/** Etiqueta humana por status conocido. */
const STATUS_LABELS: Record<Estado, { label: string; icon: string; tono: "warning" | "success" | "danger" }> = {
    pending: { label: "en curso", icon: "mdi:progress-clock", tono: "warning" },
    done: { label: "listo", icon: "mdi:check-circle-outline", tono: "success" },
    error: { label: "error", icon: "mdi:alert-circle-outline", tono: "danger" },
};

/** Tarjeta de un paso del feed de procesos (modo XML): spinner o icono según `status` y la frase del paso. */
class PatyProcess extends HTMLElement {
    #root: ShadowRoot;
    /** Estado actual, reflejo de los atributos observados. */
    #props: Props = { xml: "", text: "", step: "", status: "pending", ts: "" };

    static get observedAttributes(): readonly string[] { return OBSERVADOS; }

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
    }

    connectedCallback(): void { this.#render(); }

    /** Copia el atributo cambiado a las props y repinta. */
    attributeChangedCallback(name: string, oldV: string | null, newV: string | null): void {
        if (oldV === newV) return;
        const next: Props = { ...this.#props, [name]: newV ?? "" };
        if (name === "status") {
            const s = String(newV ?? "").toLowerCase();
            next.status = s === "done" || s === "error" ? s : "pending";
        }
        this.#props = next;
        if (this.isConnected) this.#render();
    }

    /** Pinta la tarjeta: la frase (de `text`, del wrapper `<av-paty-process>` o del XML crudo) o, sin frase, la etiqueta del step; con estado y hora en el `title`. */
    #render(): void {
        const { xml, text, step, status, ts } = this.#props;
        const stepTxt = String(step ?? "").trim();
        const statusTxt = ((): Estado => status === "done" || status === "error" ? status : "pending")();
        const tsTxt = String(ts ?? "").trim();
        const stepMeta = STEP_LABELS[stepTxt] ?? { label: stepTxt || "Proceso", icon: "mdi:cog-outline" };
        const statusMeta = STATUS_LABELS[statusTxt];

        const selfRef = unwrapPatyProcessSelfRef(xml);
        const descripcion = selfRef?.descripcion ?? null;
        const providerHint = selfRef?.provider ?? null;
        const stepEfectivo = stepTxt || (providerHint ? `${providerHint}-stream` : "");
        const stepMetaEfectivo = STEP_LABELS[stepEfectivo] ?? stepMeta;
        const frase = String(text ?? "").trim() || descripcion || (xml && !selfRef ? xml.replace(/\s+/g, " ").trim() : "");
        const titulo = frase || stepMetaEfectivo.label;
        const pista = [titulo, stepEfectivo, statusMeta.label, tsTxt].filter(Boolean).join(" · ");

        this.#root.replaceChildren(html`
            <article class="proceso proceso--${statusTxt}" data-status=${statusTxt} part="proceso" title=${pista}>
                <span class="proceso__giro" aria-hidden="true">
                    ${statusTxt === "pending"
                        ? html`<iswc-spinner></iswc-spinner>`
                        : html`<iswc-icon icon=${statusMeta.icon}></iswc-icon>`}
                </span>
                <span class="proceso__texto">
                    <span class="proceso__titulo">${titulo}</span>
                </span>
                <span class="proceso__estado">${statusMeta.label}</span>
            </article>
        `);
        adoptCss(this.#root, import.meta.url, "av-paty-process");
    }
}

/**
 * Detecta si `xml` es un wrapper auto-referencial `<av-paty-process>…</av-paty-process>` y extrae
 * su contenido. Si viene `texto|provider` lo separa. Devuelve null cuando NO es el wrapper
 * (en cuyo caso `xml` se trata como XML crudo y se renderiza escapado en `<pre>`).
 *
 * Caso típico (screenshot del bug 2026-09-23):
 *   input  : "<av-paty-process>Recibiendo respuesta de openai</av-paty-process>"
 *   output : { descripcion: "Recibiendo respuesta de openai", provider: null }
 *
 * Variante con provider:
 *   input  : "<av-paty-process>Recibiendo respuesta de OpenAI|openai</av-paty-process>"
 *   output : { descripcion: "Recibiendo respuesta de OpenAI", provider: "openai" }
 */
function unwrapPatyProcessSelfRef(xml: string): { descripcion: string; provider: string | null } | null {
    const s = String(xml ?? "").trim();
    if (!s) return null;
    const re = /^<av-paty-process>([\s\S]*?)<\/av-paty-process>$/i;
    const m = re.exec(s);
    if (!m) return null;
    const inner = String(m[1] ?? "").trim();
    if (!inner) return null;
    const sep = inner.indexOf("|");
    if (sep >= 0) {
        const descripcion = inner.slice(0, sep).trim();
        const provider = inner.slice(sep + 1).trim().toLowerCase();
        return { descripcion: descripcion || inner, provider: provider || null };
    }
    return { descripcion: inner, provider: null };
}

define("av-paty-process", PatyProcess);

/** Emite `av-paty-process-status` (`{ id, status }`) desde la tarjeta, para que el chat siga el estado del paso. */
export function notificarProceso(target: HTMLElement, status: Estado): void {
    emitir(target, "av-paty-process-status", { id: target.getAttribute("data-step") ?? "", status });
}