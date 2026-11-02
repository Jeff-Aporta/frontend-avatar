import{crearComponente as p,define as w,emitir as r,html as t}from"../../../js/base/componente.js?v=49yoqc";import{leerCampos as f,oNulo as $,oNumero as g}from"../../../js/base/campos.js?v=b0imlo";import{ESTADOS_TRANSACCION as b,MONEDAS as v,TIPOS_TRANSACCION as E,TransaccionDatosSchema as y}from"../../../js/consts/schemas/finanzas.schemas.js?v=plym48";import{fechaISO as S,hoyISO as h}from"../../../js/core/datos.js?v=2tahwq";import{ETIQUETA as s}from"../utils/finanzas.js?v=5ywdnm";const T=p(import.meta.url,"av-transaccion-form",{abierto:!1,transaccion:null,categorias:[],puedeEscribir:!1,ocupado:!1,error:""},(n,o,e)=>{const a=o.transaccion,c=!o.puedeEscribir||!!a?.ifactura,l=()=>r(e,"av-transaccion-form-cerrar",{}),d=()=>{const i=f(n),u=y.safeParse({itransaccion:a?.itransaccion??null,tipo:i.tipo,categoria:i.categoria??"",descripcion:$(i.descripcion),monto:g(i.monto)??0,moneda:i.moneda,fecha:i.fecha,estado:i.estado});if(!u.success){r(e,"av-transaccion-form-error",{mensaje:"Revisa la categor\xEDa, el monto (mayor que 0) y la fecha"});return}r(e,"av-transaccion-guardar",{datos:u.data})},m=a?`${s[a.tipo]??a.tipo} \xB7 ${a.categoria}`:"Nueva transacci\xF3n";n.append(t`
      <iswc-dialog id="dialogo" label=${m} backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${l}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" ?disabled=${c} value=${a?.tipo??"gasto"}>${E.map(i=>t`<iswc-option value=${i}>${s[i]}</iswc-option>`)}</iswc-select>
            <iswc-input name="categoria" label="Categoría" required maxlength="80" ?readonly=${c} value=${a?.categoria??""} hint=${o.categorias.length?`Usadas: ${o.categorias.slice(0,6).join(", ")}`:""}></iswc-input>
          </div>
          <iswc-input name="descripcion" label="Descripción" maxlength="200" ?readonly=${c} value=${a?.descripcion??""}></iswc-input>
          <div class="fila">
            <iswc-input name="monto" type="number" min="0" step="any" label="Monto" required ?readonly=${c} value=${a?String(a.monto):""}></iswc-input>
            <iswc-select name="moneda" label="Moneda" ?disabled=${c} value=${a?.moneda??"COP"}>${v.map(i=>t`<iswc-option value=${i}>${i}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fecha" type="date" label="Fecha" required ?readonly=${c} value=${a?S(a.fecha):h()}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${c} value=${a?.estado??"completada"}>${b.map(i=>t`<iswc-option value=${i}>${s[i]}</iswc-option>`)}</iswc-select>
          </div>
          ${o.error?t`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
          ${a?.ifactura?t`<iswc-callout color="brand">Esta transacción la registró el pago de una factura: se gestiona desde la factura.</iswc-callout>`:o.puedeEscribir?null:t`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) registra o modifica transacciones.</iswc-callout>`}
        </div>
        ${a&&!c?t`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta transacción?" oniswc-popconfirm-confirm=${()=>r(e,"av-transaccion-eliminar",{itransaccion:a.itransaccion})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${l}>${c?"Cerrar":"Cancelar"}</iswc-button>
        ${c?null:t`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${d}>${a?"Guardar":"Registrar"}</iswc-button>`}
      </iswc-dialog>
    `)},(n,o,e)=>{if(o.transaccion!==e.transaccion||o.error!==e.error||o.puedeEscribir!==e.puedeEscribir||o.categorias!==e.categorias)return!1;const a=n.querySelector("#dialogo");return a?(a.open=o.abierto,n.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});w("av-transaccion-form",T);
