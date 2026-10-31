import{crearComponente as k,define as $,html as l}from"../../base/componente.js?v=ehrr8d";import{cargarPerfil as I,cerrarSesion as b,conectar as T,iniciarSesion as q,mensajeDe as h}from"../../core/api.js?v=il5qcm";import{alCambiar as M,empresaActiva as y,estado as d,haySesion as v}from"../../core/estado.js?v=w7n12d";import{ACCION as R,puede as D,rolDe as V}from"../../core/permisos.js?v=h0y97j";import{destinoTrasAcceso as x,escuchar as O,ir as c,recordarDestino as H,resolver as N,rutaActual as j,VISTA_SESION as z,VISTAS_PRIVADAS as G}from"../../core/router.js?v=a7apgx";import{MODULOS as U}from"../../consts/comandos.js?v=of1zgp";import{PAGINAS as _}from"../../consts/paginas.js?v=d9udvp";import{tagsDeVista as B,VIEW_TAGS as F}from"../../kit-tags.js?v=1m5k1c";import"./av-empresa-selector.js?v=tvhd5v";const g=Object.fromEntries(_.map(e=>[e.vista,e.shell]));function E(e){const s=new Set(Object.keys(F));return U.filter(t=>s.has(t.id)&&(t.id!=="admin"||e))}const u=new Map;function S(e){const s=globalThis.iswcLoader,t=B(e);return!s||!t.length?Promise.resolve():(u.has(e)||u.set(e,s.load(...t).catch(a=>{u.delete(e),console.warn(`[av-app] vista ${e}:`,a)})),u.get(e))}function W(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function J(e){const s=globalThis,t=o=>s.requestIdleCallback?s.requestIdleCallback(o,{timeout:4e3}):setTimeout(o,600),a=()=>{const o=e.shift();o&&S(o).then(()=>t(a))};t(a)}function f(e,s,t){const a=g[e]??g.inicio;S(e);const o=document.createElement(a);e==="inicio"||!g[e]?o.props={sesion:t}:s!=null&&(o.props={id:s});const n=document.createDocumentFragment();if(n.append(o),!customElements.get(a)){const r=document.createElement("av-vacio");r.props={estado:"cargando"},r.classList.add("esqueleto"),n.append(r),customElements.whenDefined(a).then(()=>r.remove())}return n}function C(e){return l`
    <footer class="pie" part="pie" slot=${e}>
      <span class="pie-marca"><av-logo wordmark></av-logo></span>
      <span class="pie-lema">Gestión digital y automatización · Odys</span>
      <span class="pie-tema">
        <span class="pie-rotulo">Paleta</span>
        <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
        <iswc-theme-toggle scope="root"></iswc-theme-toggle>
      </span>
    </footer>
  `}async function K(e,s){if(e==="tema"){s.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const t=s.querySelector("iswc-palette-selector");t?.scrollIntoView({behavior:"smooth",block:"center"}),t?.focus();return}e==="salir"&&(await b(),c("inicio"))}const A=()=>new URL("./",document.baseURI).href;function P(e){return l`
    <iswc-session-menu slot="actions" ?logged=${e} name=${d.yo?.nombre??d.yo?.iusuario??""} subtitle=${V(d.perfil)} label="Entrar" heading="Entrar a Avatar"
      oniswc-login-submit=${async s=>{const t=s.currentTarget,{username:a,password:o}=s.detail;t.loading=!0;try{await q(a,o),t.reset();const n=x();c(n.vista,n.id)}catch(n){t.error=h(n)}finally{t.loading=!1}}}
      oniswc-logout=${async()=>{await b(),c("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>c("asistente")}>Preguntar a AVO</iswc-dropdown-item>
    </iswc-session-menu>
  `}const Q=k(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,s,t)=>{const a=t;if(!s.listo){e.append(l`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{T();try{await I()}catch(L){console.warn("[av-app] sesi\xF3n no restaurada:",h(L))}const i=j(),p=N(i,v());if(p.vista!==i.vista){H(i),c(p.vista,p.id);return}a.props={listo:!0,vista:p.vista,id:p.id},document.documentElement.setAttribute("data-app-ready","")})();return}const o=v();if(J(W(o).filter(i=>i!==s.vista)),!(o&&G.includes(s.vista))){e.append(l`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${A()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${o?l`<iswc-button slot="actions" variant="outlined" color="brand" oniswc-click=${()=>c(z)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          ${P(o)}
          <iswc-theme-toggle slot="actions" scope="root"></iswc-theme-toggle>
          <main class="vista" part="vista">${f(s.vista,s.id,o)}</main>
          ${C("footer")}
        </iswc-app-shell>
      `);return}const r=D(d.perfil,R.seguridad,"PUT");e.append(l`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <a slot="brand" class="marca" href=${A()} aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></a>
        <av-buscador slot="actions"></av-buscador>
        <av-empresa-selector slot="actions"></av-empresa-selector>
        ${P(!0)}
        <iswc-theme-toggle slot="actions" scope="root"></iswc-theme-toggle>
        <iswc-doc-index slot="start" id="indice" placeholder="Buscar módulo…"
          oniswc-doc-index-select=${i=>c(i.detail.id)}></iswc-doc-index>
        <main class="vista" part="vista">${f(s.vista,s.id,!0)}</main>
        ${C(null)}
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `);const m=e.querySelector("#indice");m.textos={placeholder:"Buscar m\xF3dulo\u2026",sinResultados:"Ning\xFAn m\xF3dulo coincide.",resumen:""},m.items=E(r);const w=e.querySelector("av-buscador");w.props={permitidos:E(r).map(i=>i.id)},w.addEventListener("av-buscador-global",i=>{K(i.detail.accion,e)}),m.current=s.vista,e.querySelector("av-empresa-selector").props={empresas:d.yo?.empresas??[],activa:y()}},(e,s,t)=>{if(!s.listo||!t.listo||s.vista!==t.vista||!v())return!1;const a=e.querySelector(".vista");if(!a)return!1;if(s.version!==t.version){a.replaceChildren(f(s.vista,s.id,!0));const n=e.querySelector("av-empresa-selector");return n&&(n.props={empresas:d.yo?.empresas??[],activa:y()}),e.querySelector("iswc-doc-layout")?.scrollContentTo?.(0),!0}const o=a.firstElementChild;return o?(o.props={id:s.id},!0):!1});if($("av-app",Q),typeof document<"u"){const e=()=>document.querySelector("av-app");O(s=>{const t=e();t&&s.vista===t.props.vista&&(t.props={id:s.id})}),addEventListener("av-ruta",s=>{const t=e();s.detail.intencion&&t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})}),M("empresa",()=>{const s=e();s?.props.listo&&(s.props={version:Number(s.props.version??0)+1})})}export{S as cargarVista,E as modulos,W as vistasProbables};
