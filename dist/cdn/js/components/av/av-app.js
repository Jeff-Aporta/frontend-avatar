import{avisar as L,crearComponente as T,define as k,html as n}from"../../base/componente.js?v=333q2n";import{cargarPerfil as q,cerrarSesion as h,conectar as I,iniciarSesion as R,mensajeDe as v,perfilesPrueba as M}from"../../core/api.js?v=3rnmgi";import{alCambiar as D,empresaActiva as E,estado as l,haySesion as f}from"../../core/estado.js?v=w7n12d";import{ACCION as N,puede as O,rolDe as V}from"../../core/permisos.js?v=h0y97j";import{destinoTrasAcceso as x,escuchar as H,ir as p,recordarDestino as U,resolver as j,rutaActual as z,VISTA_SESION as G,VISTAS_PRIVADAS as _}from"../../core/router.js?v=11mqc0";import{MODULOS as B}from"../../consts/comandos.js?v=of1zgp";import{COLUMNAS_PIE as F}from"../../consts/paginas.js?v=y2esoy";import{PAGINAS as W}from"../../consts/paginas.js?v=y2esoy";import{tagsDeVista as J,VIEW_TAGS as K}from"../../kit-tags.js?v=zaiflf";import"./av-empresa-selector.js?v=lza3lg";import"./av-perfil-selector.js?v=77x3e3";import"./av-perfiles-tabla.js?v=04na0t";const g=Object.fromEntries(W.map(e=>[e.vista,e.shell]));function S(e){const t=new Set(Object.keys(K));return B.filter(s=>t.has(s.id)&&(s.id!=="admin"||e))}const u=new Map;function C(e){const t=globalThis.iswcLoader,s=J(e);return!t||!s.length?Promise.resolve():(u.has(e)||u.set(e,t.load(...s).catch(a=>{u.delete(e),console.warn(`[av-app] vista ${e}:`,a)})),u.get(e))}function Q(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function X(e){const t=globalThis,s=o=>t.requestIdleCallback?t.requestIdleCallback(o,{timeout:4e3}):setTimeout(o,600),a=()=>{const o=e.shift();o&&C(o).then(()=>s(a))};s(a)}function b(e,t,s){const a=g[e]??g.inicio;C(e);const o=document.createElement(a);e==="inicio"||!g[e]?o.props={sesion:s}:t!=null&&(o.props={id:t});const r=document.createDocumentFragment();if(r.append(o),!customElements.get(a)){const c=document.createElement("av-vacio");c.props={estado:"cargando"},c.classList.add("esqueleto"),r.append(c),customElements.whenDefined(a).then(()=>c.remove())}return r}function P(e){return n`
    <footer class="pie" part="pie" slot=${e}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${F.map(t=>n`
        <nav class="pie-col" aria-label=${t.titulo}>
          <strong class="pie-titulo">${t.titulo}</strong>
          ${t.enlaces.map(s=>n`<a href=${new URL(s.ruta,w()).href}>${s.titulo}</a>`)}
        </nav>`)}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <button class="pie-accion" type="button" onclick=${Z}>Perfiles de prueba</button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${ee} onav-perfil-usar=${te}></av-perfiles-tabla>
  `}const Y=e=>e.currentTarget.getRootNode().querySelector("#perfiles-tabla");async function Z(e){const t=Y(e);t.props={abierto:!0};try{t.props={perfiles:await M()}}catch(s){L(v(s),"danger")}}function ee(e){e.currentTarget.props={abierto:!1}}function te(e){const t=e.currentTarget;t.props={abierto:!1},t.getRootNode().querySelector("av-perfil-selector")?.dispatchEvent(new CustomEvent("av-perfil-pedir",{detail:e.detail}))}async function se(e,t){if(e==="tema"){t.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const s=t.querySelector("iswc-palette-selector");s?.scrollIntoView({behavior:"smooth",block:"center"}),s?.focus();return}e==="salir"&&(await h(),p("inicio"))}const w=()=>new URL("./",document.baseURI).href;function $(e){return n`
    <iswc-session-menu slot="actions" ?logged=${e} name=${l.yo?.nombre??l.yo?.iusuario??""} subtitle=${V(l.perfil)} label="Entrar" heading="Entrar a Avatar"
      oniswc-login-submit=${async t=>{const s=t.currentTarget,{username:a,password:o}=t.detail;s.loading=!0;try{await R(a,o),s.reset();const r=x();p(r.vista,r.id)}catch(r){s.error=v(r)}finally{s.loading=!1}}}
      oniswc-logout=${async()=>{await h(),p("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>p("asistente")}>Preguntar a AVO</iswc-dropdown-item>
    </iswc-session-menu>
  `}const oe=T(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,t,s)=>{const a=s;if(!t.listo){e.append(n`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{I();try{await q()}catch(A){console.warn("[av-app] sesi\xF3n no restaurada:",v(A))}const i=z(),d=j(i,f());if(d.vista!==i.vista){U(i),p(d.vista,d.id);return}a.props={listo:!0,vista:d.vista,id:d.id},document.documentElement.setAttribute("data-app-ready","")})();return}const o=f();if(X(Q(o).filter(i=>i!==t.vista)),!(o&&_.includes(t.vista))){e.append(n`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${w()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${o?n`<iswc-button slot="actions" variant="outlined" color="brand" oniswc-click=${()=>p(G)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${$(o)}
          <main class="vista" part="vista">${b(t.vista,t.id,o)}</main>
          ${P("footer")}
        </iswc-app-shell>
      `),e.querySelector("#perfil").props={activo:l.yo?.iusuario??""};return}const c=O(l.perfil,N.seguridad,"PUT");e.append(n`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <a slot="brand" class="marca" href=${w()} aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></a>
        <av-buscador slot="actions"></av-buscador>
        <av-empresa-selector slot="actions"></av-empresa-selector>
        <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
        ${$(!0)}
        <iswc-doc-index slot="start" id="indice" placeholder="Buscar módulo…"
          oniswc-doc-index-select=${i=>p(i.detail.id)}></iswc-doc-index>
        <main class="vista" part="vista">${b(t.vista,t.id,!0)}</main>
        ${P(null)}
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `);const m=e.querySelector("#indice");m.textos={placeholder:"Buscar m\xF3dulo\u2026",sinResultados:"Ning\xFAn m\xF3dulo coincide.",resumen:""},m.items=S(c);const y=e.querySelector("av-buscador");y.props={permitidos:S(c).map(i=>i.id)},y.addEventListener("av-buscador-global",i=>{se(i.detail.accion,e)}),m.current=t.vista,e.querySelector("#perfil").props={activo:l.yo?.iusuario??""},e.querySelector("av-empresa-selector").props={empresas:l.yo?.empresas??[],activa:E()}},(e,t,s)=>{if(!t.listo||!s.listo||t.vista!==s.vista||!f())return!1;const a=e.querySelector(".vista");if(!a)return!1;if(t.version!==s.version){a.replaceChildren(b(t.vista,t.id,!0));const r=e.querySelector("av-empresa-selector");return r&&(r.props={empresas:l.yo?.empresas??[],activa:E()}),e.querySelector("iswc-doc-layout")?.scrollContentTo?.(0),!0}const o=a.firstElementChild;return o?(o.props={id:t.id},!0):!1});if(k("av-app",oe),typeof document<"u"){const e=()=>document.querySelector("av-app");H(t=>{const s=e();s&&t.vista===s.props.vista&&(s.props={id:t.id})}),addEventListener("av-ruta",t=>{const s=e();t.detail.intencion&&s?.props.listo&&(s.props={version:Number(s.props.version??0)+1})}),D("empresa",()=>{const t=e();t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})})}export{C as cargarVista,S as modulos,Q as vistasProbables};
