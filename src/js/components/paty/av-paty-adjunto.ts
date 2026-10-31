// Traído de ISW-TestPatyIA para auditarlo como propuesta de iswc.
/**
 * <av-paty-adjunto> — preview de adjunto del chat (imagen / audio / documento).
 * Tamaño vía font-size del host: alto = 1em.
 *
 * Fuentes de datos (en orden):
 *   1) atributo `jfile` = JSON de patyia_files_storage
 *   2) hijos XML <meta> + <variants><variant name url bytes/></variants>
 *   3) atributos planos src / src-thumb / src-med / src-original / mime / filename
 */
import type { AdjuntoJfile as Jfile, AdjuntoJfileVariant as JfileVariant, AdjuntoKind as Kind, AdjuntoModo as Modo, AdjuntoVariantName as VariantName } from '../../consts/schemas/paty.schemas.js';
import { adoptCss, define, emitir, html } from './_paty.js';

/** Atributos cuyo cambio repinta el adjunto. */
const OBSERVADOS = [
  "ifile", "kind", "src", "src-thumb", "src-med", "src-original",
  "mime", "filename", "iconversacion", "width", "height", "durationSec",
  "transcripcion", "mode", "jfile",
] as const;

/** Apertura de `<av-paty-adjunto …>` en el HTML de un mensaje. */
const RE_PATY_ADJUNTO = /<av-paty-adjunto\b[^>]*?>/g;
/** Cierre `</av-paty-adjunto>` en el HTML de un mensaje. */
const RE_PATY_ADJUNTO_CLOSE = /<\/av-paty-adjunto>/g;

/** Tipo canónico del adjunto; acepta alias (`file`, `doc`) y mayúsculas, y cae en `imagen`. */
function normalizarKind(raw: string | null | undefined): Kind {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "audio") return "audio";
  if (v === "documento" || v === "file" || v === "doc") return "documento";
  return "imagen";
}

/** `jfile` (JSON de `patyia_files_storage`) como objeto, o `null` si está vacío o malformado; no lanza. */
function parseJfile(raw: string | null | undefined): Jfile | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  try {
    const o = JSON.parse(s);
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    return o as Jfile;
  } catch {
    return null;
  }
}

/** URL de la variante, o `''` si no existe. */
function urlVariant(v: JfileVariant | undefined): string {
  return String(v?.url ?? "").trim();
}

/** Primera URL no vacía según el orden de variantes `prefs`, luego `fallbacks`; `''` si ninguna. */
function pickUrl(
  j: Jfile | null,
  prefs: VariantName[],
  fallbacks: string[] = [],
): string {
  for (const p of prefs) {
    const u = urlVariant(j?.variants?.[p]);
    if (u) return u;
  }
  for (const f of fallbacks) {
    const u = String(f ?? "").trim();
    if (u) return u;
  }
  return "";
}

/** Icono `mdi:*` del documento según su MIME o extensión (PDF, hoja, Word, texto, zip…). */
function iconoDocumento(mime: string, filename: string): string {
  const m = mime.toLowerCase();
  const f = filename.toLowerCase();
  if (m.includes("pdf") || f.endsWith(".pdf")) return "mdi:file-pdf-box";
  if (m.includes("sheet") || m.includes("excel") || /\.xlsx?$/.test(f) || f.endsWith(".csv")) {
    return "mdi:file-excel-box";
  }
  if (m.includes("word") || /\.docx?$/.test(f)) return "mdi:file-word-box";
  if (m.includes("text") || /\.(txt|md|csv)$/.test(f)) return "mdi:file-document-outline";
  if (m.includes("zip") || m.includes("compressed") || /\.(zip|rar|7z)$/.test(f)) {
    return "mdi:folder-zip-outline";
  }
  if (m.startsWith("image/")) return "mdi:file-image-outline";
  if (m.startsWith("audio/")) return "mdi:file-music-outline";
  return "mdi:paperclip";
}

/** Insignia de formato en mayúsculas (extensión del nombre si es corta; si no, deducida del MIME o `FILE`). */
function etiquetaExt(mime: string, filename: string): string {
  const fromName = filename.includes(".") ? filename.split(".").pop() : "";
  if (fromName && fromName.length <= 5) return fromName.toUpperCase();
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("sheet") || mime.includes("excel")) return "XLS";
  if (mime.includes("word")) return "DOC";
  if (mime.startsWith("text/")) return "TXT";
  return "FILE";
}

