import{crearComponente as $,define as w,emitir as o,html as n}from"../../../js/base/componente.js?v=uz3s44";import{colorPrioridad as g,encabezado as f,estaVencida as s,etiquetasDe as d,fechaCorta as E,ordenarTareas as k,ordenEnColumna as T,PRIORIDAD_LABEL as y}from"../utils/tareas.js?v=qfk170";const M=$(import.meta.url,"av-tablero",{tablero:null,cargando:!1,puedeMover:!1},(c,t,r)=>{if(t.cargando||!t.tablero){c.append(t.cargando?n`<iswc-empty-state estado="cargando"></iswc-empty-state>`:n`<iswc-empty-state icono="mdi:view-column-outline" titulo="Sin tablero" texto="Elige un proyecto para ver su tablero."></iswc-empty-state>`);return}const m=e=>{if(!t.puedeMover)return;const{card:a,to:i}=e.detail,l=Number(a.dataset.itarea),p=Number(i.dataset.icolumna),b=[...i.querySelectorAll(":scope > iswc-kanban-card")].map(v=>Number(v.dataset.itarea));o(r,"av-tarea-mover",{itarea:l,icolumna:p,orden:T(b,l)})},u=e=>{const{card:a}=e.detail;o(r,"av-tarea-abrir",{itarea:Number(a.dataset.itarea)})};c.append(n`
    <iswc-kanban class="tablero" part="tablero" oniswc-kanban-move=${m} oniswc-kanban-card-click=${u}>
      ${t.tablero.columnas.map(e=>n`
        <iswc-kanban-column title=${e.nombre} accent=${e.color??"var(--iswc-accent)"} data-icolumna=${String(e.icolumna)} badge=${e.limite!=null?`${e.tareas.length}/${e.limite}`:String(e.tareas.length)}>
          ${t.puedeMover?n`<iswc-button slot="header-actions" variant="plain compact" color="neutral" class="nueva" title="Nueva tarea" oniswc-click=${()=>o(r,"av-tarea-nueva",{icolumna:e.icolumna})}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>`:null}
          ${k(e.tareas).map(a=>n`
            <iswc-kanban-card class="tarjeta" heading=${f(a)} tag=${y[a.prioridad]??a.prioridad} tag-color=${g(a.prioridad)} data-itarea=${String(a.itarea)} data-vencida=${s(a)?"1":"0"}>
              ${a.descripcion?n`<span class="descripcion">${a.descripcion}</span>`:null}
              ${d(a.etiquetas).length?n`<span class="etiquetas">${d(a.etiquetas).map(i=>n`<iswc-tag color="neutral" variant="outlined">${i}</iswc-tag>`)}</span>`:null}
              <span slot="footer" class="pie">
                ${a.fvence?n`<span class="vence" data-vencida=${s(a)?"1":"0"}><iswc-icon icon=${s(a)?"mdi:alarm":"mdi:calendar-outline"}></iswc-icon>${E(a.fvence)}</span>`:n`<span></span>`}
                ${a.asignado_a?n`<iswc-person class="asignado" compacto usuario=${a.asignado_a} nombre=${a.asignado?.nombre??""}></iswc-person>`:null}
              </span>
            </iswc-kanban-card>
          `)}
        </iswc-kanban-column>
      `)}
    </iswc-kanban>
  `)});w("av-tablero",M);
