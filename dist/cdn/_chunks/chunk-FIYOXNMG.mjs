import{a as v,b as E,c as y}from"./chunk-C3A57DEW.mjs";import{a as s}from"./chunk-ZW3MWMB5.mjs";import{d as g,e as b}from"./chunk-EYJKOFS6.mjs";import{F as d,G as m,H as w,O as p,ra as e,ta as f,ua as r,wa as $}from"./chunk-22HCQII4.mjs";var T=$(new URL("view/finanzas/components/av-transaccion-form.min.mjs",new URL("../",import.meta.url)).href,"av-transaccion-form",{abierto:!1,transaccion:null,categorias:[],puedeEscribir:!1,ocupado:!1,error:""},(t,i,n)=>{let a=i.transaccion,c=!i.puedeEscribir||!!a?.ifactura,l=()=>r(n,"av-transaccion-form-cerrar",{}),S=()=>{let o=v(t),u=p.safeParse({itransaccion:a?.itransaccion??null,tipo:o.tipo,categoria:o.categoria??"",descripcion:E(o.descripcion),monto:y(o.monto)??0,moneda:o.moneda,fecha:o.fecha,estado:o.estado});if(!u.success){r(n,"av-transaccion-form-error",{mensaje:"Revisa la categor\xEDa, el monto (mayor que 0) y la fecha"});return}r(n,"av-transaccion-guardar",{datos:u.data})},h=a?`${s[a.tipo]??a.tipo} \xB7 ${a.categoria}`:"Nueva transacci\xF3n";t.append(e`
      <iswc-dialog id="dialogo" label=${h} backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${l}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" ?disabled=${c} value=${a?.tipo??"gasto"}>${m.map(o=>e`<iswc-option value=${o}>${s[o]}</iswc-option>`)}</iswc-select>
            <iswc-input name="categoria" label="Categoría" required maxlength="80" ?readonly=${c} value=${a?.categoria??""} hint=${i.categorias.length?`Usadas: ${i.categorias.slice(0,6).join(", ")}`:""}></iswc-input>
          </div>
          <iswc-input name="descripcion" label="Descripción" maxlength="200" ?readonly=${c} value=${a?.descripcion??""}></iswc-input>
          <div class="fila">
            <iswc-input name="monto" type="number" min="0" step="any" label="Monto" required ?readonly=${c} value=${a?String(a.monto):""}></iswc-input>
            <iswc-select name="moneda" label="Moneda" ?disabled=${c} value=${a?.moneda??"COP"}>${d.map(o=>e`<iswc-option value=${o}>${o}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fecha" type="date" label="Fecha" required ?readonly=${c} value=${a?b(a.fecha):g()}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${c} value=${a?.estado??"completada"}>${w.map(o=>e`<iswc-option value=${o}>${s[o]}</iswc-option>`)}</iswc-select>
          </div>
          ${i.error?e`<iswc-callout color="danger">${i.error}</iswc-callout>`:null}
          ${a?.ifactura?e`<iswc-callout color="brand">Esta transacción la registró el pago de una factura: se gestiona desde la factura.</iswc-callout>`:i.puedeEscribir?null:e`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) registra o modifica transacciones.</iswc-callout>`}
        </div>
        ${a&&!c?e`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar esta transacción?" oniswc-popconfirm-confirm=${()=>r(n,"av-transaccion-eliminar",{itransaccion:a.itransaccion})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${l}>${c?"Cerrar":"Cancelar"}</iswc-button>
        ${c?null:e`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${i.ocupado} oniswc-click=${S}>${a?"Guardar":"Registrar"}</iswc-button>`}
      </iswc-dialog>
    `)},(t,i,n)=>{if(i.transaccion!==n.transaccion||i.error!==n.error||i.puedeEscribir!==n.puedeEscribir||i.categorias!==n.categorias)return!1;let a=t.querySelector("#dialogo");return a?(a.open=i.abierto,t.querySelector("#guardar")?.toggleAttribute("loading",i.ocupado),!0):!1});f("av-transaccion-form",T);
