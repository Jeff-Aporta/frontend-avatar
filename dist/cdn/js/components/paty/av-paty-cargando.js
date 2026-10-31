import{adoptCss as a,define as i,html as e,precargarCss as s}from"./_paty.js?v=wt56bb";s(import.meta.url,"av-paty-cargando");class r extends HTMLElement{#t;static get observedAttributes(){return["texto"]}constructor(){super(),this.#t=this.attachShadow({mode:"open"})}connectedCallback(){this.hasAttribute("role")||this.setAttribute("role","status"),this.hasAttribute("aria-live")||this.setAttribute("aria-live","polite"),this.#e()}attributeChangedCallback(){this.isConnected&&this.#e()}#e(){const t=this.getAttribute("texto")??"";this.#t.replaceChildren(e`
      <iswc-spinner part="spinner"></iswc-spinner>
      ${t?e`<span class="texto" part="texto">${t}</span>`:null}
    `),a(this.#t,import.meta.url,"av-paty-cargando")}}i("av-paty-cargando",r);
