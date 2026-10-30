import{crearComponente as m,define as p,emitir as d,html as c}from"../../../js/base/componente.js?v=hjriku";import{agruparPorDia as u,esPropio as g,ICONO_CANAL as w}from"../utils/chat.js?v=zzzoma";import"./av-mensaje.js?v=44go8j";import"./av-redactor.js?v=g1anr9";const f=m(import.meta.url,"av-conversacion",{canal:null,mensajes:[],yo:"",cargando:!1,enviando:!1,puedeEscribir:!1},(e,a,s)=>{if(!a.canal){e.append(c`<av-vacio id="sin-canal" class="vacio"></av-vacio>`),e.querySelector("#sin-canal").props=a.cargando?{estado:"cargando"}:{icono:"mdi:forum-outline",titulo:"Elige un canal",texto:"La conversaci\xF3n aparecer\xE1 aqu\xED."};return}const o=a.canal,v=u(a.mensajes);e.append(c`
    <section class="conversacion" part="conversacion" aria-label=${`Canal ${o.nombre}`}>
      <header class="cabeza" part="cabeza">
        <iswc-button class="volver" variant="plain" color="neutral" title="Volver a la lista" oniswc-click=${()=>d(s,"av-conversacion-volver")}><iswc-icon icon="mdi:chevron-left"></iswc-icon></iswc-button>
        <iswc-icon class="icono" icon=${w[o.tipo]??"mdi:pound"}></iswc-icon>
        <div class="titulo"><strong>${o.nombre}</strong>${o.descripcion?c`<span class="descripcion">${o.descripcion}</span>`:null}</div>
        <iswc-tag color="neutral" class="tipo">${o.tipo}</iswc-tag>
        <iswc-button class="refrescar" variant="plain" color="neutral" title="Actualizar" ?loading=${a.cargando} oniswc-click=${()=>d(s,"av-conversacion-refrescar")}><iswc-icon icon="mdi:refresh"></iswc-icon></iswc-button>
      </header>
      <div class="mensajes" part="mensajes" id="mensajes">
        ${a.mensajes.length===0?c`<av-vacio id="vacio" class="vacio"></av-vacio>`:v.map(i=>c`
            <div class="dia" data-dia=${i.dia}>
              <div class="separador"><iswc-tag color="neutral" pill>${i.rotulo}</iswc-tag></div>
              ${i.mensajes.map(t=>{const l=document.createElement("av-mensaje");return l.props={mensaje:t,propio:g(t,a.yo)},l})}
            </div>
          `)}
      </div>
      <av-redactor id="redactor" class="redactor"></av-redactor>
    </section>
  `);const r=e.querySelector("#vacio");r&&(r.props=a.cargando?{estado:"cargando"}:{icono:"mdi:message-text-outline",titulo:"Sin mensajes",texto:"S\xE9 quien empieza la conversaci\xF3n."}),e.querySelector("#redactor").props={deshabilitado:!a.puedeEscribir,enviando:a.enviando};const n=e.querySelector("#mensajes");n&&requestAnimationFrame(()=>n.scrollTo({top:n.scrollHeight}))});p("av-conversacion",f);
