import{crearComponente as r,define as n,html as e}from"../../../js/base/componente.js?v=3c3042";import{fechaDe as i}from"../utils/chat.js?v=zzzoma";const p=r(import.meta.url,"av-mensaje",{mensaje:null,propio:!1},(s,t)=>{const a=t.mensaje;if(!a)return;const o=i(a.creado);if(a.tipo==="sistema"){s.append(e`<div class="sistema" part="sistema"><iswc-tag color="neutral" pill>${a.contenido}</iswc-tag></div>`);return}s.append(e`
    <article class="mensaje" part="mensaje" data-propio=${t.propio?"1":"0"}>
      <av-persona class="autor" id="autor"></av-persona>
      <div class="burbuja" part="burbuja">
        <p class="texto">${a.contenido}</p>
        <span class="meta">${a.editado?e`<span class="editado">editado · </span>`:null}${o?e`<iswc-relative-time date=${o} format="short"></iswc-relative-time>`:null}</span>
      </div>
    </article>
  `),s.querySelector("#autor").props={iusuario:a.iusuario,nombre:a.autor?.nombre??null,compacto:!0}});n("av-mensaje",p);
