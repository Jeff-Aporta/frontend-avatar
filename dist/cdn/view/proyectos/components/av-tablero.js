import{crearComponente as $,define as g,emitir as s,html as n}from"../../../js/base/componente.js?v=hjriku";import{colorPrioridad as w,encabezado as f,estaVencida as c,etiquetasDe as d,fechaCorta as E,ordenarTareas as k,ordenEnColumna as T,PRIORIDAD_LABEL as M}from"../utils/tareas.js?v=qfk170";const C=$(import.meta.url,"av-tablero",{tablero:null,cargando:!1,puedeMover:!1},(o,r,i)=>{if(r.cargando||!r.tablero){o.append(n`<av-vacio id="estado"></av-vacio>`),o.querySelector("#estado").props=r.cargando?{estado:"cargando"}:{icono:"mdi:view-column-outline",titulo:"Sin tablero",texto:"Elige un proyecto para ver su tablero."};return}const u=e=>{if(!r.puedeMover)return;const{card:a,to:t}=e.detail,l=Number(a.dataset.itarea),p=Number(t.dataset.icolumna),v=[...t.querySelectorAll(":scope > iswc-kanban-card")].map(b=>Number(b.dataset.itarea));s(i,"av-tarea-mover",{itarea:l,icolumna:p,orden:T(v,l)})},m=e=>{const{card:a}=e.detail;s(i,"av-tarea-abrir",{itarea:Number(a.dataset.itarea)})};o.append(n`
    <iswc-kanban class="tablero" part="tablero" oniswc-kanban-move=${u} oniswc-kanban-card-click=${m}>
      ${r.tablero.columnas.map(e=>n`
        <iswc-kanban-column title=${e.nombre} accent=${e.color??"var(--iswc-accent)"} data-icolumna=${String(e.icolumna)} badge=${e.limite!=null?`${e.tareas.length}/${e.limite}`:String(e.tareas.length)}>
          ${r.puedeMover?n`<iswc-button slot="header-actions" variant="plain" color="neutral" class="nueva" title="Nueva tarea" oniswc-click=${()=>s(i,"av-tarea-nueva",{icolumna:e.icolumna})}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>`:null}
          ${k(e.tareas).map(a=>n`
            <iswc-kanban-card class="tarjeta" heading=${f(a)} tag=${M[a.prioridad]??a.prioridad} tag-color=${w(a.prioridad)} data-itarea=${String(a.itarea)} data-vencida=${c(a)?"1":"0"}>
              ${a.descripcion?n`<span class="descripcion">${a.descripcion}</span>`:null}
              ${d(a.etiquetas).length?n`<span class="etiquetas">${d(a.etiquetas).map(t=>n`<iswc-tag color="neutral" variant="outlined">${t}</iswc-tag>`)}</span>`:null}
              <span slot="footer" class="pie">
                ${a.fvence?n`<span class="vence" data-vencida=${c(a)?"1":"0"}><iswc-icon icon=${c(a)?"mdi:alarm":"mdi:calendar-outline"}></iswc-icon>${E(a.fvence)}</span>`:n`<span></span>`}
                ${a.asignado_a?n`<av-persona class="asignado" data-iusuario=${a.asignado_a} data-nombre=${a.asignado?.nombre??""}></av-persona>`:null}
              </span>
            </iswc-kanban-card>
          `)}
        </iswc-kanban-column>
      `)}
    </iswc-kanban>
  `);for(const e of o.querySelectorAll("av-persona"))e.props={iusuario:e.dataset.iusuario,nombre:e.dataset.nombre||null,compacto:!0}});g("av-tablero",C);
