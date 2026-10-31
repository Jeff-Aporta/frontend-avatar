import{crearComponente as r,define as n,html as e,raw as l}from"../../../js/base/componente.js?v=zohalw";import{moneda as p,serieEmbudo as o}from"../utils/panel.js?v=8snlwa";const d=r(import.meta.url,"av-embudo-grafica",{clientes:null},(t,c)=>{const a=c.clientes,i=a?{data:{labels:o(a).labels,datasets:[{label:"Clientes",data:o(a).data}]},options:{plugins:{legend:{display:!1}}}}:null;t.append(e`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:filter-variant"></iswc-icon> Embudo CRM</strong>
      ${a?e`<iswc-tag slot="header-actions" color="success">${p(a.valor_pipeline)}</iswc-tag>`:null}
      ${i&&a&&a.total>0?e`<iswc-bar-chart class="grafica" part="grafica" label="Clientes por etapa" without-legend>${l(`<script type="application/json">${JSON.stringify(i).replace(/</g,"\\u003c")}<\/script>`)}</iswc-bar-chart>`:e`<av-vacio class="vacio"></av-vacio>`}
    </iswc-card>
  `);const s=t.querySelector("av-vacio");s&&(s.props=a?{icono:"mdi:account-heart-outline",titulo:"Sin clientes",texto:"Registra clientes en el CRM para ver el embudo."}:{estado:"cargando"})});n("av-embudo-grafica",d);
