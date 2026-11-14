import{b as v}from"./chunk-DJIGVK5X.mjs";import{ra as l,ta as r,ua as c,wa as s}from"./chunk-22HCQII4.mjs";var u=s(new URL("js/components/chat/av-chat-cabecera.min.mjs",new URL("../",import.meta.url)).href,"av-chat-cabecera",{id:null,tipo:"directo",nombre:"",foto:null,iniciales:"",color:0,estado:"",activo:!1,integrantes:0,puedeLlamar:!0,volver:!1},(e,a,i)=>{if(!a.id)return;let t=v(),n=()=>c(i,"av-chat-panel",{panel:"info"});e.append(l`
      <header class="cabecera" part="cabecera" data-volver=${a.volver?"1":"0"}>
        <iswc-button class="volver" variant="plain compact" color="neutral" title=${t.volverChats} aria-label=${t.volverChats} oniswc-click=${()=>c(i,"av-chat-volver")}><iswc-icon icon="mdi:arrow-left"></iswc-icon></iswc-button>
        <iswc-button class="alternar" variant="plain compact" color="neutral" title=${t.alternarLista} aria-label=${t.alternarLista} oniswc-click=${()=>c(i,"av-chat-lista-alternar")}><iswc-icon icon="mdi:menu"></iswc-icon></iswc-button>
        <iswc-button class="quien" variant="row" color="neutral" onclick=${n} title=${a.tipo==="directo"?t.infoContacto:t.infoGrupo}>
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
            <iswc-button variant="plain compact" color="neutral" title=${t.videollamar} aria-label=${t.videollamar} oniswc-click=${()=>c(i,"av-chat-llamar",{tipo:"video"})}><iswc-icon icon="mdi:video-outline"></iswc-icon></iswc-button>
            <iswc-button variant="plain compact" color="neutral" title=${t.llamar} aria-label=${t.llamar} oniswc-click=${()=>c(i,"av-chat-llamar",{tipo:"voz"})}><iswc-icon icon="mdi:phone-outline"></iswc-icon></iswc-button>`:null}
          <iswc-button variant="plain compact" color="neutral" title=${t.buscarMensajes} aria-label=${t.buscarMensajes} oniswc-click=${()=>c(i,"av-chat-panel",{panel:"busqueda"})}><iswc-icon icon="mdi:magnify"></iswc-icon></iswc-button>
          <iswc-button variant="plain compact" color="neutral" title=${t.infoChat} aria-label=${t.infoChat} oniswc-click=${n}><iswc-icon icon="mdi:information-outline"></iswc-icon></iswc-button>
        </span>
      </header>
    `)},(e,a,i)=>{let t=Object.keys(a).every(o=>o==="estado"||o==="activo"||a[o]===i[o]),n=e.querySelector(".estado");return!t||!n?!1:(n.textContent=a.estado,n.dataset.activo=a.activo?"1":"0",!0)});r("av-chat-cabecera",u);
