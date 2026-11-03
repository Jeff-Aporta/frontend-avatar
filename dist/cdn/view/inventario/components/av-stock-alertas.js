import{crearComponente as r,define as e,emitir as n,html as o}from"../../../js/base/componente.js?v=3wyanc";const l=r(import.meta.url,"av-stock-alertas",{alertas:null,puedeMover:!1},(c,t,i)=>{const s=t.alertas;if(!s){c.append(o`<div class="franja" part="franja" aria-busy="true">${[1,2,3].map(()=>o`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`);return}if(!s.length){c.append(o`<iswc-callout color="success" class="ok"><strong>Stock en orden.</strong> Ningún producto está en o bajo su mínimo.</iswc-callout>`);return}c.append(o`
    <section class="alertas" part="alertas" aria-label="Alertas de stock">
      <iswc-heading level="2" class="rotulo"><iswc-icon icon="mdi:alert-decagram-outline"></iswc-icon> Alertas de stock <iswc-badge color="danger" pill>${s.length}</iswc-badge></iswc-heading>
      <div class="franja" part="franja">
        ${s.map(a=>o`
          <article class="alerta" part="alerta" data-agotado=${a.agotado?"si":"no"}>
            <div class="cabeza">
              <iswc-tag color=${a.agotado?"danger":"warning"} pill>${a.agotado?"Agotado":"Bajo m\xEDnimo"}</iswc-tag>
              <span class="sku">${a.sku}</span>
            </div>
            <iswc-button class="nombre" variant="text compact" color="neutral" oniswc-click=${()=>n(i,"av-inventario-abrir",{entidad:"productos",id:a.iproducto})}>${a.nombre}</iswc-button>
            <div class="cifras"><strong class="stock">${a.stock}</strong><span>/ mín ${a.stock_minimo}</span>${a.ubicacion?o`<span class="ubicacion"><iswc-icon icon="mdi:map-marker-outline"></iswc-icon>${a.ubicacion}</span>`:null}</div>
            ${t.puedeMover?o`<iswc-button class="reponer" variant="soft compact" color=${a.agotado?"danger":"warning"} oniswc-click=${()=>n(i,"av-producto-mover",{iproducto:a.iproducto,tipo:"entrada"})}><iswc-icon slot="start" icon="mdi:tray-arrow-down"></iswc-icon>Reponer</iswc-button>`:null}
          </article>
        `)}
      </div>
    </section>
  `)});e("av-stock-alertas",l);
