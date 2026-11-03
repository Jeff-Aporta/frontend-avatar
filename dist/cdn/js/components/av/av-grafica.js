import{crearComponente as o,define as l,el as s,html as i}from"../../base/componente.js?v=ykdqqm";const r={barras:"iswc-bar-chart",dona:"iswc-doughnut-chart"};function f(t){const a=t.leyenda?{"legend-position":"bottom"}:{"without-legend":!0};return s(r[t.tipo],{class:"grafica",part:"grafica",role:"img","aria-label":t.etiqueta||t.titulo,...a})}const d=o(import.meta.url,"av-grafica",{tipo:"barras",titulo:"",icono:"mdi:chart-bar",detalle:"",etiqueta:"",leyenda:!0,config:null,cargando:!1,vacio:{icono:"mdi:chart-bar",titulo:"Sin datos",texto:""}},(t,a)=>{const e=a.config?f(a):null;t.append(i`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon=${a.icono}></iswc-icon> ${a.titulo}${a.detalle?i`<span class="detalle">${a.detalle}</span>`:null}</strong>
        <slot name="acciones" slot="header-actions"></slot>
        ${e??(a.cargando?i`<iswc-empty-state class="vacio" estado="cargando"></iswc-empty-state>`:i`<iswc-empty-state class="vacio" icono=${a.vacio.icono} titulo=${a.vacio.titulo} texto=${a.vacio.texto}></iswc-empty-state>`)}
      </iswc-card>
    `),e&&(e.config=a.config)},(t,a,e)=>{const c=t.querySelector(".grafica"),n=a.tipo===e.tipo&&a.titulo===e.titulo&&a.detalle===e.detalle&&a.leyenda===e.leyenda;return!c||!a.config||!n?!1:(c.config=a.config,!0)});l("av-grafica",d);
