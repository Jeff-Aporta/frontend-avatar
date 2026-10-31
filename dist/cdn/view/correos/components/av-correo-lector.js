import{crearComponente as d,define as u,emitir as c,html as e}from"../../../js/base/componente.js?v=zohalw";import{movimientosDesde as p}from"../utils/correos.js?v=7271qg";const b=d(import.meta.url,"av-correo-lector",{correo:null,nombres:{},puedeMarcar:!1,relacionados:[]},(n,r,s)=>{const a=r.correo;if(!a){n.append(e`<div class="nada" part="nada"><av-vacio id="vacio"></av-vacio></div>`),n.querySelector("#vacio").props={icono:"mdi:email-open-outline",titulo:"Elige un correo",texto:"\xC1brelo desde la lista para leerlo y responder."};return}const t=o=>r.nombres[o]??o,l=o=>c(s,"av-correo-marcar",{ibuzon:a.ibuzon,cambios:o}),i=!r.puedeMarcar;n.append(e`
    <article class="lector" part="lector">
      <header class="cabeza" part="cabeza">
        <div class="barra" part="barra" role="toolbar" aria-label="Acciones del correo">
          <iswc-button class="volver" variant="plain" color="neutral" size="small" aria-label="Volver a la lista" oniswc-click=${()=>c(s,"av-correo-cerrar",{})}><iswc-icon slot="start" icon="mdi:arrow-left"></iswc-icon>Volver</iswc-button>
          <iswc-button variant="soft" color="brand" size="small" ?disabled=${i} oniswc-click=${()=>c(s,"av-correo-responder",{ibuzon:a.ibuzon,todos:!1})}><iswc-icon slot="start" icon="mdi:reply"></iswc-icon>Responder</iswc-button>
          <iswc-button variant="outlined" color="neutral" size="small" ?disabled=${i} aria-label="Responder a todos" title="Responder a todos" oniswc-click=${()=>c(s,"av-correo-responder",{ibuzon:a.ibuzon,todos:!0})}><iswc-icon slot="start" icon="mdi:reply-all"></iswc-icon><span class="txt">A todos</span></iswc-button>
          <iswc-button variant="outlined" color="neutral" size="small" ?disabled=${i} aria-label="Reenviar" title="Reenviar" oniswc-click=${()=>c(s,"av-correo-reenviar",{ibuzon:a.ibuzon})}><iswc-icon slot="start" icon="mdi:share-outline"></iswc-icon><span class="txt">Reenviar</span></iswc-button>
          <span class="separador"></span>
          <iswc-button variant="plain" color=${a.destacado?"warning":"neutral"} size="small" ?disabled=${i} aria-pressed=${a.destacado?"true":"false"} aria-label=${a.destacado?"Quitar destacado":"Destacar"} oniswc-click=${()=>l({destacado:!a.destacado})}><iswc-icon icon=${a.destacado?"mdi:star":"mdi:star-outline"}></iswc-icon></iswc-button>
          <iswc-button variant="plain" color="neutral" size="small" ?disabled=${i} aria-label="Marcar como no leído" title="Marcar como no leído" oniswc-click=${()=>l({leido:!1})}><iswc-icon icon="mdi:email-mark-as-unread"></iswc-icon></iswc-button>
          ${p(a.carpeta).map(o=>e`<iswc-button variant="plain" color=${o.carpeta==="papelera"?"danger":"neutral"} size="small" ?disabled=${i} aria-label=${o.label} title=${o.label} oniswc-click=${()=>l({carpeta:o.carpeta})}><iswc-icon icon=${o.icono}></iswc-icon></iswc-button>`)}
        </div>
        <h2 class="asunto" part="asunto">${a.asunto}</h2>
        ${a.etiquetas.length?e`<div class="etiquetas">${a.etiquetas.map(o=>e`<iswc-tag color=${o==="urgente"?"danger":"brand"} variant="outlined" pill>${o}</iswc-tag>`)}</div>`:null}
        <div class="meta" part="meta">
          <av-persona id="remitente"></av-persona>
          <iswc-relative-time class="hora" date=${a.creado}></iswc-relative-time>
        </div>
        <dl class="para">
          <dt>Para</dt><dd>${a.destinatarios.map(t).join(", ")}</dd>
          ${a.cc.length?e`<dt>CC</dt><dd>${a.cc.map(t).join(", ")}</dd>`:null}
        </dl>
      </header>
      <div class="cuerpo" part="cuerpo">${a.cuerpo}</div>
      ${r.relacionados.length?e`
        <section class="relacionados" part="relacionados" aria-label="Relacionados">
          <h3 class="rotulo"><iswc-icon icon="mdi:link-variant"></iswc-icon> Relacionados</h3>
          ${r.relacionados.map(o=>e`<iswc-button class="relacionado" variant="plain" color="neutral" oniswc-click=${()=>c(s,"av-correo-abrir",{ibuzon:o.ibuzon})}><iswc-icon slot="start" icon="mdi:email-outline"></iswc-icon><span class="r-asunto">${o.asunto}</span><span slot="end" class="r-quien">${t(o.remitente)}</span></iswc-button>`)}
        </section>`:null}
      ${i?e`<iswc-callout color="brand" class="aviso">Tu rol no tiene permiso de correo (avatar.correo): puedes leer, pero no responder ni ordenar el buzón.</iswc-callout>`:null}
    </article>
  `),n.querySelector("#remitente").props={iusuario:a.remitente,nombre:r.nombres[a.remitente]??null,detalle:`<${a.remitente}>`}});u("av-correo-lector",b);
