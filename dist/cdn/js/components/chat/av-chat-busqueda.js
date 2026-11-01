import{crearComponente as q,define as w,emitir as u,html as v,raw as E}from"../../base/componente.js?v=kpvpk6";import{claveDia as A,horaCorta as y,rotuloDia as $}from"../../chat/formato.js?v=xzgyvo";import{textos as C}from"../../chat/textos.js?v=cthyvo";function L(s,r,c){const t=C();let l=r,n=r.chat?"chat":"todos",d=null;s.append(v`
    <aside class="busqueda" part="busqueda" aria-label=${t.buscarMensajes}>
      <header class="cabeza">
        <iswc-button variant="plain compact" color="neutral" class="cerrar" title=${t.cerrar} aria-label=${t.cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
        <iswc-heading level="3">${t.buscarMensajes}</iswc-heading>
      </header>
      <div class="controles">
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarPlaceholder} aria-label=${t.buscarMensajes}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <div class="opciones">
          <span class="grupo alcance" role="group" aria-label="Alcance">
            <iswc-button variant="compact" pill class="alc" data-v="chat">${t.enEsteChat}</iswc-button>
            <iswc-button variant="compact" pill class="alc" data-v="todos">${t.enTodos}</iswc-button>
          </span>
        </div>
      </div>
      <div class="estado" role="status"></div>
      <ol class="resultados"></ol>
    </aside>
  `);const i=s.querySelector(".q"),h=s.querySelector(".resultados"),f=s.querySelector(".estado"),p=()=>{const a=(i.value??"").trim();u(c,"av-chat-buscar",{q:a,icanal:n==="chat"?l.chat:null})},m=()=>{for(const a of s.querySelectorAll(".alc")){const o=a.dataset.v===n;a.setAttribute("variant",o?"soft":"plain"),a.setAttribute("color",o?"brand":"neutral"),a.setAttribute("aria-pressed",String(o)),a.dataset.v==="chat"&&a.toggleAttribute("disabled",!l.chat)}};i.addEventListener("iswc-input",()=>{d&&clearTimeout(d),d=setTimeout(p,280)}),i.addEventListener("keydown",a=>{a.key==="Enter"&&p(),a.key==="Escape"&&u(c,"av-chat-panel-cerrar",{panel:"busqueda"})});for(const a of s.querySelectorAll(".alc"))a.addEventListener("iswc-click",()=>{n=a.dataset.v==="chat"?"chat":"todos",m(),p()});s.querySelector(".cerrar")?.addEventListener("iswc-click",()=>u(c,"av-chat-panel-cerrar",{panel:"busqueda"}));const b=(a,o)=>{l=a,!a.chat&&n==="chat"&&(n="todos"),o&&o.chat!==a.chat&&a.chat&&(n="chat"),m(),a.abierto&&!o?.abierto&&requestAnimationFrame(()=>i.focus()),f.textContent=a.cargando?t.buscando:a.buscado&&a.resultados.length===0?t.sinResultados:"",h.replaceChildren(...a.resultados.map(e=>v`
      <li><iswc-button class="resultado" variant="row" color="neutral" data-chat=${e.chat} data-ref=${e.ref}>
        <span class="contenido"><span class="linea"><strong class="chat">${e.chatNombre}</strong><span class="fecha">${$(A(e.ts),t)} ${y(e.ts)}</span></span>
        <span class="autor" data-color=${String(e.color)}>${e.autor}</span>
        <span class="fragmento">${E(e.fragmento)}</span></span>
      </iswc-button></li>`));for(const e of h.querySelectorAll(".resultado"))e.addEventListener("click",()=>u(c,"av-chat-abrir",{icanal:e.dataset.chat,imensaje:e.dataset.ref}))};return b(r,null),b}const T=q(import.meta.url,"av-chat-busqueda",{abierto:!1,chat:null,chatNombre:"",resultados:[],cargando:!1,buscado:""},(s,r,c)=>{c.__aplicar=L(s,r,c)},(s,r,c,t)=>{const l=t.__aplicar;return l?(l(r,c),!0):!1});w("av-chat-busqueda",T);
