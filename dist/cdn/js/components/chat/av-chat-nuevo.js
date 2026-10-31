import{crearComponente as h,define as g,emitir as m,html as d}from"../../base/componente.js?v=333q2n";import{iniciales as w,normalizar as b}from"../../chat/formato.js?v=d40ok6";import{textos as C}from"../../chat/textos.js?v=gpj3dh";function $(a,e=null){return d`
    <span class="foto" data-color=${String(a.color)}><iswc-avatar initials=${w(a.nombre)} image=${a.foto??""} label=${a.nombre}></iswc-avatar>${a.enLinea?d`<span class="presencia"></span>`:null}</span>
    <span class="datos"><strong>${a.nombre}</strong><span>${a.detalle}</span></span>
    ${e}`}function y(a,e,t){const n=C();let i=e;a.append(d`
    <iswc-dialog class="dialogo" label=${n.nuevoChat} backdrop-variant="basic">
      <div class="contenido">
        <iswc-input class="q" type="search" clearable placeholder=${n.buscarPersonas} aria-label=${n.buscarPersonas}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
        <button class="fila grupo" type="button"><span class="foto icono"><iswc-icon icon="mdi:account-multiple-plus"></iswc-icon></span><span class="datos"><strong>${n.nuevoGrupo}</strong></span></button>
        <div class="personas" role="list"></div>
      </div>
    </iswc-dialog>
  `);const p=a.querySelector(".dialogo"),c=a.querySelector(".q"),v=a.querySelector(".personas"),u=()=>{const o=b((c.value??"").trim()),s=i.personas.filter(l=>!o||b(`${l.nombre} ${l.detalle}`).includes(o));v.replaceChildren(...s.map(l=>{const r=document.createElement("button");return r.type="button",r.className="fila",r.setAttribute("role","listitem"),r.append($(l)),r.addEventListener("click",()=>m(t,"av-chat-directo",{iusuario:l.id})),r})),s.length||v.append(Object.assign(document.createElement("p"),{className:"vacio",textContent:n.sinResultados}))};c.addEventListener("iswc-input",u),a.querySelector(".grupo")?.addEventListener("click",()=>m(t,"av-chat-panel",{panel:"grupo"})),p.addEventListener("iswc-hide",()=>m(t,"av-chat-panel-cerrar",{panel:"nuevo"}));const f=(o,s)=>{i=o,(!s||JSON.stringify(s.personas)!==JSON.stringify(o.personas))&&u(),o.abierto!==p.open&&(p.open=o.abierto),o.abierto&&!s?.abierto&&(c.value="",u(),requestAnimationFrame(()=>c.focus()))};return f(e,null),f}const N=h(import.meta.url,"av-chat-nuevo",{abierto:!1,personas:[]},(a,e,t)=>{t.__aplicar=y(a,e,t)},(a,e,t,n)=>{const i=n.__aplicar;return i?(i(e,t),!0):!1});g("av-chat-nuevo",N);export{$ as filaPersona};
