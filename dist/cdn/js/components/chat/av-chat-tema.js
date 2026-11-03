import{crearComponente as m,define as u,emitir as d,html as r}from"../../base/componente.js?v=ykdqqm";import{coloresDe as v,degradado as h,TEMAS as s}from"../../chat/temas.js?v=w8y4js";const w=m(import.meta.url,"av-chat-tema",{tema:null},(t,o,n)=>{const c=o.tema?.id??"",e=v(o.tema)??s[0],l=a=>d(n,"av-chat-tema",{tema:a}),i=a=>t.querySelector(`#${a}`).value,p=()=>l({id:"propio",color1:i("color1"),color2:i("color2"),angulo:Number(i("angulo"))||135});t.append(r`
    <section class="tema" part="tema">
      <iswc-heading class="titulo" level="4">Tema del chat</iswc-heading>
      <div class="muestras" role="group" aria-label="Tema del chat">
        <iswc-button class="muestra app" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(!o.tema)} title="Tema de la app" oniswc-click=${()=>l(null)}>App</iswc-button>
        ${s.map(a=>r`<iswc-button class="muestra" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(c===a.id)} title=${a.nombre} aria-label=${a.nombre} style=${`--fondo:${h(a)}`} oniswc-click=${()=>l({id:a.id})}></iswc-button>`)}
      </div>
      <iswc-details class="propio" variant="plain" summary="Personalizar" ?open=${c==="propio"}>
        <div class="campos">
          <iswc-color-picker id="color1" label="Color 1" value=${e.color1}></iswc-color-picker>
          <iswc-color-picker id="color2" label="Color 2" value=${e.color2}></iswc-color-picker>
          <iswc-input id="angulo" type="number" min="0" max="360" step="15" label="Ángulo" value=${String(e.angulo)}></iswc-input>
          <iswc-button variant="compact" color="brand" oniswc-click=${p}>Aplicar</iswc-button>
        </div>
      </iswc-details>
    </section>
  `)});u("av-chat-tema",w);
