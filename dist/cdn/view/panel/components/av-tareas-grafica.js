import{crearComponente as i,define as n,html as r,raw as l}from"../../../js/base/componente.js?v=ehrr8d";import{serieTareas as o}from"../utils/panel.js?v=8snlwa";const p=i(import.meta.url,"av-tareas-grafica",{tareas:null},(t,c)=>{const a=c.tareas,e=a?{data:{labels:o(a).labels,datasets:[{label:"Tareas",data:o(a).data}]}}:null;t.append(r`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Tareas por estado</strong>
      ${e&&a&&a.total>0?r`<iswc-doughnut-chart class="grafica" part="grafica" label="Tareas por estado" legend-position="bottom">${l(`<script type="application/json">${JSON.stringify(e).replace(/</g,"\\u003c")}<\/script>`)}</iswc-doughnut-chart>`:r`<av-vacio class="vacio"></av-vacio>`}
    </iswc-card>
  `);const s=t.querySelector("av-vacio");s&&(s.props=a?{icono:"mdi:checkbox-blank-circle-outline",titulo:"Sin tareas",texto:"Cuando el equipo cree tareas aparecer\xE1n aqu\xED por estado."}:{estado:"cargando"})});n("av-tareas-grafica",p);
