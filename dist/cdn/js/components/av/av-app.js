import{crearComponente as I,define as H,html as n}from"../../base/componente.js?v=ykdqqm";import{cargarPerfil as j,cerrarSesion as w,conectar as x,iniciarSesion as O,mensajeDe as g}from"../../core/api.js?v=3l9tpn";import{conectarBuscador as N}from"../../core/buscador.js?v=ecs2rz";import{alCambiar as V,empresaActiva as z,estado as u,fijar as D,haySesion as v}from"../../core/estado.js?v=w7n12d";import{ACCION as U,puede as G,rolDe as B}from"../../core/permisos.js?v=h0y97j";import{actualizarMetas as _,activarSpa as X,destinoTrasAcceso as W,escuchar as F,ir as f,precargar as J,recordarDestino as b,reemplazar as y,resolver as h,rutaActual as S,VISTA_SESION as K,VISTAS_PRIVADAS as E}from"../../core/router.js?v=l01npq";import{MODULOS as Q}from"../../consts/comandos.js?v=of1zgp";import{columnasPie as Y}from"../../consts/paginas.js?v=a58rp0";import{VIEW_TAGS as Z}from"../../kit-tags.js?v=otr7cp";import"./av-boton-enlace.js?v=pj0kwl";import"./av-campana.js?v=l9thsy";import"./av-link.js?v=14go8g";import"./av-menu-lateral.js?v=qsrly9";import"./av-migas.js?v=bgjb4f";import"./av-outlet.js?v=9haghn";import"./av-pestanas.js?v=ruf2qp";import"./av-perfil-selector.js?v=w3ti0l";import"./av-perfiles-lista.js?v=k59qph";import"./av-perfiles-tabla.js?v=8sttpv";const ee="(max-width: 47.5em)",$=e=>!e&&S().vista==="acceso";function C(e){e.querySelector("iswc-doc-layout")?.shadowRoot?.querySelector(".scrim")?.click()}function ae(e){const a=e.querySelector("iswc-doc-layout"),t=e.querySelector(".acciones-cajon"),o=[...e.querySelectorAll(".en-cajon")],s=matchMedia(ee),i=()=>{if(!a.isConnected)return s.removeEventListener("change",i);const c=a.querySelector('[slot="actions"]:last-of-type');for(const p of o)s.matches?(p.removeAttribute("slot"),t.append(p)):(p.setAttribute("slot","actions"),a.insertBefore(p,c))};s.addEventListener("change",i),i();let l=0;const m=e.querySelector(".lateral");m.addEventListener("touchstart",c=>l=c.touches[0]?.clientX??0,{passive:!0}),m.addEventListener("touchend",c=>{l-(c.changedTouches[0]?.clientX??l)>60&&C(e)},{passive:!0})}let P=!1;function q(e){const a=new Set(Object.keys(Z));return Q.filter(t=>a.has(t.id)&&(t.id!=="admin"||e))}const te=J;function se(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function oe(e){const a=globalThis,t=s=>a.requestIdleCallback?a.requestIdleCallback(s,{timeout:4e3}):setTimeout(s,600),o=()=>{const s=e.shift();s&&te(s).then(()=>t(o))};t(o)}function T(){return{opciones:(u.yo?.empresas??[]).map(a=>({id:a.iempresa,nombre:a.nombre})),activa:z(),etiqueta:"Empresa activa",sinOpciones:"Sin empresa"}}function A(e){return Y(e).map(a=>n`
    <nav class=${a.enlaces.length>8?"pie-col pie-col-larga":"pie-col"} aria-label=${a.titulo}>
      <strong class="pie-titulo">${a.titulo}</strong>
      ${a.enlaces.map(t=>t.vista?n`<av-link vista=${t.vista} registro=${t.id??""}>${t.titulo}</av-link>`:n`<a href=${new URL(t.ruta,k()).href}>${t.titulo}</a>`)}
    </nav>`)}function ie(e){e.querySelector("#mapa").open=!0}function L(e){return n`
    <footer class="pie" part="pie" slot=${e}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${A(v())}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <iswc-button class="pie-accion" variant="text compact" color="text" onclick=${ne}>Perfiles de prueba</iswc-button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${le}></av-perfiles-tabla>
  `}const re=e=>e.currentTarget.getRootNode().querySelector("#perfiles-tabla");function ne(e){re(e).props={abierto:!0}}function le(e){e.currentTarget.props={abierto:!1}}async function ce(e,a){if(e==="tema"){a.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const t=a.querySelector("iswc-palette-selector");t?.scrollIntoView({behavior:"smooth",block:"center"}),t?.focus();return}e==="salir"&&(await w(),f("inicio"))}const k=()=>new URL("./",document.baseURI).href;function M(e){return n`
    <iswc-session-menu slot="actions" extra-label="Entrar como…" ?hidden=${$(e)} ?logged=${e} name=${u.yo?.nombre??u.yo?.iusuario??""} subtitle=${B(u.perfil)} label="Entrar"
      oniswc-login-submit=${async a=>{const t=a.currentTarget,{username:o,password:s}=a.detail;t.loading=!0;try{await O(o,s),t.reset();const i=W();f(i.vista,i.id)}catch(i){t.error=g(i)}finally{t.loading=!1}}}
      oniswc-logout=${async()=>{await w(),f("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>f("asistente")}>Preguntar a AVO</iswc-dropdown-item>
      ${e?n`<iswc-dropdown-item value="mapa" oniswc-click=${a=>ie(a.currentTarget.getRootNode())}>Mapa del sitio</iswc-dropdown-item>`:null}
      ${e?n`<div slot="extra" class="menu-cuenta">
            <iswc-tenant-selector></iswc-tenant-selector>
            <av-perfil-selector id="perfil"></av-perfil-selector>
            <span class="menu-tema">
              <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
              <iswc-theme-toggle scope="root"></iswc-theme-toggle>
            </span>
          </div>`:n`<av-perfiles-lista slot="extra" modo="select"></av-perfiles-lista>`}
    </iswc-session-menu>
  `}const pe=I(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,a,t)=>{const o=t;if(!a.listo){e.append(n`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{x();try{await j()}catch(R){console.warn("[av-app] sesi\xF3n no restaurada:",g(R))}const r=S(),d=h(r,v());d.vista!==r.vista&&(b(r),y(d.vista)),_(d.vista,d.id),o.props={listo:!0,vista:d.vista,id:d.id},document.documentElement.setAttribute("data-app-ready","")})();return}const s=v();if(P=s,oe(se(s).filter(r=>r!==a.vista)),!(s&&E.includes(a.vista))){e.append(n`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${k()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${s?n`<iswc-button slot="actions" variant="outlined compact" color="brand" oniswc-click=${()=>f(K)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          <av-campana slot="actions"></av-campana>
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${M(s)}
          <av-outlet class="vista" part="vista" role="main"></av-outlet>
          ${L("footer")}
        </iswc-app-shell>
      `),e.querySelector("#perfil").props={activo:u.yo?.iusuario??""},e.querySelector(".vista").props={vista:a.vista,id:a.id,sesion:s,version:a.version};return}const l=G(u.perfil,U.seguridad,"PUT");e.append(n`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-rail start-width="260">
        <av-link slot="brand" class="marca" vista="inicio" aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></av-link>
        <iswc-semantic-search class="en-cajon" slot="actions"></iswc-semantic-search>
        <av-campana slot="actions"></av-campana>
        ${M(!0)}
        <div slot="start" class="lateral">
          <div class="acciones-cajon"></div>
          <av-menu-lateral id="indice"></av-menu-lateral>
        </div>
        <av-migas></av-migas>
        <av-outlet class="vista" part="vista" role="main">${L("pie")}</av-outlet>
      </iswc-doc-layout>
      <iswc-dialog id="mapa" label="Mapa del sitio" backdrop-variant="basic"><div class="pie-mapa">${A(!0)}</div></iswc-dialog>
      <iswc-toast placement="top-end"></iswc-toast>
    `);const m=e.querySelector("#indice"),c=e.querySelector("iswc-doc-layout");m.props={items:q(l),compacto:c.rail===!0},c.addEventListener("iswc-doc-layout-rail",r=>m.props={compacto:r.detail.rail}),N(e.querySelector("iswc-semantic-search"),q(l).map(r=>r.id),r=>{ce(r,e)}),e.querySelector("#perfil").props={activo:u.yo?.iusuario??""};const p=e.querySelector("iswc-tenant-selector");p.addEventListener("iswc-tenant-change",r=>D({empresa:Number(r.detail.id)})),p.props=T(),e.querySelector(".vista").props={vista:a.vista,id:a.id,sesion:!0,version:a.version},ae(e)},(e,a,t)=>{const o=v();if(!a.listo||!t.listo||o!==P)return!1;const s=l=>o&&E.includes(l);if(s(a.vista)!==s(t.vista))return!1;const i=e.querySelector(".vista");if(!i)return!1;if(i.props={vista:a.vista,id:a.id,sesion:o,version:a.version},a.vista!==t.vista&&(e.querySelector("iswc-session-menu")?.toggleAttribute("hidden",$(o)),C(e),i.scrollTop=0,scrollTo(0,0)),a.version!==t.version){const l=e.querySelector("iswc-tenant-selector");l&&(l.props=T())}return!0});if(H("av-app",pe),typeof document<"u"){const e=()=>document.querySelector("av-app");e()&&X(),F(a=>{const t=e();if(!t?.props.listo)return;const o=h(a,v());o.vista!==a.vista&&(b(a),y(o.vista)),t.props={vista:o.vista,id:o.id}}),addEventListener("av-ruta",a=>{const t=e();a.detail.intencion&&t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})}),V("empresa",()=>{const a=e();a?.props.listo&&(a.props={version:Number(a.props.version??0)+1})})}export{te as cargarVista,q as modulos,se as vistasProbables};
