import{crearComponente as i,define as c,html as o}from"../../base/componente.js?v=zohalw";const e=i(import.meta.url,"av-vacio",{icono:"mdi:inbox-outline",titulo:"Nada por aqu\xED",texto:"",estado:"vacio",variante:"caja"},(t,a)=>{t.append(o`
    <div class="caja" part="caja" data-estado=${a.estado} data-variante=${a.variante} role=${a.estado==="error"?"alert":"status"}>
      ${a.estado==="cargando"?o`<iswc-spinner class="icono"></iswc-spinner>`:o`<iswc-icon class="icono" part="icono" icon=${a.estado==="error"?"mdi:alert-circle-outline":a.icono}></iswc-icon>`}
      <strong class="titulo" part="titulo">${a.estado==="cargando"?"Cargando\u2026":a.titulo}</strong>
      ${a.texto?o`<p class="texto" part="texto">${a.texto}</p>`:null}
      <div class="accion"><slot></slot></div>
    </div>
  `)});c("av-vacio",e);
