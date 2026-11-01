import{crearComponente as w,define as y,html as i}from"../../../js/base/componente.js?v=m5nu5c";import{NotificacionSchema as b,ResumenSchema as g}from"../../../js/consts/schemas/api.schemas.js?v=bcti1h";import{sinMembresia as P}from"../../../js/consts/estados.js?v=pvk918";import{dominio as t,mensajeDe as h}from"../../../js/core/api.js?v=4m3ots";import{empresaActiva as C,estado as c}from"../../../js/core/estado.js?v=w7n12d";import{ir as p}from"../../../js/core/router.js?v=tec89c";import{z as $}from"../../../js/base/zod.js?v=zn6b7f";import"./av-kpis.js?v=btdpaj";import"./av-tareas-grafica.js?v=jqthh4";import"./av-embudo-grafica.js?v=ags50g";import"./av-notificaciones.js?v=k4m5pc";const k=w(import.meta.url,"av-panel",{resumen:null,error:"",version:0},(r,a,u)=>{const n=u,s=C(),d=()=>r.querySelector("#notificaciones"),l=async()=>{const e=d();if(e){e.props={cargando:!0};try{const o=$.array(b).safeParse(await t().mias());e.props={items:o.success?o.data:[],cargando:!1}}catch{e.props={items:[],cargando:!1}}}},v=async e=>{const{ids:o}=e.detail;await t().leer(o.length?{ids:o}:{}),await l()};r.append(i`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${v}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${()=>{n.props={resumen:null,error:"",version:(a.version??0)+1}}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button variant="compact" slot="acciones" color="brand" oniswc-click=${()=>p("proyectos")}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </iswc-page-header>
      ${a.error?i`<iswc-callout color="danger"><strong slot="title">No se pudo cargar el panel</strong>${a.error}</iswc-callout>`:null}
      ${s?i`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `:i`<iswc-empty-state id="sin-empresa"><iswc-button variant="compact" color="brand" oniswc-click=${()=>p("organizacion")}>Ir a organización</iswc-button></iswc-empty-state>`}
    </div>
  `);const f=c.yo?.empresas.find(e=>e.iempresa===s)?.nombre??"Avatar";r.querySelector("#cabecera").props={titulo:"Panel",subtitulo:`${f} \xB7 hola, ${c.yo?.nombre??c.yo?.iusuario??""}`,icono:"mdi:view-dashboard-outline"};const m=r.querySelector("#sin-empresa");m&&(m.props=P("Pide a un gestor que te invite, o crea la tuya si tienes permiso.")),s&&(r.querySelector("#kpis").props={resumen:a.resumen},r.querySelector("#tareas").props={tareas:a.resumen?.tareas??null},r.querySelector("#embudo").props={clientes:a.resumen?.clientes??null},l(),!a.resumen&&(async()=>{try{const e=g.safeParse(await t().resumen(s));if(!e.success)throw new Error("Resumen con forma inesperada");n.props={resumen:e.data,error:""}}catch(e){n.props={error:h(e)}}})())});y("av-panel",k);
