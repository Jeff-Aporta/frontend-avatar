import{e as v}from"./chunk-DSFXORMY.mjs";import{ra as d,ta as u,ua as n,wa as p}from"./chunk-22HCQII4.mjs";var b=p(new URL("view/organizacion/components/av-empresa-form.min.mjs",new URL("../",import.meta.url)).href,"av-empresa-form",{abierto:!1,datos:{iempresa:null,nombre:"",nit:"",sector:"",descripcion:""},ocupado:!1,error:""},(a,e,r)=>{let o=()=>({iempresa:e.datos.iempresa,nombre:a.querySelector("#nombre").value,nit:a.querySelector("#nit").value,sector:a.querySelector("#sector").value,descripcion:a.querySelector("#descripcion").value}),i=()=>{let l=o(),m=v(l),t=a.querySelector("#aviso");if(m.length){t.textContent=m.join(". "),t.hidden=!1;return}t.hidden=!0,n(r,"av-empresa-guardar",{datos:l})},s=()=>n(r,"av-empresa-cerrar",{}),c=e.datos.iempresa===null;a.append(d`
      <iswc-dialog id="dialogo" label=${c?"Nueva empresa":"Editar empresa"} backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${s}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" required maxlength="160" value=${e.datos.nombre}></iswc-input>
          <iswc-input id="nit" label="NIT" maxlength="30" value=${e.datos.nit} hint="Identificación tributaria (opcional)"></iswc-input>
          <iswc-input id="sector" label="Sector" maxlength="80" value=${e.datos.sector}></iswc-input>
          <iswc-textarea id="descripcion" label="Descripción" rows="3" value=${e.datos.descripcion}></iswc-textarea>
          <iswc-callout id="aviso" color="danger" ?hidden=${!e.error}>${e.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${s}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" id="guardar" color="brand" ?loading=${e.ocupado} oniswc-click=${i}>${c?"Crear":"Guardar"}</iswc-button>
      </iswc-dialog>
    `)},(a,e,r)=>{if(e.datos!==r.datos)return!1;let o=a.querySelector("#dialogo");if(!o)return!1;o.open=e.abierto;let i=a.querySelector("#aviso");return i.textContent=e.error,i.hidden=!e.error,a.querySelector("#guardar").toggleAttribute("loading",e.ocupado),!0});u("av-empresa-form",b);
