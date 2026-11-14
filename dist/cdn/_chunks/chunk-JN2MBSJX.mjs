import{ra as s,ta as e,ua as c,wa as r}from"./chunk-22HCQII4.mjs";var l=r(new URL("view/inventario/components/av-stock-alertas.min.mjs",new URL("../",import.meta.url)).href,"av-stock-alertas",{alertas:null,puedeMover:!1},(t,i,n)=>{let o=i.alertas;if(!o){t.append(s`<div class="franja" part="franja" aria-busy="true">${[1,2,3].map(()=>s`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}if(!o.length){t.append(s`<iswc-callout color="success" class="ok"><strong>Stock en orden.</strong> Ningún producto está en o bajo su mínimo.</iswc-callout>`);return}t.append(s`
    <section class="alertas" part="alertas" aria-label="Alertas de stock">
      <iswc-heading level="2" class="rotulo"><iswc-icon icon="mdi:alert-decagram-outline"></iswc-icon> Alertas de stock <iswc-badge color="danger" pill>${o.length}</iswc-badge></iswc-heading>
      <div class="franja" part="franja">
        ${o.map(a=>s`
          <article class="alerta" part="alerta" data-agotado=${a.agotado?"si":"no"}>
            <div class="cabeza">
              <iswc-tag color=${a.agotado?"danger":"warning"} pill>${a.agotado?"Agotado":"Bajo m\xEDnimo"}</iswc-tag>
              <span class="sku">${a.sku}</span>
            </div>
            <iswc-button class="nombre" variant="text compact" color="neutral" oniswc-click=${()=>c(n,"av-inventario-abrir",{entidad:"productos",id:a.iproducto})}>${a.nombre}</iswc-button>
            <div class="cifras"><strong class="stock">${a.stock}</strong><span>/ mín ${a.stock_minimo}</span>${a.ubicacion?s`<span class="ubicacion"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${a.ubicacion}</span>`:null}</div>
            ${i.puedeMover?s`<iswc-button class="reponer" variant="soft compact" color=${a.agotado?"danger":"warning"} oniswc-click=${()=>c(n,"av-producto-mover",{iproducto:a.iproducto,tipo:"entrada"})}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Reponer</iswc-button>`:null}
          </article>
        `)}
      </div>
    </section>
  `)});e("av-stock-alertas",l);
