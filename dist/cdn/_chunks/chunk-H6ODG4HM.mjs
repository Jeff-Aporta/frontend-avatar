import{b as d,c as m,e as u,f as w,g as p,k as $}from"./chunk-UMAI5G2Z.mjs";import{ra as i,ta as s,ua as r,wa as l}from"./chunk-22HCQII4.mjs";var g=l(new URL("view/proyectos/components/av-tarea-detalle.min.mjs",new URL("../",import.meta.url)).href,"av-tarea-detalle",{abierto:!1,tarea:null,comentarios:[],puedeComentar:!1,puedeEditar:!1,puedeEliminar:!1,ocupado:!1},(c,e,o)=>{let a=e.tarea,v=()=>r(o,"av-tarea-detalle-cerrar",{}),f=()=>{let t=c.querySelector("#comentario"),n=(t?.value??"").trim();!a||!n||(r(o,"av-tarea-comentar",{itarea:a.itarea,contenido:n}),t&&(t.value=""))};c.append(i`
      <iswc-drawer id="cajon" placement="end" label=${a?a.codigo??`Tarea ${a.itarea}`:"Tarea"} ?open=${e.abierto} oniswc-hide=${v}>
        ${a?i`
            <article class="tarea" part="tarea">
              <iswc-heading level="2" class="titulo">${a.titulo}</iswc-heading>
              <div class="chips">
                <iswc-tag color=${a.estado==="cerrada"?"success":"brand"}>${m[a.estado]??a.estado}</iswc-tag>
                <iswc-tag color=${u(a.prioridad)}>${d[a.prioridad]??a.prioridad}</iswc-tag>
                ${a.fvence?i`<iswc-tag color=${w(a)?"danger":"neutral"} variant="outlined"><iswc-icon slot="start" icon="mdi:calendar-outline"></iswc-icon>${p(a.fvence)}</iswc-tag>`:null}
                ${$(a.etiquetas).map(t=>i`<iswc-tag color="neutral" variant="outlined">${t}</iswc-tag>`)}
              </div>
              <dl class="datos">
                <dt>Asignado</dt><dd>${a.asignado_a?i`<iswc-person usuario=${a.asignado_a} nombre=${a.asignado?.nombre??""}></iswc-person>`:"Sin asignar"}</dd>
                <dt>Creado por</dt><dd>${a.creado_por??"\u2014"}</dd>
              </dl>
              <p class="descripcion">${a.descripcion||"Sin descripci\xF3n."}</p>
              <iswc-divider></iswc-divider>
              <iswc-heading level="3" class="subtitulo"><iswc-icon icon="mdi:comment-text-multiple-outline"></iswc-icon> Comentarios (${e.comentarios.length})</iswc-heading>
              ${e.comentarios.length===0?i`<p class="vacio">Nadie ha comentado todavía.</p>`:i`<ul class="comentarios" part="comentarios">
                ${e.comentarios.map(t=>i`
                  <li class="comentario">
                    <iswc-person class="autor" usuario=${t.iusuario} nombre=${t.autor?.nombre??""}></iswc-person>
                    <p class="texto">${t.contenido}</p>
                    ${t.creado?i`<iswc-relative-time class="cuando" date=${typeof t.creado=="string"?t.creado:t.creado.toISOString()} format="short"></iswc-relative-time>`:null}
                  </li>
                `)}
              </ul>`}
              ${e.puedeComentar?i`<div class="redactar"><iswc-textarea id="comentario" placeholder="Escribe un comentario…" rows="2" autosize max-rows="5"></iswc-textarea><iswc-button variant="compact" color="brand" ?loading=${e.ocupado} oniswc-click=${f}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Comentar</iswc-button></div>`:null}
            </article>
            ${e.puedeEditar?i`<iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>r(o,"av-tarea-editar",{itarea:a.itarea})}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>`:null}
            ${e.puedeEliminar?i`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta tarea y sus comentarios?" oniswc-popconfirm-confirm=${()=>r(o,"av-tarea-eliminar",{itarea:a.itarea})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
          `:i`<iswc-empty-state estado="cargando"></iswc-empty-state>`}
      </iswc-drawer>
    `)},(c,e,o)=>{if(e.tarea!==o.tarea||e.comentarios!==o.comentarios)return!1;let a=c.querySelector("#cajon");return a?(a.open=e.abierto,e.ocupado===o.ocupado):!1});s("av-tarea-detalle",g);
