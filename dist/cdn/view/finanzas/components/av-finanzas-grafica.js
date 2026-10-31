import{crearComponente as m,define as u,html as e}from"../../../js/base/componente.js?v=p6quri";import{nombreMes as d,serieCategorias as i,serieComparativa as l}from"../utils/finanzas.js?v=ct4umv";const f=m(import.meta.url,"av-finanzas-grafica",{resumen:null},(r,o)=>{const a=o.resumen,s=a?i(a):null;r.append(e`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-bar"></iswc-icon> Mes contra mes <span class="mes">${a?d(a.mes):""}</span></strong>
          ${a?e`<iswc-bar-chart id="barras" class="grafica" label="Ingresos, gastos y beneficio: mes anterior contra el actual" legend-position="bottom"></iswc-bar-chart>`:e`<iswc-empty-state class="vacio"></iswc-empty-state>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Gastos por categoría</strong>
          ${s?e`<iswc-doughnut-chart id="dona" class="grafica" label="Gastos del mes por categoría" legend-position="bottom"></iswc-doughnut-chart>`:e`<iswc-empty-state class="vacio"></iswc-empty-state>`}
        </iswc-card>
      </div>
    `),a&&(r.querySelector("#barras").config=l(a)),s&&(r.querySelector("#dona").config=s);for(const t of r.querySelectorAll(".vacio"))t.props=a?{icono:"mdi:chart-donut",titulo:"Sin gastos este mes",texto:"Cuando registres gastos ver\xE1s aqu\xED su reparto."}:{estado:"cargando"}},(r,o,a)=>{const s=o.resumen,t=r.querySelector("#barras"),c=r.querySelector("#dona"),n=s?i(s):null;return!s||!a.resumen||!t||!!c!=!!n||s.mes!==a.resumen.mes?!1:(t.config=l(s),c&&n&&(c.config=n),!0)});u("av-finanzas-grafica",f);
