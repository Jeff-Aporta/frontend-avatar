import{crearComponente as d,define as b,emitir as c,html as n}from"../../../js/base/componente.js?v=kpvpk6";import{ClienteDatosSchema as p,ETAPAS_CRM as w}from"../../../js/consts/schemas/crm.schemas.js?v=pau73h";import{leerCampos as v,oNulo as t,oNumero as f}from"../utils/formulario.js?v=kf7q0g";import{ETAPA_LABEL as $}from"../utils/crm.js?v=5fsmj1";const g=d(import.meta.url,"av-cliente-form",{abierto:!1,cliente:null,miembros:[],puedeEscribir:!1,ocupado:!1,error:""},(r,i,l)=>{const e=i.cliente,a=!i.puedeEscribir,s=()=>c(l,"av-cliente-form-cerrar",{}),m=()=>{const o=v(r),u=p.safeParse({icliente:e?.icliente??null,nombre:(o.nombre??"").trim(),organizacion:t(o.organizacion),email:t(o.email),telefono:t(o.telefono),etapa:o.etapa||"contacto",valor:f(o.valor)??0,responsable:t(o.responsable),notas:t(o.notas)});if(!u.success){c(l,"av-cliente-form-error",{mensaje:"Revisa el nombre, el correo y el valor"});return}c(l,"av-cliente-guardar",{datos:u.data})};r.append(n`
      <iswc-dialog id="dialogo" label=${e?e.nombre:"Nuevo cliente"} backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${s}>
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
            <iswc-select name="etapa" label="Etapa" ?disabled=${a} value=${e?.etapa??"contacto"}>${w.map(o=>n`<iswc-option value=${o}>${$[o]}</iswc-option>`)}</iswc-select>
            <iswc-input name="valor" type="number" min="0" step="1000" label="Valor" prefix="$" ?readonly=${a} value=${String(e?.valor??0)}></iswc-input>
          </div>
          <iswc-select name="responsable" label="Responsable" clearable ?disabled=${a} value=${e?.responsable??""}>
            <iswc-option value="">Sin responsable</iswc-option>
            ${i.miembros.map(o=>n`<iswc-option value=${o.iusuario}>${o.usuario?.nombre||o.iusuario}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea name="notas" label="Notas" rows="3" ?readonly=${a} value=${e?.notas??""}></iswc-textarea>
          ${i.error?n`<iswc-callout color="danger">${i.error}</iswc-callout>`:null}
          ${a?n`<iswc-callout color="brand">Solo un gestor puede modificar clientes.</iswc-callout>`:null}
        </div>
        ${e&&!a?n`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este cliente?" oniswc-popconfirm-confirm=${()=>c(l,"av-cliente-eliminar",{icliente:e.icliente})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${s}>${a?"Cerrar":"Cancelar"}</iswc-button>
        ${a?null:n`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${i.ocupado} oniswc-click=${m}>${e?"Guardar":"Crear"}</iswc-button>`}
      </iswc-dialog>
    `)},(r,i,l)=>{if(i.cliente!==l.cliente||i.miembros!==l.miembros||i.error!==l.error||i.puedeEscribir!==l.puedeEscribir)return!1;const e=r.querySelector("#dialogo");return e?(e.open=i.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",i.ocupado),!0):!1});b("av-cliente-form",g);
