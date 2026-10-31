import{crearComponente as w,define as f,emitir as t,html as n}from"../../../js/base/componente.js?v=ehrr8d";import{leerCampos as p,oNulo as $,oNumero as g}from"../../../js/base/campos.js?v=b0imlo";import{ESTADOS_TRANSACCION as b,MONEDAS as v,TIPOS_TRANSACCION as E,TransaccionDatosSchema as y}from"../../../js/consts/schemas/finanzas.schemas.js?v=w3xy1l";import{fechaISO as S,hoyISO as h}from"../../../js/core/datos.js?v=2tahwq";import{ETIQUETA as s}from"../utils/finanzas.js?v=ct4umv";const T=w(import.meta.url,"av-transaccion-form",{abierto:!1,transaccion:null,categorias:[],puedeEscribir:!1,ocupado:!1,error:""},(r,i,c)=>{const a=i.transaccion,e=!i.puedeEscribir||!!a?.ifactura,l=()=>t(c,"av-transaccion-form-cerrar",{}),d=()=>{const o=p(r),u=y.safeParse({itransaccion:a?.itransaccion??null,tipo:o.tipo,categoria:o.categoria??"",descripcion:$(o.descripcion),monto:g(o.monto)??0,moneda:o.moneda,fecha:o.fecha,estado:o.estado});if(!u.success){t(c,"av-transaccion-form-error",{mensaje:"Revisa la categor\xEDa, el monto (mayor que 0) y la fecha"});return}t(c,"av-transaccion-guardar",{datos:u.data})},m=a?`${s[a.tipo]??a.tipo} \xB7 ${a.categoria}`:"Nueva transacci\xF3n";r.append(n`
      <iswc-dialog id="dialogo" label=${m} backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${l}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" ?disabled=${e} value=${a?.tipo??"gasto"}>${E.map(o=>n`<iswc-option value=${o}>${s[o]}</iswc-option>`)}</iswc-select>
            <iswc-input name="categoria" label="Categoría" required maxlength="80" ?readonly=${e} value=${a?.categoria??""} hint=${i.categorias.length?`Usadas: ${i.categorias.slice(0,6).join(", ")}`:""}></iswc-input>
          </div>
          <iswc-input name="descripcion" label="Descripción" maxlength="200" ?readonly=${e} value=${a?.descripcion??""}></iswc-input>
          <div class="fila">
            <iswc-input name="monto" type="number" min="0" step="any" label="Monto" required ?readonly=${e} value=${a?String(a.monto):""}></iswc-input>
            <iswc-select name="moneda" label="Moneda" ?disabled=${e} value=${a?.moneda??"COP"}>${v.map(o=>n`<iswc-option value=${o}>${o}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fecha" type="date" label="Fecha" required ?readonly=${e} value=${a?S(a.fecha):h()}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${e} value=${a?.estado??"completada"}>${b.map(o=>n`<iswc-option value=${o}>${s[o]}</iswc-option>`)}</iswc-select>
          </div>
          ${i.error?n`<iswc-callout color="danger">${i.error}</iswc-callout>`:null}
          ${a?.ifactura?n`<iswc-callout color="brand">Esta transacción la registró el pago de una factura: se gestiona desde la factura.</iswc-callout>`:i.puedeEscribir?null:n`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) registra o modifica transacciones.</iswc-callout>`}
        </div>
        ${a&&!e?n`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta transacción?" oniswc-popconfirm-confirm=${()=>t(c,"av-transaccion-eliminar",{itransaccion:a.itransaccion})}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${l}>${e?"Cerrar":"Cancelar"}</iswc-button>
        ${e?null:n`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${i.ocupado} oniswc-click=${d}>${a?"Guardar":"Registrar"}</iswc-button>`}
      </iswc-dialog>
    `)},(r,i,c)=>{if(i.transaccion!==c.transaccion||i.error!==c.error||i.puedeEscribir!==c.puedeEscribir||i.categorias!==c.categorias)return!1;const a=r.querySelector("#dialogo");return a?(a.open=i.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",i.ocupado),!0):!1});f("av-transaccion-form",T);
