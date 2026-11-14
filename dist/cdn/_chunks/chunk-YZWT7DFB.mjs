import{a as w}from"./chunk-N62ZI6CO.mjs";import{i as m,l as d,ra as l,ta as b,ua as c,wa as p}from"./chunk-22HCQII4.mjs";function f(i){let e={};for(let a of i.querySelectorAll("[name]")){let o=a.getAttribute("name");o&&(e[o]=a.value==null?"":String(a.value))}return e}var t=i=>i&&i.trim()?i.trim():null;function v(i){if(!i||!i.trim())return null;let e=Number(i);return Number.isFinite(e)?e:null}var g=p(new URL("view/crm/components/av-cliente-form.min.mjs",new URL("../",import.meta.url)).href,"av-cliente-form",{abierto:!1,cliente:null,miembros:[],puedeEscribir:!1,ocupado:!1,error:""},(i,e,a)=>{let o=e.cliente,r=!e.puedeEscribir,s=()=>c(a,"av-cliente-form-cerrar",{}),$=()=>{let n=f(i),u=d.safeParse({icliente:o?.icliente??null,nombre:(n.nombre??"").trim(),organizacion:t(n.organizacion),email:t(n.email),telefono:t(n.telefono),etapa:n.etapa||"contacto",valor:v(n.valor)??0,responsable:t(n.responsable),notas:t(n.notas)});if(!u.success){c(a,"av-cliente-form-error",{mensaje:"Revisa el nombre, el correo y el valor"});return}c(a,"av-cliente-guardar",{datos:u.data})};i.append(l`
      <iswc-dialog id="dialogo" label=${o?o.nombre:"Nuevo cliente"} backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${s}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-input name="nombre" label="Nombre" required ?readonly=${r} value=${o?.nombre??""}></iswc-input>
            <iswc-input name="organizacion" label="Organización" ?readonly=${r} value=${o?.organizacion??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="email" type="email" label="Correo" ?readonly=${r} value=${o?.email??""}></iswc-input>
            <iswc-input name="telefono" type="tel" label="Teléfono" ?readonly=${r} value=${o?.telefono??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-select name="etapa" label="Etapa" ?disabled=${r} value=${o?.etapa??"contacto"}>${m.map(n=>l`<iswc-option value=${n}>${w[n]}</iswc-option>`)}</iswc-select>
            <iswc-input name="valor" type="number" min="0" step="1000" label="Valor" prefix="$" ?readonly=${r} value=${String(o?.valor??0)}></iswc-input>
          </div>
          <iswc-select name="responsable" label="Responsable" clearable ?disabled=${r} value=${o?.responsable??""}>
            <iswc-option value="">Sin responsable</iswc-option>
            ${e.miembros.map(n=>l`<iswc-option value=${n.iusuario}>${n.usuario?.nombre||n.iusuario}</iswc-option>`)}
          </iswc-select>
          <iswc-textarea name="notas" label="Notas" rows="3" ?readonly=${r} value=${o?.notas??""}></iswc-textarea>
          ${e.error?l`<iswc-callout color="danger">${e.error}</iswc-callout>`:null}
          ${r?l`<iswc-callout color="brand">Solo un gestor puede modificar clientes.</iswc-callout>`:null}
        </div>
        ${o&&!r?l`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este cliente?" oniswc-popconfirm-confirm=${()=>c(a,"av-cliente-eliminar",{icliente:o.icliente})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${s}>${r?"Cerrar":"Cancelar"}</iswc-button>
        ${r?null:l`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${e.ocupado} oniswc-click=${$}>${o?"Guardar":"Crear"}</iswc-button>`}
      </iswc-dialog>
    `)},(i,e,a)=>{if(e.cliente!==a.cliente||e.miembros!==a.miembros||e.error!==a.error||e.puedeEscribir!==a.puedeEscribir)return!1;let o=i.querySelector("#dialogo");return o?(o.open=e.abierto,i.querySelector("#guardar")?.toggleAttribute("loading",e.ocupado),!0):!1});b("av-cliente-form",g);
