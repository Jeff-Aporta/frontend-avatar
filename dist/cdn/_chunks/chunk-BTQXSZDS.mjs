import{p as m,q as v}from"./chunk-ZW3MWMB5.mjs";import{g as i}from"./chunk-EYJKOFS6.mjs";import{ra as o,ta as l,ua as d,wa as u}from"./chunk-22HCQII4.mjs";function p(e,a){let n=e.querySelector(".resultado"),s=a.resultado;n.toggleAttribute("data-ocupado",a.ocupado),n.replaceChildren(o`
    ${a.error?o`<span class="error">${a.error}</span>`:s?o`<span class="cifra" part="cifra">${i(s.resultado,s.a)}</span><span class="tasa">1 ${s.de} = ${i(s.tasa,s.a)} · ${i(s.monto,s.de)}</span>`:o`<span class="tasa">Escribe un monto para convertir</span>`}
  `)}var f=u(new URL("view/finanzas/components/av-conversor.min.mjs",new URL("../",import.meta.url)).href,"av-conversor",{tasas:[],monto:1e3,de:"USD",a:"COP",resultado:null,ocupado:!1,error:""},(e,a,n)=>{let s=m(a.tasas),c=()=>({monto:Number(e.querySelector("#monto").value||0),de:e.querySelector("#de").value||a.de,a:e.querySelector("#a").value||a.a}),r=()=>d(n,"av-conversor-convertir",c()),w=()=>{let t=c();e.querySelector("#de").value=t.a,e.querySelector("#a").value=t.de,r()};e.append(o`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header" class="titulo"><iswc-icon icon="mdi:swap-horizontal-circle-outline"></iswc-icon> Conversor de monedas</strong>
        <div class="fila" part="fila">
          <iswc-input id="monto" class="monto" type="number" min="0" step="any" label="Monto" value=${String(a.monto)} oniswc-input=${r}></iswc-input>
          <iswc-select id="de" class="moneda" label="De" value=${a.de} oniswc-change=${r}>${s.map(t=>o`<iswc-option value=${t}>${t}</iswc-option>`)}</iswc-select>
          <iswc-button class="invertir" variant="soft compact" color="brand" aria-label="Intercambiar monedas" title="Intercambiar" oniswc-click=${w}><iswc-icon icon="mdi:swap-horizontal"></iswc-icon></iswc-button>
          <iswc-select id="a" class="moneda" label="A" value=${a.a} oniswc-change=${r}>${s.map(t=>o`<iswc-option value=${t}>${t}</iswc-option>`)}</iswc-select>
        </div>
        <div class="resultado" part="resultado" aria-live="polite"></div>
        <div class="tasas" part="tasas">
          ${v(a.tasas).map(t=>o`<span class="equivalencia"><iswc-tag color="neutral" variant="outlined" pill>${t.moneda}</iswc-tag><span>${t.texto}</span></span>`)}
        </div>
      </iswc-card>
    `),p(e,a)},(e,a,n)=>a.tasas!==n.tasas&&JSON.stringify(a.tasas)!==JSON.stringify(n.tasas)||!e.querySelector(".resultado")?!1:(p(e,a),!0));l("av-conversor",f);
