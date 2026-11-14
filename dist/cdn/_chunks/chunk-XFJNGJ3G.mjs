import{ra as a,ta as s,wa as t}from"./chunk-22HCQII4.mjs";var o=t(new URL("view/inicio/components/av-abierto.min.mjs",new URL("../",import.meta.url)).href,"av-abierto",{titulo:"",pilares:[]},(c,e)=>{c.append(a`
    <section class="banda" part="banda" aria-labelledby="t">
      <div class="interior">
        <iswc-heading level="2" id="t" class="titulo">${e.titulo}</iswc-heading>
        <div class="rejilla" part="rejilla">
          <av-escena class="ilustracion" part="ilustracion" escena="red"></av-escena>
          ${e.pilares.map(i=>a`
            <article class="pilar">
              <iswc-heading level="3" class="nombre"><iswc-icon icon=${i.icono}></iswc-icon><span>${i.titulo}</span></iswc-heading>
              <p class="texto">${i.texto}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `)});s("av-abierto",o);
