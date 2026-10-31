// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.


import { adoptCss } from './_paty.js';

export interface PatyProgressStep {
    icono: string;
    texto: string;
}

const TEMPLATE = `
    <div class="bubble">
        <div class="avatar" aria-hidden="true">P</div>
        <div class="status-pill"><span class="dot"></span><span class="status-label">idle</span></div>
        <div class="name">Paty</div>
        <div class="progress" hidden></div>
        <div class="text-host"></div>
    </div>
`;

class PatyChatBubble extends HTMLElement {
    static get observedAttributes() { return ["text", "state", "chunks", "animated", "progress"]; }

    #renderedChars = 0;
    #targetText = "";
    #rafId: ReturnType<typeof setTimeout> | 0 = 0;

    #progressPintados: PatyProgressStep[] = [];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = TEMPLATE;
    }

    connectedCallback() {
        adoptCss(this.#root, import.meta.url, "av-paty-chat-bubble");
        this.#sync();
    }

    attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null): void {
        if (oldVal === newVal) return;
        this.#sync();
    }

    get #root(): ShadowRoot { return this.shadowRoot as ShadowRoot; }

    #sync(): void {
        const text = this.getAttribute("text") ?? "";
        const state = this.getAttribute("state") ?? "idle";
        const animated = this.getAttribute("animated") === "true";

        const label = this.#root?.querySelector(".status-label");
        if (label) {
            label.textContent =
                state === "streaming" ? "respondiendo" :
                state === "end" ? "listo" :
                state === "error" ? "error" : "idle";
        }

        this.#syncProgress(state);

        if (this.#targetText !== text && this.#rafId) {
            clearTimeout(this.#rafId as ReturnType<typeof setTimeout>);
            this.#rafId = 0;
        }

        const host = this.#root?.querySelector<HTMLElement>(".text-host");
        if (!host) return;

        if (state === "streaming" && animated && text.length > this.#renderedChars) {
            this.#targetText = text;
            this.#animateTypewriter(host);
        } else if (text !== this.#targetText || this.#renderedChars === 0) {

            if (this.#rafId) clearTimeout(this.#rafId as ReturnType<typeof setTimeout>);
            this.#rafId = 0;
            this.#targetText = text;
            this.#renderedChars = text.length;
            host.innerHTML = this.#renderMarkdown(text, state);
        }
    }

    #syncProgress(state: string): void {
        const cont = this.#root?.querySelector<HTMLElement>(".progress");
        if (!cont) return;

        const sellado = state === "end" || state === "error";

        let pasos: PatyProgressStep[] = [];
        try {
            const raw = this.getAttribute("progress") ?? "";
            const parsed: unknown = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed)) {
                pasos = parsed
                    .filter((p): p is PatyProgressStep => Boolean(p) && typeof p === "object" && typeof (p as PatyProgressStep).texto === "string")
                    .map((p) => ({ icono: String(p.icono ?? ""), texto: String(p.texto) }));
            }
        } catch {
            pasos = [];
        }

        if (sellado || pasos.length === 0) {
            this.#progressPintados = [];
            cont.innerHTML = "";

            const yaVacio = cont.hidden;
            if (yaVacio) return;
            window.setTimeout(() => {
                if ((this.getAttribute("state") ?? "") !== "streaming") cont.hidden = true;
            }, 400);
            return;
        }

        cont.hidden = false;

        const mismoPrefijo =
            pasos.length >= this.#progressPintados.length &&
            this.#progressPintados.every((p, i) => p.texto === pasos[i]?.texto && p.icono === pasos[i]?.icono);

        if (!mismoPrefijo) {
            this.#progressPintados = [];
            cont.innerHTML = "";
        }

        for (let i = this.#progressPintados.length; i < pasos.length; i++) {
            const p = pasos[i]!;
            const chip = document.createElement("div");
            chip.className = "progress-chip";
            chip.dataset.idx = String(i);
            const ico = document.createElement("span");
            ico.className = "progress-ico";
            ico.textContent = p.icono;
            const txt = document.createElement("span");
            txt.className = "progress-txt";
            txt.textContent = p.texto;
            const blink = document.createElement("span");
            blink.className = "progress-blink";
            chip.append(ico, txt, blink);
            cont.append(chip);
        }

        const chips = Array.from(cont.children) as HTMLElement[];
        chips.forEach((c, i) => c.classList.toggle("iswc-active", i === chips.length - 1));

        this.#progressPintados = pasos;
    }

    #animateTypewriter(host: HTMLElement): void {
        const tick = (): void => {
            const remaining = this.#targetText.length - this.#renderedChars;
            if (remaining <= 0) {
                this.#rafId = 0;
                host.innerHTML = this.#renderMarkdown(this.#targetText, this.getAttribute("state") ?? "idle");
                return;
            }

            const delay = remaining > 80 ? 6 : remaining > 20 ? 14 : 30;
            this.#renderedChars = Math.min(this.#targetText.length, this.#renderedChars + (remaining > 50 ? 3 : 1));
            host.innerHTML = this.#renderMarkdown(
                this.#targetText.slice(0, this.#renderedChars),
                "streaming",
            ) + `<span class="cursor" aria-hidden="true"></span>`;
            this.#rafId = setTimeout(() => requestAnimationFrame(tick), delay);
        };
        if (this.#rafId) clearTimeout(this.#rafId as ReturnType<typeof setTimeout>);
        requestAnimationFrame(tick);
    }

    #renderMarkdown(text: string, state: string): string {
        if (!text && state === "idle") {
            return `<span style="color: var(--iswc-text-soft); font-style: italic;">(esperando turno)</span>`;
        }
        if (!text && state === "streaming") {
            return `<span class="waiting" aria-label="pensando"><span></span><span></span><span></span></span>`;
        }
        if (!text && state === "error") {
            return `<em>error sin detalle</em>`;
        }
        const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const lines = esc(text).split(/\n/);
        const out: string[] = [];
        let inUl = false, inOl = false;
        const closeLists = () => {
            if (inUl) { out.push("</ul>"); inUl = false; }
            if (inOl) { out.push("</ol>"); inOl = false; }
        };
        for (const line of lines) {
            const trimmed = line.trim();
            if (/^#{1,6}\s+/.test(trimmed)) {
                closeLists();
                out.push(`<strong style="display:block; margin-top: 6px;">${trimmed.replace(/^#{1,6}\s+/, "")}</strong>`);
                continue;
            }
            if (/^[-*]\s+/.test(trimmed)) {
                if (!inUl) { closeLists(); out.push("<ul>"); inUl = true; }
                out.push(`<li>${trimmed.replace(/^[-*]\s+/, "")}</li>`);
                continue;
            }
            if (/^\d+\.\s+/.test(trimmed)) {
                if (!inOl) { closeLists(); out.push("<ol>"); inOl = true; }
                out.push(`<li>${trimmed.replace(/^\d+\.\s+/, "")}</li>`);
                continue;
            }
            if (/^>\s+/.test(trimmed)) {
                closeLists();
                out.push(`<blockquote>${trimmed.replace(/^>\s+/, "")}</blockquote>`);
                continue;
            }
            if (!trimmed) { closeLists(); out.push("<br/>"); continue; }
            closeLists();

            const html = trimmed
                .replace(/`([^`]+)`/g, "<code>$1</code>")
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^*]+)\*/g, "<em>$1</em>")
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, href) => {

                    const rawHref = String(href).trim()
                        .replace(/&amp;/gi, '&')
                        .replace(/&lt;/gi, '<')
                        .replace(/&gt;/gi, '>')
                        .replace(/&quot;/gi, '"')
                        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
                        .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
                    const safe = /^(javascript:|data\s*:\s*text\/html|vbscript:|file:)/i.test(rawHref.trim()) ? '#' : rawHref;
                    return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${txt}</a>`;
                });
            out.push(html);
        }
        closeLists();
        return out.join("\n");
    }
}

if (!customElements.get("av-paty-chat-bubble")) {
    customElements.define("av-paty-chat-bubble", PatyChatBubble);
}

export { PatyChatBubble };