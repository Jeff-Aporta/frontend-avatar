import{a as w,b as h,c as f,d as b,e as v,i as y,j as $,k as g,l as o,m as C}from"./chunk-3MQ37A3F.mjs";import{c as p,d as c,e as s}from"./chunk-ZQI42E6M.mjs";import{ra as n,ta as m,wa as u}from"./chunk-22HCQII4.mjs";var E=!1;function r(){E||(E=!0,p("empresa",r));let a=v(),e=s();if(!c()||!e){a?.startsWith("empresa-")&&f();return}a!==`empresa-${e}`&&import("./backend-avatar-3P3JSGGJ.mjs").then(({crearBackendAvatar:i})=>{c()&&s()===e&&b(`empresa-${e}`,"canales",()=>i({iempresa:e}))})}var k=a=>n`
  <li class="entrada" data-id=${a.id} data-leida=${a.leida?"1":"0"} data-tipo=${a.tipo}>
    <button class="abrir" type="button" onclick=${()=>g(a)}>
      <iswc-icon class="icono" icon=${w[a.tipo].icono} aria-hidden="true"></iswc-icon>
      <span class="texto">
        <strong class="titulo">${a.titulo}</strong>
        <span class="cuerpo">${a.cuerpo}</span>
        <iswc-relative-time class="cuando" date=${a.ts} format="short"></iswc-relative-time>
      </span>
      ${a.cuenta>1?n`<iswc-badge color="brand" pill>${a.cuenta}</iswc-badge>`:null}
    </button>
    ${a.leida?null:n`<iswc-button class="leer" variant="plain compact" color="neutral" title="Marcar leída" oniswc-click=${()=>{y(a)}}><iswc-icon icon="mdi:check" aria-hidden="true"></iswc-icon></iswc-button>`}
  </li>`;function S(a,e){let i=a.host;i.hidden=!e.activo,a.querySelector(".campana").setAttribute("aria-label",e.total?`Notificaciones, ${e.total} sin leer`:"Notificaciones");let t=a.querySelector(".cifra");t.hidden=e.total===0,t.textContent=e.total>99?"99+":String(e.total),a.querySelector(".conexion").hidden=e.conexion==="conectado",a.querySelector(".lista").replaceChildren(...e.entradas.slice(0,80).map(k)),a.querySelector(".vacio").hidden=e.entradas.length>0,a.querySelector(".todas").toggleAttribute("disabled",e.total===0),a.querySelector(".sonido").checked=e.preferencias.sonido,a.querySelector(".navegador").checked=e.preferencias.navegador}var L=u(new URL("js/components/av/av-campana.min.mjs",new URL("../",import.meta.url)).href,"av-campana",{},(a,e,i)=>{a.append(n`
      <iswc-button class="campana" variant="plain compact" color="neutral" title="Notificaciones" oniswc-click=${()=>{a.querySelector(".cajon").open=!0}}>
        <iswc-icon icon="mdi:bell-outline" aria-hidden="true"></iswc-icon>
        <span class="cifra" hidden></span>
      </iswc-button>
      <iswc-drawer class="cajon" label="Notificaciones" placement="end">
        <div class="panel" part="panel">
          <div class="acciones">
            <iswc-button class="todas" variant="soft compact" color="brand" oniswc-click=${()=>{$()}}><iswc-icon slot="start" icon="mdi:check-all"></iswc-icon>Marcar todas</iswc-button>
            <span class="conexion" hidden><iswc-spinner></iswc-spinner>Reconectando…</span>
          </div>
          <ul class="lista"></ul>
          <iswc-empty-state class="vacio" icono="mdi:bell-check-outline" titulo="Al día" texto="No tienes notificaciones."></iswc-empty-state>
          <div class="ajustes">
            <iswc-switch class="sonido" oniswc-change=${t=>o({sonido:t.detail.checked})}>Sonido</iswc-switch>
            <iswc-switch class="navegador" oniswc-change=${async t=>{let d=t.currentTarget;if(!t.detail.checked)return o({navegador:!1});await C()!=="granted"&&(d.checked=!1)}}>Avisos del navegador</iswc-switch>
          </div>
        </div>
      </iswc-drawer>
    `);let l=h(t=>{if(!i.isConnected)return l();S(a,t)});r()});m("av-campana",L);
