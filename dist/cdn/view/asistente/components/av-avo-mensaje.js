import{crearComponente as t,define as c,html as o}from"../../../js/base/componente.js?v=p6quri";const i=t(import.meta.url,"av-avo-mensaje",{turno:null,nombre:""},(a,s)=>{const e=s.turno;if(!e)return;const n=e.quien==="avo";a.append(o`
    <article class="turno" part="turno" data-quien=${e.quien}>
      ${n?o`<span class="avo" part="avatar" title="AVO"><iswc-icon icon="mdi:robot-outline"></iswc-icon></span>`:o`<iswc-person id="persona" class="persona"></iswc-person>`}
      <div class="burbuja" part="burbuja">
        ${n?o`<strong class="quien">AVO</strong>`:null}
        <p class="texto">${e.texto}</p>
        ${e.creado?o`<iswc-relative-time class="cuando" date=${e.creado} format="short"></iswc-relative-time>`:null}
      </div>
    </article>
  `);const r=a.querySelector("#persona");r&&(r.props={usuario:s.nombre||"yo",nombre:s.nombre||null,compacto:!0})});c("av-avo-mensaje",i);
