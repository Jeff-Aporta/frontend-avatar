import{avisar as L,crearComponente as T,define as k,html as r}from"../../base/componente.js?v=p6quri";import{cargarPerfil as q,cerrarSesion as y,conectar as I,iniciarSesion as R,mensajeDe as v,perfilesPrueba as M}from"../../core/api.js?v=3rnmgi";import{conectarBuscador as D}from"../../core/buscador.js?v=k91z5l";import{alCambiar as N,empresaActiva as O,estado as c,fijar as V,haySesion as f}from"../../core/estado.js?v=w7n12d";import{ACCION as x,puede as H,rolDe as U}from"../../core/permisos.js?v=h0y97j";import{destinoTrasAcceso as j,escuchar as z,ir as p,recordarDestino as G,resolver as _,rutaActual as B,VISTA_SESION as F,VISTAS_PRIVADAS as W}from"../../core/router.js?v=11mqc0";import{MODULOS as J}from"../../consts/comandos.js?v=of1zgp";import{COLUMNAS_PIE as K}from"../../consts/paginas.js?v=y2esoy";import{PAGINAS as Q}from"../../consts/paginas.js?v=y2esoy";import{tagsDeVista as X,VIEW_TAGS as Y}from"../../kit-tags.js?v=szmin6";import"./av-perfil-selector.js?v=xzzc5j";import"./av-perfiles-tabla.js?v=3l3vy5";const g=Object.fromEntries(Q.map(e=>[e.vista,e.shell]));function E(e){const t=new Set(Object.keys(Y));return J.filter(s=>t.has(s.id)&&(s.id!=="admin"||e))}const d=new Map;function S(e){const t=globalThis.iswcLoader,s=X(e);return!t||!s.length?Promise.resolve():(d.has(e)||d.set(e,t.load(...s).catch(a=>{d.delete(e),console.warn(`[av-app] vista ${e}:`,a)})),d.get(e))}function Z(e){return e?["panel","canales","correos","proyectos","crm","finanzas","inventario","rrhh","asistente","organizacion","admin"]:["acceso"]}function ee(e){const t=globalThis,s=o=>t.requestIdleCallback?t.requestIdleCallback(o,{timeout:4e3}):setTimeout(o,600),a=()=>{const o=e.shift();o&&S(o).then(()=>s(a))};s(a)}function C(){return{opciones:(c.yo?.empresas??[]).map(t=>({id:t.iempresa,nombre:t.nombre})),activa:O(),etiqueta:"Empresa activa",sinOpciones:"Sin empresa"}}function w(e,t,s){const a=g[e]??g.inicio;S(e);const o=document.createElement(a);e==="inicio"||!g[e]?o.props={sesion:s}:t!=null&&(o.props={id:t});const n=document.createDocumentFragment();if(n.append(o),!customElements.get(a)){const l=document.createElement("iswc-empty-state");l.props={estado:"cargando"},l.classList.add("esqueleto"),n.append(l),customElements.whenDefined(a).then(()=>l.remove())}return n}function P(e){return r`
    <footer class="pie" part="pie" slot=${e}>
      <div class="pie-col pie-col-marca">
        <span class="pie-marca"><av-logo wordmark></av-logo></span>
        <span class="pie-lema">Gestión digital y automatización · Odys</span>
      </div>
      ${K.map(t=>r`
        <nav class="pie-col" aria-label=${t.titulo}>
          <strong class="pie-titulo">${t.titulo}</strong>
          ${t.enlaces.map(s=>r`<a href=${new URL(s.ruta,b()).href}>${s.titulo}</a>`)}
        </nav>`)}
      <div class="pie-col">
        <strong class="pie-titulo">Pruebas</strong>
        <button class="pie-accion" type="button" onclick=${se}>Perfiles de prueba</button>
      </div>
      <div class="pie-col">
        <strong class="pie-titulo">Tema</strong>
        <span class="pie-tema">
          <iswc-palette-selector scope="root" aria-label="Elegir la paleta de colores"></iswc-palette-selector>
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </div>
    </footer>
    <av-perfiles-tabla id="perfiles-tabla" onav-perfiles-cerrar=${oe} onav-perfil-usar=${ae}></av-perfiles-tabla>
  `}const te=e=>e.currentTarget.getRootNode().querySelector("#perfiles-tabla");async function se(e){const t=te(e);t.props={abierto:!0};try{t.props={perfiles:await M()}}catch(s){L(v(s),"danger")}}function oe(e){e.currentTarget.props={abierto:!1}}function ae(e){const t=e.currentTarget;t.props={abierto:!1},t.getRootNode().querySelector("av-perfil-selector")?.dispatchEvent(new CustomEvent("av-perfil-pedir",{detail:e.detail}))}async function ie(e,t){if(e==="tema"){t.querySelector("iswc-theme-toggle")?.click();return}if(e==="paleta"){const s=t.querySelector("iswc-palette-selector");s?.scrollIntoView({behavior:"smooth",block:"center"}),s?.focus();return}e==="salir"&&(await y(),p("inicio"))}const b=()=>new URL("./",document.baseURI).href;function $(e){return r`
    <iswc-session-menu slot="actions" ?logged=${e} name=${c.yo?.nombre??c.yo?.iusuario??""} subtitle=${U(c.perfil)} label="Entrar" heading="Entrar a Avatar"
      oniswc-login-submit=${async t=>{const s=t.currentTarget,{username:a,password:o}=t.detail;s.loading=!0;try{await R(a,o),s.reset();const n=j();p(n.vista,n.id)}catch(n){s.error=v(n)}finally{s.loading=!1}}}
      oniswc-logout=${async()=>{await y(),p("inicio")}}>
      <iswc-dropdown-item value="asistente" oniswc-click=${()=>p("asistente")}>Preguntar a AVO</iswc-dropdown-item>
    </iswc-session-menu>
  `}const ne=T(import.meta.url,"av-app",{vista:"inicio",id:null,listo:!1,version:0},(e,t,s)=>{const a=s;if(!t.listo){e.append(r`<div class="arranque" part="arranque"><iswc-spinner></iswc-spinner><span>Cargando Avatar…</span></div>`),(async()=>{I();try{await q()}catch(A){console.warn("[av-app] sesi\xF3n no restaurada:",v(A))}const i=B(),u=_(i,f());if(u.vista!==i.vista){G(i),p(u.vista,u.id);return}a.props={listo:!0,vista:u.vista,id:u.id},document.documentElement.setAttribute("data-app-ready","")})();return}const o=f();if(ee(Z(o).filter(i=>i!==t.vista)),!(o&&W.includes(t.vista))){e.append(r`
        <iswc-app-shell class="publica" brand="Avatar" brand-href=${b()} home-label="Ir al inicio" toast="top-end">
          <av-logo slot="brand" class="marca" wordmark animado></av-logo>
          ${o?r`<iswc-button slot="actions" variant="outlined" color="brand" oniswc-click=${()=>p(F)}><iswc-icon slot="start" icon="mdi:view-dashboard-outline"></iswc-icon>Ir al panel</iswc-button>`:null}
          <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
          ${$(o)}
          <main class="vista" part="vista">${w(t.vista,t.id,o)}</main>
          ${P("footer")}
        </iswc-app-shell>
      `),e.querySelector("#perfil").props={activo:c.yo?.iusuario??""};return}const l=H(c.perfil,x.seguridad,"PUT");e.append(r`
      <iswc-doc-layout class="privada" storage-key="avatar-app" toc="off" hide-end start-width="260">
        <a slot="brand" class="marca" href=${b()} aria-label="Avatar, ir al inicio"><av-logo wordmark animado></av-logo></a>
        <iswc-semantic-search slot="actions"></iswc-semantic-search>
        <iswc-tenant-selector slot="actions"></iswc-tenant-selector>
        <av-perfil-selector slot="actions" id="perfil"></av-perfil-selector>
        ${$(!0)}
        <iswc-doc-index slot="start" id="indice" placeholder="Buscar módulo…"
          oniswc-doc-index-select=${i=>p(i.detail.id)}></iswc-doc-index>
        <main class="vista" part="vista">${w(t.vista,t.id,!0)}</main>
        ${P(null)}
      </iswc-doc-layout>
      <iswc-toast placement="top-end"></iswc-toast>
    `);const m=e.querySelector("#indice");m.textos={placeholder:"Buscar m\xF3dulo\u2026",sinResultados:"Ning\xFAn m\xF3dulo coincide.",resumen:""},m.items=E(l),D(e.querySelector("iswc-semantic-search"),E(l).map(i=>i.id),i=>{ie(i,e)}),m.current=t.vista,e.querySelector("#perfil").props={activo:c.yo?.iusuario??""};const h=e.querySelector("iswc-tenant-selector");h.addEventListener("iswc-tenant-change",i=>V({empresa:Number(i.detail.id)})),h.props=C()},(e,t,s)=>{if(!t.listo||!s.listo||t.vista!==s.vista||!f())return!1;const a=e.querySelector(".vista");if(!a)return!1;if(t.version!==s.version){a.replaceChildren(w(t.vista,t.id,!0));const n=e.querySelector("iswc-tenant-selector");return n&&(n.props=C()),e.querySelector("iswc-doc-layout")?.scrollContentTo?.(0),!0}const o=a.firstElementChild;return o?(o.props={id:t.id},!0):!1});if(k("av-app",ne),typeof document<"u"){const e=()=>document.querySelector("av-app");z(t=>{const s=e();s&&t.vista===s.props.vista&&(s.props={id:t.id})}),addEventListener("av-ruta",t=>{const s=e();t.detail.intencion&&s?.props.listo&&(s.props={version:Number(s.props.version??0)+1})}),N("empresa",()=>{const t=e();t?.props.listo&&(t.props={version:Number(t.props.version??0)+1})})}export{S as cargarVista,E as modulos,Z as vistasProbables};
