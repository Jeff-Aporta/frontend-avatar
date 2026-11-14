import{ra as i,ta as s,wa as t}from"./chunk-22HCQII4.mjs";var l=t(new URL("view/inicio/components/av-caracteristicas.min.mjs",new URL("../",import.meta.url)).href,"av-caracteristicas",{titulo:"Caracter\xEDsticas principales",subtitulo:"",items:[],variante:"tarjetas",escena:"",lado:"izquierda"},(c,a)=>{c.append(i`
      <section class="seccion" part="seccion" data-variante=${a.variante} data-escena=${a.escena?a.lado:"no"} aria-labelledby="t">
        ${a.escena?i`<av-escena class="ilustracion" part="ilustracion" escena=${a.escena}></av-escena>`:null}
        <div class="cuerpo">
        <iswc-heading level="2" id="t" class="titulo">${a.titulo}</iswc-heading>
        ${a.subtitulo?i`<p class="subtitulo">${a.subtitulo}</p>`:null}
        <div class="rejilla" part="rejilla">
          ${a.items.map((e,n)=>i`
            <article class="item" style=${`--i:${n}`}>
              <span class="icono" aria-hidden="true"><iswc-icon icon=${e.icono}></iswc-icon></span>
              <iswc-heading level="3" class="nombre">${e.titulo}</iswc-heading>
              <p class="texto">${e.texto}</p>
            </article>
          `)}
        </div>
        </div>
      </section>
    `)});s("av-caracteristicas",l);
