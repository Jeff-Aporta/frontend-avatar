import{adoptCss as h,define as p,emitir as n,html as s,precargarCss as u,adoptarPropsTardias as g}from"./_paty.js?v=h174kq";import{revisarProps as m}from"../../base/props-registro.js?v=a5hvzg";u(import.meta.url,"av-paty-json-dialog");class v extends HTMLElement{#s;#t={open:!1,titulo:"JSON",valor:"{}",readonly:!0};#o="";#i=[];constructor(){super(),this.#s=this.attachShadow({mode:"open"})}set props(t){t&&typeof t=="object"&&m(this.tagName.toLowerCase(),t);const i=!!t?.open&&!this.#t.open;this.#t={...this.#t,...t??{}},i&&(this.#o=this.#t.valor??"{}",this.#i=[]),this.isConnected&&this.#a()}get props(){return this.#t}connectedCallback(){this.#a(),g(this)}#r(t){const i=this.#t.validar;if(!i)return null;const o=i(t);return this.#i=o.errors??[],o}#a(){const{open:t,titulo:i,readonly:o}=this.#t,l=this.#t.validar?this.#t.validar(this.#o):null,c=!o&&!!l?.ok,e=()=>n(this,"paty-json-cerrar");this.#s.replaceChildren(s`
      <iswc-dialog class="dialogo" backdrop-variant="basic" label=${i} ?open=${t} oniswc-hide=${e}>
        ${this.#i.length?s`
              <iswc-callout color="warning" role="alert">
                <ul class="errores">
                  ${this.#i.map(r=>s`<li>${r}</li>`)}
                </ul>
              </iswc-callout>
            `:null}

        <iswc-code
          class="editor"
          lang="json"
          ?readonly=${o}
          placeholder="{}"
          oniswc-input=${r=>{this.#o=r.target.value;const d=this.#i.join("|");this.#r(this.#o),this.#i.join("|")!==d&&this.#a()}}
        ></iswc-code>

        <iswc-button slot="footer" variant="plain" oniswc-click=${e}>
          ${o?"Cerrar":"Cancelar"}
        </iswc-button>
        ${o?null:s`
              <iswc-button
                slot="footer"
                variant="filled"
                color="brand"
                ?disabled=${!c}
                oniswc-click=${()=>n(this,"paty-json-aplicar",{valor:l?.normalized})}
              >Aplicar JSON</iswc-button>
            `}
      </iswc-dialog>
    `);const a=this.#s.querySelector(".editor");a&&a.value!==this.#o&&(a.value=this.#o),h(this.#s,import.meta.url,"av-paty-json-dialog")}}p("av-paty-json-dialog",v);
