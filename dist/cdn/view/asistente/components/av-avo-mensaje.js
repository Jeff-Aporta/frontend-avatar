import{crearComponente as t,define as i,html as a}from"../../../js/base/componente.js?v=0air4b";const c=t(import.meta.url,"av-avo-mensaje",{turno:null,nombre:""},(s,o)=>{const e=o.turno;if(!e)return;const n=e.quien==="avo";s.append(a`
    <article class="turno" part="turno" data-quien=${e.quien}>
      ${n?a`<span class="avo" part="avatar" title="AVO"><iswc-icon icon="mdi:robot-outline"></iswc-icon></span>`:a`<av-persona id="persona" class="persona"></av-persona>`}
      <div class="burbuja" part="burbuja">
        ${n?a`<strong class="quien">AVO</strong>`:null}
        <p class="texto">${e.texto}</p>
        ${e.creado?a`<iswc-relative-time class="cuando" date=${e.creado} format="short"></iswc-relative-time>`:null}
      </div>
    </article>
  `);const r=s.querySelector("#persona");r&&(r.props={iusuario:o.nombre||"yo",nombre:o.nombre||null,compacto:!0})});i("av-avo-mensaje",c);
