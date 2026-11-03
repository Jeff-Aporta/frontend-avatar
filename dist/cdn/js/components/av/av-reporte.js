import{avisar as C,crearComponente as $,define as H,html as w}from"../../base/componente.js?v=uz3s44";import{mensajeDe as u,perfilesPrueba as L}from"../../core/api.js?v=45sjif";import{estado as g}from"../../core/estado.js?v=w7n12d";const v=8,b=20,f={recibiendo:"Recibiendo",pendiente:"En cola",en_proceso:"Un agente lo est\xE1 atendiendo",atendido:"Atendido"},s=()=>import("../../core/reporte.js?v=vq6m4c");async function x(){const c=g.yo?.iusuario;return!g.token||!c?!0:(await L().catch(()=>[])).some(n=>n.iusuario===c&&n.prueba!==!1)}const A=$(import.meta.url,"av-reporte",{},c=>{let i=[],n=null,p="";const e=o=>c.querySelector(o),r=o=>{const t=e(".error");t.textContent=o,t.hidden=!o},m=()=>{e(".adjuntos").replaceChildren(...i.map((t,a)=>w`
      <li class="adjunto">
        <iswc-icon icon=${t.type.startsWith("audio/")?"mdi:microphone-outline":"mdi:image-outline"} aria-hidden="true"></iswc-icon>
        <span class="nombre">${t.name}</span>
        <iswc-button variant="plain compact" color="neutral" aria-label=${`Quitar ${t.name}`} oniswc-click=${()=>{i.splice(a,1),m()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
      </li>`))},l=o=>{for(const t of o){if(i.length>=v)return r(`M\xE1ximo ${v} adjuntos.`);if(t.size>b*1024*1024)return r(`${t.name} supera ${b} MB.`);i.push(t)}r(""),m()},h=async()=>{e(".formulario").hidden=!1,e(".enviado").hidden=!0,e("#enviar").hidden=!1,r(""),e("#dialogo").open=!0,e("#codigo").hidden=!await x();const o=await s();e("#capturar").hidden=!o.puedeCapturar()},E=async()=>{const o=e("#dialogo");o.open=!1;try{l([await(await s()).capturarPantalla()])}catch(t){t.name!=="NotAllowedError"&&r(u(t))}finally{o.open=!0}},M=async()=>{const o=e("#grabar");try{if(n){const t=n;n=null,o.textContent="Nota de voz",l([await t()]);return}n=await(await s()).grabarVoz(),o.textContent="Detener y adjuntar"}catch(t){n=null,r(`No se pudo usar el micr\xF3fono: ${u(t)}`)}},T=async o=>{const t=await(await s()).seguimiento(o);e(".estado").textContent=f[t.estado]??t.estado,e(".bitacora").replaceChildren(...t.avance.map(a=>w`<li><iswc-relative-time date=${a.fh} format="short"></iswc-relative-time> ${a.texto}</li>`))},y=async()=>{const o=e("#texto").value?.trim()??"";if(p=e("#codigo").value??p,!o&&!i.length)return r("Cuenta qu\xE9 pas\xF3 o adjunta una captura o una nota de voz.");const t=e("#enviar");t.toggleAttribute("loading",!0);try{const a=await(await s()).enviarReporte(o,i,p);i=[],m(),e("#texto").value="",e(".formulario").hidden=!0,e(".enviado").hidden=!1,e("#enviar").hidden=!0,e(".numero").textContent=`#${a.ierror}`,e(".estado").textContent=f[a.estado]??a.estado,e(".bitacora").replaceChildren(),e("#actualizar").onclick=()=>{T(a).catch(d=>C(u(d),"danger"))}}catch(a){const d=u(a);/código|incorrecto/i.test(d)&&(e("#codigo").hidden=!1),r(d)}finally{t.toggleAttribute("loading",!1)}};c.append(w`
    <iswc-button class="flotante" part="boton" variant="outlined compact" color="neutral" aria-label="Reportar un error" title="Reportar un error" oniswc-click=${()=>{h()}}>
      <iswc-icon icon="mdi:bug-outline"></iswc-icon>
    </iswc-button>
    <iswc-dialog id="dialogo" label="Reportar un error" backdrop-variant="basic">
      <div class="formulario" part="formulario" onpaste=${o=>l([...o.clipboardData?.files??[]].filter(t=>t.type.startsWith("image/")))}>
        <iswc-textarea id="texto" label="¿Qué pasó?" rows="4" placeholder="Qué hacías, qué esperabas y qué ocurrió"></iswc-textarea>
        <div class="acciones">
          <iswc-button id="capturar" variant="outlined compact" color="neutral" hidden oniswc-click=${()=>{E()}}><iswc-icon slot="start" icon="mdi:monitor-screenshot"></iswc-icon>Capturar pantalla</iswc-button>
          <iswc-button variant="outlined compact" color="neutral" oniswc-click=${()=>e(".archivo").click()}><iswc-icon slot="start" icon="mdi:image-plus-outline"></iswc-icon>Imagen</iswc-button>
          <iswc-button id="grabar" variant="outlined compact" color="neutral" oniswc-click=${()=>{M()}}><iswc-icon slot="start" icon="mdi:microphone-outline"></iswc-icon>Nota de voz</iswc-button>
          <input class="archivo" type="file" accept="image/*,audio/*" multiple hidden onchange=${o=>{const t=o.currentTarget;l([...t.files??[]]),t.value=""}}>
        </div>
        <ul class="adjuntos"></ul>
        <iswc-input id="codigo" type="password" autocomplete="off" label="Código de reporte" hidden></iswc-input>
        <p class="nota">Se envía también el contenido de esta página y los últimos errores del navegador, sin contraseñas.</p>
      </div>
      <div class="enviado" hidden>
        <p>Reporte <strong class="numero"></strong> recibido. <span class="estado"></span>.</p>
        <ul class="bitacora"></ul>
        <iswc-button id="actualizar" variant="outlined compact" color="neutral"><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Ver avance</iswc-button>
      </div>
      <p class="error" role="alert" hidden></p>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>e("#dialogo").open=!1}>Cerrar</iswc-button>
      <iswc-button slot="footer" id="enviar" variant="compact" color="brand" oniswc-click=${()=>{y()}}>Enviar</iswc-button>
    </iswc-dialog>
  `)});H("av-reporte",A);
