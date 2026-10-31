import{crearComponente as $,define as w,emitir as i,html as n}from"../../../js/base/componente.js?v=p6quri";import{colorPrioridad as g,encabezado as f,estaVencida as c,etiquetasDe as d,fechaCorta as E,ordenarTareas as k,ordenEnColumna as T,PRIORIDAD_LABEL as y}from"../utils/tareas.js?v=qfk170";const M=$(import.meta.url,"av-tablero",{tablero:null,cargando:!1,puedeMover:!1},(t,r,s)=>{if(r.cargando||!r.tablero){t.append(n`<iswc-empty-state id="estado"></iswc-empty-state>`),t.querySelector("#estado").props=r.cargando?{estado:"cargando"}:{icono:"mdi:view-column-outline",titulo:"Sin tablero",texto:"Elige un proyecto para ver su tablero."};return}const u=e=>{if(!r.puedeMover)return;const{card:a,to:o}=e.detail,l=Number(a.dataset.itarea),p=Number(o.dataset.icolumna),b=[...o.querySelectorAll(":scope > iswc-kanban-card")].map(v=>Number(v.dataset.itarea));i(s,"av-tarea-mover",{itarea:l,icolumna:p,orden:T(b,l)})},m=e=>{const{card:a}=e.detail;i(s,"av-tarea-abrir",{itarea:Number(a.dataset.itarea)})};t.append(n`
    <iswc-kanban class="tablero" part="tablero" oniswc-kanban-move=${u} oniswc-kanban-card-click=${m}>
      ${r.tablero.columnas.map(e=>n`
        <iswc-kanban-column title=${e.nombre} accent=${e.color??"var(--iswc-accent)"} data-icolumna=${String(e.icolumna)} badge=${e.limite!=null?`${e.tareas.length}/${e.limite}`:String(e.tareas.length)}>
          ${r.puedeMover?n`<iswc-button slot="header-actions" variant="plain" color="neutral" class="nueva" title="Nueva tarea" oniswc-click=${()=>i(s,"av-tarea-nueva",{icolumna:e.icolumna})}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>`:null}
          ${k(e.tareas).map(a=>n`
            <iswc-kanban-card class="tarjeta" heading=${f(a)} tag=${y[a.prioridad]??a.prioridad} tag-color=${g(a.prioridad)} data-itarea=${String(a.itarea)} data-vencida=${c(a)?"1":"0"}>
              ${a.descripcion?n`<span class="descripcion">${a.descripcion}</span>`:null}
              ${d(a.etiquetas).length?n`<span class="etiquetas">${d(a.etiquetas).map(o=>n`<iswc-tag color="neutral" variant="outlined">${o}</iswc-tag>`)}</span>`:null}
              <span slot="footer" class="pie">
                ${a.fvence?n`<span class="vence" data-vencida=${c(a)?"1":"0"}><iswc-icon icon=${c(a)?"mdi:alarm":"mdi:calendar-outline"}></iswc-icon>${E(a.fvence)}</span>`:n`<span></span>`}
                ${a.asignado_a?n`<iswc-person class="asignado" data-iusuario=${a.asignado_a} data-nombre=${a.asignado?.nombre??""}></iswc-person>`:null}
              </span>
            </iswc-kanban-card>
          `)}
        </iswc-kanban-column>
      `)}
    </iswc-kanban>
  `);for(const e of t.querySelectorAll("iswc-person"))e.props={usuario:e.dataset.iusuario,nombre:e.dataset.nombre||null,compacto:!0}});w("av-tablero",M);
