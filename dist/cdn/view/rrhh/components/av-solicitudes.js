import{crearComponente as b,define as f,emitir as d,html as o}from"../../../js/base/componente.js?v=zohalw";import{fechaISO as w,iniciales as h}from"../../../js/core/datos.js?v=2tahwq";import{colorDe as g,conteoSolicitudes as S,diasSolicitud as z,ETIQUETA as u,filtrarSolicitudes as y,ICONO as R}from"../utils/rrhh.js?v=n0wjd8";const k=["pendiente","aprobada","rechazada","todas"],A=b(import.meta.url,"av-solicitudes",{solicitudes:null,filtro:"pendiente",puedeResolver:!1,compacto:!1,ocupados:[]},(s,e,a)=>{const l=e.solicitudes;if(!l){s.append(o`<div class="lista" aria-busy="true">${[1,2].map(()=>o`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}const t=e.compacto?"pendiente":e.filtro,p=S(l),m=y(l,t);s.append(o`
    <section class="solicitudes" part="solicitudes">
      ${e.compacto?null:o`
        <div class="filtros" part="filtros" role="group" aria-label="Filtrar solicitudes">
          ${k.map(i=>o`<iswc-button size="small" variant=${t===i?"soft":"plain"} color=${t===i?"brand":"neutral"} aria-pressed=${t===i?"true":"false"} oniswc-click=${()=>d(a,"av-solicitudes-filtro",{filtro:i})}>${i==="todas"?"Todas":`${u[i]}s`}<iswc-badge slot="end" color=${i==="pendiente"&&p[i]?"warning":"neutral"} pill>${p[i]??0}</iswc-badge></iswc-button>`)}
        </div>`}
      <div class="lista" part="lista">
        ${m.length?m.map(i=>{const n=e.ocupados.includes(i.isolicitud),c=w(i.desde),r=w(i.hasta),v=z(i);return o`
            <article class="solicitud" part="solicitud" data-estado=${i.estado} aria-busy=${n?"true":"false"}>
              <div class="icono"><iswc-icon icon=${R[i.tipo]??"mdi:file-document-outline"}></iswc-icon></div>
              <div class="cuerpo">
                <div class="linea">
                  <iswc-avatar class="avatar" initials=${h(i.empleado)} label=${i.empleado}></iswc-avatar>
                  <strong class="empleado">${i.empleado}</strong>
                  <iswc-tag color=${g(i.estado)} pill>${u[i.estado]??i.estado}</iswc-tag>
                </div>
                <div class="detalle">
                  <span class="tipo">${u[i.tipo]??i.tipo}</span>
                  ${c?o`<span><iswc-icon icon="mdi:calendar-range"></iswc-icon>${c===r||!r?c:`${c} \u2192 ${r}`}${i.tipo!=="certificado"?` \xB7 ${v} d\xEDa${v===1?"":"s"}`:""}</span>`:null}
                </div>
                ${i.motivo?o`<p class="motivo">${i.motivo}</p>`:null}
                ${i.estado!=="pendiente"&&(i.resuelto_por||i.comentario)?o`<p class="resolucion">${i.resuelto_por?`Resuelta por ${i.resuelto_por}`:""}${i.comentario?` \xB7 \xAB${i.comentario}\xBB`:""}</p>`:null}
              </div>
              ${i.estado==="pendiente"&&e.puedeResolver?o`
                <div class="acciones">
                  <iswc-button size="small" color="success" ?disabled=${n} oniswc-click=${()=>d(a,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"aprobar"})}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Aprobar</iswc-button>
                  <iswc-button size="small" variant="outlined" color="danger" id=${`rechazar-${i.isolicitud}`} ?disabled=${n}><iswc-icon slot="start" icon="mdi:close"></iswc-icon>Rechazar</iswc-button>
                  <iswc-popconfirm for=${`rechazar-${i.isolicitud}`} message=${`\xBFRechazar la solicitud de ${i.empleado}?`} oniswc-popconfirm-confirm=${()=>d(a,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"rechazar"})}><iswc-button slot="confirm" color="danger">Sí, rechazar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>
                </div>`:null}
            </article>`}):o`<av-vacio class="vacio"></av-vacio>`}
      </div>
    </section>
  `);const $=s.querySelector(".vacio");$&&($.props=t==="pendiente"?{icono:"mdi:inbox-outline",titulo:"Nada pendiente",texto:"No hay solicitudes esperando aprobaci\xF3n."}:{icono:"mdi:file-search-outline",titulo:"Sin solicitudes",texto:"No hay solicitudes con este filtro."})});f("av-solicitudes",A);
