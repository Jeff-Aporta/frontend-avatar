import{crearComponente as n,define as r,emitir as l,html as d}from"../../../js/base/componente.js?v=3c3042";import{LEMA as a}from"../utils/landing.js?v=h4f8yf";const p=n(import.meta.url,"av-hero",{sesion:!1},(c,i,e)=>{const s=o=>l(e,"av-inicio-ir",{vista:o}),t=o=>new URL(o,document.baseURI).href;c.append(d`
    <section class="hero" part="hero" aria-labelledby="titulo">
      <img class="banner" part="banner" src=${t("assets/img/bgbanner.svg")} alt="" aria-hidden="true">
      <div class="velo" aria-hidden="true"></div>
      <div class="contenido">
        <div class="texto">
          <p class="kicker"><iswc-tag color="brand" pill>Avatar · Odys</iswc-tag></p>
          <h1 id="titulo" class="titulo" part="titulo">${a.titulo}</h1>
          <p class="lede">${a.texto}</p>
          <div class="acciones">
            <iswc-button id="empezar" color="brand" class="principal" oniswc-click=${()=>s(i.sesion?"panel":"acceso")}>
              ${i.sesion?"Ir al panel":"Empieza ahora"}<iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
            </iswc-button>
            <iswc-button variant="outlined" color="brand" oniswc-click=${()=>s("asistente")}><iswc-icon slot="start" icon="mdi:robot-outline"></iswc-icon>Conoce a AVO</iswc-button>
          </div>
          <iswc-button variant="text" color="brand" class="enlace" oniswc-click=${()=>s(i.sesion?"panel":"acceso")}>${a.enlace} →</iswc-button>
        </div>
        <img class="ilustracion" part="ilustracion" src=${t("assets/img/ilustration.svg")} alt="Equipo trabajando con los tableros de Avatar" loading="eager">
      </div>
    </section>
  `)});r("av-hero",p);
