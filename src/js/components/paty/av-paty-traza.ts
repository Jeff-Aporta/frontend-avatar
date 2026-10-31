// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
// `<av-paty-traza>` — log del turno que narra el ISS (SSE `event: log` en vivo y
// `meta.traza` al cerrar o al recargar desde la bitacora). Cada fila es un paso
// del pipeline: `+ms` desde el inicio del turno, nivel, etapa, mensaje, duracion
// y sus datos (JSON desplegable). Sirve a QA para ver que hizo el ISS, cuanto
// tardo cada paso y donde fallo.
//
// API:
//   - propiedad `eventos`  : `TEventoTraza[]` (contrato `ZEventoTraza` del pin del ISS).
//   - atributo  `en-vivo`  : el turno sigue en curso (abre la traza y marca el ultimo paso).
//   - atributo  `abierto`  : la traza nace desplegada.
// Eventos: `av-paty-traza-copiar` ({ json }) al copiar la traza.
import { PatyTrazaFiltroSchema, PatyTrazaPropsSchema } from '../../consts/schemas/paty.schemas.js';
import type { PatyTrazaFiltro } from '../../consts/schemas/paty.schemas.js';
import { ZTraza } from '../../consts/schemas/paty.schemas.js';
import type { TEventoTraza } from '../../consts/schemas/paty.schemas.js';
import { adoptarPropsTardias, adoptCss, define, emitir, html, precargarCss } from './_paty.js';

precargarCss(import.meta.url, "av-paty-traza");

const NIVELES: Record<TEventoTraza["nivel"], { icono: string; etiqueta: string }> = {
    debug: { icono: "mdi:bug-outline", etiqueta: "debug" },
    info: { icono: "mdi:information-outline", etiqueta: "info" },
    warn: { icono: "mdi:alert-outline", etiqueta: "aviso" },
    error: { icono: "mdi:alert-circle-outline", etiqueta: "error" },
};
const FILTROS: Array<{ id: PatyTrazaFiltro; etiqueta: string }> = [
    { id: "todo", etiqueta: "Todo" },
    { id: "info", etiqueta: "Info" },
    { id: "warn", etiqueta: "Avisos" },
    { id: "error", etiqueta: "Errores" },
];

