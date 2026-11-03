import{crearComponente as q,define as F,emitir as p,html as i}from"../../../js/base/componente.js?v=uz3s44";import{oNulo as A}from"../../../js/base/campos.js?v=b0imlo";import{FacturaDatosSchema as h,MONEDAS as I}from"../../../js/consts/schemas/finanzas.schemas.js?v=83st1w";import{fechaISO as u,formatoMoneda as v}from"../../../js/core/datos.js?v=2tahwq";import{colorEstado as k,ETIQUETA as N,estadoFactura as P,nombreCliente as T,totalesFactura as M}from"../utils/finanzas.js?v=5ywdnm";const D=q(import.meta.url,"av-factura-form",{abierto:!1,factura:null,clientes:[],puedeEscribir:!1,ocupado:!1,error:""},(o,t,r)=>{const a=t.factura,l=a?P(a):"borrador",c=t.puedeEscribir&&l==="borrador";let s=a?.items?.length?a.items.map(e=>({...e})):[{descripcion:"",cantidad:1,precio:0}];const g=()=>o.querySelector("#moneda")?.value||a?.moneda||"COP",$=()=>Number(o.querySelector("#impuesto")?.value??a?.impuesto??19),d=e=>e?.value??"",b=()=>[...o.querySelectorAll(".item")].map(e=>({descripcion:d(e.querySelector(".i-desc")).trim(),cantidad:Number(d(e.querySelector(".i-cant"))||0),precio:Number(d(e.querySelector(".i-precio"))||0)})),w=()=>{const e=M(c?b():s,$()),n=g();o.querySelector(".totales").replaceChildren(i`
        <dt>Subtotal</dt><dd>${v(e.subtotal,n)}</dd>
        <dt>IVA (${$()} %)</dt><dd>${v(e.iva,n)}</dd>
        <dt class="total">Total</dt><dd class="total">${v(e.total,n)}</dd>
      `)},f=()=>{o.querySelector(".items").replaceChildren(i`${s.map((n,m)=>i`
        <div class="item" part="item" data-i=${String(m)}>
          <iswc-input class="i-desc" label=${m===0?"Descripci\xF3n":""} aria-label="Descripción" placeholder="Servicio o producto" ?readonly=${!c} value=${n.descripcion}></iswc-input>
          <iswc-input class="i-cant" type="number" min="0" step="any" label=${m===0?"Cant.":""} aria-label="Cantidad" ?readonly=${!c} value=${String(n.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${m===0?"Precio":""} aria-label="Precio unitario" ?readonly=${!c} value=${String(n.precio)}></iswc-input>
          ${c?i`<iswc-button class="quitar" variant="plain compact" color="danger" aria-label="Quitar ítem" ?disabled=${s.length===1} oniswc-click=${()=>{s=b(),s.splice(m,1),f()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`:null}
        </div>`)}`),w()},y=()=>p(r,"av-factura-form-cerrar",{}),E=()=>{const e=h.safeParse({ifactura:a?.ifactura??null,icliente:Number(d(o.querySelector("#cliente")))||null,moneda:g(),impuesto:$(),items:b().filter(n=>n.descripcion||n.precio),notas:A(d(o.querySelector("#notas")))});if(!e.success){p(r,"av-factura-form-error",{mensaje:"Cada \xEDtem necesita descripci\xF3n, cantidad mayor que 0 y precio; el IVA va de 0 a 100"});return}p(r,"av-factura-guardar",{datos:e.data})},S=e=>a&&p(r,"av-finanzas-accion",{entidad:"facturas",accion:e,id:a.ifactura}),C=a?`Factura ${a.numero??`#${a.ifactura}`}`:"Nueva factura";o.append(i`
      <iswc-dialog id="dialogo" label=${C} backdrop-variant="basic" ?open=${t.abierto} oniswc-hide=${y}>
        <div class="campos" part="campos">
          ${a?i`<div class="estado"><iswc-tag color=${k(l)} pill>${N[l]??l}</iswc-tag>
            ${u(a.femision)?i`<span>Emitida ${u(a.femision)}</span>`:null}
            ${u(a.fvence)?i`<span>Vence ${u(a.fvence)}</span>`:null}
            ${u(a.fpago)?i`<span>Pagada ${u(a.fpago)}</span>`:null}</div>`:null}
          <iswc-select id="cliente" label="Cliente" clearable ?disabled=${!c} value=${a?.icliente?String(a.icliente):""} placeholder="Sin cliente">
            ${t.clientes.map(e=>i`<iswc-option value=${String(e.icliente)}>${T(e)}</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select id="moneda" label="Moneda" ?disabled=${!c} value=${a?.moneda??"COP"} oniswc-change=${w}>${I.map(e=>i`<iswc-option value=${e}>${e}</iswc-option>`)}</iswc-select>
            <iswc-input id="impuesto" type="number" min="0" max="100" step="any" label="IVA %" ?readonly=${!c} value=${String(a?.impuesto??19)} oniswc-input=${w}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${w}></div>
          ${c?i`<iswc-button class="agregar" variant="outlined compact" color="brand" oniswc-click=${()=>{s=[...b(),{descripcion:"",cantidad:1,precio:0}],f()}}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>`:null}
          <dl class="totales" part="totales"></dl>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${!c} value=${a?.notas??""}></iswc-textarea>
          ${t.error?i`<iswc-callout color="danger">${t.error}</iswc-callout>`:null}
          ${t.puedeEscribir?c?null:i`<iswc-callout color="brand">Una factura emitida ya no se edita: se cobra o se anula.</iswc-callout>`:i`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) crea, emite o cobra facturas.</iswc-callout>`}
        </div>
        ${a&&c?i`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este borrador?" oniswc-popconfirm-confirm=${()=>p(r,"av-factura-eliminar",{ifactura:a.ifactura})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${y}>${c?"Cancelar":"Cerrar"}</iswc-button>
        ${a&&c?i`<iswc-button slot="footer" variant="soft compact" color="brand" ?disabled=${t.ocupado} oniswc-click=${()=>S("emitir")}><iswc-icon slot="start" icon="mdi:send-check-outline"></iswc-icon>Emitir</iswc-button>`:null}
        ${a&&t.puedeEscribir&&(l==="emitida"||l==="vencida")?i`<iswc-button variant="compact" slot="footer" color="success" ?loading=${t.ocupado} oniswc-click=${()=>S("pagar")}><iswc-icon slot="start" icon="mdi:cash-check"></iswc-icon>Registrar pago</iswc-button>`:null}
        ${c?i`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${t.ocupado} oniswc-click=${E}>${a?"Guardar":"Crear borrador"}</iswc-button>`:null}
      </iswc-dialog>
    `),f()},(o,t,r)=>{if(t.factura!==r.factura||t.clientes!==r.clientes||t.error!==r.error||t.puedeEscribir!==r.puedeEscribir)return!1;const a=o.querySelector("#dialogo");return a?(a.open=t.abierto,o.querySelector("#guardar")?.toggleAttribute("loading",t.ocupado),!0):!1});F("av-factura-form",D);
