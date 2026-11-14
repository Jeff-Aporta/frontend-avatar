import{b as p,e as b,f as o,g as v,h as w,k as c,m as $,n as g}from"./chunk-UMAI5G2Z.mjs";import{ra as n,ta as d,ua as r,wa as u}from"./chunk-22HCQII4.mjs";var T=u(new URL("view/proyectos/components/av-tablero.min.mjs",new URL("../",import.meta.url)).href,"av-tablero",{tablero:null,cargando:!1,puedeMover:!1},(l,t,s)=>{if(t.cargando||!t.tablero){l.append(t.cargando?n`<iswc-empty-state estado="cargando"></iswc-empty-state>`:n`<iswc-empty-state icono="mdi:view-column-outline" titulo="Sin tablero" texto="Elige un proyecto para ver su tablero."></iswc-empty-state>`);return}let f=e=>{if(!t.puedeMover)return;let{card:a,to:i}=e.detail,m=Number(a.dataset.itarea),k=Number(i.dataset.icolumna),y=[...i.querySelectorAll(":scope > iswc-kanban-card")].map(L=>Number(L.dataset.itarea));r(s,"av-tarea-mover",{itarea:m,icolumna:k,orden:g(y,m)})},E=e=>{let{card:a}=e.detail;r(s,"av-tarea-abrir",{itarea:Number(a.dataset.itarea)})};l.append(n`
    <iswc-kanban class="tablero" part="tablero" oniswc-kanban-move=${f} oniswc-kanban-card-click=${E}>
      ${t.tablero.columnas.map(e=>n`
        <iswc-kanban-column title=${e.nombre} accent=${e.color??"var(--iswc-accent)"} data-icolumna=${String(e.icolumna)} badge=${e.limite!=null?`${e.tareas.length}/${e.limite}`:String(e.tareas.length)}>
          ${t.puedeMover?n`<iswc-button slot="header-actions" variant="plain compact" color="neutral" class="nueva" title="Nueva tarea" oniswc-click=${()=>r(s,"av-tarea-nueva",{icolumna:e.icolumna})}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>`:null}
          ${w(e.tareas).map(a=>n`
            <iswc-kanban-card class="tarjeta" heading=${$(a)} tag=${p[a.prioridad]??a.prioridad} tag-color=${b(a.prioridad)} data-itarea=${String(a.itarea)} data-vencida=${o(a)?"1":"0"}>
              ${a.descripcion?n`<span class="descripcion">${a.descripcion}</span>`:null}
              ${c(a.etiquetas).length?n`<span class="etiquetas">${c(a.etiquetas).map(i=>n`<iswc-tag color="neutral" variant="outlined">${i}</iswc-tag>`)}</span>`:null}
              <span slot="footer" class="pie">
                ${a.fvence?n`<span class="vence" data-vencida=${o(a)?"1":"0"}><iswc-icon icon=${o(a)?"mdi:alarm":"mdi:calendar-outline"}></iswc-icon>${v(a.fvence)}</span>`:n`<span></span>`}
                ${a.asignado_a?n`<iswc-person class="asignado" compacto usuario=${a.asignado_a} nombre=${a.asignado?.nombre??""}></iswc-person>`:null}
              </span>
            </iswc-kanban-card>
          `)}
        </iswc-kanban-column>
      `)}
    </iswc-kanban>
  `)});d("av-tablero",T);
