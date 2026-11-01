import{crearComponente as f,define as $,emitir as s,html as c}from"../../../js/base/componente.js?v=m5nu5c";import{leerCampos as p,oNulo as b,oNumero as m}from"../../../js/base/campos.js?v=b0imlo";import{MovimientoDatosSchema as k,TIPOS_MOVIMIENTO as y}from"../../../js/consts/schemas/inventario.schemas.js?v=ixgawp";import{ETIQUETA as h,stockResultante as v}from"../utils/inventario.js?v=su2x7t";const E={entrada:"Suma al stock (compras, devoluciones).",salida:"Resta del stock (ventas, despachos, mermas).",ajuste:"Fija el stock al conteo f\xEDsico."},M=f(import.meta.url,"av-movimiento-form",{abierto:!1,productos:[],iproducto:null,tipo:"entrada",ocupado:!1,error:""},(e,o,a)=>{const n=()=>s(a,"av-movimiento-form-cerrar",{}),l=()=>{const t=p(e),i=o.productos.find(w=>w.iproducto===Number(t.iproducto)),r=e.querySelector(".previa"),d=e.querySelector(".ayuda");if(d.textContent=E[t.tipo??""]??"",!i){r.replaceChildren(c`<span>Elige un producto</span>`);return}const u=v(i.stock,t.tipo??"entrada",m(t.cantidad)??0);r.toggleAttribute("data-error",u==null),r.replaceChildren(c`<span class="rotulo">Stock</span><strong>${i.stock}</strong><iswc-icon icon="mdi:arrow-right-thin"></iswc-icon><strong class="nuevo">${u??"insuficiente"}</strong>`)},g=()=>{const t=p(e),i=k.safeParse({iproducto:m(t.iproducto)??0,tipo:t.tipo,cantidad:m(t.cantidad)??-1,motivo:b(t.motivo)});if(!i.success||!i.data.iproducto){s(a,"av-movimiento-form-error",{mensaje:"Elige el producto y una cantidad entera (mayor que 0, salvo en un ajuste)"});return}const r=o.productos.find(d=>d.iproducto===i.data.iproducto);if(r&&v(r.stock,i.data.tipo,i.data.cantidad)==null){s(a,"av-movimiento-form-error",{mensaje:`Stock insuficiente: hay ${r.stock}`});return}s(a,"av-movimiento-guardar",{datos:i.data})};e.append(c`
      <iswc-dialog id="dialogo" label="Movimiento de inventario" backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${n}>
        <div class="campos" part="campos" oniswc-change=${l} oniswc-input=${l}>
          <iswc-select name="iproducto" label="Producto" required placeholder="Elige un producto" value=${o.iproducto?String(o.iproducto):""}>
            ${o.productos.map(t=>c`<iswc-option value=${String(t.iproducto)}>${t.sku?`${t.sku} \xB7 `:""}${t.nombre} (${t.stock})</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" value=${o.tipo}>${y.map(t=>c`<iswc-option value=${t}>${h[t]}</iswc-option>`)}</iswc-select>
            <iswc-input name="cantidad" type="number" min="0" step="1" label=${o.tipo==="ajuste"?"Conteo f\xEDsico":"Cantidad"} required value="1"></iswc-input>
          </div>
          <p class="ayuda"></p>
          <div class="previa" part="previa" aria-live="polite"></div>
          <iswc-input name="motivo" label="Motivo" maxlength="300" placeholder="Compra, venta, conteo…"></iswc-input>
          ${o.error?c`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${n}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${g}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `),l()},(e,o,a)=>{if(o.productos!==a.productos||o.iproducto!==a.iproducto||o.tipo!==a.tipo||o.error!==a.error)return!1;const n=e.querySelector("#dialogo");return n?(n.open=o.abierto,e.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});$("av-movimiento-form",M);
