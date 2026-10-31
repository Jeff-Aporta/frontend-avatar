import{crearComponente as n,define as s,emitir as t,html as o}from"../../base/componente.js?v=0air4b";const m=n(import.meta.url,"av-chat-reacciones",{ref:"",reacciones:[],propio:!1},(i,a,c)=>{a.reacciones.length&&i.append(o`
    <div class="reacciones" part="reacciones" role="group" data-propio=${a.propio?"1":"0"}>
      ${a.reacciones.map(e=>o`
        <button class="reaccion" type="button" data-mia=${e.mia?"1":"0"} aria-pressed=${e.mia?"true":"false"}
          title=${e.nombres.join(", ")} aria-label=${`${e.emoji} ${e.n}: ${e.nombres.join(", ")}`}
          onclick=${()=>t(c,"av-chat-reaccionar",{imensaje:a.ref,emoji:e.mia?null:e.emoji})}>
          <span class="emoji">${e.emoji}</span>${e.n>1?o`<span class="n">${e.n}</span>`:null}
        </button>`)}
    </div>
  `)});s("av-chat-reacciones",m);
