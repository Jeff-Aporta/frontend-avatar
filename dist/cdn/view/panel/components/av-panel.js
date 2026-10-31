import{crearComponente as w,define as y,html as i}from"../../../js/base/componente.js?v=p6quri";import{NotificacionSchema as g,ResumenSchema as b}from"../../../js/consts/schemas/api.schemas.js?v=bcti1h";import{dominio as t,mensajeDe as P}from"../../../js/core/api.js?v=3rnmgi";import{empresaActiva as h,estado as c}from"../../../js/core/estado.js?v=w7n12d";import{ir as p}from"../../../js/core/router.js?v=11mqc0";import{z as C}from"../../../js/base/zod.js?v=zn6b7f";import"./av-kpis.js?v=rfyui6";import"./av-tareas-grafica.js?v=1uuts8";import"./av-embudo-grafica.js?v=ckq24o";import"./av-notificaciones.js?v=6anz2w";const $=w(import.meta.url,"av-panel",{resumen:null,error:"",version:0},(r,a,u)=>{const n=u,s=h(),d=()=>r.querySelector("#notificaciones"),l=async()=>{const e=d();if(e){e.props={cargando:!0};try{const o=C.array(g).safeParse(await t().mias());e.props={items:o.success?o.data:[],cargando:!1}}catch{e.props={items:[],cargando:!1}}}},f=async e=>{const{ids:o}=e.detail;await t().leer(o.length?{ids:o}:{}),await l()};r.append(i`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${f}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${()=>{n.props={resumen:null,error:"",version:(a.version??0)+1}}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" color="brand" oniswc-click=${()=>p("proyectos")}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </iswc-page-header>
      ${a.error?i`<iswc-callout tone="danger"><strong slot="title">No se pudo cargar el panel</strong>${a.error}</iswc-callout>`:null}
      ${s?i`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `:i`<iswc-empty-state id="sin-empresa"><iswc-button color="brand" oniswc-click=${()=>p("organizacion")}>Ir a organización</iswc-button></iswc-empty-state>`}
    </div>
  `);const v=c.yo?.empresas.find(e=>e.iempresa===s)?.nombre??"Avatar";r.querySelector("#cabecera").props={titulo:"Panel",subtitulo:`${v} \xB7 hola, ${c.yo?.nombre??c.yo?.iusuario??""}`,icono:"mdi:view-dashboard-outline"};const m=r.querySelector("#sin-empresa");m&&(m.props={icono:"mdi:domain",titulo:"A\xFAn no perteneces a una empresa",texto:"Pide a un gestor que te invite, o crea la tuya si tienes permiso."}),s&&(r.querySelector("#kpis").props={resumen:a.resumen},r.querySelector("#tareas").props={tareas:a.resumen?.tareas??null},r.querySelector("#embudo").props={clientes:a.resumen?.clientes??null},l(),!a.resumen&&(async()=>{try{const e=b.safeParse(await t().resumen(s));if(!e.success)throw new Error("Resumen con forma inesperada");n.props={resumen:e.data,error:""}}catch(e){n.props={error:P(e)}}})())});y("av-panel",$);
