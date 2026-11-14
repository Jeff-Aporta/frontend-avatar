import{a as o,b as A,c as v,i as f,j as p}from"./chunk-CNLG4QTM.mjs";import{d as m,j as g}from"./chunk-EYJKOFS6.mjs";import{ea as w,ra as i,ta as h,ua as u,wa as b}from"./chunk-22HCQII4.mjs";function y(s,e,l){let r=f(e.filas);s.querySelector(".conteo").replaceChildren(i`${["presente","retardo","ausente","vacaciones","sin_marcar"].map(a=>i`
    <span class="contador" data-estado=${a}><strong>${r[a]??0}</strong><span>${o[a]}</span></span>`)}`);let c=s.querySelector(".lista");if(e.cargando&&!e.filas.length){c.replaceChildren(i`${[1,2,3].map(()=>i`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}`);return}if(!e.filas.length){c.replaceChildren(i`<iswc-callout color="brand">No hay empleados vigentes para marcar.</iswc-callout>`);return}let $=e.fecha===m(),C=(a,n)=>()=>{let d=n==="presente"||n==="retardo";u(l,"av-asistencia-marcar",{iempleado:a.iempleado,estado:n,fecha:e.fecha,entrada:d?a.entrada??($?p():null):null,salida:d?a.salida:null})},S=a=>()=>u(l,"av-asistencia-marcar",{iempleado:a.iempleado,estado:a.estado,fecha:e.fecha,entrada:a.entrada,salida:p()});c.replaceChildren(i`${e.filas.map(a=>{let n=e.ocupados.includes(a.iempleado),d=(a.estado==="presente"||a.estado==="retardo")&&!a.salida;return i`
      <div class="fila" part="fila" data-estado=${a.estado??"sin_marcar"} aria-busy=${n?"true":"false"}>
        <iswc-avatar class="avatar" initials=${g(a.nombre)} label=${a.nombre}></iswc-avatar>
        <div class="quien">
          <span class="nombre">${a.nombre}</span>
          <span class="cargo">${[a.cargo,a.departamento].filter(Boolean).join(" \xB7 ")}</span>
        </div>
        <div class="marca">
          <iswc-tag color=${v(a.estado)} pill variant=${a.estado?"filled-outlined":"outlined"}>${o[a.estado??"sin_marcar"]}</iswc-tag>
          ${a.entrada||a.salida?i`<span class="horas"><iswc-icon icon="mdi:clock-outline"></iswc-icon>${a.entrada??"\u2014"} – ${a.salida??"\u2026"}</span>`:null}
        </div>
        <div class="botones" role="group" aria-label=${`Marcar a ${a.nombre}`}>
          ${w.map(t=>i`<iswc-button variant=${a.estado===t?"soft":"plain"} color=${a.estado===t?v(t):"neutral"} aria-label=${o[t]} title=${o[t]} aria-pressed=${a.estado===t?"true":"false"} ?disabled=${!e.puedeMarcar||n} oniswc-click=${C(a,t)}><iswc-icon icon=${A[t]}></iswc-icon></iswc-button>`)}
          ${d?i`<iswc-button variant="outlined compact" color="brand" ?disabled=${!e.puedeMarcar||n||!$} oniswc-click=${S(a)}><iswc-icon slot="start" icon="mdi:logout-variant"></iswc-icon>Salida</iswc-button>`:null}
        </div>
      </div>`})}`)}var E=b(new URL("view/rrhh/components/av-asistencia-dia.min.mjs",new URL("../",import.meta.url)).href,"av-asistencia-dia",{fecha:"",filas:[],cargando:!1,puedeMarcar:!1,ocupados:[]},(s,e,l)=>{s.append(i`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon="mdi:calendar-check-outline"></iswc-icon> Control de asistencia</strong>
        <div class="barra" part="barra">
          <iswc-input class="fecha" type="date" label="Fecha" value=${e.fecha||m()} oniswc-change=${r=>u(l,"av-asistencia-fecha",{fecha:r.target.value||m()})}></iswc-input>
          <div class="conteo" part="conteo" aria-live="polite"></div>
        </div>
        <div class="lista" part="lista"></div>
      </iswc-card>
    `),y(s,e,l)},(s,e,l,r)=>{if(!s.querySelector(".lista"))return!1;y(s,e,r);let c=s.querySelector(".fecha");return c&&e.fecha&&c.value!==e.fecha&&(c.value=e.fecha),!0});h("av-asistencia-dia",E);
