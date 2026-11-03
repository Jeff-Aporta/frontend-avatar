import{crearComponente as N,define as A,emitir as v,html as c}from"../../../js/base/componente.js?v=3wyanc";import{oNulo as g,oNumero as E}from"../../../js/base/campos.js?v=b0imlo";import{ESTADOS_PEDIDO as T,PedidoDatosSchema as I,TIPOS_PEDIDO as D}from"../../../js/consts/schemas/inventario.schemas.js?v=55ts8c";import{fechaISO as f,hoyISO as q}from"../../../js/core/datos.js?v=2tahwq";import{ETIQUETA as P,formatoPrecio as L,totalPedido as O}from"../utils/inventario.js?v=su2x7t";const k=N(import.meta.url,"av-pedido-form",{abierto:!1,pedido:null,items:[],productos:[],proveedores:[],clientes:[],puedeEscribir:!1,ocupado:!1,error:""},(t,i,n)=>{const o=i.pedido,r=!i.puedeEscribir;let u=i.items.length?i.items.map(e=>({iproducto:e.iproducto,cantidad:e.cantidad,precio:Number(e.precio??0)})):[{iproducto:0,cantidad:1,precio:0}];const l=e=>e?.value??"",b=()=>l(t.querySelector("#tipo"))||o?.tipo||"proveedor",m=()=>[...t.querySelectorAll(".item")].map(e=>({iproducto:Number(l(e.querySelector(".i-prod")))||0,cantidad:Number(l(e.querySelector(".i-cant"))||0),precio:Number(l(e.querySelector(".i-precio"))||0)})),w=()=>{t.querySelector(".total").textContent=L(O(m()))},C=e=>a=>{const d=i.productos.find(p=>p.iproducto===Number(a.target.value)),s=t.querySelectorAll(".item")[e]?.querySelector(".i-precio");d&&s&&!Number(s.value)&&(s.value=String(b()==="proveedor"?Number(d.costo??0):Number(d.precio??0))),w()},$=()=>{t.querySelector(".items").replaceChildren(c`${u.map((e,a)=>c`
        <div class="item" part="item">
          <iswc-select class="i-prod" label=${a===0?"Producto":""} aria-label="Producto" placeholder="Producto" ?disabled=${r} value=${e.iproducto?String(e.iproducto):""} oniswc-change=${C(a)}>
            ${i.productos.map(d=>c`<iswc-option value=${String(d.iproducto)}>${d.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-input class="i-cant" type="number" min="1" step="1" label=${a===0?"Cant.":""} aria-label="Cantidad" ?readonly=${r} value=${String(e.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${a===0?"Precio":""} aria-label="Precio unitario" ?readonly=${r} value=${String(e.precio)}></iswc-input>
          ${r?null:c`<iswc-button variant="plain compact" color="danger" aria-label="Quitar ítem" ?disabled=${u.length===1} oniswc-click=${()=>{u=m(),u.splice(a,1),$()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`}
        </div>`)}`),w()},y=()=>{const e=b();t.querySelector(".c-proveedor")?.toggleAttribute("hidden",e!=="proveedor"),t.querySelector(".c-cliente")?.toggleAttribute("hidden",e!=="cliente")},S=()=>v(n,"av-pedido-form-cerrar",{}),h=()=>{const e=b(),a=I.safeParse({ipedido:o?.ipedido??null,tipo:e,iproveedor:e==="proveedor"?E(l(t.querySelector("#iproveedor"))):null,icliente:e==="cliente"?E(l(t.querySelector("#icliente"))):null,estado:l(t.querySelector("#estado"))||"pendiente",fpedido:l(t.querySelector("#fpedido"))||q(),fenvio:g(l(t.querySelector("#fenvio"))),fentrega:g(l(t.querySelector("#fentrega"))),notas:g(l(t.querySelector("#notas"))),items:m().filter(p=>p.iproducto)}),d=a.success&&(a.data.tipo==="proveedor"?!a.data.iproveedor:!a.data.icliente),s=a.success&&new Set(a.data.items.map(p=>p.iproducto)).size!==a.data.items.length;if(!a.success||d||s){v(n,"av-pedido-form-error",{mensaje:s?"Un producto aparece dos veces: s\xFAmalo en un solo \xEDtem":d?`Elige el ${e==="proveedor"?"proveedor":"cliente"}`:"Agrega al menos un producto con cantidad entera mayor que 0"});return}v(n,"av-pedido-guardar",{datos:a.data})};t.append(c`
      <iswc-dialog id="dialogo" label=${o?`Pedido ${o.codigo??`#${o.ipedido}`}`:"Nuevo pedido"} backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${S}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-select id="tipo" label="Tipo" ?disabled=${r||!!o} value=${o?.tipo??"proveedor"} oniswc-change=${y}>${D.map(e=>c`<iswc-option value=${e}>${P[e]}</iswc-option>`)}</iswc-select>
            <iswc-select id="estado" label="Estado" ?disabled=${r} value=${o?.estado??"pendiente"}>${T.map(e=>c`<iswc-option value=${e}>${P[e]}</iswc-option>`)}</iswc-select>
          </div>
          <iswc-select id="iproveedor" class="c-proveedor" label="Proveedor" placeholder="Elige el proveedor" ?disabled=${r} value=${o?.iproveedor?String(o.iproveedor):""}>${i.proveedores.map(e=>c`<iswc-option value=${String(e.iproveedor)}>${e.nombre}</iswc-option>`)}</iswc-select>
          <iswc-select id="icliente" class="c-cliente" label="Cliente" placeholder="Elige el cliente" ?disabled=${r} value=${o?.icliente?String(o.icliente):""}>${i.clientes.map(e=>c`<iswc-option value=${String(e.icliente)}>${e.organizacion?`${e.organizacion} \xB7 ${e.nombre}`:e.nombre}</iswc-option>`)}</iswc-select>
          <div class="fila tres">
            <iswc-input id="fpedido" type="date" label="Fecha del pedido" ?readonly=${r} value=${f(o?.fpedido)||q()}></iswc-input>
            <iswc-input id="fenvio" type="date" label="Envío" ?readonly=${r} value=${f(o?.fenvio)}></iswc-input>
            <iswc-input id="fentrega" type="date" label="Entrega" ?readonly=${r} value=${f(o?.fentrega)}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${w}></div>
          <div class="pie">
            ${r?null:c`<iswc-button variant="outlined compact" color="brand" oniswc-click=${()=>{u=[...m(),{iproducto:0,cantidad:1,precio:0}],$()}}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>`}
            <span class="etiqueta-total">Total</span><strong class="total" part="total"></strong>
          </div>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${r} value=${o?.notas??""}></iswc-textarea>
          ${i.error?c`<iswc-callout color="danger">${i.error}</iswc-callout>`:null}
          ${r?c`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) crea o modifica pedidos.</iswc-callout>`:null}
        </div>
        ${o&&!r?c`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este pedido y sus ítems?" oniswc-popconfirm-confirm=${()=>v(n,"av-pedido-eliminar",{ipedido:o.ipedido})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${S}>${r?"Cerrar":"Cancelar"}</iswc-button>
        ${r?null:c`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${i.ocupado} oniswc-click=${h}>${o?"Guardar":"Crear pedido"}</iswc-button>`}
      </iswc-dialog>
    `),$(),y()},(t,i,n)=>{if(i.pedido!==n.pedido||i.items!==n.items||i.productos!==n.productos||i.error!==n.error||i.puedeEscribir!==n.puedeEscribir)return!1;const o=t.querySelector("#dialogo");return o?(o.open=i.abierto,t.querySelector("#guardar")?.toggleAttribute("loading",i.ocupado),!0):!1});A("av-pedido-form",k);
