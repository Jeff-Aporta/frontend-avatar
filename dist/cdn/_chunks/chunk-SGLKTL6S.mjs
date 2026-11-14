import{b as P}from"./chunk-C3A57DEW.mjs";import{a as h,c as A,d as I,j as k,n as N}from"./chunk-ZW3MWMB5.mjs";import{e as l,g as f}from"./chunk-EYJKOFS6.mjs";import{F as E,P as C,ra as i,ta as q,ua as d,wa as F}from"./chunk-22HCQII4.mjs";var D=F(new URL("view/finanzas/components/av-factura-form.min.mjs",new URL("../",import.meta.url)).href,"av-factura-form",{abierto:!1,factura:null,clientes:[],puedeEscribir:!1,ocupado:!1,error:""},(o,t,r)=>{let a=t.factura,s=a?I(a):"borrador",c=t.puedeEscribir&&s==="borrador",u=a?.items?.length?a.items.map(e=>({...e})):[{descripcion:"",cantidad:1,precio:0}],g=()=>o.querySelector("#moneda")?.value||a?.moneda||"COP",$=()=>Number(o.querySelector("#impuesto")?.value??a?.impuesto??19),m=e=>e?.value??"",w=()=>[...o.querySelectorAll(".item")].map(e=>({descripcion:m(e.querySelector(".i-desc")).trim(),cantidad:Number(m(e.querySelector(".i-cant"))||0),precio:Number(m(e.querySelector(".i-precio"))||0)})),b=()=>{let e=N(c?w():u,$()),n=g();o.querySelector(".totales").replaceChildren(i`
        <dt>Subtotal</dt><dd>${f(e.subtotal,n)}</dd>
        <dt>IVA (${$()} %)</dt><dd>${f(e.iva,n)}</dd>
        <dt class="total">Total</dt><dd class="total">${f(e.total,n)}</dd>
      `)},v=()=>{o.querySelector(".items").replaceChildren(i`${u.map((n,p)=>i`
        <div class="item" part="item" data-i=${String(p)}>
          <iswc-input class="i-desc" label=${p===0?"Descripci\xF3n":""} aria-label="Descripción" placeholder="Servicio o producto" ?readonly=${!c} value=${n.descripcion}></iswc-input>
          <iswc-input class="i-cant" type="number" min="0" step="any" label=${p===0?"Cant.":""} aria-label="Cantidad" ?readonly=${!c} value=${String(n.cantidad)}></iswc-input>
          <iswc-input class="i-precio" type="number" min="0" step="any" label=${p===0?"Precio":""} aria-label="Precio unitario" ?readonly=${!c} value=${String(n.precio)}></iswc-input>
          ${c?i`<iswc-button class="quitar" variant="plain compact" color="danger" aria-label="Quitar ítem" ?disabled=${u.length===1} oniswc-click=${()=>{u=w(),u.splice(p,1),v()}}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`:null}
        </div>`)}`),b()},y=()=>d(r,"av-factura-form-cerrar",{}),T=()=>{let e=C.safeParse({ifactura:a?.ifactura??null,icliente:Number(m(o.querySelector("#cliente")))||null,moneda:g(),impuesto:$(),items:w().filter(n=>n.descripcion||n.precio),notas:P(m(o.querySelector("#notas")))});if(!e.success){d(r,"av-factura-form-error",{mensaje:"Cada \xEDtem necesita descripci\xF3n, cantidad mayor que 0 y precio; el IVA va de 0 a 100"});return}d(r,"av-factura-guardar",{datos:e.data})},S=e=>a&&d(r,"av-finanzas-accion",{entidad:"facturas",accion:e,id:a.ifactura}),M=a?`Factura ${a.numero??`#${a.ifactura}`}`:"Nueva factura";o.append(i`
      <iswc-dialog id="dialogo" label=${M} backdrop-variant="basic" ?open=${t.abierto} oniswc-hide=${y}>
        <div class="campos" part="campos">
          ${a?i`<div class="estado"><iswc-tag color=${A(s)} pill>${h[s]??s}</iswc-tag>
            ${l(a.femision)?i`<span>Emitida ${l(a.femision)}</span>`:null}
            ${l(a.fvence)?i`<span>Vence ${l(a.fvence)}</span>`:null}
            ${l(a.fpago)?i`<span>Pagada ${l(a.fpago)}</span>`:null}</div>`:null}
          <iswc-select id="cliente" label="Cliente" clearable ?disabled=${!c} value=${a?.icliente?String(a.icliente):""} placeholder="Sin cliente">
            ${t.clientes.map(e=>i`<iswc-option value=${String(e.icliente)}>${k(e)}</iswc-option>`)}
          </iswc-select>
          <div class="fila">
            <iswc-select id="moneda" label="Moneda" ?disabled=${!c} value=${a?.moneda??"COP"} oniswc-change=${b}>${E.map(e=>i`<iswc-option value=${e}>${e}</iswc-option>`)}</iswc-select>
            <iswc-input id="impuesto" type="number" min="0" max="100" step="any" label="IVA %" ?readonly=${!c} value=${String(a?.impuesto??19)} oniswc-input=${b}></iswc-input>
          </div>
          <div class="items" part="items" oniswc-input=${b}></div>
          ${c?i`<iswc-button class="agregar" variant="outlined compact" color="brand" oniswc-click=${()=>{u=[...w(),{descripcion:"",cantidad:1,precio:0}],v()}}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Agregar ítem</iswc-button>`:null}
          <dl class="totales" part="totales"></dl>
          <iswc-textarea id="notas" label="Notas" rows="2" ?readonly=${!c} value=${a?.notas??""}></iswc-textarea>
          ${t.error?i`<iswc-callout color="danger">${t.error}</iswc-callout>`:null}
          ${t.puedeEscribir?c?null:i`<iswc-callout color="brand">Una factura emitida ya no se edita: se cobra o se anula.</iswc-callout>`:i`<iswc-callout color="brand">Solo quien tiene el permiso de finanzas (avatar.finanzas) crea, emite o cobra facturas.</iswc-callout>`}
        </div>
        ${a&&c?i`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este borrador?" oniswc-popconfirm-confirm=${()=>d(r,"av-factura-eliminar",{ifactura:a.ifactura})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${y}>${c?"Cancelar":"Cerrar"}</iswc-button>
        ${a&&c?i`<iswc-button slot="footer" variant="soft compact" color="brand" ?disabled=${t.ocupado} oniswc-click=${()=>S("emitir")}><iswc-icon slot="start" icon="mdi:send-check-outline"></iswc-icon>Emitir</iswc-button>`:null}
        ${a&&t.puedeEscribir&&(s==="emitida"||s==="vencida")?i`<iswc-button variant="compact" slot="footer" color="success" ?loading=${t.ocupado} oniswc-click=${()=>S("pagar")}><iswc-icon slot="start" icon="mdi:cash-check"></iswc-icon>Registrar pago</iswc-button>`:null}
        ${c?i`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${t.ocupado} oniswc-click=${T}>${a?"Guardar":"Crear borrador"}</iswc-button>`:null}
      </iswc-dialog>
    `),v()},(o,t,r)=>{if(t.factura!==r.factura||t.clientes!==r.clientes||t.error!==r.error||t.puedeEscribir!==r.puedeEscribir)return!1;let a=o.querySelector("#dialogo");return a?(a.open=t.abierto,o.querySelector("#guardar")?.toggleAttribute("loading",t.ocupado),!0):!1});q("av-factura-form",D);
