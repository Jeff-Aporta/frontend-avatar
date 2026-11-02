import{crearComponente as t,define as n,html as i}from"../../../js/base/componente.js?v=49yoqc";const l=t(import.meta.url,"av-comunidad",{titulo:"",texto:"",personas:[],cifras:[]},(c,a)=>{const e=a.personas.length||1;c.append(i`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <div class="constelacion" part="constelacion" aria-hidden="true">
        ${a.personas.map((s,o)=>i`
          <iswc-avatar class="persona" style=${`--i:${o};--n:${e}`} image=${new URL(s,document.baseURI).href} loading="lazy" shape="circle"></iswc-avatar>
        `)}
        <span class="nucleo"><iswc-icon icon="mdi:account-group"></iswc-icon></span>
      </div>
      <div class="texto">
        <iswc-heading level="2" id="t" class="titulo">${a.titulo}</iswc-heading>
        <p class="lede">${a.texto}</p>
        <div class="cifras">
          ${a.cifras.map(s=>i`<div class="cifra"><strong class="valor">${s.valor}</strong><span class="etiqueta">${s.etiqueta}</span></div>`)}
        </div>
      </div>
    </section>
  `)});n("av-comunidad",l);
