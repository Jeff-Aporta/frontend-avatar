import{crearComponente as i,define as c,html as t}from"../../base/componente.js?v=y3pj6c";const e=i(import.meta.url,"av-vacio",{icono:"mdi:inbox-outline",titulo:"Nada por aqu\xED",texto:"",estado:"vacio"},(a,o)=>{a.append(t`
    <div class="caja" part="caja" data-estado=${o.estado} role=${o.estado==="error"?"alert":"status"}>
      ${o.estado==="cargando"?t`<iswc-spinner class="icono"></iswc-spinner>`:t`<iswc-icon class="icono" part="icono" icon=${o.estado==="error"?"mdi:alert-circle-outline":o.icono}></iswc-icon>`}
      <strong class="titulo" part="titulo">${o.estado==="cargando"?"Cargando\u2026":o.titulo}</strong>
      ${o.texto?t`<p class="texto" part="texto">${o.texto}</p>`:null}
      <div class="accion"><slot></slot></div>
    </div>
  `)});c("av-vacio",e);
