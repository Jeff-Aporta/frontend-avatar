import{crearComponente as l,define as d,html as r}from"../../../js/base/componente.js?v=p6quri";import{serieAsistenciaHoy as n,seriePorDepartamento as o}from"../utils/rrhh.js?v=n0wjd8";const u=l(import.meta.url,"av-rrhh-grafica",{resumen:null,departamentos:[]},(e,a)=>{const t=a.resumen?n(a.resumen):null,s=o(a.departamentos);e.append(r`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Asistencia de hoy</strong>
          ${t?r`<iswc-doughnut-chart id="asistencia" class="grafica" label="Asistencia de hoy por estado" legend-position="bottom"></iswc-doughnut-chart>`:r`<iswc-empty-state class="vacio" data-cual="asistencia"></iswc-empty-state>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:office-building-outline"></iswc-icon> Plantilla por departamento</strong>
          ${s?r`<iswc-bar-chart id="departamentos" class="grafica" label="Personas por departamento" legend-position="bottom"></iswc-bar-chart>`:r`<iswc-empty-state class="vacio" data-cual="departamentos"></iswc-empty-state>`}
        </iswc-card>
      </div>
    `),t&&(e.querySelector("#asistencia").config=t),s&&(e.querySelector("#departamentos").config=s);for(const i of e.querySelectorAll(".vacio"))i.props=a.resumen?i.dataset.cual==="asistencia"?{icono:"mdi:calendar-blank-outline",titulo:"Sin datos de hoy",texto:"Marca la asistencia para verla aqu\xED."}:{icono:"mdi:account-group-outline",titulo:"Sin plantilla",texto:"Registra empleados con su departamento."}:{estado:"cargando"}},(e,a)=>{const t=a.resumen?n(a.resumen):null,s=o(a.departamentos),i=e.querySelector("#asistencia"),c=e.querySelector("#departamentos");return!a.resumen||!!i!=!!t||!!c!=!!s?!1:(i&&t&&(i.config=t),c&&s&&(c.config=s),!0)});d("av-rrhh-grafica",u);
