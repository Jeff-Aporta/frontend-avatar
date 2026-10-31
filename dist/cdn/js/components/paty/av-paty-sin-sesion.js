import{adoptCss as e,define as o,html as a,precargarCss as n}from"./_paty.js?v=wt56bb";n(import.meta.url,"av-paty-sin-sesion");const c="Inicia sesi\xF3n para conversar con PatyIA",r="Con tu cuenta ContaPyme puedes consultar al asistente, revisar tus conversaciones y seguir la trazabilidad de cada respuesta.";class l extends HTMLElement{#t;static get observedAttributes(){return["icon","titulo","texto"]}constructor(){super(),this.#t=this.attachShadow({mode:"open"})}connectedCallback(){this.#s()}attributeChangedCallback(){this.isConnected&&this.#s()}#s(){const t=this.getAttribute("icon")||"solar:chat-round-line-bold-duotone",s=this.getAttribute("titulo")||c,i=this.getAttribute("texto")||r;this.#t.replaceChildren(a`
      <iswc-card class="tarjeta">
        <iswc-icon class="icono" icon=${t}></iswc-icon>
        <h2 class="titulo">${s}</h2>
        <p class="texto">${i}</p>
      </iswc-card>
    `),e(this.#t,import.meta.url,"av-paty-sin-sesion")}}o("av-paty-sin-sesion",l);
