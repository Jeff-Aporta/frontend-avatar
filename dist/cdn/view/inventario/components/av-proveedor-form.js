import{crearComponente as m,define as v,emitir as c,html as i}from"../../../js/base/componente.js?v=ykdqqm";import{leerCampos as p,oNulo as l}from"../../../js/base/campos.js?v=b0imlo";import{ProveedorDatosSchema as b}from"../../../js/consts/schemas/inventario.schemas.js?v=ixgawp";const f=m(import.meta.url,"av-proveedor-form",{abierto:!1,proveedor:null,productos:0,puedeEscribir:!1,ocupado:!1,error:""},(t,o,r)=>{const e=o.proveedor,a=!o.puedeEscribir,d=()=>c(r,"av-proveedor-form-cerrar",{}),u=()=>{const n=p(t),s=b.safeParse({iproveedor:e?.iproveedor??null,nombre:n.nombre??"",contacto:l(n.contacto),email:l(n.email),telefono:l(n.telefono)});if(!s.success){c(r,"av-proveedor-form-error",{mensaje:"Revisa el nombre y el correo"});return}c(r,"av-proveedor-guardar",{datos:s.data})};t.append(i`
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
        ${e&&!a&&o.productos===0?i`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este proveedor?" oniswc-popconfirm-confirm=${()=>c(r,"av-proveedor-eliminar",{iproveedor:e.iproveedor})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${d}>${a?"Cerrar":"Cancelar"}</iswc-button>
        ${a?null:i`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${u}>${e?"Guardar":"Crear proveedor"}</iswc-button>`}
      </iswc-dialog>
    `)},(t,o,r)=>{if(o.proveedor!==r.proveedor||o.productos!==r.productos||o.error!==r.error||o.puedeEscribir!==r.puedeEscribir)return!1;const e=t.querySelector("#dialogo");return e?(e.open=o.abierto,t.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});v("av-proveedor-form",f);
