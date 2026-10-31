import{PatyTrazaFiltroSchema as u,PatyTrazaPropsSchema as v}from"../../consts/schemas/paty.schemas.js?v=gle689";import{ZTraza as c}from"../../consts/schemas/paty.schemas.js?v=gle689";import{adoptarPropsTardias as p,adoptCss as h,define as m,emitir as f,html as r,precargarCss as b}from"./_paty.js?v=x9hzap";b(import.meta.url,"av-paty-traza");const l={debug:{icono:"mdi:bug-outline",etiqueta:"debug"},info:{icono:"mdi:information-outline",etiqueta:"info"},warn:{icono:"mdi:alert-outline",etiqueta:"aviso"},error:{icono:"mdi:alert-circle-outline",etiqueta:"error"}},g=[{id:"todo",etiqueta:"Todo"},{id:"info",etiqueta:"Info"},{id:"warn",etiqueta:"Avisos"},{id:"error",etiqueta:"Errores"}];function o(s){return s<1e3?`${s} ms`:`${(s/1e3).toLocaleString("es-CO",{maximumFractionDigits:1})} s`}function $(s,a){return a==="todo"?[...s]:a==="error"?s.filter(t=>t.nivel==="error"):a==="warn"?s.filter(t=>t.nivel==="warn"||t.nivel==="error"):s.filter(t=>t.nivel!=="debug")}function T(s){return{total:s.length,ms:s.at(-1)?.ms??0,avisos:s.filter(a=>a.nivel==="warn").length,errores:s.filter(a=>a.nivel==="error").length}}class y extends HTMLElement{#r;#a=[];#s="todo";#t=!1;static get observedAttributes(){return["en-vivo","abierto"]}constructor(){super(),this.#r=this.attachShadow({mode:"open"})}get abierta(){return this.#t}get eventos(){return[...this.#a]}set eventos(a){const t=c.safeParse(a??[]);this.#a=t.success?t.data:[],this.isConnected&&this.#i()}set props(a){const t=v.partial().safeParse(a??{});if(t.success){if(t.data.eventos){const e=c.safeParse(t.data.eventos);this.#a=e.success?e.data:[]}t.data.filtro&&(this.#s=t.data.filtro),t.data.abierto!==void 0&&(this.#t=t.data.abierto),this.isConnected&&this.#i()}}connectedCallback(){p(this),this.#t=this.#t||this.hasAttribute("abierto")||this.hasAttribute("en-vivo"),this.#i()}attributeChangedCallback(a,t,e){t!==e&&(e!==null&&(a==="abierto"||a==="en-vivo")&&(this.#t=!0),this.isConnected&&this.#i())}#e=()=>{this.#t=!this.#t,this.#i()};#o(a){const t=u.safeParse(a);t.success&&(this.#s=t.data,this.#i())}#n=()=>{const a=JSON.stringify(this.#a,null,2);navigator.clipboard?.writeText(a).catch(()=>{}),f(this,"av-paty-traza-copiar",{json:a})};#i(){const a=this.hasAttribute("en-vivo"),t=T(this.#a),e=$(this.#a,this.#s),d=this.#a.at(-1)?.seq,n=t.errores?"error":t.avisos?"warn":"ok";this.#r.replaceChildren(r`
            <section class="traza traza--${n}" part="traza" data-estado=${n}>
                <button class="cabecera" type="button" aria-expanded=${String(this.#t)} onclick=${this.#e}>
                    <iswc-icon icon=${this.#t?"mdi:chevron-down":"mdi:chevron-right"}></iswc-icon>
                    <iswc-icon icon="mdi:text-box-search-outline"></iswc-icon>
                    <span class="titulo">Traza del ISS</span>
                    <span class="resumen">${t.total} evento${t.total===1?"":"s"} · ${o(t.ms)}</span>
                    ${t.avisos?r`<iswc-badge class="cuenta" color="warning">${t.avisos} aviso${t.avisos===1?"":"s"}</iswc-badge>`:""}
                    ${t.errores?r`<iswc-badge class="cuenta" color="danger">${t.errores} error${t.errores===1?"":"es"}</iswc-badge>`:""}
                    ${a?r`<span class="vivo" aria-label="en curso">en vivo</span>`:""}
                </button>
                ${this.#t?r`
                    <div class="barra">
                        <div class="filtros" role="group" aria-label="Filtrar por nivel">
                            ${g.map(i=>r`
                                <button type="button" class="filtro" aria-pressed=${String(this.#s===i.id)} onclick=${()=>this.#o(i.id)}>${i.etiqueta}</button>
                            `)}
                        </div>
                        <button type="button" class="copiar" onclick=${this.#n} aria-label="Copiar la traza en JSON">
                            <iswc-icon icon="mdi:content-copy"></iswc-icon> JSON
                        </button>
                    </div>
                    <ol class="eventos" aria-label="Eventos de la traza">
                        ${e.length?e.map(i=>r`
                            <li class="evento evento--${i.nivel}" data-nivel=${i.nivel} data-etapa=${i.etapa} ?data-ultimo=${a&&i.seq===d}>
                                <span class="ms">+${o(i.ms)}</span>
                                <iswc-icon class="nivel" icon=${l[i.nivel].icono} title=${l[i.nivel].etiqueta}></iswc-icon>
                                <span class="etapa">${i.etapa}</span>
                                <span class="mensaje">${i.mensaje}</span>
                                ${i.dur!==void 0?r`<span class="dur">${o(i.dur)}</span>`:""}
                                ${i.datos?r`<details class="datos"><summary>datos</summary><pre>${JSON.stringify(i.datos,null,2)}</pre></details>`:""}
                            </li>
                        `):r`<li class="vacio">Sin eventos para este filtro.</li>`}
                    </ol>
                `:""}
            </section>
        `),h(this.#r,import.meta.url,"av-paty-traza")}}m("av-paty-traza",y);export{$ as filtrarTraza,o as formatoMs,T as resumenTraza};
