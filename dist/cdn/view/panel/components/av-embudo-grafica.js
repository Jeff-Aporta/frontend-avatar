import{crearComponente as r,define as n,html as e,raw as l}from"../../../js/base/componente.js?v=p6quri";import{moneda as p,serieEmbudo as c}from"../utils/panel.js?v=8snlwa";const d=r(import.meta.url,"av-embudo-grafica",{clientes:null},(t,o)=>{const a=o.clientes,s=a?{data:{labels:c(a).labels,datasets:[{label:"Clientes",data:c(a).data}]},options:{plugins:{legend:{display:!1}}}}:null;t.append(e`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:filter-variant"></iswc-icon> Embudo CRM</strong>
      ${a?e`<iswc-tag slot="header-actions" color="success">${p(a.valor_pipeline)}</iswc-tag>`:null}
      ${s&&a&&a.total>0?e`<iswc-bar-chart class="grafica" part="grafica" label="Clientes por etapa" without-legend>${l(`<script type="application/json">${JSON.stringify(s).replace(/</g,"\\u003c")}<\/script>`)}</iswc-bar-chart>`:e`<iswc-empty-state class="vacio"></iswc-empty-state>`}
    </iswc-card>
  `);const i=t.querySelector("iswc-empty-state");i&&(i.props=a?{icono:"mdi:account-heart-outline",titulo:"Sin clientes",texto:"Registra clientes en el CRM para ver el embudo."}:{estado:"cargando"})});n("av-embudo-grafica",d);
