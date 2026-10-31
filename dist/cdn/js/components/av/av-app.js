import{crearComponente as $,define as k,html as c}from"../../base/componente.js?v=17uldv";import{cargarPerfil as I,cerrarSesion as h,conectar as T,iniciarSesion as q,mensajeDe as y}from"../../core/api.js?v=il5qcm";import{alCambiar as R,empresaActiva as E,estado as d,haySesion as v}from"../../core/estado.js?v=w7n12d";import{ACCION as M,puede as D,rolDe as V}from"../../core/permisos.js?v=h0y97j";import{destinoTrasAcceso as x,escuchar as O,ir as l,recordarDestino as H,resolver as N,rutaActual as U,VISTA_SESION as j,VISTAS_PRIVADAS as z}from"../../core/router.js?v=9ifirh";import{MODULOS as G}from"../../consts/comandos.js?v=of1zgp";import{ENLACES_PIE as _}from"../../consts/paginas.js?v=ddfkig";import{PAGINAS as B}from"../../consts/paginas.js?v=ddfkig";import{tagsDeVista as F,VIEW_TAGS as W}from"../../kit-tags.js?v=45qevx";import"./av-empresa-selector.js?v=p8z8bk";const g=Object.fromEntries(B.map(e=>[e.vista,e.shell]));function S(e){const s=new Set(Object.keys(W));return G.filter(t=>s.has(t.id)&&(t.id!=="admin"||e))}const u=new Map;function C(e){const s=globalThis.iswcLoader,t=F(e);return!s||!t.length?Promise.resolve():(u.has(e)||u.set(e,s.load(...t).catch(a=>{u.delete(e),console.warn(`[av-app] vista ${e}:`,a)})),u.get(e))}function J(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function K(e){const s=globalThis,t=o=>s.requestIdleCallback?s.requestIdleCallback(o,{timeout:4e3}):setTimeout(o,600),a=()=>{const o=e.shift();o&&C(o).then(()=>t(a))};t(a)}function f(e,s,t){const a=g[e]??g.inicio;C(e);const o=document.createElement(a);e==="inicio"||!g[e]?o.props={sesion:t}:s!=null&&(o.props={id:s});const n=document.createDocumentFragment();if(n.append(o),!customElements.get(a)){const r=document.createElement("av-vacio");r.props={estado:"cargando"},r.classList.add("esqueleto"),n.append(r),customElements.whenDefined(a).then(()=>r.remove())}return n}function A(e){return c`
    <footer class="pie" part="pie" slot=${e}>
      <span class="pie-marca"><av-logo wordmark></av-logo></span>
      <span class="pie-lema">Gestión digital y automatización · Odys</span>
      <nav class="pie-enlaces" part="pie-enlaces" aria-label="Enlaces del sitio">
        ${_.map(s=>c`<a href=${new URL(s.ruta,w()).href}>${s.titulo}</a>`)}
      </nav>
      <span class="pie-tema">
        <span class="pie-rotulo">Paleta</span>
        <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
        <iswc-theme-toggle scope="root"></iswc-theme-toggle>
      </span>
    </footer>
  `}async function Q(e,s){if(e==="tema"){s.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const t=s.querySelector("iswc-palette-selector");t?.scrollIntoView({behavior:"smooth",block:"center"}),t?.focus();return}e==="salir"&&(await h(),l("inicio"))}const w=()=>new URL("./",document.baseURI).href;function P(e){return c`
    <iswc-session-menu slot="actions" ?logged=${e} name=${d.yo?.nombre??d.yo?.iusuario??""} subtitle=${V(d.perfil)} label="Entrar" heading="Entrar a Avatar"
      oniswc-login-submit=${async s=>{const t=s.currentTarget,{username:a,password:o}=s.detail;t.loading=!0;try{await q(a,o),t.reset();const n=x();l(n.vista,n.id)}catch(n){t.error=y(n)}finally{t.loading=!1}}}
      oniswc-logout=${async()=>{await h(),l("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>l("asistente")}>Preguntar a AVO</iswc-dropdown-item>
    </iswc-session-menu>
  `}const X=$(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,s,t)=>{const a=t;if(!s.listo){e.append(c`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{T();try{await I()}catch(L){console.warn("[av-app] sesi\xF3n no restaurada:",y(L))}const i=U(),p=N(i,v());if(p.vista!==i.vista){H(i),l(p.vista,p.id);return}a.props={listo:!0,vista:p.vista,id:p.id},document.documentElement.setAttribute("data-app-ready","")})();return}const o=v();if(K(J(o).filter(i=>i!==s.vista)),!(o&&z.includes(s.vista))){e.append(c`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${w()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${o?c`<iswc-button slot="actions" variant="outlined" color="brand" oniswc-click=${()=>l(j)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          ${P(o)}
          <iswc-theme-toggle slot="actions" scope="root"></iswc-theme-toggle>
          <main class="vista" part="vista">${f(s.vista,s.id,o)}</main>
          ${A("footer")}
        </iswc-app-shell>
      `);return}const r=D(d.perfil,M.seguridad,"PUT");e.append(c`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <a slot="brand" class="marca" href=${w()} aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></a>
        <av-buscador slot="actions"></av-buscador>
        <av-empresa-selector slot="actions"></av-empresa-selector>
        ${P(!0)}
        <iswc-theme-toggle slot="actions" scope="root"></iswc-theme-toggle>
        <iswc-doc-index slot="start" id="indice" placeholder="Buscar módulo…"
          oniswc-doc-index-select=${i=>l(i.detail.id)}></iswc-doc-index>
        <main class="vista" part="vista">${f(s.vista,s.id,!0)}</main>
        ${A(null)}
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `);const m=e.querySelector("#indice");m.textos={placeholder:"Buscar m\xF3dulo\u2026",sinResultados:"Ning\xFAn m\xF3dulo coincide.",resumen:""},m.items=S(r);const b=e.querySelector("av-buscador");b.props={permitidos:S(r).map(i=>i.id)},b.addEventListener("av-buscador-global",i=>{Q(i.detail.accion,e)}),m.current=s.vista,e.querySelector("av-empresa-selector").props={empresas:d.yo?.empresas??[],activa:E()}},(e,s,t)=>{if(!s.listo||!t.listo||s.vista!==t.vista||!v())return!1;const a=e.querySelector(".vista");if(!a)return!1;if(s.version!==t.version){a.replaceChildren(f(s.vista,s.id,!0));const n=e.querySelector("av-empresa-selector");return n&&(n.props={empresas:d.yo?.empresas??[],activa:E()}),e.querySelector("iswc-doc-layout")?.scrollContentTo?.(0),!0}const o=a.firstElementChild;return o?(o.props={id:s.id},!0):!1});if(k("av-app",X),typeof document<"u"){const e=()=>document.querySelector("av-app");O(s=>{const t=e();t&&s.vista===t.props.vista&&(t.props={id:s.id})}),addEventListener("av-ruta",s=>{const t=e();s.detail.intencion&&t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})}),R("empresa",()=>{const s=e();s?.props.listo&&(s.props={version:Number(s.props.version??0)+1})})}export{C as cargarVista,S as modulos,J as vistasProbables};
