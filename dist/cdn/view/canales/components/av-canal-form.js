import{crearComponente as u,define as p,emitir as c,html as l}from"../../../js/base/componente.js?v=333q2n";const d=u(import.meta.url,"av-canal-form",{abierto:!1,equipos:[],guardando:!1,error:""},(i,e,r)=>{const o=a=>i.querySelector(`#${a}`)?.value?.trim()??"",n=()=>{const a=o("nombre");if(!a){i.querySelector("#nombre")?.setAttribute("error-text","El nombre es obligatorio");return}const s=Number(o("equipo"))||null;c(r,"av-canal-crear",{nombre:a,tipo:o("tipo")||"publico",descripcion:o("descripcion")||null,iequipo:s})},t=()=>c(r,"av-canal-form-cerrar");i.append(l`
      <iswc-dialog id="dialogo" label="Nuevo canal" backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${t}>
        <div class="campos" part="campos">
          <iswc-input id="nombre" label="Nombre" placeholder="general, soporte, ventas…" required maxlength="120"></iswc-input>
          <iswc-select id="tipo" label="Tipo" value="publico">
            <iswc-option value="publico">Público (toda la empresa)</iswc-option>
            <iswc-option value="privado">Privado (solo participantes)</iswc-option>
            <iswc-option value="directo">Directo</iswc-option>
          </iswc-select>
          <iswc-select id="equipo" label="Equipo (opcional)" clearable placeholder="Sin equipo">
            ${e.equipos.map(a=>l`<iswc-option value=${String(a.iequipo)}>${a.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea id="descripcion" label="Descripción" rows="2" maxlength="500"></iswc-textarea>
          ${e.error?l`<iswc-callout tone="danger">${e.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${t}>Cancelar</iswc-button>
        <iswc-button slot="footer" color="brand" id="guardar" ?loading=${e.guardando} oniswc-click=${n}>Crear canal</iswc-button>
      </iswc-dialog>
    `)},(i,e,r)=>{const o=i.querySelector("#dialogo");return!o||e.equipos!==r.equipos||e.error!==r.error?!1:(o.open=e.abierto,i.querySelector("#guardar")?.toggleAttribute("loading",e.guardando),!0)});p("av-canal-form",d);
