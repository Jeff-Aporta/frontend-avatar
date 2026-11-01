import{crearComponente as n,define as s,emitir as t,html as i}from"../../base/componente.js?v=m5nu5c";const r=n(import.meta.url,"av-chat-reacciones",{ref:"",reacciones:[],propio:!1},(o,e,c)=>{e.reacciones.length&&o.append(i`
    <div class="reacciones" part="reacciones" role="group" data-propio=${e.propio?"1":"0"}>
      ${e.reacciones.map(a=>i`
        <iswc-button class="reaccion" variant="row" color=${a.mia?"brand":"neutral"} shape="pill" data-mia=${a.mia?"1":"0"} aria-pressed=${a.mia?"true":"false"}
          title=${a.nombres.join(", ")} aria-label=${`${a.emoji} ${a.n}: ${a.nombres.join(", ")}`}
          onclick=${()=>t(c,"av-chat-reaccionar",{imensaje:e.ref,emoji:a.mia?null:a.emoji})}>
          <span class="emoji">${a.emoji}</span>${a.n>1?i`<span class="n">${a.n}</span>`:null}
        </iswc-button>`)}
    </div>
  `)});s("av-chat-reacciones",r);
