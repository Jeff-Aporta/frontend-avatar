import{crearComponente as r,define as l,html as c}from"../../base/componente.js?v=uz3s44";import{abrir as d,alCambio as p,fijarPreferencia as s,marcarLeida as m,marcarTodas as u,pedirPermisoNavegador as w}from"../../notificaciones/centro.js?v=sbg4u8";import{arrancar as h}from"../../notificaciones/arranque.js?v=nlnox4";import{TIPOS_AVISO as b}from"../../notificaciones/avisos.js?v=nkmjbz";const f=a=>c`
  <li class="entrada" data-id=${a.id} data-leida=${a.leida?"1":"0"} data-tipo=${a.tipo}>
    <button class="abrir" type="button" onclick=${()=>d(a)}>
      <iswc-icon class="icono" icon=${b[a.tipo].icono} aria-hidden="true"></iswc-icon>
      <span class="texto">
        <strong class="titulo">${a.titulo}</strong>
        <span class="cuerpo">${a.cuerpo}</span>
        <iswc-relative-time class="cuando" date=${a.ts} format="short"></iswc-relative-time>
      </span>
      ${a.cuenta>1?c`<iswc-badge color="brand" pill>${a.cuenta}</iswc-badge>`:null}
    </button>
    ${a.leida?null:c`<iswc-button class="leer" variant="plain compact" color="neutral" title="Marcar leída" oniswc-click=${()=>{m(a)}}><iswc-icon icon="mdi:check" aria-hidden="true"></iswc-icon></iswc-button>`}
  </li>`;function v(a,e){const i=a.host;i.hidden=!e.activo,a.querySelector(".campana").setAttribute("aria-label",e.total?`Notificaciones, ${e.total} sin leer`:"Notificaciones");const t=a.querySelector(".cifra");t.hidden=e.total===0,t.textContent=e.total>99?"99+":String(e.total),a.querySelector(".conexion").hidden=e.conexion==="conectado",a.querySelector(".lista").replaceChildren(...e.entradas.slice(0,80).map(f)),a.querySelector(".vacio").hidden=e.entradas.length>0,a.querySelector(".todas").toggleAttribute("disabled",e.total===0),a.querySelector(".sonido").checked=e.preferencias.sonido,a.querySelector(".navegador").checked=e.preferencias.navegador}const g=r(import.meta.url,"av-campana",{},(a,e,i)=>{a.append(c`
      <iswc-button class="campana" variant="plain compact" color="neutral" title="Notificaciones" oniswc-click=${()=>{a.querySelector(".cajon").open=!0}}>
        <iswc-icon icon="mdi:bell-outline" aria-hidden="true"></iswc-icon>
        <span class="cifra" hidden></span>
      </iswc-button>
      <iswc-drawer class="cajon" label="Notificaciones" placement="end">
        <div class="panel" part="panel">
          <div class="acciones">
            <iswc-button class="todas" variant="soft compact" color="brand" oniswc-click=${()=>{u()}}><iswc-icon slot="start" icon="mdi:check-all"></iswc-icon>Marcar todas</iswc-button>
            <span class="conexion" hidden><iswc-spinner></iswc-spinner>Reconectando…</span>
          </div>
          <ul class="lista"></ul>
          <iswc-empty-state class="vacio" icono="mdi:bell-check-outline" titulo="Al día" texto="No tienes notificaciones."></iswc-empty-state>
          <div class="ajustes">
            <iswc-switch class="sonido" oniswc-change=${t=>s({sonido:t.detail.checked})}>Sonido</iswc-switch>
            <iswc-switch class="navegador" oniswc-change=${async t=>{const o=t.currentTarget;if(!t.detail.checked)return s({navegador:!1});await w()!=="granted"&&(o.checked=!1)}}>Avisos del navegador</iswc-switch>
          </div>
        </div>
      </iswc-drawer>
    `);const n=p(t=>{if(!i.isConnected)return n();v(a,t)});h()});l("av-campana",g);
