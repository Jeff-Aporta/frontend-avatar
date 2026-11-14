import{ra as t,ta as p,ua as u,wa as g}from"./chunk-22HCQII4.mjs";var c=[{id:"oceano",nombre:"Oc\xE9ano",color1:"#0077b6",color2:"#00b4d8",angulo:135},{id:"atardecer",nombre:"Atardecer",color1:"#ff5f6d",color2:"#ffc371",angulo:135},{id:"selva",nombre:"Selva",color1:"#11998e",color2:"#38ef7d",angulo:135},{id:"uva",nombre:"Uva",color1:"#7928ca",color2:"#ff0080",angulo:135},{id:"cereza",nombre:"Cereza",color1:"#b20a2c",color2:"#eb3349",angulo:160},{id:"neon",nombre:"Ne\xF3n",color1:"#00f5a0",color2:"#00d9f5",angulo:90},{id:"oro",nombre:"Oro",color1:"#b8860b",color2:"#f7c948",angulo:135},{id:"medianoche",nombre:"Medianoche",color1:"#141e30",color2:"#3a4f7a",angulo:160},{id:"algodon",nombre:"Algod\xF3n",color1:"#a18cd1",color2:"#fbc2eb",angulo:135},{id:"lavanda",nombre:"Lavanda",color1:"#5f2c82",color2:"#a770ef",angulo:135},{id:"coral",nombre:"Coral",color1:"#ee5253",color2:"#ff9f80",angulo:90},{id:"grafito",nombre:"Grafito",color1:"#232526",color2:"#5a6068",angulo:135}],h=["--chat-propia","--chat-propia-texto","--chat-fondo","--iswc-accent"],s=o=>`linear-gradient(${o.angulo}deg, ${o.color1}, ${o.color2})`;function d(o){if(!o)return null;let r=c.find(e=>e.id===o.id);return r||(o.color1?{id:"propio",nombre:"Propio",color1:o.color1,color2:o.color2??o.color1,angulo:o.angulo??135}:null)}function v(o){let r=d(o);if(!r)return{};let e=`color-mix(in srgb, ${r.color1}, ${r.color2})`;return{"--chat-propia":s(r),"--chat-propia-texto":`oklch(from ${e} clamp(0, calc((0.65 - l) * 1000), 1) 0 0)`,"--chat-fondo":o?.fondo??`color-mix(in srgb, ${r.color1} 7%, var(--iswc-bg))`,"--iswc-accent":r.color1}}var f=g(new URL("js/components/chat/av-chat-tema.min.mjs",new URL("../",import.meta.url)).href,"av-chat-tema",{tema:null},(o,r,e)=>{let m=r.tema?.id??"",l=d(r.tema)??c[0],n=a=>u(e,"av-chat-tema",{tema:a}),i=a=>o.querySelector(`#${a}`).value,b=()=>n({id:"propio",color1:i("color1"),color2:i("color2"),angulo:Number(i("angulo"))||135});o.append(t`
    <section class="tema" part="tema">
      <iswc-heading class="titulo" level="4">Tema del chat</iswc-heading>
      <div class="muestras" role="group" aria-label="Tema del chat">
        <iswc-button class="muestra app" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(!r.tema)} title="Tema de la app" oniswc-click=${()=>n(null)}>App</iswc-button>
        ${c.map(a=>t`<iswc-button class="muestra" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(m===a.id)} title=${a.nombre} aria-label=${a.nombre} style=${`--fondo:${s(a)}`} oniswc-click=${()=>n({id:a.id})}></iswc-button>`)}
      </div>
      <iswc-details class="propio" variant="plain" summary="Personalizar" ?open=${m==="propio"}>
        <div class="campos">
          <iswc-color-picker id="color1" label="Color 1" value=${l.color1}></iswc-color-picker>
          <iswc-color-picker id="color2" label="Color 2" value=${l.color2}></iswc-color-picker>
          <iswc-input id="angulo" type="number" min="0" max="360" step="15" label="Ángulo" value=${String(l.angulo)}></iswc-input>
          <iswc-button variant="compact" color="brand" oniswc-click=${b}>Aplicar</iswc-button>
        </div>
      </iswc-details>
    </section>
  `)});p("av-chat-tema",f);export{h as a,v as b};
