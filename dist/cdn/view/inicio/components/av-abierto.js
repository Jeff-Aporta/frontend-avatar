import{crearComponente as t,define as o,html as e}from"../../../js/base/componente.js?v=49yoqc";const l=t(import.meta.url,"av-abierto",{titulo:"",pilares:[]},(s,a)=>{s.append(e`
    <section class="banda" part="banda" aria-labelledby="t">
      <div class="interior">
        <iswc-heading level="2" id="t" class="titulo">${a.titulo}</iswc-heading>
        <div class="rejilla" part="rejilla">
          ${a.pilares.map(i=>e`
            <article class="pilar">
              <iswc-heading level="3" class="nombre"><iswc-icon icon=${i.icono}></iswc-icon><span>${i.titulo}</span></iswc-heading>
              <p class="texto">${i.texto}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `)});o("av-abierto",l);
