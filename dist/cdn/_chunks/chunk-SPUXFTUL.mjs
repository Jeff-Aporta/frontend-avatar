import{a as s,b as g,c as S,p as y,q as R,r as z}from"./chunk-CNLG4QTM.mjs";import{e as p,j as h}from"./chunk-EYJKOFS6.mjs";import{ra as o,ta as b,ua as a,wa as f}from"./chunk-22HCQII4.mjs";var k=["pendiente","aprobada","rechazada","todas"],A=f(new URL("view/rrhh/components/av-solicitudes.min.mjs",new URL("../",import.meta.url)).href,"av-solicitudes",{solicitudes:null,filtro:"pendiente",puedeResolver:!1,compacto:!1,ocupados:[]},(l,t,n)=>{let r=t.solicitudes;if(!r){l.append(o`<div class="lista" aria-busy="true">${[1,2].map(()=>o`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}let c=t.compacto?"pendiente":t.filtro,m=y(r),$=R(r,c);l.append(o`
    <section class="solicitudes" part="solicitudes">
      ${t.compacto?null:o`
        <div class="filtros" part="filtros" role="group" aria-label="Filtrar solicitudes">
          ${k.map(i=>o`<iswc-button variant=${c===i?"soft":"plain"} color=${c===i?"brand":"neutral"} aria-pressed=${c===i?"true":"false"} oniswc-click=${()=>a(n,"av-solicitudes-filtro",{filtro:i})}>${i==="todas"?"Todas":`${s[i]}s`}<iswc-badge slot="end" color=${i==="pendiente"&&m[i]?"warning":"neutral"} pill>${m[i]??0}</iswc-badge></iswc-button>`)}
        </div>`}
      <div class="lista" part="lista">
        ${$.length?$.map(i=>{let d=t.ocupados.includes(i.isolicitud),e=p(i.desde),u=p(i.hasta),w=z(i);return o`
            <article class="solicitud" part="solicitud" data-estado=${i.estado} aria-busy=${d?"true":"false"}>
              <div class="icono"><iswc-icon icon=${g[i.tipo]??"mdi:file-document-outline"}></iswc-icon></div>
              <div class="cuerpo">
                <div class="linea">
                  <iswc-avatar class="avatar" initials=${h(i.empleado)} label=${i.empleado}></iswc-avatar>
                  <strong class="empleado">${i.empleado}</strong>
                  <iswc-tag color=${S(i.estado)} pill>${s[i.estado]??i.estado}</iswc-tag>
                </div>
                <div class="detalle">
                  <span class="tipo">${s[i.tipo]??i.tipo}</span>
                  ${e?o`<span><iswc-icon icon="mdi:calendar-range"></iswc-icon>${e===u||!u?e:`${e} \u2192 ${u}`}${i.tipo!=="certificado"?` \xB7 ${w} d\xEDa${w===1?"":"s"}`:""}</span>`:null}
                </div>
                ${i.motivo?o`<p class="motivo">${i.motivo}</p>`:null}
                ${i.estado!=="pendiente"&&(i.resuelto_por||i.comentario)?o`<p class="resolucion">${i.resuelto_por?`Resuelta por ${i.resuelto_por}`:""}${i.comentario?` \xB7 \xAB${i.comentario}\xBB`:""}</p>`:null}
              </div>
              ${i.estado==="pendiente"&&t.puedeResolver?o`
                <div class="acciones">
                  <iswc-button variant="compact" color="success" ?disabled=${d} oniswc-click=${()=>a(n,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"aprobar"})}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Aprobar</iswc-button>
                  <iswc-button variant="outlined compact" color="danger" id=${`rechazar-${i.isolicitud}`} ?disabled=${d}><iswc-icon slot="start" icon="mdi:close"></iswc-icon>Rechazar</iswc-button>
                  <iswc-popconfirm for=${`rechazar-${i.isolicitud}`} message=${`\xBFRechazar la solicitud de ${i.empleado}?`} oniswc-popconfirm-confirm=${()=>a(n,"av-solicitud-resolver",{isolicitud:i.isolicitud,accion:"rechazar"})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, rechazar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>
                </div>`:null}
            </article>`}):o`<iswc-empty-state class="vacio"></iswc-empty-state>`}
      </div>
    </section>
  `);let v=l.querySelector(".vacio");v&&(v.props=c==="pendiente"?{icono:"mdi:inbox-outline",titulo:"Nada pendiente",texto:"No hay solicitudes esperando aprobaci\xF3n."}:{icono:"mdi:file-search-outline",titulo:"Sin solicitudes",texto:"No hay solicitudes con este filtro."})});b("av-solicitudes",A);
