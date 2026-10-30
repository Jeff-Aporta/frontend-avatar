import{crearComponente as l,define as r,emitir as d,html as a}from"../../../js/base/componente.js?v=hjriku";const u={invitacion:"mdi:account-plus-outline",tarea:"mdi:checkbox-marked-circle-outline",mensaje:"mdi:forum-outline"},m=l(import.meta.url,"av-notificaciones",{items:[],cargando:!1},(c,o,n)=>{const e=o.items.filter(i=>!i.leida);c.append(a`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:bell-outline"></iswc-icon> Notificaciones ${e.length?a`<iswc-badge color="danger" pill>${e.length}</iswc-badge>`:null}</strong>
      ${e.length?a`<iswc-button slot="header-actions" variant="plain" color="neutral" class="leer" oniswc-click=${()=>d(n,"av-notificaciones-leer",{ids:[]})}>Marcar leídas</iswc-button>`:null}
      ${o.cargando?a`<av-vacio class="vacio" id="cargando"></av-vacio>`:o.items.length===0?a`<av-vacio class="vacio" id="vacio"></av-vacio>`:a`<ul class="lista" part="lista">
            ${o.items.slice(0,8).map(i=>a`
              <li class="item" data-leida=${i.leida?"1":"0"}>
                <iswc-icon class="icono" icon=${u[i.tipo]??"mdi:information-outline"}></iswc-icon>
                <span class="texto"><strong class="titulo">${i.titulo}</strong>${i.cuerpo?a`<span class="cuerpo">${i.cuerpo}</span>`:null}</span>
                ${i.creado?a`<iswc-relative-time class="cuando" date=${typeof i.creado=="string"?i.creado:i.creado.toISOString()} format="short"></iswc-relative-time>`:null}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);const t=c.querySelector("#cargando");t&&(t.props={estado:"cargando"});const s=c.querySelector("#vacio");s&&(s.props={icono:"mdi:bell-check-outline",titulo:"Al d\xEDa",texto:"No tienes notificaciones."})});r("av-notificaciones",m);
