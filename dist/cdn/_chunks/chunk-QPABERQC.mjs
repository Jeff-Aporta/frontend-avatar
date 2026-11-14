import{a as b,f as p}from"./chunk-GYNRS6LC.mjs";import{j as v}from"./chunk-EYJKOFS6.mjs";import{ra as n,ta as u,ua as c,wa as m}from"./chunk-22HCQII4.mjs";function C(t,a,i){if(a==="enviados"){let r=t.destinatarios.map(o=>i[o]??o);return`Para: ${r.slice(0,2).join(", ")}${r.length>2?` +${r.length-2}`:""}`}return i[t.remitente]??t.remitente}function $(t,a,i){let r=t.querySelector(".items"),o=t.querySelector(".vacio"),g=t.querySelector(".conteo");if(g.textContent=a.cargando?"":`${a.correos.length} ${a.correos.length===1?"correo":"correos"}`,a.cargando&&!a.correos.length){r.replaceChildren(n`${[1,2,3,4].map(()=>n`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}`),o.hidden=!0;return}if(o.hidden=a.correos.length>0,!a.correos.length){let e=b[a.carpeta];o.props=a.texto.trim()?{icono:"mdi:email-search-outline",titulo:"Sin resultados",texto:`Ning\xFAn correo coincide con \xAB${a.texto.trim()}\xBB.`,estado:"vacio"}:{icono:e?.icono??"mdi:email-outline",titulo:`${e?.label??"Carpeta"} vac\xEDa`,texto:a.carpeta==="entrada"?"Cuando te escriban, los correos llegar\xE1n aqu\xED.":"No hay correos en esta carpeta.",estado:"vacio"}}let l=e=>c(i,"av-correo-abrir",{ibuzon:e}),w=e=>s=>{s.key!=="Enter"&&s.key!==" "||(s.preventDefault(),l(e))},f=e=>s=>{s.stopPropagation(),c(i,"av-correo-marcar",{ibuzon:e.ibuzon,cambios:{destacado:!e.destacado}})};r.replaceChildren(n`${a.correos.map(e=>{let s=C(e,a.carpeta,a.nombres),h=a.carpeta==="enviados"?a.nombres[e.destinatarios[0]??""]??e.destinatarios[0]??"?":s;return n`
      <div class="correo" part="correo" role="option" tabindex="0" data-ibuzon=${String(e.ibuzon)} data-leido=${e.leido?"si":"no"} aria-selected=${a.activo===e.ibuzon?"true":"false"}
        onclick=${()=>l(e.ibuzon)} onkeydown=${w(e.ibuzon)}>
        <iswc-avatar class="avatar" initials=${v(h)} label=${s}></iswc-avatar>
        <div class="cuerpo">
          <div class="linea">
            <span class="quien">${s}</span>
            <iswc-relative-time class="hora" date=${e.creado} format="short"></iswc-relative-time>
          </div>
          <div class="asunto">${e.asunto}</div>
          <div class="previa">${p(e.cuerpo)}</div>
          ${e.etiquetas.length?n`<div class="etiquetas">${e.etiquetas.map(d=>n`<iswc-tag color=${d==="urgente"?"danger":"brand"} variant="outlined" pill>${d}</iswc-tag>`)}</div>`:null}
        </div>
        <iswc-button class="estrella" variant="plain compact" color=${e.destacado?"warning":"neutral"} aria-label=${e.destacado?"Quitar destacado":"Destacar"} aria-pressed=${e.destacado?"true":"false"} ?disabled=${!a.puedeMarcar} oniswc-click=${f(e)}>
          <iswc-icon icon=${e.destacado?"mdi:star":"mdi:star-outline"}></iswc-icon>
        </iswc-button>
      </div>`})}`)}var y=m(new URL("view/correos/components/av-correo-lista.min.mjs",new URL("../",import.meta.url)).href,"av-correo-lista",{correos:[],activo:null,carpeta:"entrada",nombres:{},texto:"",cargando:!1,puedeMarcar:!1},(t,a,i)=>{let r=o=>c(i,"av-correos-buscar",{texto:o.target.value??""});t.append(n`
      <div class="lista" part="lista">
        <div class="barra" part="barra">
          <iswc-input class="buscador" type="search" clearable placeholder="Buscar en el correo" aria-label="Buscar en el correo" value=${a.texto} oniswc-input=${r}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
          <span class="conteo" part="conteo"></span>
        </div>
        <div class="items" part="items" role="listbox" aria-label="Correos"></div>
        <iswc-empty-state class="vacio" hidden></iswc-empty-state>
      </div>
    `),$(t,a,i)},(t,a,i,r)=>{if(!t.querySelector(".items"))return!1;$(t,a,r);let o=t.querySelector(".buscador");return o&&o.value!==a.texto&&t.activeElement!==o&&(o.value=a.texto),!0});u("av-correo-lista",y);
