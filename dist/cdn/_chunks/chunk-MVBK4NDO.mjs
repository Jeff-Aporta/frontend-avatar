import{ra as i,sa as n,ta as o,wa as l}from"./chunk-22HCQII4.mjs";var r={barras:"iswc-bar-chart",dona:"iswc-doughnut-chart"};function f(t){let a=t.leyenda?{"legend-position":"bottom"}:{"without-legend":!0};return n(r[t.tipo],{class:"grafica",part:"grafica",role:"img","aria-label":t.etiqueta||t.titulo,...a})}var d=l(new URL("js/components/av/av-grafica.min.mjs",new URL("../",import.meta.url)).href,"av-grafica",{tipo:"barras",titulo:"",icono:"mdi:chart-bar",detalle:"",etiqueta:"",leyenda:!0,config:null,cargando:!1,vacio:{icono:"mdi:chart-bar",titulo:"Sin datos",texto:""}},(t,a)=>{let e=a.config?f(a):null;t.append(i`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon=${a.icono}></iswc-icon> ${a.titulo}${a.detalle?i`<span class="detalle">${a.detalle}</span>`:null}</strong>
        <slot name="acciones" slot="header-actions"></slot>
        ${e??(a.cargando?i`<iswc-empty-state class="vacio" estado="cargando"></iswc-empty-state>`:i`<iswc-empty-state class="vacio" icono=${a.vacio.icono} titulo=${a.vacio.titulo} texto=${a.vacio.texto}></iswc-empty-state>`)}
      </iswc-card>
    `),e&&(e.config=a.config)},(t,a,e)=>{let c=t.querySelector(".grafica"),s=a.tipo===e.tipo&&a.titulo===e.titulo&&a.detalle===e.detalle&&a.leyenda===e.leyenda;return!c||!a.config||!s?!1:(c.config=a.config,!0)});o("av-grafica",d);
