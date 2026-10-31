import{crearComponente as w,define as A,emitir as d,html as v,raw as E}from"../../base/componente.js?v=333q2n";import{claveDia as y,horaCorta as $,rotuloDia as L}from"../../chat/formato.js?v=d40ok6";import{textos as T}from"../../chat/textos.js?v=gpj3dh";function C(e,l,c){const t=T();let r=l,p="texto",n=l.chat?"chat":"todos",m=null;e.append(v`
    <aside class="busqueda" part="busqueda" aria-label=${t.buscarMensajes}>
      <header class="cabeza">
        <iswc-button variant="plain" color="neutral" class="cerrar" title=${t.cerrar} aria-label=${t.cerrar}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
        <h3>${t.buscarMensajes}</h3>
      </header>
      <div class="controles">
        <iswc-input class="q" type="search" clearable placeholder=${t.buscarPlaceholder} aria-label=${t.buscarMensajes}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <div class="opciones">
          <span class="grupo" role="group" aria-label="Modo">
            <iswc-button pill class="modo" data-v="texto">${t.modoTexto}</iswc-button>
            <iswc-button pill class="modo" data-v="semantica"><iswc-icon slot="start" icon="mdi:creation-outline"></iswc-icon>${t.modoSignificado}</iswc-button>
          </span>
          <span class="grupo alcance" role="group" aria-label="Alcance">
            <iswc-button pill class="alc" data-v="chat">${t.enEsteChat}</iswc-button>
            <iswc-button pill class="alc" data-v="todos">${t.enTodos}</iswc-button>
          </span>
        </div>
      </div>
      <div class="estado" role="status"></div>
      <ol class="resultados"></ol>
    </aside>
  `);const i=e.querySelector(".q"),h=e.querySelector(".resultados"),q=e.querySelector(".estado"),u=()=>{const a=(i.value??"").trim();d(c,"av-chat-buscar",{q:a,modo:p,icanal:n==="chat"?r.chat:null})},b=()=>{for(const a of e.querySelectorAll(".modo")){const o=a.dataset.v===p;a.setAttribute("variant",o?"soft":"plain"),a.setAttribute("color",o?"brand":"neutral"),a.setAttribute("aria-pressed",String(o))}for(const a of e.querySelectorAll(".alc")){const o=a.dataset.v===n;a.setAttribute("variant",o?"soft":"plain"),a.setAttribute("color",o?"brand":"neutral"),a.setAttribute("aria-pressed",String(o)),a.dataset.v==="chat"&&a.toggleAttribute("disabled",!r.chat)}};i.addEventListener("iswc-input",()=>{m&&clearTimeout(m),m=setTimeout(u,280)}),i.addEventListener("keydown",a=>{a.key==="Enter"&&u(),a.key==="Escape"&&d(c,"av-chat-panel-cerrar",{panel:"busqueda"})});for(const a of e.querySelectorAll(".modo"))a.addEventListener("iswc-click",()=>{p=a.dataset.v==="semantica"?"semantica":"texto",b(),u()});for(const a of e.querySelectorAll(".alc"))a.addEventListener("iswc-click",()=>{n=a.dataset.v==="chat"?"chat":"todos",b(),u()});e.querySelector(".cerrar")?.addEventListener("iswc-click",()=>d(c,"av-chat-panel-cerrar",{panel:"busqueda"}));const f=(a,o)=>{r=a,!a.chat&&n==="chat"&&(n="todos"),o&&o.chat!==a.chat&&a.chat&&(n="chat"),b(),a.abierto&&!o?.abierto&&requestAnimationFrame(()=>i.focus()),q.textContent=a.cargando?t.buscando:a.buscado&&a.resultados.length===0?t.sinResultados:"",h.replaceChildren(...a.resultados.map(s=>v`
      <li><button class="resultado" type="button" data-chat=${s.chat} data-ref=${s.ref}>
        <span class="linea"><strong class="chat">${s.chatNombre}</strong><span class="fecha">${L(y(s.ts),t)} ${$(s.ts)}</span></span>
        <span class="autor" data-color=${String(s.color)}>${s.autor}</span>
        <span class="fragmento">${E(s.fragmento)}</span>
      </button></li>`));for(const s of h.querySelectorAll(".resultado"))s.addEventListener("click",()=>d(c,"av-chat-abrir",{icanal:s.dataset.chat,imensaje:s.dataset.ref}))};return f(l,null),f}const M=w(import.meta.url,"av-chat-busqueda",{abierto:!1,chat:null,chatNombre:"",resultados:[],cargando:!1,buscado:""},(e,l,c)=>{c.__aplicar=C(e,l,c)},(e,l,c,t)=>{const r=t.__aplicar;return r?(r(l,c),!0):!1});A("av-chat-busqueda",M);
