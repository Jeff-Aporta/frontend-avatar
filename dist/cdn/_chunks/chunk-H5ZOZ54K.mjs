import{b as k,n as v}from"./chunk-PWSHK26A.mjs";import{a as p,b,c as l}from"./chunk-C3A57DEW.mjs";import{Q as w,aa as g,ra as c,ta as f,ua as s,wa as $}from"./chunk-22HCQII4.mjs";var E={entrada:"Suma al stock (compras, devoluciones).",salida:"Resta del stock (ventas, despachos, mermas).",ajuste:"Fija el stock al conteo f\xEDsico."},M=$(new URL("view/inventario/components/av-movimiento-form.min.mjs",new URL("../",import.meta.url)).href,"av-movimiento-form",{abierto:!1,productos:[],iproducto:null,tipo:"entrada",ocupado:!1,error:""},(a,o,e)=>{let n=()=>s(e,"av-movimiento-form-cerrar",{}),d=()=>{let t=p(a),i=o.productos.find(h=>h.iproducto===Number(t.iproducto)),r=a.querySelector(".previa"),u=a.querySelector(".ayuda");if(u.textContent=E[t.tipo??""]??"",!i){r.replaceChildren(c`<span>Elige un producto</span>`);return}let m=v(i.stock,t.tipo??"entrada",l(t.cantidad)??0);r.toggleAttribute("data-error",m==null),r.replaceChildren(c`<span class="rotulo">Stock</span><strong>${i.stock}</strong><iswc-icon icon="mdi:arrow-right-thin"></iswc-icon><strong class="nuevo">${m??"insuficiente"}</strong>`)},y=()=>{let t=p(a),i=g.safeParse({iproducto:l(t.iproducto)??0,tipo:t.tipo,cantidad:l(t.cantidad)??-1,motivo:b(t.motivo)});if(!i.success||!i.data.iproducto){s(e,"av-movimiento-form-error",{mensaje:"Elige el producto y una cantidad entera (mayor que 0, salvo en un ajuste)"});return}let r=o.productos.find(u=>u.iproducto===i.data.iproducto);if(r&&v(r.stock,i.data.tipo,i.data.cantidad)==null){s(e,"av-movimiento-form-error",{mensaje:`Stock insuficiente: hay ${r.stock}`});return}s(e,"av-movimiento-guardar",{datos:i.data})};a.append(c`
      <iswc-dialog id="dialogo" label="Movimiento de inventario" backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${n}>
        <div class="campos" part="campos" oniswc-change=${d} oniswc-input=${d}>
          <iswc-select name="iproducto" label="Producto" required placeholder="Elige un producto" value=${o.iproducto?String(o.iproducto):""}>
            ${o.productos.map(t=>c`<iswc-option value=${String(t.iproducto)}>${t.sku?`${t.sku} \xB7 `:""}${t.nombre} (${t.stock})</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select name="tipo" label="Tipo" value=${o.tipo}>${w.map(t=>c`<iswc-option value=${t}>${k[t]}</iswc-option>`)}</iswc-select>
            <iswc-input name="cantidad" type="number" min="0" step="1" label=${o.tipo==="ajuste"?"Conteo f\xEDsico":"Cantidad"} required value="1"></iswc-input>
          </div>
          <p class="ayuda"></p>
          <div class="previa" part="previa" aria-live="polite"></div>
          <iswc-input name="motivo" label="Motivo" maxlength="300" placeholder="Compra, venta, conteo…"></iswc-input>
          ${o.error?c`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${n}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${y}><iswc-icon slot="start" icon="mdi:check"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `),d()},(a,o,e)=>{if(o.productos!==e.productos||o.iproducto!==e.iproducto||o.tipo!==e.tipo||o.error!==e.error)return!1;let n=a.querySelector("#dialogo");return n?(n.open=o.abierto,a.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});f("av-movimiento-form",M);
