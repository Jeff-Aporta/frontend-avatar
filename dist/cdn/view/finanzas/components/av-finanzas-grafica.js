import{crearComponente as u,define as m,html as o}from"../../../js/base/componente.js?v=333q2n";import{nombreMes as d,serieCategorias as i,serieComparativa as l}from"../utils/finanzas.js?v=ct4umv";const f=u(import.meta.url,"av-finanzas-grafica",{resumen:null},(r,c)=>{const a=c.resumen,s=a?i(a):null;r.append(o`
      <div class="rejilla" part="rejilla">
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-bar"></iswc-icon> Mes contra mes <span class="mes">${a?d(a.mes):""}</span></strong>
          ${a?o`<iswc-bar-chart id="barras" class="grafica" label="Ingresos, gastos y beneficio: mes anterior contra el actual" legend-position="bottom"></iswc-bar-chart>`:o`<av-vacio class="vacio"></av-vacio>`}
        </iswc-card>
        <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
          <strong slot="header" class="titulo"><iswc-icon icon="mdi:chart-donut"></iswc-icon> Gastos por categoría</strong>
          ${s?o`<iswc-doughnut-chart id="dona" class="grafica" label="Gastos del mes por categoría" legend-position="bottom"></iswc-doughnut-chart>`:o`<av-vacio class="vacio"></av-vacio>`}
        </iswc-card>
      </div>
    `),a&&(r.querySelector("#barras").config=l(a)),s&&(r.querySelector("#dona").config=s);for(const e of r.querySelectorAll(".vacio"))e.props=a?{icono:"mdi:chart-donut",titulo:"Sin gastos este mes",texto:"Cuando registres gastos ver\xE1s aqu\xED su reparto."}:{estado:"cargando"}},(r,c,a)=>{const s=c.resumen,e=r.querySelector("#barras"),n=r.querySelector("#dona"),t=s?i(s):null;return!s||!a.resumen||!e||!!n!=!!t||s.mes!==a.resumen.mes?!1:(e.config=l(s),n&&t&&(n.config=t),!0)});m("av-finanzas-grafica",f);
