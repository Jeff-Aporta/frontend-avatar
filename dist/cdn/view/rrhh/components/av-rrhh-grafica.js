import{crearComponente as l,define as d,html as r}from"../../../js/base/componente.js?v=17uldv";import{serieAsistenciaHoy as c,seriePorDepartamento as n}from"../utils/rrhh.js?v=n0wjd8";const u=l(import.meta.url,"av-rrhh-grafica",{resumen:null,departamentos:[]},(e,a)=>{const t=a.resumen?c(a.resumen):null,i=n(a.departamentos);e.append(r`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Asistencia de hoy</strong>
          ${t?r`<iswc-doughnut-chart id="asistencia" class="grafica" label="Asistencia de hoy por estado" legend-position="bottom"></iswc-doughnut-chart>`:r`<av-vacio class="vacio" data-cual="asistencia"></av-vacio>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:office-building-outline"></iswc-icon> Plantilla por departamento</strong>
          ${i?r`<iswc-bar-chart id="departamentos" class="grafica" label="Personas por departamento" legend-position="bottom"></iswc-bar-chart>`:r`<av-vacio class="vacio" data-cual="departamentos"></av-vacio>`}
        </iswc-card>
      </div>
    `),t&&(e.querySelector("#asistencia").config=t),i&&(e.querySelector("#departamentos").config=i);for(const s of e.querySelectorAll(".vacio"))s.props=a.resumen?s.dataset.cual==="asistencia"?{icono:"mdi:calendar-blank-outline",titulo:"Sin datos de hoy",texto:"Marca la asistencia para verla aqu\xED."}:{icono:"mdi:account-group-outline",titulo:"Sin plantilla",texto:"Registra empleados con su departamento."}:{estado:"cargando"}},(e,a)=>{const t=a.resumen?c(a.resumen):null,i=n(a.departamentos),s=e.querySelector("#asistencia"),o=e.querySelector("#departamentos");return!a.resumen||!!s!=!!t||!!o!=!!i?!1:(s&&t&&(s.config=t),o&&i&&(o.config=i),!0)});d("av-rrhh-grafica",u);
