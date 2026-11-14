import{m as g,p as s}from"../../../_chunks/chunk-SDQIKR5O.mjs";import"../../../_chunks/chunk-3OLLRFAW.mjs";import"../../../_chunks/chunk-BY7FRINU.mjs";import{a as v}from"../../../_chunks/chunk-ZQI42E6M.mjs";import{ra as p,ta as b,wa as f,xa as h}from"../../../_chunks/chunk-22HCQII4.mjs";import"../../../_chunks/chunk-JOUQNVKA.mjs";import"../../../_chunks/chunk-2XJIRYNX.mjs";import"../../../_chunks/chunk-FWBWSRYW.mjs";import"../../../_chunks/chunk-S24WVIZS.mjs";var E=8,M=20,T={recibiendo:"Recibiendo",pendiente:"En cola",en_proceso:"Un agente lo est\xE1 atendiendo",atendido:"Atendido"},l=()=>import("../../../_chunks/reporte-NUP26ZL7.mjs");async function x(){let c=v.yo?.iusuario;return!v.token||!c?!0:(await g().catch(()=>[])).some(n=>n.iusuario===c&&n.prueba!==!1)}var j=f(new URL("js/components/av/av-reporte.min.mjs",new URL("../../../",import.meta.url)).href,"av-reporte",{},c=>{let i=[],n=null,m="",t=o=>c.querySelector(o),r=o=>{let e=t(".error");e.textContent=o,e.hidden=!o},w=()=>{t(".adjuntos").replaceChildren(...i.map((e,a)=>p`
      <li class="adjunto">
        <iswc-icon icon=${e.type.startsWith("audio/")?"mdi:microphone-outline":"mdi:image-outline"} aria-hidden="true"></iswc-icon>
        <span class="nombre">${e.name}</span>
        <iswc-button variant="plain compact" color="neutral" aria-label=${`Quitar ${e.name}`} oniswc-click=${()=>{i.splice(a,1),w()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
      </li>`))},d=o=>{for(let e of o){if(i.length>=E)return r(`M\xE1ximo ${E} adjuntos.`);if(e.size>M*1024*1024)return r(`${e.name} supera ${M} MB.`);i.push(e)}r(""),w()},y=async()=>{t(".formulario").hidden=!1,t(".enviado").hidden=!0,t("#enviar").hidden=!1,r(""),t("#dialogo").open=!0,t("#codigo").hidden=!await x();let o=await l();t("#capturar").hidden=!o.puedeCapturar()},C=async()=>{let o=t("#dialogo");o.open=!1;try{d([await(await l()).capturarPantalla()])}catch(e){e.name!=="NotAllowedError"&&r(s(e))}finally{o.open=!0}},L=async()=>{let o=t("#grabar");try{if(n){let e=n;n=null,o.textContent="Nota de voz",d([await e()]);return}n=await(await l()).grabarVoz(),o.textContent="Detener y adjuntar"}catch(e){n=null,r(`No se pudo usar el micr\xF3fono: ${s(e)}`)}},$=async o=>{let e=await(await l()).seguimiento(o);t(".estado").textContent=T[e.estado]??e.estado,t(".bitacora").replaceChildren(...e.avance.map(a=>p`<li><iswc-relative-time date=${a.fh} format="short"></iswc-relative-time> ${a.texto}</li>`))},H=async()=>{let o=t("#texto").value?.trim()??"";if(m=t("#codigo").value??m,!o&&!i.length)return r("Cuenta qu\xE9 pas\xF3 o adjunta una captura o una nota de voz.");let e=t("#enviar");e.toggleAttribute("loading",!0);try{let a=await(await l()).enviarReporte(o,i,m);i=[],w(),t("#texto").value="",t(".formulario").hidden=!0,t(".enviado").hidden=!1,t("#enviar").hidden=!0,t(".numero").textContent=`#${a.ierror}`,t(".estado").textContent=T[a.estado]??a.estado,t(".bitacora").replaceChildren(),t("#actualizar").onclick=()=>{$(a).catch(u=>h(s(u),"danger"))}}catch(a){let u=s(a);/código|incorrecto/i.test(u)&&(t("#codigo").hidden=!1),r(u)}finally{e.toggleAttribute("loading",!1)}};c.append(p`
    <iswc-button class="flotante" part="boton" variant="outlined compact" color="neutral" aria-label="Reportar un error" title="Reportar un error" oniswc-click=${()=>{y()}}>
      <iswc-icon icon="mdi:bug-outline"></iswc-icon>
    </iswc-button>
    <iswc-dialog id="dialogo" label="Reportar un error" backdrop-variant="basic">
      <div class="formulario" part="formulario" onpaste=${o=>d([...o.clipboardData?.files??[]].filter(e=>e.type.startsWith("image/")))}>
        <iswc-textarea id="texto" label="¿Qué pasó?" rows="4" placeholder="Qué hacías, qué esperabas y qué ocurrió"></iswc-textarea>
        <div class="acciones">
          <iswc-button id="capturar" variant="outlined compact" color="neutral" hidden oniswc-click=${()=>{C()}}><iswc-icon slot="start" icon="mdi:monitor-screenshot"></iswc-icon>Capturar pantalla</iswc-button>
          <iswc-button variant="outlined compact" color="neutral" oniswc-click=${()=>t(".archivo").click()}><iswc-icon slot="start" icon="mdi:image-plus-outline"></iswc-icon>Imagen</iswc-button>
          <iswc-button id="grabar" variant="outlined compact" color="neutral" oniswc-click=${()=>{L()}}><iswc-icon slot="start" icon="mdi:microphone-outline"></iswc-icon>Nota de voz</iswc-button>
          <input class="archivo" type="file" accept="image/*,audio/*" multiple hidden onchange=${o=>{let e=o.currentTarget;d([...e.files??[]]),e.value=""}}>
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
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>t("#dialogo").open=!1}>Cerrar</iswc-button>
      <iswc-button slot="footer" id="enviar" variant="compact" color="brand" oniswc-click=${()=>{H()}}>Enviar</iswc-button>
    </iswc-dialog>
  `)});b("av-reporte",j);
