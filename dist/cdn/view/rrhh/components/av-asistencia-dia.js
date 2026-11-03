import{crearComponente as g,define as A,emitir as u,html as i}from"../../../js/base/componente.js?v=ykdqqm";import{ESTADOS_ASISTENCIA as f}from"../../../js/consts/schemas/rrhh.schemas.js?v=9o17sp";import{hoyISO as m,iniciales as y}from"../../../js/core/datos.js?v=2tahwq";import{colorDe as p,conteoDia as C,ETIQUETA as d,horaActual as $,ICONO as S}from"../utils/rrhh.js?v=m5xhfk";function h(s,e,l){const r=C(e.filas);s.querySelector(".conteo").replaceChildren(i`${["presente","retardo","ausente","vacaciones","sin_marcar"].map(a=>i`
    <span class="contador" data-estado=${a}><strong>${r[a]??0}</strong><span>${d[a]}</span></span>`)}`);const c=s.querySelector(".lista");if(e.cargando&&!e.filas.length){c.replaceChildren(i`${[1,2,3].map(()=>i`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}`);return}if(!e.filas.length){c.replaceChildren(i`<iswc-callout color="brand">No hay empleados vigentes para marcar.</iswc-callout>`);return}const v=e.fecha===m(),w=(a,n)=>()=>{const o=n==="presente"||n==="retardo";u(l,"av-asistencia-marcar",{iempleado:a.iempleado,estado:n,fecha:e.fecha,entrada:o?a.entrada??(v?$():null):null,salida:o?a.salida:null})},b=a=>()=>u(l,"av-asistencia-marcar",{iempleado:a.iempleado,estado:a.estado,fecha:e.fecha,entrada:a.entrada,salida:$()});c.replaceChildren(i`${e.filas.map(a=>{const n=e.ocupados.includes(a.iempleado),o=(a.estado==="presente"||a.estado==="retardo")&&!a.salida;return i`
      <div class="fila" part="fila" data-estado=${a.estado??"sin_marcar"} aria-busy=${n?"true":"false"}>
        <iswc-avatar class="avatar" initials=${y(a.nombre)} label=${a.nombre}></iswc-avatar>
        <div class="quien">
          <span class="nombre">${a.nombre}</span>
          <span class="cargo">${[a.cargo,a.departamento].filter(Boolean).join(" \xB7 ")}</span>
        </div>
        <div class="marca">
          <iswc-tag color=${p(a.estado)} pill variant=${a.estado?"filled-outlined":"outlined"}>${d[a.estado??"sin_marcar"]}</iswc-tag>
          ${a.entrada||a.salida?i`<span class="horas"><iswc-icon icon="mdi:clock-outline"></iswc-icon>${a.entrada??"\u2014"} – ${a.salida??"\u2026"}</span>`:null}
        </div>
        <div class="botones" role="group" aria-label=${`Marcar a ${a.nombre}`}>
          ${f.map(t=>i`<iswc-button variant=${a.estado===t?"soft":"plain"} color=${a.estado===t?p(t):"neutral"} aria-label=${d[t]} title=${d[t]} aria-pressed=${a.estado===t?"true":"false"} ?disabled=${!e.puedeMarcar||n} oniswc-click=${w(a,t)}><iswc-icon icon=${S[t]}></iswc-icon></iswc-button>`)}
          ${o?i`<iswc-button variant="outlined compact" color="brand" ?disabled=${!e.puedeMarcar||n||!v} oniswc-click=${b(a)}><iswc-icon slot="start" icon="mdi:logout-variant"></iswc-icon>Salida</iswc-button>`:null}
        </div>
      </div>`})}`)}const E=g(import.meta.url,"av-asistencia-dia",{fecha:"",filas:[],cargando:!1,puedeMarcar:!1,ocupados:[]},(s,e,l)=>{s.append(i`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon="mdi:calendar-check-outline"></iswc-icon> Control de asistencia</strong>
        <div class="barra" part="barra">
          <iswc-input class="fecha" type="date" label="Fecha" value=${e.fecha||m()} oniswc-change=${r=>u(l,"av-asistencia-fecha",{fecha:r.target.value||m()})}></iswc-input>
          <div class="conteo" part="conteo" aria-live="polite"></div>
        </div>
        <div class="lista" part="lista"></div>
      </iswc-card>
    `),h(s,e,l)},(s,e,l,r)=>{if(!s.querySelector(".lista"))return!1;h(s,e,r);const c=s.querySelector(".fecha");return c&&e.fecha&&c.value!==e.fecha&&(c.value=e.fecha),!0});A("av-asistencia-dia",E);
