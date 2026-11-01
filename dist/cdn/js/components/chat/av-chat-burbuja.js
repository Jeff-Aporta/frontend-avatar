import{crearComponente as E,define as C,emitir as f,html as n,raw as P}from"../../base/componente.js?v=m5nu5c";import{formatearHtml as M,horaCorta as w,soloEmojis as T,textoLlamada as k}from"../../chat/formato.js?v=xzgyvo";import{textos as A}from"../../chat/textos.js?v=cthyvo";import{ICONO_MARCA as y}from"./marcas.js?v=s62wqx";import"./av-chat-adjunto.js?v=ffh5yn";import"./av-chat-audio.js?v=t9lbox";import"./av-chat-reacciones.js?v=zj0q16";const O=480,L=E(import.meta.url,"av-chat-burbuja",{mensaje:null,propio:!1,primero:!0,ultimo:!0,autor:null,marca:null,cita:null,menciones:[],reacciones:[],resaltado:!1},(s,t,d)=>{const a=t.mensaje;if(!a)return;const i=A(),r=a.clave,u=e=>f(d,"av-chat-accion",{accion:e,imensaje:r});if(a.tipo==="sistema"||a.tipo==="llamada"){const e=a.tipo==="llamada",o=e&&a.meta.perdida===!0;s.append(n`
        <div class="sistema" part="sistema" data-tipo=${a.tipo} data-perdida=${o?"1":"0"}>
          <span class="pildora">
            ${e?n`<iswc-icon icon=${a.meta.medio==="video"?"mdi:video-outline":o?"mdi:phone-missed-outline":"mdi:phone-outline"}></iswc-icon>`:null}
            <span>${e?k(a.meta,i):a.texto}</span>
            ${e?n`<span class="hora">${w(a.ts)}</span>`:null}
          </span>
        </div>
      `);return}const m=(e,o)=>f(d,"av-chat-menu",{imensaje:r,x:e,y:o});let l=null;const c=e=>{const o=e;o.pointerType==="touch"&&(l=setTimeout(()=>{l=null,navigator.vibrate?.(12),m(o.clientX,o.clientY)},O))},p=()=>{l&&clearTimeout(l),l=null},x=e=>{const o=e;if(o.key==="ContextMenu"||o.shiftKey&&o.key==="F10"||o.key==="Enter"){o.preventDefault();const $=o.currentTarget.getBoundingClientRect();m($.left+$.width/2,$.top+$.height/2)}},j=!a.eliminado&&!a.adjunto?T(a.texto):0,h=!a.eliminado&&a.texto.trim().length>0,v=!!a.adjunto&&(a.tipo==="audio"||a.adjunto.mime.startsWith("audio/")),S=!!a.adjunto&&!h&&(a.tipo==="imagen"||a.tipo==="video"),b=n`
      <span class="meta" part="meta">
        ${a.editado&&!a.eliminado?n`<span class="editado">${i.editado}</span>`:null}
        ${a.destacado?n`<iswc-icon class="estrella" icon="mdi:star" title=${i.destacados}></iswc-icon>`:null}
        <span class="hora">${w(a.ts)}</span>
        ${t.marca?n`<iswc-icon class="marca" data-marca=${t.marca} icon=${y[t.marca]} aria-label=${t.marca}></iswc-icon>`:null}
      </span>`;s.append(n`
      <div class="fila" part="fila" data-propio=${t.propio?"1":"0"} data-primero=${t.primero?"1":"0"} data-ultimo=${t.ultimo?"1":"0"} data-resaltado=${t.resaltado?"1":"0"} data-grande=${j?String(j):"0"}>
        <div class="burbuja" part="burbuja" tabindex="0" role="article" data-solomedio=${S?"1":"0"} data-eliminado=${a.eliminado?"1":"0"} data-estado=${a.estado}
          aria-label=${`${t.autor?.nombre??(t.propio?i.tu:"")} ${a.eliminado?i.eliminado:a.texto||a.adjunto?.nombre||""} ${w(a.ts)}`}
          oncontextmenu=${e=>{const o=e;o.preventDefault(),m(o.clientX,o.clientY)}}
          onpointerdown=${c} onpointerup=${p} onpointerleave=${p} onpointermove=${p} onkeydown=${x}>
          ${t.autor&&t.primero?n`<span class="autor" data-color=${String(t.autor.color)}>${t.autor.nombre}</span>`:null}
          ${a.reenviado&&!a.eliminado?n`<span class="reenviado"><iswc-icon icon="mdi:share-outline"></iswc-icon>${i.reenviado}</span>`:null}
          ${t.cita&&!a.eliminado?n`
            <iswc-button class="cita" variant="row" color="neutral" data-color=${String(t.cita.color)} onclick=${e=>{e.stopPropagation(),f(d,"av-chat-accion",{accion:"ir",imensaje:t.cita.ref})}}>
              <span class="cita-texto"><strong>${t.cita.autor}</strong><span>${t.cita.texto}</span></span>
              ${t.cita.miniatura?n`<img class="cita-mini" src=${t.cita.miniatura} alt="">`:null}
            </iswc-button>`:null}
          ${a.adjunto&&!a.eliminado?v?n`<av-chat-audio class="medio" id="medio"></av-chat-audio>`:n`<av-chat-adjunto class="medio" id="medio"></av-chat-adjunto>`:null}
          ${a.eliminado?n`<p class="texto eliminado"><iswc-icon icon="mdi:cancel"></iswc-icon>${t.propio?i.eliminadoPorMi:i.eliminado}${b}</p>`:h?n`<div class="texto" dir="auto">${P(M(a.texto,t.menciones))}${b}</div>`:n`<div class="texto vacio">${b}</div>`}
          ${a.estado==="pendiente"&&a.progreso!=null?n`
            <div class="subida"><iswc-progress-bar id="progreso" value=${String(Math.round(a.progreso*100))} label=${i.adjuntar}></iswc-progress-bar>
            <iswc-button variant="plain compact" color="neutral" title=${i.cancelar} aria-label=${i.cancelar} oniswc-click=${()=>u("cancelar-subida")}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button></div>`:null}
          <iswc-button class="mas" variant="plain compact" color="neutral" title=${i.menu} aria-label=${i.menu} tabindex="-1"
            oniswc-click=${e=>{e.stopPropagation();const o=e.currentTarget.getBoundingClientRect();m(o.left,o.bottom)}}><iswc-icon icon="mdi:chevron-down"></iswc-icon></iswc-button>
        </div>
        ${a.estado==="fallido"?n`<iswc-button class="fallo" variant="text compact" color="danger" onclick=${()=>u("reintentar")}><iswc-icon slot="start" icon="mdi:alert-circle-outline"></iswc-icon>${i.noEnviado} · <u>${i.reintentar}</u></iswc-button>`:null}
        <av-chat-reacciones id="reacciones" class="reacciones"></av-chat-reacciones>
      </div>
    `);const g=s.querySelector("#medio");g&&a.adjunto&&(g.props=v?{url:a.adjunto.url,duracion:a.adjunto.duracion,onda:a.adjunto.onda,propio:t.propio}:{adjunto:a.adjunto,modo:"burbuja",propio:t.propio,progreso:null},v||g.addEventListener("av-chat-adjunto-ver",e=>{e.stopPropagation(),u("ver")})),s.querySelector("#reacciones").props={ref:r,reacciones:t.reacciones,propio:t.propio}},(s,t,d)=>{const a=new Set(["mensaje","marca","resaltado"]),i=Object.keys(t).some(c=>!a.has(c)&&JSON.stringify(t[c])!==JSON.stringify(d[c])),r=t.mensaje,u=d.mensaje;if(i||!r||!u||!(JSON.stringify({...r,progreso:0})===JSON.stringify({...u,progreso:0})))return!1;const l=s.querySelector(".fila");if(!l)return!1;if(r.progreso!==u.progreso){const c=s.querySelector("#progreso");if(!c||r.progreso==null)return!1;c.setAttribute("value",String(Math.round(r.progreso*100)))}if(t.marca!==d.marca){const c=s.querySelector(".marca");if(!c||!t.marca)return!1;c.setAttribute("data-marca",t.marca),c.setAttribute("icon",y[t.marca])}return l.dataset.resaltado=t.resaltado?"1":"0",!0});C("av-chat-burbuja",L);
