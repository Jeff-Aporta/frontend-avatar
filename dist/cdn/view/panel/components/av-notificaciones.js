import{crearComponente as o,define as l,emitir as n,html as t}from"../../../js/base/componente.js?v=49yoqc";const r={invitacion:"mdi:account-plus-outline",tarea:"mdi:checkbox-marked-circle-outline",mensaje:"mdi:forum-outline"},d=o(import.meta.url,"av-notificaciones",{items:[],cargando:!1},(c,e,s)=>{const a=e.items.filter(i=>!i.leida);c.append(t`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:bell-outline"></iswc-icon> Notificaciones ${a.length?t`<iswc-badge color="danger" pill>${a.length}</iswc-badge>`:null}</strong>
      ${a.length?t`<iswc-button slot="header-actions" variant="plain compact" color="neutral" class="leer" oniswc-click=${()=>n(s,"av-notificaciones-leer",{ids:[]})}>Marcar leídas</iswc-button>`:null}
      ${e.cargando?t`<iswc-empty-state class="vacio" estado="cargando"></iswc-empty-state>`:e.items.length===0?t`<iswc-empty-state class="vacio" icono="mdi:bell-check-outline" titulo="Al día" texto="No tienes notificaciones."></iswc-empty-state>`:t`<ul class="lista" part="lista">
            ${e.items.slice(0,8).map(i=>t`
              <li class="item" data-leida=${i.leida?"1":"0"}>
                <iswc-icon class="icono" icon=${r[i.tipo]??"mdi:information-outline"}></iswc-icon>
                <span class="texto"><strong class="titulo">${i.titulo}</strong>${i.cuerpo?t`<span class="cuerpo">${i.cuerpo}</span>`:null}</span>
                ${i.creado?t`<iswc-relative-time class="cuando" date=${typeof i.creado=="string"?i.creado:i.creado.toISOString()} format="short"></iswc-relative-time>`:null}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `)});l("av-notificaciones",d);
