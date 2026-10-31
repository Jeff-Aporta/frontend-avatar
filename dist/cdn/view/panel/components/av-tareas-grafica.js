import{crearComponente as i,define as n,html as t,raw as l}from"../../../js/base/componente.js?v=p6quri";import{serieTareas as o}from"../utils/panel.js?v=8snlwa";const p=i(import.meta.url,"av-tareas-grafica",{tareas:null},(e,c)=>{const a=c.tareas,s=a?{data:{labels:o(a).labels,datasets:[{label:"Tareas",data:o(a).data}]}}:null;e.append(t`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Tareas por estado</strong>
      ${s&&a&&a.total>0?t`<iswc-doughnut-chart class="grafica" part="grafica" label="Tareas por estado" legend-position="bottom">${l(`<script type="application/json">${JSON.stringify(s).replace(/</g,"\\u003c")}<\/script>`)}</iswc-doughnut-chart>`:t`<iswc-empty-state class="vacio"></iswc-empty-state>`}
    </iswc-card>
  `);const r=e.querySelector("iswc-empty-state");r&&(r.props=a?{icono:"mdi:checkbox-blank-circle-outline",titulo:"Sin tareas",texto:"Cuando el equipo cree tareas aparecer\xE1n aqu\xED por estado."}:{estado:"cargando"})});n("av-tareas-grafica",p);
