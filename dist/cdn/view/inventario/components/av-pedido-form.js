import{crearComponente as N,define as A,emitir as v,html as l}from"../../../js/base/componente.js?v=zohalw";import{oNulo as g,oNumero as E}from"../../../js/base/campos.js?v=b0imlo";import{ESTADOS_PEDIDO as T,PedidoDatosSchema as I,TIPOS_PEDIDO as D}from"../../../js/consts/schemas/inventario.schemas.js?v=bx2vxl";import{fechaISO as f,hoyISO as q}from"../../../js/core/datos.js?v=2tahwq";import{ETIQUETA as P,formatoPrecio as L,totalPedido as O}from"../utils/inventario.js?v=cd32w5";const k=N(import.meta.url,"av-pedido-form",{abierto:!1,pedido:null,items:[],productos:[],proveedores:[],clientes:[],puedeEscribir:!1,ocupado:!1,error:""},(t,o,n)=>{const i=o.pedido,r=!o.puedeEscribir;let u=o.items.length?o.items.map(e=>({iproducto:e.iproducto,cantidad:e.cantidad,precio:Number(e.precio??0)})):[{iproducto:0,cantidad:1,precio:0}];const c=e=>e?.value??"",b=()=>c(t.querySelector("#tipo"))||i?.tipo||"proveedor",m=()=>[...t.querySelectorAll(".item")].map(e=>({iproducto:Number(c(e.querySelector(".i-prod")))||0,cantidad:Number(c(e.querySelector(".i-cant"))||0),precio:Number(c(e.querySelector(".i-precio"))||0)})),w=()=>{t.querySelector(".total").textContent=L(O(m()))},C=e=>a=>{const d=o.productos.find(p=>p.iproducto===Number(a.target.value)),s=t.querySelectorAll(".item")[e]?.querySelector(".i-precio");d&&s&&!Number(s.value)&&(s.value=String(b()==="proveedor"?Number(d.costo??0):Number(d.precio??0))),w()},$=()=>{t.querySelector(".items").replaceChildren(l`${u.map((e,a)=>l`
        <div class="item" part="item">
          <iswc-select class="i-prod" label=${a===0?"Producto":""} aria-label="Producto" placeholder="Producto" ?disabled=${r} value=${e.iproducto?String(e.iproducto):""} oniswc-change=${C(a)}>
            ${o.productos.map(d=>l`<iswc-option value=${String(d.iproducto)}>${d.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-input class="i-cant" type="number" min="1" step="1" label=${a===0?"Cant.":""} aria-label="Cantidad" ?readonly=${r} value=${String(e.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${a===0?"Precio":""} aria-label="Precio unitario" ?readonly=${r} value=${String(e.precio)}></iswc-input>
          ${r?null:l`<iswc-button variant="plain" color="danger" size="small" aria-label="Quitar ítem" ?disabled=${u.length===1} oniswc-click=${()=>{u=m(),u.splice(a,1),$()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`}
        </div>`)}`),w()},y=()=>{const e=b();t.querySelector(".c-proveedor")?.toggleAttribute("hidden",e!=="proveedor"),t.querySelector(".c-cliente")?.toggleAttribute("hidden",e!=="cliente")},S=()=>v(n,"av-pedido-form-cerrar",{}),h=()=>{const e=b(),a=I.safeParse({ipedido:i?.ipedido??null,tipo:e,iproveedor:e==="proveedor"?E(c(t.querySelector("#iproveedor"))):null,icliente:e==="cliente"?E(c(t.querySelector("#icliente"))):null,estado:c(t.querySelector("#estado"))||"pendiente",fpedido:c(t.querySelector("#fpedido"))||q(),fenvio:g(c(t.querySelector("#fenvio"))),fentrega:g(c(t.querySelector("#fentrega"))),notas:g(c(t.querySelector("#notas"))),items:m().filter(p=>p.iproducto)}),d=a.success&&(a.data.tipo==="proveedor"?!a.data.iproveedor:!a.data.icliente),s=a.success&&new Set(a.data.items.map(p=>p.iproducto)).size!==a.data.items.length;if(!a.success||d||s){v(n,"av-pedido-form-error",{mensaje:s?"Un producto aparece dos veces: s\xFAmalo en un solo \xEDtem":d?`Elige el ${e==="proveedor"?"proveedor":"cliente"}`:"Agrega al menos un producto con cantidad entera mayor que 0"});return}v(n,"av-pedido-guardar",{datos:a.data})};t.append(l`
      <iswc-dialog id="dialogo" label=${i?`Pedido ${i.codigo??`#${i.ipedido}`}`:"Nuevo pedido"} backdrop-variant="basic" ?open=${o.abierto} oniswc-hide=${S}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select id="tipo" label="Tipo" ?disabled=${r||!!i} value=${i?.tipo??"proveedor"} oniswc-change=${y}>${D.map(e=>l`<iswc-option value=${e}>${P[e]}</iswc-option>`)}</iswc-select>
            <iswc-select id="estado" label="Estado" ?disabled=${r} value=${i?.estado??"pendiente"}>${T.map(e=>l`<iswc-option value=${e}>${P[e]}</iswc-option>`)}</iswc-select>
          </div>
          <iswc-select id="iproveedor" class="c-proveedor" label="Proveedor" placeholder="Elige el proveedor" ?disabled=${r} value=${i?.iproveedor?String(i.iproveedor):""}>${o.proveedores.map(e=>l`<iswc-option value=${String(e.iproveedor)}>${e.nombre}</iswc-option>`)}</iswc-select>
          <iswc-select id="icliente" class="c-cliente" label="Cliente" placeholder="Elige el cliente" ?disabled=${r} value=${i?.icliente?String(i.icliente):""}>${o.clientes.map(e=>l`<iswc-option value=${String(e.icliente)}>${e.organizacion?`${e.organizacion} \xB7 ${e.nombre}`:e.nombre}</iswc-option>`)}</iswc-select>
          <div class="fila tres">
            <iswc-input id="fpedido" type="date" label="Fecha del pedido" ?readonly=${r} value=${f(i?.fpedido)||q()}></iswc-input>
            <iswc-input id="fenvio" type="date" label="Envío" ?readonly=${r} value=${f(i?.fenvio)}></iswc-input>
            <iswc-input id="fentrega" type="date" label="Entrega" ?readonly=${r} value=${f(i?.fentrega)}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${w}></div>
          <div class="pie">
            ${r?null:l`<iswc-button variant="outlined" color="brand" size="small" oniswc-click=${()=>{u=[...m(),{iproducto:0,cantidad:1,precio:0}],$()}}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>`}
            <span class="etiqueta-total">Total</span><strong class="total" part="total"></strong>
          </div>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${r} value=${i?.notas??""}></iswc-textarea>
          ${o.error?l`<iswc-callout color="danger">${o.error}</iswc-callout>`:null}
          ${r?l`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) crea o modifica pedidos.</iswc-callout>`:null}
        </div>
        ${i&&!r?l`<iswc-button slot="footer" id="eliminar" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este pedido y sus ítems?" oniswc-popconfirm-confirm=${()=>v(n,"av-pedido-eliminar",{ipedido:i.ipedido})}><iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${S}>${r?"Cerrar":"Cancelar"}</iswc-button>
        ${r?null:l`<iswc-button slot="footer" color="brand" id="guardar" ?loading=${o.ocupado} oniswc-click=${h}>${i?"Guardar":"Crear pedido"}</iswc-button>`}
      </iswc-dialog>
    `),$(),y()},(t,o,n)=>{if(o.pedido!==n.pedido||o.items!==n.items||o.productos!==n.productos||o.error!==n.error||o.puedeEscribir!==n.puedeEscribir)return!1;const i=t.querySelector("#dialogo");return i?(i.open=o.abierto,t.querySelector("#guardar")?.toggleAttribute("loading",o.ocupado),!0):!1});A("av-pedido-form",k);
