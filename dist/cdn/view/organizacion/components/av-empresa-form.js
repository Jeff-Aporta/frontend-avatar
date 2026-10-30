import{crearComponente as m,define as u,emitir as d,html as p}from"../../../js/base/componente.js?v=hjriku";import{validarEmpresa as v}from"../utils/organizacion.js?v=bn0ies";const b=m(import.meta.url,"av-empresa-form",{abierto:!1,datos:{iempresa:null,nombre:"",nit:"",sector:"",descripcion:""},ocupado:!1,error:""},(a,e,r)=>{const o=()=>({iempresa:e.datos.iempresa,nombre:a.querySelector("#nombre").value,nit:a.querySelector("#nit").value,sector:a.querySelector("#sector").value,descripcion:a.querySelector("#descripcion").value}),t=()=>{const c=o(),l=v(c),i=a.querySelector("#aviso");if(l.length){i.textContent=l.join(". "),i.hidden=!1;return}i.hidden=!0,d(r,"av-empresa-guardar",{datos:c})},n=()=>d(r,"av-empresa-cerrar",{}),s=e.datos.iempresa===null;a.append(p`
      <iswc-dialog id="dialogo" label=${s?"Nueva empresa":"Editar empresa"} backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${n}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" required maxlength="160" value=${e.datos.nombre}></iswc-input>
          <iswc-input id="nit" label="NIT" maxlength="30" value=${e.datos.nit} hint="Identificación tributaria (opcional)"></iswc-input>
          <iswc-input id="sector" label="Sector" maxlength="80" value=${e.datos.sector}></iswc-input>
          <iswc-textarea id="descripcion" label="Descripción" rows="3" value=${e.datos.descripcion}></iswc-textarea>
          <iswc-callout id="aviso" tone="danger" ?hidden=${!e.error}>${e.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${n}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="guardar" color="brand" ?loading=${e.ocupado} oniswc-click=${t}>${s?"Crear":"Guardar"}</iswc-button>
      </iswc-dialog>
    `)},(a,e,r)=>{if(e.datos!==r.datos)return!1;const o=a.querySelector("#dialogo");if(!o)return!1;o.open=e.abierto;const t=a.querySelector("#aviso");return t.textContent=e.error,t.hidden=!e.error,a.querySelector("#guardar").toggleAttribute("loading",e.ocupado),!0});u("av-empresa-form",b);
