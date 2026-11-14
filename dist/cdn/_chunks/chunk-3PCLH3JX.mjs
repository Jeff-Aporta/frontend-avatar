import{ra as l,ta as n,ua as c,wa as s}from"./chunk-22HCQII4.mjs";var m=s(new URL("view/canales/components/av-canal-form.min.mjs",new URL("../",import.meta.url)).href,"av-canal-form",{abierto:!1,equipos:[],guardando:!1,error:""},(i,o,r)=>{let e=a=>i.querySelector(`#${a}`)?.value?.trim()??"",u=()=>{let a=e("nombre");if(!a){i.querySelector("#nombre")?.setAttribute("error-text","El nombre es obligatorio");return}let p=Number(e("equipo"))||null;c(r,"av-canal-crear",{nombre:a,tipo:e("tipo")||"publico",descripcion:e("descripcion")||null,iequipo:p})},t=()=>c(r,"av-canal-form-cerrar");i.append(l`
      <iswc-dialog id="dialogo" label="Nuevo canal" backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${t}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" placeholder="general, soporte, ventas…" required maxlength="120"></iswc-input>
          <iswc-select id="tipo" label="Tipo" value="publico">
            <iswc-option value="publico">Público (toda la empresa)</iswc-option>
            <iswc-option value="privado">Privado (solo participantes)</iswc-option>
            <iswc-option value="directo">Directo</iswc-option>
          </iswc-select>
          <iswc-select id="equipo" label="Equipo (opcional)" clearable placeholder="Sin equipo">
            ${o.equipos.map(a=>l`<iswc-option value=${String(a.iequipo)}>${a.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea id="descripcion" label="Descripción" rows="2" maxlength="500"></iswc-textarea>
          ${o.error?l`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${t}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${o.guardando} oniswc-click=${u}>Crear canal</iswc-button>
      </iswc-dialog>
    `)},(i,o,r)=>{let e=i.querySelector("#dialogo");return!e||o.equipos!==r.equipos||o.error!==r.error?!1:(e.open=o.abierto,i.querySelector("#guardar")?.toggleAttribute("loading",o.guardando),!0)});n("av-canal-form",m);
