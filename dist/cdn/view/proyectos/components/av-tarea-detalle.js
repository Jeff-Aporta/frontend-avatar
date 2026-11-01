import{crearComponente as d,define as m,emitir as c,html as t}from"../../../js/base/componente.js?v=kpvpk6";import{colorPrioridad as u,ESTADO_LABEL as w,estaVencida as p,etiquetasDe as $,fechaCorta as v,PRIORIDAD_LABEL as f}from"../utils/tareas.js?v=qfk170";const g=d(import.meta.url,"av-tarea-detalle",{abierto:!1,tarea:null,comentarios:[],puedeComentar:!1,puedeEditar:!1,puedeEliminar:!1,ocupado:!1},(r,e,o)=>{const a=e.tarea,s=()=>c(o,"av-tarea-detalle-cerrar",{}),l=()=>{const i=r.querySelector("#comentario"),n=(i?.value??"").trim();!a||!n||(c(o,"av-tarea-comentar",{itarea:a.itarea,contenido:n}),i&&(i.value=""))};r.append(t`
      <iswc-drawer id="cajon" placement="end" label=${a?a.codigo??`Tarea ${a.itarea}`:"Tarea"} ?open=${e.abierto} oniswc-hide=${s}>
        ${a?t`
            <article class="tarea" part="tarea">
              <iswc-heading level="2" class="titulo">${a.titulo}</iswc-heading>
              <div class="chips">
                <iswc-tag color=${a.estado==="cerrada"?"success":"brand"}>${w[a.estado]??a.estado}</iswc-tag>
                <iswc-tag color=${u(a.prioridad)}>${f[a.prioridad]??a.prioridad}</iswc-tag>
                ${a.fvence?t`<iswc-tag color=${p(a)?"danger":"neutral"} variant="outlined"><iswc-icon slot="start" icon="mdi:calendar-outline"></iswc-icon>${v(a.fvence)}</iswc-tag>`:null}
                ${$(a.etiquetas).map(i=>t`<iswc-tag color="neutral" variant="outlined">${i}</iswc-tag>`)}
              </div>
              <dl class="datos">
                <dt>Asignado</dt><dd>${a.asignado_a?t`<iswc-person usuario=${a.asignado_a} nombre=${a.asignado?.nombre??""}></iswc-person>`:"Sin asignar"}</dd>
                <dt>Creado por</dt><dd>${a.creado_por??"\u2014"}</dd>
              </dl>
              <p class="descripcion">${a.descripcion||"Sin descripci\xF3n."}</p>
              <iswc-divider></iswc-divider>
              <iswc-heading level="3" class="subtitulo"><iswc-icon icon="mdi:comment-text-multiple-outline"></iswc-icon> Comentarios (${e.comentarios.length})</iswc-heading>
              ${e.comentarios.length===0?t`<p class="vacio">Nadie ha comentado todavía.</p>`:t`<ul class="comentarios" part="comentarios">
                ${e.comentarios.map(i=>t`
                  <li class="comentario">
                    <iswc-person class="autor" usuario=${i.iusuario} nombre=${i.autor?.nombre??""}></iswc-person>
                    <p class="texto">${i.contenido}</p>
                    ${i.creado?t`<iswc-relative-time class="cuando" date=${typeof i.creado=="string"?i.creado:i.creado.toISOString()} format="short"></iswc-relative-time>`:null}
                  </li>
                `)}
              </ul>`}
              ${e.puedeComentar?t`<div class="redactar"><iswc-textarea id="comentario" placeholder="Escribe un comentario…" rows="2" autosize max-rows="5"></iswc-textarea><iswc-button variant="compact" color="brand" ?loading=${e.ocupado} oniswc-click=${l}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Comentar</iswc-button></div>`:null}
            </article>
            ${e.puedeEditar?t`<iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>c(o,"av-tarea-editar",{itarea:a.itarea})}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>`:null}
            ${e.puedeEliminar?t`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta tarea y sus comentarios?" oniswc-popconfirm-confirm=${()=>c(o,"av-tarea-eliminar",{itarea:a.itarea})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
          `:t`<iswc-empty-state estado="cargando"></iswc-empty-state>`}
      </iswc-drawer>
    `)},(r,e,o)=>{if(e.tarea!==o.tarea||e.comentarios!==o.comentarios)return!1;const a=r.querySelector("#cajon");return a?(a.open=e.abierto,e.ocupado===o.ocupado):!1});m("av-tarea-detalle",g);
