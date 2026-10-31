import{crearComponente as r,define as s,emitir as o,html as l}from"../../base/componente.js?v=0air4b";import{textos as v}from"../../chat/textos.js?v=gpj3dh";const u=r(import.meta.url,"av-chat-cabecera",{id:null,tipo:"directo",nombre:"",foto:null,iniciales:"",color:0,estado:"",activo:!1,integrantes:0,puedeLlamar:!0,volver:!1},(c,a,i)=>{if(!a.id)return;const t=v(),e=()=>o(i,"av-chat-panel",{panel:"info"});c.append(l`
      <header class="cabecera" part="cabecera" data-volver=${a.volver?"1":"0"}>
        <iswc-button class="volver" variant="plain" color="neutral" title=${t.volverChats} aria-label=${t.volverChats} oniswc-click=${()=>o(i,"av-chat-volver")}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
        <button class="quien" type="button" onclick=${e} title=${a.tipo==="directo"?t.infoContacto:t.infoGrupo}>
          <span class="foto" data-color=${String(a.color)}>
            <iswc-avatar initials=${a.iniciales} image=${a.foto??""} label=${a.nombre}></iswc-avatar>
          </span>
          <span class="texto">
            <strong class="nombre">${a.nombre}</strong>
            <span class="estado" data-activo=${a.activo?"1":"0"} aria-live="polite">${a.estado}</span>
          </span>
        </button>
        <span class="acciones">
          ${a.puedeLlamar?l`
            <iswc-button variant="plain" color="neutral" title=${t.videollamar} aria-label=${t.videollamar} oniswc-click=${()=>o(i,"av-chat-llamar",{tipo:"video"})}><iswc-icon icon="mdi:video-outline"></iswc-icon></iswc-button>
            <iswc-button variant="plain" color="neutral" title=${t.llamar} aria-label=${t.llamar} oniswc-click=${()=>o(i,"av-chat-llamar",{tipo:"voz"})}><iswc-icon icon="mdi:phone-outline"></iswc-icon></iswc-button>`:null}
          <iswc-button variant="plain" color="neutral" title=${t.buscarMensajes} aria-label=${t.buscarMensajes} oniswc-click=${()=>o(i,"av-chat-panel",{panel:"busqueda"})}><iswc-icon icon="mdi:magnify"></iswc-icon></iswc-button>
          <iswc-button variant="plain" color="neutral" title=${t.infoChat} aria-label=${t.infoChat} oniswc-click=${e}><iswc-icon icon="mdi:information-outline"></iswc-icon></iswc-button>
        </span>
      </header>
    `)},(c,a,i)=>{const t=Object.keys(a).every(n=>n==="estado"||n==="activo"||a[n]===i[n]),e=c.querySelector(".estado");return!t||!e?!1:(e.textContent=a.estado,e.dataset.activo=a.activo?"1":"0",!0)});s("av-chat-cabecera",u);
