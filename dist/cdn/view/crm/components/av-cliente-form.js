import{crearComponente as d,define as b,emitir as c,html as n}from"../../../js/base/componente.js?v=0air4b";import{ClienteDatosSchema as w,ETAPAS_CRM as p}from"../../../js/consts/schemas/crm.schemas.js?v=pfwn5d";import{leerCampos as f,oNulo as t,oNumero as v}from"../utils/formulario.js?v=kf7q0g";import{ETAPA_LABEL as $}from"../utils/crm.js?v=a3gyoi";const g=d(import.meta.url,"av-cliente-form",{abierto:!1,cliente:null,miembros:[],puedeEscribir:!1,ocupado:!1,error:""},(r,o,l)=>{const e=o.cliente,a=!o.puedeEscribir,s=()=>c(l,"av-cliente-form-cerrar",{}),m=()=>{const i=f(r),u=w.safeParse({icliente:e?.icliente??null,nombre:(i.nombre??"").trim(),organizacion:t(i.organizacion),email:t(i.email),telefono:t(i.telefono),etapa:i.etapa||"contacto",valor:v(i.valor)??0,responsable:t(i.responsable),notas:t(i.notas)});if(!u.success){c(l,"av-cliente-form-error",{mensaje:"Revisa el nombre, el correo y el valor"});return}c(l,"av-cliente-guardar",{datos:u.data})};r.append(n`
      <iswc-dialog id="dialogo" label=${e?e.nombre:"Nuevo cliente"} backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${s}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-input name="nombre" label="Nombre" required ?readonly=${a} value=${e?.nombre??""}></iswc-input>
            <iswc-input name="organizacion" label="Organización" ?readonly=${a} value=${e?.organizacion??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="email" type="email" label="Correo" ?readonly=${a} value=${e?.email??""}></iswc-input>
            <iswc-input name="telefono" type="tel" label="Teléfono" ?readonly=${a} value=${e?.telefono??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-select name="etapa" label="Etapa" ?disabled=${a} value=${e?.etapa??"contacto"}>${p.map(i=>n`<iswc-option value=${i}>${$[i]}</iswc-option>`)}</iswc-select>
            <iswc-input name="valor" type="number" min="0" step="1000" label="Valor" prefix="$" ?readonly=${a} value=${String(e?.valor??0)}></iswc-input>
          </div>
          <iswc-select name="responsable" label="Responsable" clearable ?disabled=${a} value=${e?.responsable??""}>
            <iswc-option value="">Sin responsable</iswc-option>
            ${o.miembros.map(i=>n`<iswc-option value=${i.iusuario}>${i.usuario?.nombre||i.iusuario}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea name="notas" label="Notas" rows="3" ?readonly=${a} value=${e?.notas??""}></iswc-textarea>
          ${o.error?n`<iswc-callout tone="danger">${o.error}</iswc-callout>`:null}
          ${a?n`<iswc-callout tone="info">Solo un gestor puede modificar clientes.</iswc-callout>`:null}
        </div>
        ${e&&!a?n`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este cliente?" oniswc-popconfirm-confirm=${()=>c(l,"av-cliente-eliminar",{icliente:e.icliente})}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${s}>${a?"Cerrar":"Cancelar"}</iswc-button>
        ${a?null:n`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${m}>${e?"Guardar":"Crear"}</iswc-button>`}
      </iswc-dialog>
    `)},(r,o,l)=>{if(o.cliente!==l.cliente||o.miembros!==l.miembros||o.error!==l.error||o.puedeEscribir!==l.puedeEscribir)return!1;const e=r.querySelector("#dialogo");return e?(e.open=o.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});b("av-cliente-form",g);
