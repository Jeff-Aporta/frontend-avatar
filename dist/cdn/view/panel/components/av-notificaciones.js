import{crearComponente as l,define as r,emitir as d,html as e}from"../../../js/base/componente.js?v=p6quri";const m={invitacion:"mdi:account-plus-outline",tarea:"mdi:checkbox-marked-circle-outline",mensaje:"mdi:forum-outline"},u=l(import.meta.url,"av-notificaciones",{items:[],cargando:!1},(a,t,n)=>{const c=t.items.filter(i=>!i.leida);a.append(e`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:bell-outline"></iswc-icon> Notificaciones ${c.length?e`<iswc-badge color="danger" pill>${c.length}</iswc-badge>`:null}</strong>
      ${c.length?e`<iswc-button slot="header-actions" variant="plain" color="neutral" class="leer" oniswc-click=${()=>d(n,"av-notificaciones-leer",{ids:[]})}>Marcar leídas</iswc-button>`:null}
      ${t.cargando?e`<iswc-empty-state class="vacio" id="cargando"></iswc-empty-state>`:t.items.length===0?e`<iswc-empty-state class="vacio" id="vacio"></iswc-empty-state>`:e`<ul class="lista" part="lista">
            ${t.items.slice(0,8).map(i=>e`
              <li class="item" data-leida=${i.leida?"1":"0"}>
                <iswc-icon class="icono" icon=${m[i.tipo]??"mdi:information-outline"}></iswc-icon>
                <span class="texto"><strong class="titulo">${i.titulo}</strong>${i.cuerpo?e`<span class="cuerpo">${i.cuerpo}</span>`:null}</span>
                ${i.creado?e`<iswc-relative-time class="cuando" date=${typeof i.creado=="string"?i.creado:i.creado.toISOString()} format="short"></iswc-relative-time>`:null}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);const o=a.querySelector("#cargando");o&&(o.props={estado:"cargando"});const s=a.querySelector("#vacio");s&&(s.props={icono:"mdi:bell-check-outline",titulo:"Al d\xEDa",texto:"No tienes notificaciones."})});r("av-notificaciones",u);
