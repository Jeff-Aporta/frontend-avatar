import{crearComponente as m,define as v,emitir as l,html as i}from"../../../js/base/componente.js?v=333q2n";import{leerCampos as p,oNulo as c}from"../../../js/base/campos.js?v=b0imlo";import{ProveedorDatosSchema as b}from"../../../js/consts/schemas/inventario.schemas.js?v=bx2vxl";const f=m(import.meta.url,"av-proveedor-form",{abierto:!1,proveedor:null,productos:0,puedeEscribir:!1,ocupado:!1,error:""},(n,o,r)=>{const e=o.proveedor,a=!o.puedeEscribir,d=()=>l(r,"av-proveedor-form-cerrar",{}),u=()=>{const t=p(n),s=b.safeParse({iproveedor:e?.iproveedor??null,nombre:t.nombre??"",contacto:c(t.contacto),email:c(t.email),telefono:c(t.telefono)});if(!s.success){l(r,"av-proveedor-form-error",{mensaje:"Revisa el nombre y el correo"});return}l(r,"av-proveedor-guardar",{datos:s.data})};n.append(i`
      <iswc-dialog id="dialogo" label=${e?e.nombre:"Nuevo proveedor"} backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${d}>
        <div class="campos" part="campos">
          <iswc-input name="nombre" label="Nombre" required maxlength="160" ?readonly=${a} value=${e?.nombre??""}></iswc-input>
          <iswc-input name="contacto" label="Persona de contacto" maxlength="120" ?readonly=${a} value=${e?.contacto??""}></iswc-input>
          <div class="fila">
            <iswc-input name="email" type="email" label="Correo" maxlength="160" ?readonly=${a} value=${e?.email??""}></iswc-input>
            <iswc-input name="telefono" type="tel" label="Teléfono" maxlength="40" ?readonly=${a} value=${e?.telefono??""}></iswc-input>
          </div>
          ${e?i`<p class="nota"><iswc-icon icon="mdi:package-variant-closed"></iswc-icon> Surte ${o.productos} producto${o.productos===1?"":"s"} del catálogo.</p>`:null}
          ${o.error?i`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
          ${a?i`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) modifica proveedores.</iswc-callout>`:null}
        </div>
        ${e&&!a&&o.productos===0?i`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este proveedor?" oniswc-popconfirm-confirm=${()=>l(r,"av-proveedor-eliminar",{iproveedor:e.iproveedor})}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${d}>${a?"Cerrar":"Cancelar"}</iswc-button>
        ${a?null:i`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${u}>${e?"Guardar":"Crear proveedor"}</iswc-button>`}
      </iswc-dialog>
    `)},(n,o,r)=>{if(o.proveedor!==r.proveedor||o.productos!==r.productos||o.error!==r.error||o.puedeEscribir!==r.puedeEscribir)return!1;const e=n.querySelector("#dialogo");return e?(e.open=o.abierto,n.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});v("av-proveedor-form",f);