/** `1234` ms -> `1,2 s`; menos de un segundo, en ms. */
export function formatoMs(ms: number): string {
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} s`;
}

/** Eventos que pasan el filtro: `warn` incluye errores; `info` excluye `debug`. */
export function filtrarTraza(eventos: readonly TEventoTraza[], filtro: PatyTrazaFiltro): TEventoTraza[] {
    if (filtro === "todo") return [...eventos];
    if (filtro === "error") return eventos.filter((e) => e.nivel === "error");
    if (filtro === "warn") return eventos.filter((e) => e.nivel === "warn" || e.nivel === "error");
    return eventos.filter((e) => e.nivel !== "debug");
}

/** Resumen de la cabecera: cantidad, duracion total y avisos/errores. */
export function resumenTraza(eventos: readonly TEventoTraza[]): { total: number; ms: number; avisos: number; errores: number } {
    return {
        total: eventos.length,
        ms: eventos.at(-1)?.ms ?? 0,
        avisos: eventos.filter((e) => e.nivel === "warn").length,
        errores: eventos.filter((e) => e.nivel === "error").length,
    };
}

class PatyTraza extends HTMLElement {
    #root: ShadowRoot;
    #eventos: TEventoTraza[] = [];
    #filtro: PatyTrazaFiltro = "todo";
    #abierto = false;

    static get observedAttributes(): readonly string[] { return ["en-vivo", "abierto"]; }

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
    }

    /** Si el usuario la dejo desplegada (la burbuja la conserva al repintar). */
    get abierta(): boolean { return this.#abierto; }
    get eventos(): TEventoTraza[] { return [...this.#eventos]; }
    set eventos(v: unknown) {
        const r = ZTraza.safeParse(v ?? []);
        this.#eventos = r.success ? r.data : [];
        if (this.isConnected) this.#render();
    }

    /** Playground y vistas: `{ eventos, filtro?, abierto? }` (`PatyTrazaPropsSchema` parcial). */
    set props(v: unknown) {
        const r = PatyTrazaPropsSchema.partial().safeParse(v ?? {});
        if (!r.success) return;
        if (r.data.eventos) { const t = ZTraza.safeParse(r.data.eventos); this.#eventos = t.success ? t.data : []; }
        if (r.data.filtro) this.#filtro = r.data.filtro;
        if (r.data.abierto !== undefined) this.#abierto = r.data.abierto;
        if (this.isConnected) this.#render();
    }

    connectedCallback(): void {
        adoptarPropsTardias(this);
        this.#abierto = this.#abierto || this.hasAttribute("abierto") || this.hasAttribute("en-vivo");
        this.#render();
    }

    attributeChangedCallback(nombre: string, antes: string | null, ahora: string | null): void {
        if (antes === ahora) return;
        if (ahora !== null && (nombre === "abierto" || nombre === "en-vivo")) this.#abierto = true;
        if (this.isConnected) this.#render();
    }

    #alternar = (): void => { this.#abierto = !this.#abierto; this.#render(); };

    #filtrar(id: string): void {
        const r = PatyTrazaFiltroSchema.safeParse(id);
        if (!r.success) return;
        this.#filtro = r.data;
        this.#render();
    }

    #copiar = (): void => {
        const json = JSON.stringify(this.#eventos, null, 2);
        void navigator.clipboard?.writeText(json).catch(() => undefined);
        emitir(this, "av-paty-traza-copiar", { json });
    };

    #render(): void {
        const enVivo = this.hasAttribute("en-vivo");
        const r = resumenTraza(this.#eventos);
        const visibles = filtrarTraza(this.#eventos, this.#filtro);
        const ultimo = this.#eventos.at(-1)?.seq;
        const estado = r.errores ? "error" : r.avisos ? "warn" : "ok";
        this.#root.replaceChildren(html`
            <section class="traza traza--${estado}" part="traza" data-estado=${estado}>
                <button class="cabecera" type="button" aria-expanded=${String(this.#abierto)} onclick=${this.#alternar}>
                    <iswc-icon icon=${this.#abierto ? "mdi:chevron-down" : "mdi:chevron-right"}></iswc-icon>
                    <iswc-icon icon="mdi:text-box-search-outline"></iswc-icon>
                    <span class="titulo">Traza del ISS</span>
                    <span class="resumen">${r.total} evento${r.total === 1 ? "" : "s"} · ${formatoMs(r.ms)}</span>
                    ${r.avisos ? html`<iswc-badge class="cuenta" color="warning">${r.avisos} aviso${r.avisos === 1 ? "" : "s"}</iswc-badge>` : ""}
                    ${r.errores ? html`<iswc-badge class="cuenta" color="danger">${r.errores} error${r.errores === 1 ? "" : "es"}</iswc-badge>` : ""}
                    ${enVivo ? html`<span class="vivo" aria-label="en curso">en vivo</span>` : ""}
                </button>
                ${this.#abierto ? html`
                    <div class="barra">
                        <div class="filtros" role="group" aria-label="Filtrar por nivel">
                            ${FILTROS.map((f) => html`
                                <button type="button" class="filtro" aria-pressed=${String(this.#filtro === f.id)} onclick=${() => this.#filtrar(f.id)}>${f.etiqueta}</button>
                            `)}
                        </div>
                        <button type="button" class="copiar" onclick=${this.#copiar} aria-label="Copiar la traza en JSON">
                            <iswc-icon icon="mdi:content-copy"></iswc-icon> JSON
                        </button>
                    </div>
                    <ol class="eventos" aria-label="Eventos de la traza">
                        ${visibles.length ? visibles.map((e) => html`
                            <li class="evento evento--${e.nivel}" data-nivel=${e.nivel} data-etapa=${e.etapa} ?data-ultimo=${enVivo && e.seq === ultimo}>
                                <span class="ms">+${formatoMs(e.ms)}</span>
                                <iswc-icon class="nivel" icon=${NIVELES[e.nivel]!.icono} title=${NIVELES[e.nivel]!.etiqueta}></iswc-icon>
                                <span class="etapa">${e.etapa}</span>
                                <span class="mensaje">${e.mensaje}</span>
                                ${e.dur !== undefined ? html`<span class="dur">${formatoMs(e.dur)}</span>` : ""}
                                ${e.datos ? html`<details class="datos"><summary>datos</summary><pre>${JSON.stringify(e.datos, null, 2)}</pre></details>` : ""}
                            </li>
                        `) : html`<li class="vacio">Sin eventos para este filtro.</li>`}
                    </ol>
                ` : ""}
            </section>
        `);
        adoptCss(this.#root, import.meta.url, "av-paty-traza");
    }
}

define("av-paty-traza", PatyTraza);
