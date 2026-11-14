import{ra as i,ta as c,ua as n,wa as o}from"./chunk-22HCQII4.mjs";var r=o(new URL("js/components/chat/av-chat-reacciones.min.mjs",new URL("../",import.meta.url)).href,"av-chat-reacciones",{ref:"",reacciones:[],propio:!1},(s,e,t)=>{e.reacciones.length&&s.append(i`
    <div class="reacciones" part="reacciones" role="group" data-propio=${e.propio?"1":"0"}>
      ${e.reacciones.map(a=>i`
        <iswc-button class="reaccion" variant="row" color=${a.mia?"brand":"neutral"} shape="pill" data-mia=${a.mia?"1":"0"} aria-pressed=${a.mia?"true":"false"}
          title=${a.nombres.join(", ")} aria-label=${`${a.emoji} ${a.n}: ${a.nombres.join(", ")}`}
          onclick=${()=>n(t,"av-chat-reaccionar",{imensaje:e.ref,emoji:a.mia?null:a.emoji})}>
          <span class="emoji">${a.emoji}</span>${a.n>1?i`<span class="n">${a.n}</span>`:null}
        </iswc-button>`)}
    </div>
  `)});c("av-chat-reacciones",r);