/** Escapa `"` para un valor de atributo entre comillas dobles. */
function escAttr(s: string): string {
  return String(s ?? "").replace(/"/g, "&quot;");
}

class PatyAdjunto extends HTMLElement {
  #root: ShadowRoot;
  /** Observa los hijos `<meta>`/`<variants>` para repintar cuando cambian; vivo solo mientras está conectado. */
  #hijos: MutationObserver | null = null;

  static get observedAttributes(): readonly string[] { return OBSERVADOS; }

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
  }

  /** Pinta y queda reactivo a cambios en los hijos. */
  connectedCallback(): void {
    this.#hijos?.disconnect();
    this.#hijos = new MutationObserver(() => this.#render());
    this.#hijos.observe(this, { childList: true, subtree: true });
    this.#render();
  }

  /** Deja de observar los hijos. */
  disconnectedCallback(): void {
    this.#hijos?.disconnect();
    this.#hijos = null;
  }

  /** Repinta si un atributo observado cambió estando conectado. */
  attributeChangedCallback(_n: string, oldV: string | null, newV: string | null): void {
    if (oldV === newV || !this.isConnected) return;
    this.#render();
  }

  /**
   * Datos normalizados del adjunto fusionando las tres fuentes (`jfile`, hijos XML, atributos
   * planos; los `src-*` planos ganan). Dimensiones y duración no positivas quedan en `null`.
   */
  #datos(): {
    ifile: string;
    kind: Kind;
    mime: string;
    filename: string;
    preview: string;
    full: string;
    media: string;
    width: number | null;
    height: number | null;
    durationSec: number | null;
    transcripcion: string;
    modo: Modo;
  } {
    const fromAttr = parseJfile(this.getAttribute("jfile"));
    const fromDom = this.#jfileDesdeHijos();
    const j: Jfile = {
      kind: fromAttr?.kind ?? fromDom?.kind ?? this.getAttribute("kind") ?? undefined,
      mime: fromAttr?.mime ?? fromDom?.mime ?? this.getAttribute("mime") ?? undefined,
      filename: fromAttr?.filename ?? fromDom?.filename ?? this.getAttribute("filename") ?? undefined,
      meta: { ...(fromDom?.meta ?? {}), ...(fromAttr?.meta ?? {}) },
      variants: { ...(fromDom?.variants ?? {}), ...(fromAttr?.variants ?? {}) },
    };

    // attrs planos de variantes ganan si vienen
    const thumb = String(this.getAttribute("src-thumb") ?? "").trim();
    const med = String(this.getAttribute("src-med") ?? "").trim();
    const original = String(this.getAttribute("src-original") ?? "").trim();
    const src = String(this.getAttribute("src") ?? "").trim();
    if (thumb) j.variants = { ...j.variants, thumb: { ...(j.variants?.thumb ?? {}), url: thumb } };
    if (med) j.variants = { ...j.variants, med: { ...(j.variants?.med ?? {}), url: med } };
    if (original) j.variants = { ...j.variants, original: { ...(j.variants?.original ?? {}), url: original } };

    const wAttr = Number(this.getAttribute("width") ?? j.meta?.width);
    const hAttr = Number(this.getAttribute("height") ?? j.meta?.height);
    const durAttr = Number(this.getAttribute("durationSec") ?? j.meta?.durationSec);

    const kind = normalizarKind(j.kind ?? this.getAttribute("kind"));
    const preview = pickUrl(j, ["thumb", "med", "original"], [src]);
    const full = pickUrl(j, ["original", "med", "thumb"], [src]);
    const media = pickUrl(j, ["original", "med", "thumb"], [src]);

    return {
      ifile: String(this.getAttribute("ifile") ?? "").trim(),
      kind,
      mime: String(j.mime ?? "").trim(),
      filename: String(j.filename ?? "").trim(),
      preview,
      full,
      media,
      width: Number.isFinite(wAttr) && wAttr > 0 ? wAttr : null,
      height: Number.isFinite(hAttr) && hAttr > 0 ? hAttr : null,
      durationSec: Number.isFinite(durAttr) && durAttr > 0 ? durAttr : null,
      transcripcion: String(this.getAttribute("transcripcion") ?? "").trim(),
      modo: this.getAttribute("mode") === "md" ? "md" : "xml",
    };
  }

  /** `Jfile` leído de los hijos `<meta>` y `<variant>` del light DOM, o `null` si no hay ninguno. */
  #jfileDesdeHijos(): Jfile | null {
    const metaEl = this.querySelector(":scope > meta");
    const variantsEl = this.querySelector(":scope > variants");
    if (!metaEl && !variantsEl && !this.querySelector(":scope > variant")) return null;

    const meta: Jfile["meta"] = {};
    if (metaEl) {
      const w = Number(metaEl.getAttribute("width"));
      const h = Number(metaEl.getAttribute("height"));
      const d = Number(metaEl.getAttribute("durationSec"));
      const ic = Number(metaEl.getAttribute("iconversacion"));
      if (Number.isFinite(w) && w > 0) meta.width = w;
      if (Number.isFinite(h) && h > 0) meta.height = h;
      if (Number.isFinite(d) && d > 0) meta.durationSec = d;
      if (Number.isFinite(ic) && ic > 0) meta.iconversacion = ic;
    }

    const variants: NonNullable<Jfile["variants"]> = {};
    const nodos = variantsEl
      ? variantsEl.querySelectorAll("variant")
      : this.querySelectorAll(":scope > variant");
    for (const n of nodos) {
      const name = String(n.getAttribute("name") ?? "").trim() as VariantName;
      if (name !== "thumb" && name !== "med" && name !== "original") continue;
      const url = String(n.getAttribute("url") ?? "").trim();
      const bytes = Number(n.getAttribute("bytes"));
      variants[name] = {
        url: url || undefined,
        bytes: Number.isFinite(bytes) && bytes > 0 ? bytes : undefined,
      };
    }

    return {
      kind: this.getAttribute("kind") ?? undefined,
      mime: this.getAttribute("mime") ?? undefined,
      filename: this.getAttribute("filename") ?? undefined,
      meta: Object.keys(meta).length ? meta : undefined,
      variants: Object.keys(variants).length ? variants : undefined,
    };
  }

  #escape(s: string): string {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  #render(): void {
    const d = this.#datos();
    const idTxt = d.ifile ? `#${this.#escape(d.ifile)}` : "";

    if (d.modo === "md") {
      const txt = d.kind === "audio"
        ? `[Audio ${idTxt}]${d.transcripcion || "(sin transcripción)"}`
        : d.kind === "documento"
          ? `[Documento ${idTxt}]${d.filename || d.media || "(sin nombre)"}`
          : `[Imagen ${idTxt}]`;
      this.#root.replaceChildren(html`<span class="md" part="md">${this.#escape(txt)}</span>`);
      adoptCss(this.#root, import.meta.url, "av-paty-adjunto");
      return;
    }

    if (d.kind === "audio") {
      const label = d.filename || "Nota de voz";
      this.#root.replaceChildren(html`
        <article class="adjunto adjunto--audio" part="adjunto" title=${label}>
          <iswc-icon class="adjunto__icono" icon="mdi:microphone"></iswc-icon>
          ${d.media
            ? html`<audio
                class="adjunto__audio"
                controls
                preload="metadata"
                aria-label=${`Audio ${idTxt || label}`}
                src=${d.media}
              ></audio>`
            : html`<span class="adjunto__vacio">sin audio</span>`}
          ${d.durationSec
            ? html`<span class="adjunto__meta">${Math.round(d.durationSec)}s</span>`
            : null}
        </article>
      `);
    } else if (d.kind === "documento") {
      const nombre = d.filename || d.media || "documento";
      const icon = iconoDocumento(d.mime, nombre);
      const ext = etiquetaExt(d.mime, nombre);
      this.#root.replaceChildren(html`
        <a
          class="adjunto adjunto--documento"
          part="adjunto"
          href=${d.media || "#"}
          ?disabled=${!d.media}
          target="_blank"
          rel="noopener noreferrer"
          download=${d.filename || true}
          title=${nombre}
          aria-label=${`Documento ${nombre}`}
        >
          <iswc-icon class="adjunto__icono" icon=${icon}></iswc-icon>
          <span class="adjunto__nombre">${this.#escape(nombre)}</span>
          <span class="adjunto__ext">${this.#escape(ext)}</span>
        </a>
      `);
    } else {
      const ratio = d.width && d.height ? d.width / d.height : 1;
      const styleW = `width: ${Math.max(0.6, Math.min(2.4, ratio)).toFixed(3)}em`;
      const alt = d.filename || `Imagen ${idTxt || "adjunta"}`;
      this.#root.replaceChildren(html`
        <a
          class="adjunto adjunto--imagen"
          part="adjunto"
          href=${d.full || d.preview || "#"}
          ?disabled=${!(d.full || d.preview)}
          target="_blank"
          rel="noopener noreferrer"
          title=${alt}
          aria-label=${alt}
          style=${styleW}
        >
          ${d.preview
            ? html`<img
                class="adjunto__preview"
                src=${d.preview}
                alt=${alt}
                loading="lazy"
              />`
            : html`<span class="adjunto__placeholder"><iswc-icon icon="mdi:image-outline"></iswc-icon></span>`}
        </a>
      `);
    }
    adoptCss(this.#root, import.meta.url, "av-paty-adjunto");
  }
}

define("av-paty-adjunto", PatyAdjunto);

/**
 * Devuelve el HTML con cada `<av-paty-adjunto ifile=…>` reescrito con src, variantes, mime,
 * filename y `jfile` tomados de la lista canónica de adjuntos (imagen prefiere thumb).
 * Los tags sin adjunto conocido quedan intactos.
 */
export function upgradePatyAdjuntosEnHtml(
  contenidoHTML: string,
  adjuntos: ReadonlyArray<{
    ifile: string;
    kind: "imagen" | "audio" | "documento";
    src?: string;
    transcripcion?: string;
    filename?: string;
    mime?: string;
    variants?: Partial<Record<VariantName, string>>;
    jfile?: Jfile | string;
  }>,
  mode: "xml" | "md" = "xml",
): string {
  if (!contenidoHTML || !adjuntos.length) return contenidoHTML;

  const porIfile = new Map<string, typeof adjuntos[number]>();
  for (const a of adjuntos) {
    if (a.ifile && !porIfile.has(a.ifile)) porIfile.set(a.ifile, a);
  }

  return contenidoHTML.replace(
    /<av-paty-adjunto\b([^>]*?)\/?>(?:[\s\S]*?<\/av-paty-adjunto>)?/g,
    (match, attrsRaw: string) => {
      const attrs = new Map<string, string>();
      for (const m of String(attrsRaw).matchAll(/([a-zA-Z][\w-]*)\s*=\s*"([^"]*)"/g)) {
        attrs.set(m[1]!.toLowerCase(), m[2]!);
      }
      const ifile = String(attrs.get("ifile") ?? "").trim();
      const kindRaw = String(attrs.get("kind") ?? "imagen").trim();
      const kind: Kind = normalizarKind(kindRaw);
      const adj = porIfile.get(ifile);
      if (!adj) return match;

      const j = typeof adj.jfile === "string" ? parseJfile(adj.jfile) : (adj.jfile ?? null);
      const thumb = adj.variants?.thumb || urlVariant(j?.variants?.thumb);
      const med = adj.variants?.med || urlVariant(j?.variants?.med);
      const original = adj.variants?.original || urlVariant(j?.variants?.original) || adj.src;
      const preview = kind === "imagen"
        ? (thumb || med || original || adj.src || "")
        : (original || med || thumb || adj.src || "");

      const out: string[] = [`ifile="${escAttr(ifile)}"`, `kind="${kind}"`, `mode="${mode}"`];
      if (preview) out.push(`src="${escAttr(preview)}"`);
      if (thumb) out.push(`src-thumb="${escAttr(thumb)}"`);
      if (med) out.push(`src-med="${escAttr(med)}"`);
      if (original) out.push(`src-original="${escAttr(original)}"`);
      const mime = adj.mime || j?.mime;
      const filename = adj.filename || j?.filename;
      if (mime) out.push(`mime="${escAttr(mime)}"`);
      if (filename) out.push(`filename="${escAttr(filename)}"`);
      if (j?.meta?.width) out.push(`width="${escAttr(String(j.meta.width))}"`);
      if (j?.meta?.height) out.push(`height="${escAttr(String(j.meta.height))}"`);
      if (kind === "audio" && adj.transcripcion) {
        out.push(`transcripcion="${escAttr(adj.transcripcion)}"`);
      }
      if (j) out.push(`jfile="${escAttr(JSON.stringify(j))}"`);
      return `<av-paty-adjunto ${out.join(" ")}></av-paty-adjunto>`;
    },
  );
}

export function reproducirAdjuntoAudio(target: HTMLElement): void {
  emitir(target, "av-paty-adjunto-play", {
    ifile: target.getAttribute("ifile") ?? "",
  });
}

export const __internals = { RE_PATY_ADJUNTO, RE_PATY_ADJUNTO_CLOSE };
