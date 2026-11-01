import{crearComponente as b,define as f,emitir as d,html as o}from"../../../js/base/componente.js?v=kpvpk6";import{fechaISO as w,iniciales as h}from"../../../js/core/datos.js?v=2tahwq";import{colorDe as g,conteoSolicitudes as S,diasSolicitud as y,ETIQUETA as u,filtrarSolicitudes as z,ICONO as R}from"../utils/rrhh.js?v=m5xhfk";const k=["pendiente","aprobada","rechazada","todas"],A=b(import.meta.url,"av-solicitudes",{solicitudes:null,filtro:"pendiente",puedeResolver:!1,compacto:!1,ocupados:[]},(a,t,s)=>{const l=t.solicitudes;if(!l){a.append(o`<div class="lista" aria-busy="true">${[1,2].map(()=>o`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}const c=t.compacto?"pendiente":t.filtro,p=S(l),m=z(l,c);a.append(o`
    <section class="solicitudes" part="solicitudes">
      ${t.compacto?null:o`
        <div class="filtros" part="filtros" role="group" aria-label="Filtrar solicitudes">
          ${k.map(i=>o`<iswc-button variant=${c===i?"soft":"plain"} color=${c===i?"brand":"neutral"} aria-pressed=${c===i?"true":"false"} oniswc-click=${()=>d(s,"av-solicitudes-filtro",{filtro:i})}>${i==="todas"?"Todas":`${u[i]}s`}<iswc-badge slot="end" color=${i==="pendiente"&&p[i]?"warning":"neutral"} pill>${p[i]??0}</iswc-badge></iswc-button>`)}
        </div>`}
      <div class="lista" part="lista">
        ${m.length?m.map(i=>{const n=t.ocupados.includes(i.isolicitud),e=w(i.desde),r=w(i.hasta),v=y(i);return o`
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
                  ${e?o`<span><iswc-icon icon="mdi:calendar-range"></iswc-icon>${e===r||!r?e:`${e} \u2192 ${r}`}${i.tipo!=="certificado"?` \xB7 ${v} d\xEDa${v===1?"":"s"}`:""}</span>`:null}
                </div>
                ${i.motivo?o`<p class="motivo">${i.motivo}</p>`:null}
                ${i.estado!=="pendiente"&&(i.resuelto_por||i.comentario)?o`<p class="resolucion">${i.resuelto_por?`Resuelta por ${i.resuelto_por}`:""}${i.comentario?` \xB7 \xAB${i.comentario}\xBB`:""}</p>`:null}
              </div>
              ${i.estado==="pendiente"&&t.puedeResolver?o`
                <div class="acciones">
                  <iswc-button variant="compact" color="success" ?disabled=${n} oniswc-click=${()=>d(s,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"aprobar"})}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Aprobar</iswc-button>
                  <iswc-button variant="outlined compact" color="danger" id=${`rechazar-${i.isolicitud}`} ?disabled=${n}><iswc-icon slot="start" icon="mdi:close"></iswc-icon>Rechazar</iswc-button>
                  <iswc-popconfirm for=${`rechazar-${i.isolicitud}`} message=${`\xBFRechazar la solicitud de ${i.empleado}?`} oniswc-popconfirm-confirm=${()=>d(s,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"rechazar"})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, rechazar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>
                </div>`:null}
            </article>`}):o`<iswc-empty-state class="vacio"></iswc-empty-state>`}
      </div>
    </section>
  `);const $=a.querySelector(".vacio");$&&($.props=c==="pendiente"?{icono:"mdi:inbox-outline",titulo:"Nada pendiente",texto:"No hay solicitudes esperando aprobaci\xF3n."}:{icono:"mdi:file-search-outline",titulo:"Sin solicitudes",texto:"No hay solicitudes con este filtro."})});f("av-solicitudes",A);
