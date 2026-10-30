import{crearComponente as c,define as n,emitir as l,html as p}from"../../../js/base/componente.js?v=y3pj6c";import{LEMA as o}from"../utils/landing.js?v=7z2r8t";const m=c(import.meta.url,"av-hero",{sesion:!1},(a,i,t)=>{const s=r=>l(t,"av-inicio-ir",{vista:r}),e=new URL("assets/img/ilustration.svg",document.baseURI).href;a.append(p`
    <section class="hero" part="hero" aria-labelledby="titulo">
      <div class="texto">
        <p class="kicker"><iswc-tag color="brand" pill>Avatar · Odys</iswc-tag></p>
        <h1 id="titulo" class="titulo" part="titulo">${o.titulo}</h1>
        <p class="lede">${o.texto}</p>
        <div class="acciones">
          <iswc-button id="empezar" color="brand" oniswc-click=${()=>s(i.sesion?"panel":"acceso")}>
            ${i.sesion?"Ir al panel":"Empieza ahora"}<iswc-icon slot="end" icon="mdi:arrow-right"></iswc-icon>
          </iswc-button>
          <iswc-button variant="outlined" color="neutral" oniswc-click=${()=>s("asistente")}>Conoce a AVO</iswc-button>
        </div>
        <p class="nota">Equipos, canales, kanban, CRM y permisos por rol. Sin instalar nada.</p>
      </div>
      <img class="ilustracion" part="ilustracion" src=${e} alt="" loading="eager">
    </section>
  `)});n("av-hero",m);
