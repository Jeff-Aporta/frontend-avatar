import{crearComponente as g,define as w,emitir as y,html as i}from"../../base/componente.js?v=17uldv";import{buscarEmojis as L,CATEGORIAS_EMOJI as h,recientes as M,usarEmoji as A}from"../../chat/emojis.js?v=tq8zq1";import{textos as T}from"../../chat/textos.js?v=gpj3dh";const E=8,H=g(import.meta.url,"av-chat-emojis",{destino:""},(s,$,f)=>{const n=T(),j=e=>{A(e),y(f,"av-chat-emoji",{emoji:e,destino:$.destino})},c=(e,t="")=>i`<button class="emoji" type="button" tabindex="-1" title=${t} aria-label=${t||e} data-e=${e}>${e}</button>`,r=M();s.append(i`
    <div class="selector" part="selector" role="dialog" aria-label=${n.emojis}>
      <iswc-input class="buscar" type="search" clearable placeholder=${n.buscar} aria-label=${n.buscar}><iswc-icon slot="start" icon="mdi:magnify"></iswc-icon></iswc-input>
      <nav class="categorias" aria-label=${n.emojis}>
        ${r.length?i`<button type="button" class="cat" data-ir="recientes" title="Recientes" aria-label="Recientes"><iswc-icon icon="mdi:clock-outline"></iswc-icon></button>`:null}
        ${h.map(e=>i`<button type="button" class="cat" data-ir=${e.id} title=${e.nombre} aria-label=${e.nombre}><iswc-icon icon=${e.icono}></iswc-icon></button>`)}
      </nav>
      <div class="rejilla" role="grid">
        <div class="resultados" hidden></div>
        <div class="secciones">
          ${r.length?i`<section data-cat="recientes"><h3>Recientes</h3><div class="grupo">${r.map(e=>c(e))}</div></section>`:null}
          ${h.map(e=>i`<section data-cat=${e.id}><h3>${e.nombre}</h3><div class="grupo">${e.emojis.map(t=>c(t.e,t.k))}</div></section>`)}
        </div>
      </div>
    </div>
  `);const u=s.querySelector(".rejilla"),o=s.querySelector(".resultados"),l=s.querySelector(".secciones"),d=()=>[...(o.hidden?l:o).querySelectorAll(".emoji")],p=d()[0];p&&(p.tabIndex=0),u.addEventListener("click",e=>{const t=e.target.closest(".emoji");t?.dataset.e&&j(t.dataset.e)}),u.addEventListener("keydown",e=>{const t=d(),a=t.indexOf(s.activeElement);if(a<0)return;const v={ArrowRight:1,ArrowLeft:-1,ArrowDown:E,ArrowUp:-E}[e.key];if(v===void 0)return;e.preventDefault();const m=t[Math.max(0,Math.min(t.length-1,a+v))];m&&(t[a].tabIndex=-1,m.tabIndex=0,m.focus())});for(const e of s.querySelectorAll(".cat"))e.addEventListener("click",()=>{l.querySelector(`[data-cat="${e.dataset.ir}"]`)?.scrollIntoView({block:"start",behavior:"smooth"})});const b=s.querySelector(".buscar");b.addEventListener("iswc-input",()=>{const e=b.value??"";o.hidden=!e.trim(),l.hidden=!!e.trim(),o.replaceChildren(...e.trim()?[i`<div class="grupo">${L(e).map(a=>c(a.e,a.k))}</div>`]:[]);const t=d()[0];t&&(t.tabIndex=0)})});w("av-chat-emojis",H);
