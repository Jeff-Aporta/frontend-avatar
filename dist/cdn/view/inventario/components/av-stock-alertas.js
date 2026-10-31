import{crearComponente as n,define as e,emitir as r,html as s}from"../../../js/base/componente.js?v=333q2n";const l=n(import.meta.url,"av-stock-alertas",{alertas:null,puedeMover:!1},(t,c,i)=>{const o=c.alertas;if(!o){t.append(s`<div class="franja" part="franja" aria-busy="true">${[1,2,3].map(()=>s`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}if(!o.length){t.append(s`<iswc-callout color="success" class="ok"><strong>Stock en orden.</strong> Ningún producto está en o bajo su mínimo.</iswc-callout>`);return}t.append(s`
    <section class="alertas" part="alertas" aria-label="Alertas de stock">
      <h2 class="rotulo"><iswc-icon icon="mdi:alert-decagram-outline"></iswc-icon> Alertas de stock <iswc-badge color="danger" pill>${o.length}</iswc-badge></h2>
      <div class="franja" part="franja">
        ${o.map(a=>s`
          <article class="alerta" part="alerta" data-agotado=${a.agotado?"si":"no"}>
            <div class="cabeza">
              <iswc-tag color=${a.agotado?"danger":"warning"} pill>${a.agotado?"Agotado":"Bajo m\xEDnimo"}</iswc-tag>
              <span class="sku">${a.sku}</span>
            </div>
            <iswc-button class="nombre" variant="text" color="neutral" oniswc-click=${()=>r(i,"av-inventario-abrir",{entidad:"productos",id:a.iproducto})}>${a.nombre}</iswc-button>
            <div class="cifras"><strong class="stock">${a.stock}</strong><span>/ mín ${a.stock_minimo}</span>${a.ubicacion?s`<span class="ubicacion"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${a.ubicacion}</span>`:null}</div>
            ${c.puedeMover?s`<iswc-button class="reponer" size="small" variant="soft" color=${a.agotado?"danger":"warning"} oniswc-click=${()=>r(i,"av-producto-mover",{iproducto:a.iproducto,tipo:"entrada"})}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Reponer</iswc-button>`:null}
          </article>
        `)}
      </div>
    </section>
  `)});e("av-stock-alertas",l);
