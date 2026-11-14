import"../../../_chunks/chunk-37RKFK5Q.mjs";import"../../../_chunks/chunk-JQYIYMH2.mjs";import"../../../_chunks/chunk-MKDC3SEO.mjs";import"../../../_chunks/chunk-MXCR5UPE.mjs";import"../../../_chunks/chunk-GUMNOQ4R.mjs";import{b as g}from"../../../_chunks/chunk-MZCXCTZR.mjs";import{c as t,p as w}from"../../../_chunks/chunk-SDQIKR5O.mjs";import"../../../_chunks/chunk-3OLLRFAW.mjs";import"../../../_chunks/chunk-BY7FRINU.mjs";import{a as n,e as f}from"../../../_chunks/chunk-ZQI42E6M.mjs";import"../../../_chunks/chunk-MVBK4NDO.mjs";import{l}from"../../../_chunks/chunk-RTQWBEUQ.mjs";import"../../../_chunks/chunk-YDU3QAVP.mjs";import{ra as o,ta as y,wa as b}from"../../../_chunks/chunk-22HCQII4.mjs";import{c as d,g as v}from"../../../_chunks/chunk-JOUQNVKA.mjs";import"../../../_chunks/chunk-2XJIRYNX.mjs";import{a as u}from"../../../_chunks/chunk-FWBWSRYW.mjs";import"../../../_chunks/chunk-S24WVIZS.mjs";var k=b(new URL("view/panel/components/av-panel.min.mjs",new URL("../../../",import.meta.url)).href,"av-panel",{resumen:null,error:"",version:0},(a,r,P)=>{let c=P,i=f(),h=()=>a.querySelector("#notificaciones"),p=async()=>{let e=h();if(e){e.props={cargando:!0};try{let s=u.array(v).safeParse(await t().mias());e.props={items:s.success?s.data:[],cargando:!1}}catch{e.props={items:[],cargando:!1}}}},C=async e=>{let{ids:s}=e.detail;await t().leer(s.length?{ids:s}:{}),await p()};a.append(o`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${C}>
      <iswc-page-header id="cabecera">
        <av-escena slot="ilustracion" escena="panel"></av-escena>
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${()=>{c.props={resumen:null,error:"",version:(r.version??0)+1}}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button variant="compact" slot="acciones" color="brand" oniswc-click=${()=>l("proyectos")}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </iswc-page-header>
      ${r.error?o`<iswc-callout color="danger"><strong slot="title">No se pudo cargar el panel</strong>${r.error}</iswc-callout>`:null}
      ${i?o`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `:o`<iswc-empty-state id="sin-empresa"><iswc-button variant="compact" color="brand" oniswc-click=${()=>l("organizacion")}>Ir a organización</iswc-button></iswc-empty-state>`}
    </div>
  `);let $=n.yo?.empresas.find(e=>e.iempresa===i)?.nombre??"Avatar";a.querySelector("#cabecera").props={titulo:"Panel",subtitulo:`${$} \xB7 hola, ${n.yo?.nombre??n.yo?.iusuario??""}`,icono:"mdi:view-dashboard-outline"};let m=a.querySelector("#sin-empresa");m&&(m.props=g("Pide a un gestor que te invite, o crea la tuya si tienes permiso.")),i&&(a.querySelector("#kpis").props={resumen:r.resumen},a.querySelector("#tareas").props={tareas:r.resumen?.tareas??null},a.querySelector("#embudo").props={clientes:r.resumen?.clientes??null},p(),!r.resumen&&(async()=>{try{let e=d.safeParse(await t().resumen(i));if(!e.success)throw new Error("Resumen con forma inesperada");c.props={resumen:e.data,error:""}}catch(e){c.props={error:w(e)}}})())});y("av-panel",k);
