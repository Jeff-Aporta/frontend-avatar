import{l as E,m as A,n as y}from"./chunk-SQVRVHQY.mjs";import{b as L}from"./chunk-DJIGVK5X.mjs";import{qa as f,ra as h,ta as q,ua as i,wa as w}from"./chunk-22HCQII4.mjs";function C(s,r,c){let t=L(),n=r,l=r.chat?"chat":"todos",d=null;s.append(h`
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
  `);let u=s.querySelector(".q"),m=s.querySelector(".resultados"),$=s.querySelector(".estado"),p=()=>{let a=(u.value??"").trim();i(c,"av-chat-buscar",{q:a,icanal:l==="chat"?n.chat:null})},b=()=>{for(let a of s.querySelectorAll(".alc")){let o=a.dataset.v===l;a.setAttribute("variant",o?"soft":"plain"),a.setAttribute("color",o?"brand":"neutral"),a.setAttribute("aria-pressed",String(o)),a.dataset.v==="chat"&&a.toggleAttribute("disabled",!n.chat)}};u.addEventListener("iswc-input",()=>{d&&clearTimeout(d),d=setTimeout(p,280)}),u.addEventListener("keydown",a=>{a.key==="Enter"&&p(),a.key==="Escape"&&i(c,"av-chat-panel-cerrar",{panel:"busqueda"})});for(let a of s.querySelectorAll(".alc"))a.addEventListener("iswc-click",()=>{l=a.dataset.v==="chat"?"chat":"todos",b(),p()});s.querySelector(".cerrar")?.addEventListener("iswc-click",()=>i(c,"av-chat-panel-cerrar",{panel:"busqueda"}));let v=(a,o)=>{n=a,!a.chat&&l==="chat"&&(l="todos"),o&&o.chat!==a.chat&&a.chat&&(l="chat"),b(),a.abierto&&!o?.abierto&&requestAnimationFrame(()=>u.focus()),$.textContent=a.cargando?t.buscando:a.buscado&&a.resultados.length===0?t.sinResultados:"",m.replaceChildren(...a.resultados.map(e=>h`
      <li><iswc-button class="resultado" variant="row" color="neutral" data-chat=${e.chat} data-ref=${e.ref}>
        <span class="contenido"><span class="linea"><strong class="chat">${e.chatNombre}</strong><span class="fecha">${A(E(e.ts),t)} ${y(e.ts)}</span></span>
        <span class="autor" data-color=${String(e.color)}>${e.autor}</span>
        <span class="fragmento">${f(e.fragmento)}</span></span>
      </iswc-button></li>`));for(let e of m.querySelectorAll(".resultado"))e.addEventListener("click",()=>i(c,"av-chat-abrir",{icanal:e.dataset.chat,imensaje:e.dataset.ref}))};return v(r,null),v}var T=w(new URL("js/components/chat/av-chat-busqueda.min.mjs",new URL("../",import.meta.url)).href,"av-chat-busqueda",{abierto:!1,chat:null,chatNombre:"",resultados:[],cargando:!1,buscado:""},(s,r,c)=>{c.__aplicar=C(s,r,c)},(s,r,c,t)=>{let n=t.__aplicar;return n?(n(r,c),!0):!1});q("av-chat-busqueda",T);
