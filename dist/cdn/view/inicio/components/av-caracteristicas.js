import{crearComponente as e,define as r,html as i}from"../../../js/base/componente.js?v=333q2n";const l=e(import.meta.url,"av-caracteristicas",{titulo:"Caracter\xEDsticas principales",subtitulo:"",items:[],variante:"tarjetas"},(s,t)=>{s.append(i`
      <section class="seccion" part="seccion" data-variante=${t.variante} aria-labelledby="t">
        <h2 id="t" class="titulo">${t.titulo}</h2>
        ${t.subtitulo?i`<p class="subtitulo">${t.subtitulo}</p>`:null}
        <div class="rejilla" part="rejilla">
          ${t.items.map((a,c)=>i`
            <article class="item" style=${`--i:${c}`}>
              <span class="icono" aria-hidden="true"><iswc-icon icon=${a.icono}></iswc-icon></span>
              <h3 class="nombre">${a.titulo}</h3>
              <p class="texto">${a.texto}</p>
            </article>
          `)}
        </div>
      </section>
    `)});r("av-caracteristicas",l);
