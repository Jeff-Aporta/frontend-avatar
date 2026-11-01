import{crearComponente as r,define as s,emitir as o,html as l}from"../../base/componente.js?v=m5nu5c";import{textos as v}from"../../chat/textos.js?v=cthyvo";const u=r(import.meta.url,"av-chat-cabecera",{id:null,tipo:"directo",nombre:"",foto:null,iniciales:"",color:0,estado:"",activo:!1,integrantes:0,puedeLlamar:!0,volver:!1},(n,a,i)=>{if(!a.id)return;const t=v(),c=()=>o(i,"av-chat-panel",{panel:"info"});n.append(l`
      <header class="cabecera" part="cabecera" data-volver=${a.volver?"1":"0"}>
        <iswc-button class="volver" variant="plain compact" color="neutral" title=${t.volverChats} aria-label=${t.volverChats} oniswc-click=${()=>o(i,"av-chat-volver")}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
        <iswc-button class="quien" variant="row" color="neutral" onclick=${c} title=${a.tipo==="directo"?t.infoContacto:t.infoGrupo}>
          <span class="foto" data-color=${String(a.color)}>
            <iswc-avatar initials=${a.iniciales} image=${a.foto??""} label=${a.nombre}></iswc-avatar>
          </span>
          <span class="texto">
            <strong class="nombre">${a.nombre}</strong>
            <span class="estado" data-activo=${a.activo?"1":"0"} aria-live="polite">${a.estado}</span>
          </span>
        </iswc-button>
        <span class="acciones">
          ${a.puedeLlamar?l`
            <iswc-button variant="plain compact" color="neutral" title=${t.videollamar} aria-label=${t.videollamar} oniswc-click=${()=>o(i,"av-chat-llamar",{tipo:"video"})}><iswc-icon icon="mdi:video-outline"></iswc-icon></iswc-button>
            <iswc-button variant="plain compact" color="neutral" title=${t.llamar} aria-label=${t.llamar} oniswc-click=${()=>o(i,"av-chat-llamar",{tipo:"voz"})}><iswc-icon icon="mdi:phone-outline"></iswc-icon></iswc-button>`:null}
          <iswc-button variant="plain compact" color="neutral" title=${t.buscarMensajes} aria-label=${t.buscarMensajes} oniswc-click=${()=>o(i,"av-chat-panel",{panel:"busqueda"})}><iswc-icon icon="mdi:magnify"></iswc-icon></iswc-button>
          <iswc-button variant="plain compact" color="neutral" title=${t.infoChat} aria-label=${t.infoChat} oniswc-click=${c}><iswc-icon icon="mdi:information-outline"></iswc-icon></iswc-button>
        </span>
      </header>
    `)},(n,a,i)=>{const t=Object.keys(a).every(e=>e==="estado"||e==="activo"||a[e]===i[e]),c=n.querySelector(".estado");return!t||!c?!1:(c.textContent=a.estado,c.dataset.activo=a.activo?"1":"0",!0)});s("av-chat-cabecera",u);
