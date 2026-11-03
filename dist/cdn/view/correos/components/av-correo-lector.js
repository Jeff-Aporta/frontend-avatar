import{crearComponente as d,define as u,emitir as t,html as e}from"../../../js/base/componente.js?v=uz3s44";import{movimientosDesde as p}from"../utils/correos.js?v=r675qt";const w=d(import.meta.url,"av-correo-lector",{correo:null,nombres:{},puedeMarcar:!1,relacionados:[]},(l,c,r)=>{const a=c.correo;if(!a){l.append(e`<div class="nada" part="nada"><iswc-empty-state icono="mdi:email-open-outline" titulo="Elige un correo" texto="Ábrelo desde la lista para leerlo y responder."></iswc-empty-state></div>`);return}const s=o=>c.nombres[o]??o,n=o=>t(r,"av-correo-marcar",{ibuzon:a.ibuzon,cambios:o}),i=!c.puedeMarcar;l.append(e`
    <article class="lector" part="lector">
      <header class="cabeza" part="cabeza">
        <div class="barra" part="barra" role="toolbar" aria-label="Acciones del correo">
          <iswc-button class="volver" variant="plain compact" color="neutral" aria-label="Volver a la lista" oniswc-click=${()=>t(r,"av-correo-cerrar",{})}><iswc-icon slot="start" icon="mdi:arrow-left"></iswc-icon>Volver</iswc-button>
          <iswc-button variant="soft compact" color="brand" ?disabled=${i} oniswc-click=${()=>t(r,"av-correo-responder",{ibuzon:a.ibuzon,todos:!1})}><iswc-icon slot="start" icon="mdi:reply"></iswc-icon>Responder</iswc-button>
          <iswc-button variant="outlined compact" color="neutral" ?disabled=${i} aria-label="Responder a todos" title="Responder a todos" oniswc-click=${()=>t(r,"av-correo-responder",{ibuzon:a.ibuzon,todos:!0})}><iswc-icon slot="start" icon="mdi:reply-all"></iswc-icon><span class="txt">A todos</span></iswc-button>
          <iswc-button variant="outlined compact" color="neutral" ?disabled=${i} aria-label="Reenviar" title="Reenviar" oniswc-click=${()=>t(r,"av-correo-reenviar",{ibuzon:a.ibuzon})}><iswc-icon slot="start" icon="mdi:share-outline"></iswc-icon><span class="txt">Reenviar</span></iswc-button>
          <span class="separador"></span>
          <iswc-button variant="plain compact" color=${a.destacado?"warning":"neutral"} ?disabled=${i} aria-pressed=${a.destacado?"true":"false"} aria-label=${a.destacado?"Quitar destacado":"Destacar"} oniswc-click=${()=>n({destacado:!a.destacado})}><iswc-icon icon=${a.destacado?"mdi:star":"mdi:star-outline"}></iswc-icon></iswc-button>
          <iswc-button variant="plain compact" color="neutral" ?disabled=${i} aria-label="Marcar como no leído" title="Marcar como no leído" oniswc-click=${()=>n({leido:!1})}><iswc-icon icon="mdi:email-mark-as-unread"></iswc-icon></iswc-button>
          ${p(a.carpeta).map(o=>e`<iswc-button variant="plain compact" color=${o.carpeta==="papelera"?"danger":"neutral"} ?disabled=${i} aria-label=${o.label} title=${o.label} oniswc-click=${()=>n({carpeta:o.carpeta})}><iswc-icon icon=${o.icono}></iswc-icon></iswc-button>`)}
        </div>
        <iswc-heading level="2" class="asunto" part="asunto">${a.asunto}</iswc-heading>
        ${a.etiquetas.length?e`<div class="etiquetas">${a.etiquetas.map(o=>e`<iswc-tag color=${o==="urgente"?"danger":"brand"} variant="outlined" pill>${o}</iswc-tag>`)}</div>`:null}
        <div class="meta" part="meta">
          <iswc-person usuario=${a.remitente} nombre=${c.nombres[a.remitente]??""} detalle=${`<${a.remitente}>`}></iswc-person>
          <iswc-relative-time class="hora" date=${a.creado}></iswc-relative-time>
        </div>
        <dl class="para">
          <dt>Para</dt><dd>${a.destinatarios.map(s).join(", ")}</dd>
          ${a.cc.length?e`<dt>CC</dt><dd>${a.cc.map(s).join(", ")}</dd>`:null}
        </dl>
      </header>
      <div class="cuerpo" part="cuerpo">${a.cuerpo}</div>
      ${c.relacionados.length?e`
        <section class="relacionados" part="relacionados" aria-label="Relacionados">
          <iswc-heading level="3" class="rotulo"><iswc-icon icon="mdi:link-variant"></iswc-icon> Relacionados</iswc-heading>
          ${c.relacionados.map(o=>e`<iswc-button class="relacionado" variant="plain compact" color="neutral" oniswc-click=${()=>t(r,"av-correo-abrir",{ibuzon:o.ibuzon})}><iswc-icon slot="start" icon="mdi:email-outline"></iswc-icon><span class="r-asunto">${o.asunto}</span><span slot="end" class="r-quien">${s(o.remitente)}</span></iswc-button>`)}
        </section>`:null}
      ${i?e`<iswc-callout color="brand" class="aviso">Tu rol no tiene permiso de correo (avatar.correo): puedes leer, pero no responder ni ordenar el buzón.</iswc-callout>`:null}
    </article>
  `)});u("av-correo-lector",w);
