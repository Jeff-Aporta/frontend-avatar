import{crearComponente as w,define as y,html as i}from"../../../js/base/componente.js?v=ykdqqm";import{NotificacionSchema as b,ResumenSchema as g}from"../../../js/consts/schemas/api.schemas.js?v=bcti1h";import{sinMembresia as P}from"../../../js/consts/estados.js?v=pvk918";import{dominio as t,mensajeDe as h}from"../../../js/core/api.js?v=3l9tpn";import{empresaActiva as C,estado as c}from"../../../js/core/estado.js?v=w7n12d";import{ir as p}from"../../../js/core/router.js?v=l01npq";import{z as $}from"../../../js/base/zod.js?v=zn6b7f";import"./av-kpis.js?v=tniw3f";import"./av-tareas-grafica.js?v=ytqsgo";import"./av-embudo-grafica.js?v=pkwcw6";import"./av-notificaciones.js?v=0sdp2l";const k=w(import.meta.url,"av-panel",{resumen:null,error:"",version:0},(a,r,u)=>{const n=u,o=C(),d=()=>a.querySelector("#notificaciones"),l=async()=>{const e=d();if(e){e.props={cargando:!0};try{const s=$.array(b).safeParse(await t().mias());e.props={items:s.success?s.data:[],cargando:!1}}catch{e.props={items:[],cargando:!1}}}},v=async e=>{const{ids:s}=e.detail;await t().leer(s.length?{ids:s}:{}),await l()};a.append(i`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${v}>
      <iswc-page-header id="cabecera">
        <av-escena slot="ilustracion" escena="panel"></av-escena>
        <iswc-button slot="acciones" variant="outlined compact" color="neutral" oniswc-click=${()=>{n.props={resumen:null,error:"",version:(r.version??0)+1}}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button variant="compact" slot="acciones" color="brand" oniswc-click=${()=>p("proyectos")}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </iswc-page-header>
      ${r.error?i`<iswc-callout color="danger"><strong slot="title">No se pudo cargar el panel</strong>${r.error}</iswc-callout>`:null}
      ${o?i`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `:i`<iswc-empty-state id="sin-empresa"><iswc-button variant="compact" color="brand" oniswc-click=${()=>p("organizacion")}>Ir a organización</iswc-button></iswc-empty-state>`}
    </div>
  `);const f=c.yo?.empresas.find(e=>e.iempresa===o)?.nombre??"Avatar";a.querySelector("#cabecera").props={titulo:"Panel",subtitulo:`${f} \xB7 hola, ${c.yo?.nombre??c.yo?.iusuario??""}`,icono:"mdi:view-dashboard-outline"};const m=a.querySelector("#sin-empresa");m&&(m.props=P("Pide a un gestor que te invite, o crea la tuya si tienes permiso.")),o&&(a.querySelector("#kpis").props={resumen:r.resumen},a.querySelector("#tareas").props={tareas:r.resumen?.tareas??null},a.querySelector("#embudo").props={clientes:r.resumen?.clientes??null},l(),!r.resumen&&(async()=>{try{const e=g.safeParse(await t().resumen(o));if(!e.success)throw new Error("Resumen con forma inesperada");n.props={resumen:e.data,error:""}}catch(e){n.props={error:h(e)}}})())});y("av-panel",k);
