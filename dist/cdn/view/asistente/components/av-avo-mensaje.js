import{crearComponente as n,define as r,html as e}from"../../../js/base/componente.js?v=49yoqc";const c=n(import.meta.url,"av-avo-mensaje",{turno:null,nombre:""},(t,o)=>{const a=o.turno;if(!a)return;const s=a.quien==="avo";t.append(e`
    <article class="turno" part="turno" data-quien=${a.quien}>
      ${s?e`<span class="avo" part="avatar" title="AVO"><iswc-icon icon="mdi:robot-outline"></iswc-icon></span>`:e`<iswc-person class="persona" compacto usuario=${o.nombre||"yo"} nombre=${o.nombre}></iswc-person>`}
      <div class="burbuja" part="burbuja">
        ${s?e`<strong class="quien">AVO</strong>`:null}
        <p class="texto">${a.texto}</p>
        ${a.creado?e`<iswc-relative-time class="cuando" date=${a.creado} format="short"></iswc-relative-time>`:null}
      </div>
    </article>
  `)});r("av-avo-mensaje",c);
