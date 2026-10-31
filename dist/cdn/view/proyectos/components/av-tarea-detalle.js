import{crearComponente as m,define as p,emitir as n,html as i}from"../../../js/base/componente.js?v=333q2n";import{colorPrioridad as w,ESTADO_LABEL as v,estaVencida as f,etiquetasDe as $,fechaCorta as g,PRIORIDAD_LABEL as b}from"../utils/tareas.js?v=qfk170";const E=m(import.meta.url,"av-tarea-detalle",{abierto:!1,tarea:null,comentarios:[],puedeComentar:!1,puedeEditar:!1,puedeEliminar:!1,ocupado:!1},(r,o,t)=>{const a=o.tarea,d=()=>n(t,"av-tarea-detalle-cerrar",{}),u=()=>{const e=r.querySelector("#comentario"),l=(e?.value??"").trim();!a||!l||(n(t,"av-tarea-comentar",{itarea:a.itarea,contenido:l}),e&&(e.value=""))};r.append(i`
      <iswc-drawer id="cajon" placement="end" label=${a?a.codigo??`Tarea ${a.itarea}`:"Tarea"} ?open=${o.abierto} oniswc-hide=${d}>
        ${a?i`
            <article class="tarea" part="tarea">
              <h2 class="titulo">${a.titulo}</h2>
              <div class="chips">
                <iswc-tag color=${a.estado==="cerrada"?"success":"brand"}>${v[a.estado]??a.estado}</iswc-tag>
                <iswc-tag color=${w(a.prioridad)}>${b[a.prioridad]??a.prioridad}</iswc-tag>
                ${a.fvence?i`<iswc-tag color=${f(a)?"danger":"neutral"} variant="outlined"><iswc-icon slot="start" icon="mdi:calendar-outline"></iswc-icon>${g(a.fvence)}</iswc-tag>`:null}
                ${$(a.etiquetas).map(e=>i`<iswc-tag color="neutral" variant="outlined">${e}</iswc-tag>`)}
              </div>
              <dl class="datos">
                <dt>Asignado</dt><dd>${a.asignado_a?i`<av-persona id="asignado"></av-persona>`:"Sin asignar"}</dd>
                <dt>Creado por</dt><dd>${a.creado_por??"\u2014"}</dd>
              </dl>
              <p class="descripcion">${a.descripcion||"Sin descripci\xF3n."}</p>
              <iswc-divider></iswc-divider>
              <h3 class="subtitulo"><iswc-icon icon="mdi:comment-text-multiple-outline"></iswc-icon> Comentarios (${o.comentarios.length})</h3>
              ${o.comentarios.length===0?i`<p class="vacio">Nadie ha comentado todavía.</p>`:i`<ul class="comentarios" part="comentarios">
                ${o.comentarios.map(e=>i`
                  <li class="comentario">
                    <av-persona class="autor" data-iusuario=${e.iusuario} data-nombre=${e.autor?.nombre??""}></av-persona>
                    <p class="texto">${e.contenido}</p>
                    ${e.creado?i`<iswc-relative-time class="cuando" date=${typeof e.creado=="string"?e.creado:e.creado.toISOString()} format="short"></iswc-relative-time>`:null}
                  </li>
                `)}
              </ul>`}
              ${o.puedeComentar?i`<div class="redactar"><iswc-textarea id="comentario" placeholder="Escribe un comentario…" rows="2" autosize max-rows="5"></iswc-textarea><iswc-button color="brand" ?loading=${o.ocupado} oniswc-click=${u}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Comentar</iswc-button></div>`:null}
            </article>
            ${o.puedeEditar?i`<iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${()=>n(t,"av-tarea-editar",{itarea:a.itarea})}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>`:null}
            ${o.puedeEliminar?i`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta tarea y sus comentarios?" oniswc-popconfirm-confirm=${()=>n(t,"av-tarea-eliminar",{itarea:a.itarea})}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
          `:i`<av-vacio id="sin"></av-vacio>`}
      </iswc-drawer>
    `);const c=r.querySelector("#asignado");c&&a&&(c.props={iusuario:a.asignado_a,nombre:a.asignado?.nombre??null});for(const e of r.querySelectorAll(".autor"))e.props={iusuario:e.dataset.iusuario,nombre:e.dataset.nombre||null};const s=r.querySelector("#sin");s&&(s.props={estado:"cargando"})},(r,o,t)=>{if(o.tarea!==t.tarea||o.comentarios!==t.comentarios)return!1;const a=r.querySelector("#cajon");return a?(a.open=o.abierto,o.ocupado===t.ocupado):!1});p("av-tarea-detalle",E);
