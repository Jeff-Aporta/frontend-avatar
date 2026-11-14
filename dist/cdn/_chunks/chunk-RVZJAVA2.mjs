import{b}from"./chunk-DJIGVK5X.mjs";import{ra as m,ta as p,ua as d,wa as g}from"./chunk-22HCQII4.mjs";var E=["todos","noleidos","grupos","directos"];function y(i,t){let n=b(),a=i.querySelector(".filas");if(!a)return;for(let e of i.querySelectorAll("[data-filtro]")){let v=e.dataset.filtro===t.filtro;e.setAttribute("variant",v?"soft":"plain"),e.setAttribute("color",v?"brand":"neutral"),e.setAttribute("aria-pressed",v?"true":"false")}let f=i.querySelector(".cabeza");f.dataset.archivados=t.archivados?"1":"0",i.querySelector(".titulo").textContent=t.archivados?n.archivados:t.titulo||n.chats;let w=i.querySelector(".archivados");w.hidden=t.archivados||t.cantidadArchivados===0,i.querySelector(".archivados-n").textContent=String(t.cantidadArchivados);let o=i.querySelector(".conexion");o.hidden=t.conexion==="conectado",o.dataset.estado=t.conexion,o.querySelector("span").textContent=t.conexion==="conectando"?n.conectando:n.desconectado;let c=i.querySelector(".buscador");(c.value??"")!==t.q&&!c.matches(":focus-within")&&(c.value=t.q);let s=new Map;for(let e of[...a.children])s.set(e.dataset.id??"",e);t.chats.forEach((e,v)=>{let u=s.get(e.id);u||(u=document.createElement("av-chat-item"),u.dataset.id=e.id,u.setAttribute("role","option")),s.delete(e.id),u.props={chat:e,activo:e.id===t.activo},u.setAttribute("aria-selected",e.id===t.activo?"true":"false"),a.children[v]!==u&&a.insertBefore(u,a.children[v]??null)});for(let e of s.values())e.remove();let l=[...a.children],r=l.find(e=>e===i.activeElement)??l.find(e=>e.dataset.id===t.activo)??l[0];for(let e of l)e.tabIndex=e===r?0:-1;let h=i.querySelector(".vacio");h.hidden=t.chats.length>0||t.cargando,h.querySelector("strong").textContent=t.q?n.sinResultados:t.archivados?n.sinElementos:n.sinChats,h.querySelector("span").textContent=t.q||t.archivados?"":n.sinChatsTexto,i.querySelector(".esqueletos").hidden=!(t.cargando&&t.chats.length===0)}var q=g(new URL("js/components/chat/av-chat-lista.min.mjs",new URL("../",import.meta.url)).href,"av-chat-lista",{chats:[],activo:null,filtro:"todos",q:"",archivados:!1,cantidadArchivados:0,conexion:"conectado",titulo:"",cargando:!1},(i,t,n)=>{let a=b(),f={todos:a.todos,noleidos:a.noLeidos,grupos:a.grupos,directos:a.directos},w=o=>{let c=o,s=[...i.querySelectorAll(".filas > av-chat-item")],l=s.indexOf(i.activeElement),r;if(c.key==="ArrowDown")r=s[Math.min(s.length-1,l+1)];else if(c.key==="ArrowUp")r=s[Math.max(0,l-1)];else if(c.key==="Home")r=s[0];else if(c.key==="End")r=s[s.length-1];else if((c.key==="Enter"||c.key===" ")&&l>=0&&c.target===s[l]){c.preventDefault(),d(n,"av-chat-abrir",{icanal:s[l].dataset.id});return}else return;if(c.preventDefault(),!!r){for(let h of s)h.tabIndex=-1;r.tabIndex=0,r.focus()}};i.append(m`
      <nav class="lista" part="lista" aria-label=${a.chats}>
        <header class="cabeza" part="cabeza">
          <iswc-button class="atras" variant="plain compact" color="neutral" title=${a.volverChats} aria-label=${a.volverChats} oniswc-click=${()=>d(n,"av-chat-lista-filtro",{archivados:!1})}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
          <iswc-heading class="titulo" level="2"></iswc-heading>
          <span class="acciones">
            <iswc-button variant="plain compact" color="neutral" title=${a.buscarMensajes} aria-label=${a.buscarMensajes} oniswc-click=${()=>d(n,"av-chat-panel",{panel:"busqueda"})}><iswc-icon icon="mdi:text-search"></iswc-icon></iswc-button>
            <iswc-button variant="plain compact" color="neutral" title=${a.nuevoGrupo} aria-label=${a.nuevoGrupo} oniswc-click=${()=>d(n,"av-chat-panel",{panel:"grupo"})}><iswc-icon icon="mdi:account-multiple-plus-outline"></iswc-icon></iswc-button>
            <iswc-button class="nuevo" variant="soft compact" color="brand" title=${a.nuevoChat} aria-label=${a.nuevoChat} oniswc-click=${()=>d(n,"av-chat-panel",{panel:"nuevo"})}><iswc-icon icon="mdi:message-plus-outline"></iswc-icon></iswc-button>
          </span>
        </header>
        <div class="conexion" role="status" hidden><iswc-spinner></iswc-spinner><span></span></div>
        <div class="herramientas">
          <iswc-input class="buscador" type="search" clearable placeholder=${a.buscarChats} aria-label=${a.buscarChats}
            oniswc-input=${o=>d(n,"av-chat-lista-filtro",{q:o.currentTarget.value??""})}>
            <iswc-icon slot="start" icon="mdi:magnify"></iswc-icon>
          </iswc-input>
          <div class="filtros" role="group" aria-label=${a.todos}>
            ${E.map(o=>m`<iswc-button pill data-filtro=${o} variant="plain compact" color="neutral" oniswc-click=${()=>d(n,"av-chat-lista-filtro",{filtro:o})}>${f[o]}</iswc-button>`)}
          </div>
        </div>
        <iswc-button class="archivados" variant="row" color="neutral" hidden onclick=${()=>d(n,"av-chat-lista-filtro",{archivados:!0})}>
          <iswc-icon icon="mdi:archive-outline"></iswc-icon><span class="archivados-t">${a.archivados}</span><span class="archivados-n"></span>
        </iswc-button>
        <div class="filas" part="filas" role="listbox" aria-label=${a.chats} onkeydown=${w}></div>
        <div class="esqueletos" hidden>${[1,2,3,4,5].map(()=>m`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>
        <div class="vacio" hidden><iswc-icon icon="mdi:chat-processing-outline"></iswc-icon><strong></strong><span></span></div>
      </nav>
    `),y(i,t)},(i,t)=>i.querySelector(".filas")?(y(i,t),!0):!1);p("av-chat-lista",q);
