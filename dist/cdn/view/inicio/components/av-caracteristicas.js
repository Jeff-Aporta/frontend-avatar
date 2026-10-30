import{crearComponente as t,define as r,html as a}from"../../../js/base/componente.js?v=hjriku";const e=t(import.meta.url,"av-caracteristicas",{items:[]},(i,c)=>{i.append(a`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <h2 id="t" class="titulo">Características principales</h2>
      <div class="rejilla" part="rejilla">
        ${c.items.map(s=>a`
          <iswc-card variant="outlined" class="tarjeta">
            <strong slot="header" class="cabeza"><span class="icono"><iswc-icon icon=${s.icono}></iswc-icon></span>${s.titulo}</strong>
            <p>${s.texto}</p>
          </iswc-card>
        `)}
      </div>
    </section>
  `)});r("av-caracteristicas",e);
