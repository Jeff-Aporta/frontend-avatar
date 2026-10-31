import{crearComponente as o,define as e,html as t}from"../../../js/base/componente.js?v=zohalw";const r=o(import.meta.url,"av-abierto",{titulo:"",pilares:[]},(s,a)=>{s.append(t`
    <section class="banda" part="banda" aria-labelledby="t">
      <div class="interior">
        <h2 id="t" class="titulo">${a.titulo}</h2>
        <div class="rejilla" part="rejilla">
          ${a.pilares.map(i=>t`
            <article class="pilar">
              <h3 class="nombre"><iswc-icon icon=${i.icono}></iswc-icon><span>${i.titulo}</span></h3>
              <p class="texto">${i.texto}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `)});e("av-abierto",r);
