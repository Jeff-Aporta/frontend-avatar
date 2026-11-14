import{ra as i,ta as c,ua as a,wa as e}from"./chunk-22HCQII4.mjs";var t=e(new URL("view/inicio/components/av-precios.min.mjs",new URL("../",import.meta.url)).href,"av-precios",{planes:[]},(o,l,n)=>{o.append(i`
    <section class="seccion" part="seccion" aria-labelledby="t">
      <iswc-heading level="2" id="t" class="titulo">Planes y precios</iswc-heading>
      <div class="rejilla" part="rejilla">
        ${l.planes.map(s=>i`
          <iswc-card variant=${s.destacado?"accent":"outlined"} class="plan" data-destacado=${s.destacado?"1":"0"}>
            <strong slot="header" class="cabeza">${s.titulo}${s.destacado?i`<iswc-badge color="success" pill>Recomendado</iswc-badge>`:null}</strong>
            <p class="precio"><span class="valor">${s.precio}</span> <span class="periodo">${s.periodo}</span></p>
            <ul class="incluye">${s.incluye.map(r=>i`<li><iswc-icon icon="mdi:check"></iswc-icon>${r}</li>`)}</ul>
            <iswc-button slot="footer" color=${s.destacado?"brand":"neutral"} variant=${s.destacado?"filled":"outlined"} oniswc-click=${()=>a(n,"av-inicio-ir",{vista:"acceso",plan:s.id})}>Suscribirse</iswc-button>
          </iswc-card>
        `)}
      </div>
    </section>
  `)});c("av-precios",t);
