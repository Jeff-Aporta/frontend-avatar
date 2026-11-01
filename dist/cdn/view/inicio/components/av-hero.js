import{crearComponente as n,define as r,emitir as l,html as d}from"../../../js/base/componente.js?v=kpvpk6";import{LEMA as c}from"../utils/landing.js?v=h4f8yf";const p=n(import.meta.url,"av-hero",{sesion:!1},(o,i,e)=>{const a=s=>l(e,"av-inicio-ir",{vista:s}),t=s=>new URL(s,document.baseURI).href;o.append(d`
    <section class="hero" part="hero" aria-labelledby="titulo">
      <img class="banner" part="banner" src=${t("assets/img/bgbanner.svg")} alt="" aria-hidden="true">
      <div class="velo" aria-hidden="true"></div>
      <div class="contenido">
        <div class="texto">
          <p class="kicker"><iswc-tag color="brand" pill>Avatar · Odys</iswc-tag></p>
          <iswc-heading level="1" id="titulo" class="titulo" part="titulo">${c.titulo}</iswc-heading>
          <p class="lede">${c.texto}</p>
          <div class="acciones">
            <iswc-button variant="compact" id="empezar" color="brand" class="principal" oniswc-click=${()=>a(i.sesion?"panel":"acceso")}>
              ${i.sesion?"Ir al panel":"Empieza ahora"}<iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
            </iswc-button>
            <iswc-button variant="outlined compact" color="brand" oniswc-click=${()=>a("asistente")}><iswc-icon slot="start" icon="mdi:robot-outline"></iswc-icon>Conoce a AVO</iswc-button>
          </div>
          <iswc-button variant="text compact" color="brand" class="enlace" oniswc-click=${()=>a(i.sesion?"panel":"acceso")}>${c.enlace} →</iswc-button>
        </div>
        <av-escena class="ilustracion" part="ilustracion" escena="bienvenida" etiqueta="Equipo celebrando con Avatar"></av-escena>
      </div>
    </section>
  `)});r("av-hero",p);
