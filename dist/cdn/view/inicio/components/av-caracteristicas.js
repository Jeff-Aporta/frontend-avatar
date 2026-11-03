import{crearComponente as c,define as l,html as i}from"../../../js/base/componente.js?v=3wyanc";const n=c(import.meta.url,"av-caracteristicas",{titulo:"Caracter\xEDsticas principales",subtitulo:"",items:[],variante:"tarjetas",escena:"",lado:"izquierda"},(e,a)=>{e.append(i`
      <section class="seccion" part="seccion" data-variante=${a.variante} data-escena=${a.escena?a.lado:"no"} aria-labelledby="t">
        ${a.escena?i`<av-escena class="ilustracion" part="ilustracion" escena=${a.escena}></av-escena>`:null}
        <div class="cuerpo">
        <iswc-heading level="2" id="t" class="titulo">${a.titulo}</iswc-heading>
        ${a.subtitulo?i`<p class="subtitulo">${a.subtitulo}</p>`:null}
        <div class="rejilla" part="rejilla">
          ${a.items.map((s,t)=>i`
            <article class="item" style=${`--i:${t}`}>
              <span class="icono" aria-hidden="true"><iswc-icon icon=${s.icono}></iswc-icon></span>
              <iswc-heading level="3" class="nombre">${s.titulo}</iswc-heading>
              <p class="texto">${s.texto}</p>
            </article>
          `)}
        </div>
        </div>
      </section>
    `)});l("av-caracteristicas",n);
