import{crearComponente as w,define as b,html as i}from"../../../js/base/componente.js?v=ehrr8d";import{NotificacionSchema as y,ResumenSchema as g}from"../../../js/consts/schemas/api.schemas.js?v=c8lmgg";import{dominio as t,mensajeDe as P}from"../../../js/core/api.js?v=il5qcm";import{empresaActiva as h,estado as c}from"../../../js/core/estado.js?v=w7n12d";import{ir as p}from"../../../js/core/router.js?v=a7apgx";import{z as C}from"../../../js/base/zod.js?v=zn6b7f";import"./av-kpis.js?v=regdif";import"./av-tareas-grafica.js?v=kl9p4f";import"./av-embudo-grafica.js?v=q7snqz";import"./av-notificaciones.js?v=bo6ejz";const $=w(import.meta.url,"av-panel",{resumen:null,error:"",version:0},(a,r,u)=>{const n=u,s=h(),d=()=>a.querySelector("#notificaciones"),l=async()=>{const e=d();if(e){e.props={cargando:!0};try{const o=C.array(y).safeParse(await t().mias());e.props={items:o.success?o.data:[],cargando:!1}}catch{e.props={items:[],cargando:!1}}}},v=async e=>{const{ids:o}=e.detail;await t().leer(o.length?{ids:o}:{}),await l()};a.append(i`
    <div class="pagina" part="pagina" onav-notificaciones-leer=${v}>
      <av-cabecera id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${()=>{n.props={resumen:null,error:"",version:(r.version??0)+1}}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
        <iswc-button slot="acciones" color="brand" oniswc-click=${()=>p("proyectos")}><iswc-icon slot="start" icon="mdi:view-column-outline"></iswc-icon>Ir a proyectos</iswc-button>
      </av-cabecera>
      ${r.error?i`<iswc-callout tone="danger"><strong slot="title">No se pudo cargar el panel</strong>${r.error}</iswc-callout>`:null}
      ${s?i`
        <av-kpis id="kpis"></av-kpis>
        <div class="rejilla" part="rejilla">
          <av-tareas-grafica id="tareas"></av-tareas-grafica>
          <av-embudo-grafica id="embudo"></av-embudo-grafica>
          <av-notificaciones id="notificaciones"></av-notificaciones>
        </div>
      `:i`<av-vacio id="sin-empresa"><iswc-button color="brand" oniswc-click=${()=>p("organizacion")}>Ir a organización</iswc-button></av-vacio>`}
    </div>
  `);const f=c.yo?.empresas.find(e=>e.iempresa===s)?.nombre??"Avatar";a.querySelector("#cabecera").props={titulo:"Panel",subtitulo:`${f} \xB7 hola, ${c.yo?.nombre??c.yo?.iusuario??""}`,icono:"mdi:view-dashboard-outline"};const m=a.querySelector("#sin-empresa");m&&(m.props={icono:"mdi:domain",titulo:"A\xFAn no perteneces a una empresa",texto:"Pide a un gestor que te invite, o crea la tuya si tienes permiso."}),s&&(a.querySelector("#kpis").props={resumen:r.resumen},a.querySelector("#tareas").props={tareas:r.resumen?.tareas??null},a.querySelector("#embudo").props={clientes:r.resumen?.clientes??null},l(),!r.resumen&&(async()=>{try{const e=g.safeParse(await t().resumen(s));if(!e.success)throw new Error("Resumen con forma inesperada");n.props={resumen:e.data,error:""}}catch(e){n.props={error:P(e)}}})())});b("av-panel",$);
