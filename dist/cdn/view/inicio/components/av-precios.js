import{crearComponente as l,define as r,emitir as t,html as c}from"../../../js/base/componente.js?v=333q2n";const n=l(import.meta.url,"av-precios",{planes:[]},(a,i,o)=>{a.append(c`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <h2 id="t" class="titulo">Planes y precios</h2>
      <div class="rejilla" part="rejilla">
        ${i.planes.map(s=>c`
          <iswc-card variant=${s.destacado?"accent":"outlined"} class="plan" data-destacado=${s.destacado?"1":"0"}>
            <strong slot="header" class="cabeza">${s.titulo}${s.destacado?c`<iswc-badge color="success" pill>Recomendado</iswc-badge>`:null}</strong>
            <p class="precio"><span class="valor">${s.precio}</span> <span class="periodo">${s.periodo}</span></p>
            <ul class="incluye">${s.incluye.map(e=>c`<li><iswc-icon icon="mdi:check"></iswc-icon>${e}</li>`)}</ul>
            <iswc-button slot="footer" color=${s.destacado?"brand":"neutral"} variant=${s.destacado?"filled":"outlined"} oniswc-click=${()=>t(o,"av-inicio-ir",{vista:"acceso",plan:s.id})}>Suscribirse</iswc-button>
          </iswc-card>
        `)}
      </div>
    </section>
  `)});r("av-precios",n);
