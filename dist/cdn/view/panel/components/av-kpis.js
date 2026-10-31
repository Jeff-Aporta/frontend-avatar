import{crearComponente as l,define as r,html as s}from"../../../js/base/componente.js?v=p6quri";import{kpis as p}from"../utils/panel.js?v=8snlwa";const t=l(import.meta.url,"av-kpis",{resumen:null},(a,i)=>{if(!i.resumen){a.append(s`<div class="rejilla" part="rejilla" aria-busy="true">${[1,2,3,4,5,6].map(()=>s`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}a.append(s`
    <div class="rejilla" part="rejilla">
      ${p(i.resumen).map(e=>s`<iswc-stat class="kpi" data-id=${e.id} label=${e.label} value=${e.value} helper=${e.helper} icon=${e.icon} color=${e.color}></iswc-stat>`)}
    </div>
  `)});r("av-kpis",t);
