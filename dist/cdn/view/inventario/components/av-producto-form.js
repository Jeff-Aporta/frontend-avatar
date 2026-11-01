import{crearComponente as w,define as $,emitir as t,html as a}from"../../../js/base/componente.js?v=kpvpk6";import{leerCampos as g,oNulo as s,oNumero as d}from"../../../js/base/campos.js?v=b0imlo";import{ProductoDatosSchema as f}from"../../../js/consts/schemas/inventario.schemas.js?v=ixgawp";import{colorDe as p,ETIQUETA as k,formatoPrecio as y,nivelStock as v}from"../utils/inventario.js?v=su2x7t";const S=w(import.meta.url,"av-producto-form",{abierto:!1,producto:null,proveedores:[],relacionados:[],puedeEscribir:!1,ocupado:!1,error:""},(n,e,r)=>{const o=e.producto,c=!e.puedeEscribir,u=()=>t(r,"av-producto-form-cerrar",{}),b=()=>{const i=g(n),m=f.safeParse({iproducto:o?.iproducto??null,nombre:i.nombre??"",categoria:s(i.categoria),marca:s(i.marca),modelo:s(i.modelo),precio:d(i.precio)??0,costo:d(i.costo)??0,stock_minimo:d(i.stock_minimo)??0,ubicacion:s(i.ubicacion),iproveedor:d(i.iproveedor),bactivo:n.querySelector("#bactivo")?.checked??!0});if(!m.success){t(r,"av-producto-form-error",{mensaje:"Revisa el nombre, los precios (no negativos) y el stock m\xEDnimo (entero)"});return}t(r,"av-producto-guardar",{datos:m.data})},l=o?v(o):null;n.append(a`
      <iswc-dialog id="dialogo" label=${o?o.nombre:"Nuevo producto"} backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${u}>
        <div class="campos" part="campos">
          ${o&&l?a`
            <div class="stock" part="stock" data-nivel=${l}>
              <div class="cifra"><span class="rotulo">Stock</span><strong>${o.stock}</strong><iswc-tag color=${p(l)} pill>${k[l]} · mín ${o.stock_minimo}</iswc-tag></div>
              ${c?null:a`<div class="mover">
                <iswc-button variant="soft compact" color="success" oniswc-click=${()=>t(r,"av-producto-mover",{iproducto:o.iproducto,tipo:"entrada"})}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Entrada</iswc-button>
                <iswc-button variant="soft compact" color="danger" ?disabled=${o.stock<=0} oniswc-click=${()=>t(r,"av-producto-mover",{iproducto:o.iproducto,tipo:"salida"})}><iswc-icon slot="start" icon="mdi:tray-arrow-up"></iswc-icon>Salida</iswc-button>
                <iswc-button variant="outlined compact" color="neutral" oniswc-click=${()=>t(r,"av-producto-mover",{iproducto:o.iproducto,tipo:"ajuste"})}><iswc-icon slot="start" icon="mdi:counter"></iswc-icon>Ajuste</iswc-button>
              </div>`}
              ${o.sku?a`<span class="sku">${o.sku}</span>`:null}
            </div>`:null}
          <iswc-input name="nombre" label="Nombre" required maxlength="160" ?readonly=${c} value=${o?.nombre??""}></iswc-input>
          <div class="fila">
            <iswc-input name="categoria" label="Categoría" maxlength="80" ?readonly=${c} value=${o?.categoria??""}></iswc-input>
            <iswc-input name="marca" label="Marca" maxlength="80" ?readonly=${c} value=${o?.marca??""}></iswc-input>
            <iswc-input name="modelo" label="Modelo" maxlength="80" ?readonly=${c} value=${o?.modelo??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="precio" type="number" min="0" step="any" label="Precio de venta" prefix="$" ?readonly=${c} value=${String(o?.precio??0)}></iswc-input>
            <iswc-input name="costo" type="number" min="0" step="any" label="Costo" prefix="$" ?readonly=${c} value=${String(o?.costo??0)}></iswc-input>
            <iswc-input name="stock_minimo" type="number" min="0" step="1" label="Stock mínimo" ?readonly=${c} value=${String(o?.stock_minimo??0)}></iswc-input>
          </div>
          <div class="fila dos">
            <iswc-input name="ubicacion" label="Ubicación" placeholder="A1-B2" maxlength="40" ?readonly=${c} value=${o?.ubicacion??""}></iswc-input>
            <iswc-select name="iproveedor" label="Proveedor" clearable placeholder="Sin proveedor" ?disabled=${c} value=${o?.iproveedor?String(o.iproveedor):""}>
              ${e.proveedores.map(i=>a`<iswc-option value=${String(i.iproveedor)}>${i.nombre}</iswc-option>`)}
            </iswc-select>
          </div>
          <iswc-switch id="bactivo" ?checked=${o?o.bactivo!==!1:!0} ?disabled=${c}>Activo en el catálogo</iswc-switch>
          ${o&&o.precio!=null&&o.costo!=null&&Number(o.precio)>0?a`<p class="margen">Margen: ${y(Number(o.precio)-Number(o.costo))} por unidad (${Math.round((Number(o.precio)-Number(o.costo))/Number(o.precio)*100)} %)</p>`:null}
          ${e.relacionados.length?a`
            <section class="relacionados" part="relacionados" aria-label="Productos relacionados">
              <iswc-heading level="3" class="rotulo"><iswc-icon icon="mdi:vector-link"></iswc-icon> Productos relacionados</iswc-heading>
              <div class="chips">${e.relacionados.map(i=>a`<iswc-button variant="outlined compact" color=${p(v(i))} oniswc-click=${()=>t(r,"av-inventario-abrir",{entidad:"productos",id:i.iproducto})}>${i.nombre}<span slot="end" class="r-stock">${i.stock}</span></iswc-button>`)}</div>
            </section>`:null}
          ${e.error?a`<iswc-callout color="danger">${e.error}</iswc-callout>`:null}
          ${c?a`<iswc-callout color="brand">Solo quien tiene el permiso de inventario (avatar.inventario) modifica el catálogo o mueve stock.</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${u}>${c?"Cerrar":"Cancelar"}</iswc-button>
        ${c?null:a`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${e.ocupado} oniswc-click=${b}>${o?"Guardar":"Crear producto"}</iswc-button>`}
      </iswc-dialog>
    `)},(n,e,r)=>{if(e.producto!==r.producto||e.proveedores!==r.proveedores||e.relacionados!==r.relacionados||e.error!==r.error||e.puedeEscribir!==r.puedeEscribir)return!1;const o=n.querySelector("#dialogo");return o?(o.open=e.abierto,n.querySelector("#guardar")?.toggleAttribute("loading",e.ocupado),!0):!1});$("av-producto-form",S);
