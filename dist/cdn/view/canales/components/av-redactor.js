import{crearComponente as c,define as d,emitir as v,html as s}from"../../../js/base/componente.js?v=hjriku";import{textoParaEnviar as u}from"../utils/chat.js?v=zzzoma";const b=c(import.meta.url,"av-redactor",{deshabilitado:!1,enviando:!1,placeholder:"Escribe un mensaje\u2026 (Enter env\xEDa, Shift+Enter salto de l\xEDnea)"},(i,e,r)=>{const n=()=>i.querySelector("#area"),o=()=>{const t=n();if(!t||e.deshabilitado)return;const a=u(t.value);a&&(v(r,"av-mensaje-enviar",{contenido:a}),t.value="",t.focus())},l=t=>{const a=t;a.key==="Enter"&&!a.shiftKey&&!a.isComposing&&(a.preventDefault(),o())};i.append(s`
      <div class="redactor" part="redactor">
        <iswc-textarea id="area" class="area" part="area" autosize min-rows="1" max-rows="6" placeholder=${e.placeholder} ?disabled=${e.deshabilitado} onkeydown=${l}></iswc-textarea>
        <iswc-button id="enviar" class="enviar" color="brand" ?disabled=${e.deshabilitado} ?loading=${e.enviando} oniswc-click=${o} title="Enviar (Enter)">
          <iswc-icon icon="mdi:send"></iswc-icon>
        </iswc-button>
      </div>
      ${e.deshabilitado?s`<p class="aviso">No tienes permiso para escribir en este canal.</p>`:null}
    `)},(i,e)=>{const r=i.querySelector("#enviar"),n=i.querySelector("#area");return!r||!n?!1:(r.toggleAttribute("loading",e.enviando),r.toggleAttribute("disabled",e.deshabilitado),n.toggleAttribute("disabled",e.deshabilitado),!0)});d("av-redactor",b);
