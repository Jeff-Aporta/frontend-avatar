import{ra as i,ta as c,wa as e}from"./chunk-22HCQII4.mjs";var l=e(new URL("view/inicio/components/av-comunidad.min.mjs",new URL("../",import.meta.url)).href,"av-comunidad",{titulo:"",texto:"",personas:[],cifras:[]},(n,a)=>{let o=a.personas.length||1;n.append(i`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <div class="constelacion" part="constelacion" aria-hidden="true">
        ${a.personas.map((s,t)=>i`
          <iswc-avatar class="persona" style=${`--i:${t};--n:${o}`} image=${new URL(s,document.baseURI).href} loading="lazy" shape="circle"></iswc-avatar>
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
  `)});c("av-comunidad",l);
