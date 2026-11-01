import{crearComponente as k,define as L,html as l}from"../../base/componente.js?v=m5nu5c";import{cargarPerfil as I,cerrarSesion as m,conectar as M,iniciarSesion as R,mensajeDe as f}from"../../core/api.js?v=4m3ots";import{conectarBuscador as j}from"../../core/buscador.js?v=tqll33";import{alCambiar as H,empresaActiva as O,estado as p,fijar as x,haySesion as v}from"../../core/estado.js?v=w7n12d";import{ACCION as N,puede as V,rolDe as z}from"../../core/permisos.js?v=h0y97j";import{actualizarMetas as D,activarSpa as U,destinoTrasAcceso as G,escuchar as _,ir as d,precargar as B,recordarDestino as g,reemplazar as w,resolver as b,rutaActual as y,VISTA_SESION as X,VISTAS_PRIVADAS as h}from"../../core/router.js?v=tec89c";import{MODULOS as W}from"../../consts/comandos.js?v=of1zgp";import{COLUMNAS_PIE as F}from"../../consts/paginas.js?v=18o4x7";import{VIEW_TAGS as J}from"../../kit-tags.js?v=fywpcq";import"./av-boton-enlace.js?v=1vb2tf";import"./av-link.js?v=jh7k06";import"./av-menu-lateral.js?v=dfon5r";import"./av-migas.js?v=scckqx";import"./av-outlet.js?v=2crjad";import"./av-pestanas.js?v=7y8787";import"./av-perfil-selector.js?v=c9m42n";import"./av-perfiles-lista.js?v=1exu44";import"./av-perfiles-tabla.js?v=qpmgkg";const K="(max-width: 47.5em)",S=e=>!e&&y().vista==="acceso";function E(e){e.querySelector("iswc-doc-layout")?.shadowRoot?.querySelector(".scrim")?.click()}function Q(e){const t=e.querySelector("iswc-doc-layout"),a=e.querySelector(".acciones-cajon"),o=[...e.querySelectorAll(".en-cajon")],s=matchMedia(K),r=()=>{if(!t.isConnected)return s.removeEventListener("change",r);const i=t.querySelector('[slot="actions"]:last-of-type');for(const c of o)s.matches?(c.removeAttribute("slot"),a.append(c)):(c.setAttribute("slot","actions"),t.insertBefore(c,i))};s.addEventListener("change",r),r();let n=0;const u=e.querySelector(".lateral");u.addEventListener("touchstart",i=>n=i.touches[0]?.clientX??0,{passive:!0}),u.addEventListener("touchend",i=>{n-(i.changedTouches[0]?.clientX??n)>60&&E(e)},{passive:!0})}let C=!1;function P(e){const t=new Set(Object.keys(J));return W.filter(a=>t.has(a.id)&&(a.id!=="admin"||e))}const Y=B;function Z(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function ee(e){const t=globalThis,a=s=>t.requestIdleCallback?t.requestIdleCallback(s,{timeout:4e3}):setTimeout(s,600),o=()=>{const s=e.shift();s&&Y(s).then(()=>a(o))};a(o)}function A(){return{opciones:(p.yo?.empresas??[]).map(t=>({id:t.iempresa,nombre:t.nombre})),activa:O(),etiqueta:"Empresa activa",sinOpciones:"Sin empresa"}}function te(e){return l`
    <footer class="pie" part="pie" slot=${e}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${F.map(t=>l`
        <nav class="pie-col" aria-label=${t.titulo}>
          <strong class="pie-titulo">${t.titulo}</strong>
          ${t.enlaces.map(a=>a.vista?l`<av-link vista=${a.vista}>${a.titulo}</av-link>`:l`<a href=${new URL(a.ruta,q()).href}>${a.titulo}</a>`)}
        </nav>`)}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <iswc-button class="pie-accion" variant="text compact" color="text" onclick=${se}>Perfiles de prueba</iswc-button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${oe}></av-perfiles-tabla>
  `}const ae=e=>e.currentTarget.getRootNode().querySelector("#perfiles-tabla");function se(e){ae(e).props={abierto:!0}}function oe(e){e.currentTarget.props={abierto:!1}}async function ie(e,t){if(e==="tema"){t.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const a=t.querySelector("iswc-palette-selector");a?.scrollIntoView({behavior:"smooth",block:"center"}),a?.focus();return}e==="salir"&&(await m(),d("inicio"))}const q=()=>new URL("./",document.baseURI).href;function $(e){return l`
    <iswc-session-menu slot="actions" ?hidden=${S(e)} ?logged=${e} name=${p.yo?.nombre??p.yo?.iusuario??""} subtitle=${z(p.perfil)} label="Entrar"
      oniswc-login-submit=${async t=>{const a=t.currentTarget,{username:o,password:s}=t.detail;a.loading=!0;try{await R(o,s),a.reset();const r=G();d(r.vista,r.id)}catch(r){a.error=f(r)}finally{a.loading=!1}}}
      oniswc-logout=${async()=>{await m(),d("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>d("asistente")}>Preguntar a AVO</iswc-dropdown-item>
      ${e?l`<div slot="extra" class="menu-cuenta">
            <iswc-tenant-selector></iswc-tenant-selector>
            <av-perfil-selector id="perfil"></av-perfil-selector>
            <span class="menu-tema">
              <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
              <iswc-theme-toggle scope="root"></iswc-theme-toggle>
            </span>
          </div>`:l`<av-perfiles-lista slot="extra" modo="select"></av-perfiles-lista>`}
    </iswc-session-menu>
  `}const re=k(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,t,a)=>{const o=a;if(!t.listo){e.append(l`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{M();try{await I()}catch(T){console.warn("[av-app] sesi\xF3n no restaurada:",f(T))}const i=y(),c=b(i,v());c.vista!==i.vista&&(g(i),w(c.vista)),D(c.vista,c.id),o.props={listo:!0,vista:c.vista,id:c.id},document.documentElement.setAttribute("data-app-ready","")})();return}const s=v();if(C=s,ee(Z(s).filter(i=>i!==t.vista)),!(s&&h.includes(t.vista))){e.append(l`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${q()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${s?l`<iswc-button slot="actions" variant="outlined compact" color="brand" oniswc-click=${()=>d(X)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${$(s)}
          <av-outlet class="vista" part="vista" role="main"></av-outlet>
          ${te("footer")}
        </iswc-app-shell>
      `),e.querySelector("#perfil").props={activo:p.yo?.iusuario??""},e.querySelector(".vista").props={vista:t.vista,id:t.id,sesion:s,version:t.version};return}const n=V(p.perfil,N.seguridad,"PUT");e.append(l`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <av-link slot="brand" class="marca" vista="inicio" aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></av-link>
        <iswc-semantic-search class="en-cajon" slot="actions"></iswc-semantic-search>
        ${$(!0)}
        <div slot="start" class="lateral">
          <div class="acciones-cajon"></div>
          <av-menu-lateral id="indice"></av-menu-lateral>
        </div>
        <av-migas></av-migas>
        <av-outlet class="vista" part="vista" role="main"></av-outlet>
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `),e.querySelector("#indice").props={items:P(n)},j(e.querySelector("iswc-semantic-search"),P(n).map(i=>i.id),i=>{ie(i,e)}),e.querySelector("#perfil").props={activo:p.yo?.iusuario??""};const u=e.querySelector("iswc-tenant-selector");u.addEventListener("iswc-tenant-change",i=>x({empresa:Number(i.detail.id)})),u.props=A(),e.querySelector(".vista").props={vista:t.vista,id:t.id,sesion:!0,version:t.version},Q(e)},(e,t,a)=>{const o=v();if(!t.listo||!a.listo||o!==C)return!1;const s=n=>o&&h.includes(n);if(s(t.vista)!==s(a.vista))return!1;const r=e.querySelector(".vista");if(!r)return!1;if(r.props={vista:t.vista,id:t.id,sesion:o,version:t.version},t.vista!==a.vista&&(e.querySelector("iswc-session-menu")?.toggleAttribute("hidden",S(o)),E(e),r.scrollTop=0,scrollTo(0,0)),t.version!==a.version){const n=e.querySelector("iswc-tenant-selector");n&&(n.props=A())}return!0});if(L("av-app",re),typeof document<"u"){const e=()=>document.querySelector("av-app");e()&&U(),_(t=>{const a=e();if(!a?.props.listo)return;const o=b(t,v());o.vista!==t.vista&&(g(t),w(o.vista)),a.props={vista:o.vista,id:o.id}}),addEventListener("av-ruta",t=>{const a=e();t.detail.intencion&&a?.props.listo&&(a.props={version:Number(a.props.version??0)+1})}),H("empresa",()=>{const t=e();t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})})}export{Y as cargarVista,P as modulos,Z as vistasProbables};
