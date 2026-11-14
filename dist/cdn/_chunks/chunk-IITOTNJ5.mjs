import{a as j}from"./chunk-CXDJ6PR7.mjs";import{A as M,i as C,j as P,n as v}from"./chunk-SQVRVHQY.mjs";import{b as T}from"./chunk-DJIGVK5X.mjs";import{qa as x,ra as n,ta as S,ua as $,wa as E}from"./chunk-22HCQII4.mjs";var L=480,R=E(new URL("js/components/chat/av-chat-burbuja.min.mjs",new URL("../",import.meta.url)).href,"av-chat-burbuja",{mensaje:null,propio:!1,primero:!0,ultimo:!0,autor:null,marca:null,cita:null,menciones:[],reacciones:[],resaltado:!1},(s,t,d)=>{let a=t.mensaje;if(!a)return;let i=T(),r=a.clave,u=e=>$(d,"av-chat-accion",{accion:e,imensaje:r});if(a.tipo==="sistema"||a.tipo==="llamada"){let e=a.tipo==="llamada",o=e&&a.meta.perdida===!0;s.append(n`
        <div class="sistema" part="sistema" data-tipo=${a.tipo} data-perdida=${o?"1":"0"}>
          <span class="pildora">
            ${e?n`<iswc-icon icon=${a.meta.medio==="video"?"mdi:video-outline":o?"mdi:phone-missed-outline":"mdi:phone-outline"}></iswc-icon>`:null}
            <span>${e?M(a.meta,i):a.texto}</span>
            ${e?n`<span class="hora">${v(a.ts)}</span>`:null}
          </span>
        </div>
      `);return}let m=(e,o)=>$(d,"av-chat-menu",{imensaje:r,x:e,y:o}),l=null,c=e=>{let o=e;o.pointerType==="touch"&&(l=setTimeout(()=>{l=null,navigator.vibrate?.(12),m(o.clientX,o.clientY)},L))},b=()=>{l&&clearTimeout(l),l=null},k=e=>{let o=e;if(o.key==="ContextMenu"||o.shiftKey&&o.key==="F10"||o.key==="Enter"){o.preventDefault();let p=o.currentTarget.getBoundingClientRect();m(p.left+p.width/2,p.top+p.height/2)}},h=!a.eliminado&&!a.adjunto?P(a.texto):0,y=!a.eliminado&&a.texto.trim().length>0,g=!!a.adjunto&&(a.tipo==="audio"||a.adjunto.mime.startsWith("audio/")),A=!!a.adjunto&&!y&&(a.tipo==="imagen"||a.tipo==="video"),f=n`
      <span class="meta" part="meta">
        ${a.editado&&!a.eliminado?n`<span class="editado">${i.editado}</span>`:null}
        ${a.destacado?n`<iswc-icon class="estrella" icon="mdi:star" title=${i.destacados}></iswc-icon>`:null}
        <span class="hora">${v(a.ts)}</span>
        ${t.marca?n`<iswc-icon class="marca" data-marca=${t.marca} icon=${j[t.marca]} aria-label=${t.marca}></iswc-icon>`:null}
      </span>`;s.append(n`
      <div class="fila" part="fila" data-propio=${t.propio?"1":"0"} data-primero=${t.primero?"1":"0"} data-ultimo=${t.ultimo?"1":"0"} data-resaltado=${t.resaltado?"1":"0"} data-grande=${h?String(h):"0"}>
        <div class="burbuja" part="burbuja" tabindex="0" role="article" data-solomedio=${A?"1":"0"} data-eliminado=${a.eliminado?"1":"0"} data-estado=${a.estado}
          aria-label=${`${t.autor?.nombre??(t.propio?i.tu:"")} ${a.eliminado?i.eliminado:a.texto||a.adjunto?.nombre||""} ${v(a.ts)}`}
          oncontextmenu=${e=>{let o=e;o.preventDefault(),m(o.clientX,o.clientY)}}
          onpointerdown=${c} onpointerup=${b} onpointerleave=${b} onpointermove=${b} onkeydown=${k}>
          ${t.autor&&t.primero?n`<span class="autor" data-color=${String(t.autor.color)}>${t.autor.nombre}</span>`:null}
          ${a.reenviado&&!a.eliminado?n`<span class="reenviado"><iswc-icon icon="mdi:share-outline"></iswc-icon>${i.reenviado}</span>`:null}
          ${t.cita&&!a.eliminado?n`
            <iswc-button class="cita" variant="row" color="neutral" data-color=${String(t.cita.color)} onclick=${e=>{e.stopPropagation(),$(d,"av-chat-accion",{accion:"ir",imensaje:t.cita.ref})}}>
              <span class="cita-texto"><strong>${t.cita.autor}</strong><span>${t.cita.texto}</span></span>
              ${t.cita.miniatura?n`<img class="cita-mini" src=${t.cita.miniatura} alt="" loading="lazy" decoding="async">`:null}
            </iswc-button>`:null}
          ${a.adjunto&&!a.eliminado?g?n`<av-chat-audio class="medio" id="medio"></av-chat-audio>`:n`<av-chat-adjunto class="medio" id="medio"></av-chat-adjunto>`:null}
          ${a.eliminado?n`<p class="texto eliminado"><iswc-icon icon="mdi:cancel"></iswc-icon>${t.propio?i.eliminadoPorMi:i.eliminado}${f}</p>`:y?n`<div class="texto" dir="auto">${x(C(a.texto,t.menciones))}${f}</div>`:n`<div class="texto vacio">${f}</div>`}
          ${a.estado==="pendiente"&&a.progreso!=null?n`
            <div class="subida"><iswc-progress-bar id="progreso" value=${String(Math.round(a.progreso*100))} label=${i.adjuntar}></iswc-progress-bar>
            <iswc-button variant="plain compact" color="neutral" title=${i.cancelar} aria-label=${i.cancelar} oniswc-click=${()=>u("cancelar-subida")}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button></div>`:null}
          <iswc-button class="mas" variant="plain compact" color="neutral" title=${i.menu} aria-label=${i.menu} tabindex="-1"
            oniswc-click=${e=>{e.stopPropagation();let o=e.currentTarget.getBoundingClientRect();m(o.left,o.bottom)}}><iswc-icon icon="mdi:chevron-down"></iswc-icon></iswc-button>
        </div>
        ${a.estado==="fallido"?n`<iswc-button class="fallo" variant="text compact" color="danger" onclick=${()=>u("reintentar")}><iswc-icon slot="start" icon="mdi:alert-circle-outline"></iswc-icon>${i.noEnviado} · <u>${i.reintentar}</u></iswc-button>`:null}
        <av-chat-reacciones id="reacciones" class="reacciones"></av-chat-reacciones>
      </div>
    `);let w=s.querySelector("#medio");w&&a.adjunto&&(w.props=g?{url:a.adjunto.url,duracion:a.adjunto.duracion,onda:a.adjunto.onda,propio:t.propio}:{adjunto:a.adjunto,modo:"burbuja",propio:t.propio,progreso:null},g||w.addEventListener("av-chat-adjunto-ver",e=>{e.stopPropagation(),u("ver")})),s.querySelector("#reacciones").props={ref:r,reacciones:t.reacciones,propio:t.propio}},(s,t,d)=>{let a=new Set(["mensaje","marca","resaltado"]),i=Object.keys(t).some(c=>!a.has(c)&&JSON.stringify(t[c])!==JSON.stringify(d[c])),r=t.mensaje,u=d.mensaje;if(i||!r||!u||!(JSON.stringify({...r,progreso:0})===JSON.stringify({...u,progreso:0})))return!1;let l=s.querySelector(".fila");if(!l)return!1;if(r.progreso!==u.progreso){let c=s.querySelector("#progreso");if(!c||r.progreso==null)return!1;c.setAttribute("value",String(Math.round(r.progreso*100)))}if(t.marca!==d.marca){let c=s.querySelector(".marca");if(!c||!t.marca)return!1;c.setAttribute("data-marca",t.marca),c.setAttribute("icon",j[t.marca])}return l.dataset.resaltado=t.resaltado?"1":"0",!0});S("av-chat-burbuja",R);
