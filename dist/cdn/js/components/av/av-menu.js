import{crearComponente as c,define as u,emitir as i,html as l}from"../../base/componente.js?v=3c3042";const m=c(import.meta.url,"av-menu",{items:[],activo:"",plegado:!1},(s,e,t)=>{const o=[...new Set(e.items.map(n=>n.grupo))];s.append(l`
      <nav class="menu" part="menu" data-plegado=${e.plegado?"1":"0"} aria-label="Módulos">
        <button class="plegar" part="plegar" type="button" aria-expanded=${e.plegado?"false":"true"} title=${e.plegado?"Desplegar men\xFA":"Plegar men\xFA"}
          onclick=${()=>i(t,"av-menu-plegar",{plegado:!e.plegado})}>
          <iswc-icon icon=${e.plegado?"mdi:menu":"mdi:menu-open"}></iswc-icon>
          <span class="etiqueta">Menú</span>
        </button>
        ${o.map(n=>l`
          <div class="grupo" role="group" aria-label=${n}>
            <span class="titulo-grupo">${n}</span>
            ${e.items.filter(a=>a.grupo===n).map(a=>l`
              <a class="item" part="item" href=${`#/${a.id}`} data-id=${a.id} aria-current=${a.id===e.activo?"page":"false"} title=${e.plegado?a.label:""}
                onclick=${r=>{r.preventDefault(),i(t,"av-menu-ir",{id:a.id})}}>
                <span class="icono"><iswc-icon icon=${a.icon}></iswc-icon>${a.contador?l`<span class="punto" aria-hidden="true"></span>`:null}</span>
                <span class="etiqueta">${a.label}</span>
                ${a.contador?l`<iswc-badge class="contador" color="danger" pill>${a.contador}</iswc-badge>`:null}
              </a>
            `)}
          </div>
        `)}
      </nav>
    `)},(s,e,t)=>{if(e.items!==t.items||!s.querySelector(".menu")||e.plegado!==t.plegado)return!1;for(const n of s.querySelectorAll(".item"))n.setAttribute("aria-current",n.dataset.id===e.activo?"page":"false");return!0});u("av-menu",m);
