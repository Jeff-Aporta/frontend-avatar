import{crearComponente as c,define as l,html as t}from"../../../js/base/componente.js?v=kpvpk6";const r=c(import.meta.url,"av-caracteristicas",{titulo:"Caracter\xEDsticas principales",subtitulo:"",items:[],variante:"tarjetas"},(s,i)=>{s.append(t`
      <section class="seccion" part="seccion" data-variante=${i.variante} aria-labelledby="t">
        <iswc-heading level="2" id="t" class="titulo">${i.titulo}</iswc-heading>
        ${i.subtitulo?t`<p class="subtitulo">${i.subtitulo}</p>`:null}
        <div class="rejilla" part="rejilla">
          ${i.items.map((a,e)=>t`
            <article class="item" style=${`--i:${e}`}>
              <span class="icono" aria-hidden="true"><iswc-icon icon=${a.icono}></iswc-icon></span>
              <iswc-heading level="3" class="nombre">${a.titulo}</iswc-heading>
              <p class="texto">${a.texto}</p>
            </article>
          `)}
        </div>
      </section>
    `)});l("av-caracteristicas",r);
