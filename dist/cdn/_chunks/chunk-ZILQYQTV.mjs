import{ra as a,ta as n,wa as t}from"./chunk-22HCQII4.mjs";var i=t(new URL("view/asistente/components/av-avo-mensaje.min.mjs",new URL("../",import.meta.url)).href,"av-avo-mensaje",{turno:null,nombre:""},(r,s)=>{let e=s.turno;if(!e)return;let o=e.quien==="avo";r.append(a`
    <article class="turno" part="turno" data-quien=${e.quien}>
      ${o?a`<span class="avo" part="avatar" title="AVO"><iswc-icon icon="mdi:robot-outline"></iswc-icon></span>`:a`<iswc-person class="persona" compacto usuario=${s.nombre||"yo"} nombre=${s.nombre}></iswc-person>`}
      <div class="burbuja" part="burbuja">
        ${o?a`<strong class="quien">AVO</strong>`:null}
        <p class="texto">${e.texto}</p>
        ${e.creado?a`<iswc-relative-time class="cuando" date=${e.creado} format="short"></iswc-relative-time>`:null}
      </div>
    </article>
  `)});n("av-avo-mensaje",i);
