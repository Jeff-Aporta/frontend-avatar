import{crearComponente as p,define as u,emitir as d,html as i}from"../../base/componente.js?v=p6quri";import{coloresDe as b,degradado as h,TEMAS as s}from"../../chat/temas.js?v=w8y4js";const v=p(import.meta.url,"av-chat-tema",{tema:null},(l,o,n)=>{const c=o.tema?.id??"",e=b(o.tema)??s[0],t=a=>d(n,"av-chat-tema",{tema:a}),r=a=>l.querySelector(`#${a}`).value,m=()=>t({id:"propio",color1:r("color1"),color2:r("color2"),angulo:Number(r("angulo"))||135});l.append(i`
    <section class="tema" part="tema">
      <h4 class="titulo">Tema del chat</h4>
      <div class="muestras" role="radiogroup" aria-label="Tema del chat">
        <button class="muestra app" type="button" role="radio" aria-checked=${String(!o.tema)} title="Tema de la app" onclick=${()=>t(null)}><span>App</span></button>
        ${s.map(a=>i`<button class="muestra" type="button" role="radio" aria-checked=${String(c===a.id)} title=${a.nombre} aria-label=${a.nombre} style=${`background:${h(a)}`} onclick=${()=>t({id:a.id})}></button>`)}
      </div>
      <details class="propio" ?open=${c==="propio"}>
        <summary>Personalizar</summary>
        <div class="campos">
          <iswc-color-picker id="color1" label="Color 1" value=${e.color1}></iswc-color-picker>
          <iswc-color-picker id="color2" label="Color 2" value=${e.color2}></iswc-color-picker>
          <iswc-input id="angulo" type="number" min="0" max="360" step="15" label="Ángulo" value=${String(e.angulo)}></iswc-input>
          <iswc-button color="brand" oniswc-click=${m}>Aplicar</iswc-button>
        </div>
      </details>
    </section>
  `)});u("av-chat-tema",v);
