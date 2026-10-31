import{crearComponente as y,define as E,emitir as u,html as b}from"../../base/componente.js?v=p6quri";import{textos as w}from"../../chat/textos.js?v=gpj3dh";import"./av-chat-item.js?v=nvcwjr";const g=["todos","noleidos","grupos","directos"];function p(i,t){const n=w(),e=i.querySelector(".filas");if(!e)return;for(const a of i.querySelectorAll("[data-filtro]")){const v=a.dataset.filtro===t.filtro;a.setAttribute("variant",v?"soft":"plain"),a.setAttribute("color",v?"brand":"neutral"),a.setAttribute("aria-pressed",v?"true":"false")}const m=i.querySelector(".cabeza");m.dataset.archivados=t.archivados?"1":"0",i.querySelector(".titulo").textContent=t.archivados?n.archivados:t.titulo||n.chats;const f=i.querySelector(".archivados");f.hidden=t.archivados||t.cantidadArchivados===0,i.querySelector(".archivados-n").textContent=String(t.cantidadArchivados);const o=i.querySelector(".conexion");o.hidden=t.conexion==="conectado",o.dataset.estado=t.conexion,o.querySelector("span").textContent=t.conexion==="conectando"?n.conectando:n.desconectado;const c=i.querySelector(".buscador");(c.value??"")!==t.q&&!c.matches(":focus-within")&&(c.value=t.q);const s=new Map;for(const a of[...e.children])s.set(a.dataset.id??"",a);t.chats.forEach((a,v)=>{let d=s.get(a.id);d||(d=document.createElement("av-chat-item"),d.dataset.id=a.id,d.setAttribute("role","option")),s.delete(a.id),d.props={chat:a,activo:a.id===t.activo},d.setAttribute("aria-selected",a.id===t.activo?"true":"false"),e.children[v]!==d&&e.insertBefore(d,e.children[v]??null)});for(const a of s.values())a.remove();const l=[...e.children],r=l.find(a=>a===i.activeElement)??l.find(a=>a.dataset.id===t.activo)??l[0];for(const a of l)a.tabIndex=a===r?0:-1;const h=i.querySelector(".vacio");h.hidden=t.chats.length>0||t.cargando,h.querySelector("strong").textContent=t.q?n.sinResultados:t.archivados?n.sinElementos:n.sinChats,h.querySelector("span").textContent=t.q||t.archivados?"":n.sinChatsTexto,i.querySelector(".esqueletos").hidden=!(t.cargando&&t.chats.length===0)}const q=y(import.meta.url,"av-chat-lista",{chats:[],activo:null,filtro:"todos",q:"",archivados:!1,cantidadArchivados:0,conexion:"conectado",titulo:"",cargando:!1},(i,t,n)=>{const e=w(),m={todos:e.todos,noleidos:e.noLeidos,grupos:e.grupos,directos:e.directos},f=o=>{const c=o,s=[...i.querySelectorAll(".filas > av-chat-item")],l=s.indexOf(i.activeElement);let r;if(c.key==="ArrowDown")r=s[Math.min(s.length-1,l+1)];else if(c.key==="ArrowUp")r=s[Math.max(0,l-1)];else if(c.key==="Home")r=s[0];else if(c.key==="End")r=s[s.length-1];else if((c.key==="Enter"||c.key===" ")&&l>=0&&c.target===s[l]){c.preventDefault(),u(n,"av-chat-abrir",{icanal:s[l].dataset.id});return}else return;if(c.preventDefault(),!!r){for(const h of s)h.tabIndex=-1;r.tabIndex=0,r.focus()}};i.append(b`
      <nav class="lista" part="lista" aria-label=${e.chats}>
        <header class="cabeza" part="cabeza">
          <iswc-button class="atras" variant="plain" color="neutral" title=${e.volverChats} aria-label=${e.volverChats} oniswc-click=${()=>u(n,"av-chat-lista-filtro",{archivados:!1})}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
          <h2 class="titulo"></h2>
          <span class="acciones">
            <iswc-button variant="plain" color="neutral" title=${e.buscarMensajes} aria-label=${e.buscarMensajes} oniswc-click=${()=>u(n,"av-chat-panel",{panel:"busqueda"})}><iswc-icon icon="mdi:text-search"></iswc-icon></iswc-button>
            <iswc-button variant="plain" color="neutral" title=${e.nuevoGrupo} aria-label=${e.nuevoGrupo} oniswc-click=${()=>u(n,"av-chat-panel",{panel:"grupo"})}><iswc-icon icon="mdi:account-multiple-plus-outline"></iswc-icon></iswc-button>
            <iswc-button class="nuevo" variant="soft" color="brand" title=${e.nuevoChat} aria-label=${e.nuevoChat} oniswc-click=${()=>u(n,"av-chat-panel",{panel:"nuevo"})}><iswc-icon icon="mdi:message-plus-outline"></iswc-icon></iswc-button>
          </span>
        </header>
        <div class="conexion" role="status" hidden><iswc-spinner></iswc-spinner><span></span></div>
        <div class="herramientas">
          <iswc-input class="buscador" type="search" clearable placeholder=${e.buscarChats} aria-label=${e.buscarChats}
            oniswc-input=${o=>u(n,"av-chat-lista-filtro",{q:o.currentTarget.value??""})}>
            <iswc-icon slot="start" icon="mdi:magnify"></iswc-icon>
          </iswc-input>
          <div class="filtros" role="group" aria-label=${e.todos}>
            ${g.map(o=>b`<iswc-button pill data-filtro=${o} variant="plain" color="neutral" oniswc-click=${()=>u(n,"av-chat-lista-filtro",{filtro:o})}>${m[o]}</iswc-button>`)}
          </div>
        </div>
        <button class="archivados" type="button" hidden onclick=${()=>u(n,"av-chat-lista-filtro",{archivados:!0})}>
          <iswc-icon icon="mdi:archive-outline"></iswc-icon><span class="archivados-t">${e.archivados}</span><span class="archivados-n"></span>
        </button>
        <div class="filas" part="filas" role="listbox" aria-label=${e.chats} onkeydown=${f}></div>
        <div class="esqueletos" hidden>${[1,2,3,4,5].map(()=>b`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>
        <div class="vacio" hidden><iswc-icon icon="mdi:chat-processing-outline"></iswc-icon><strong></strong><span></span></div>
      </nav>
    `),p(i,t)},(i,t)=>i.querySelector(".filas")?(p(i,t),!0):!1);E("av-chat-lista",q);
