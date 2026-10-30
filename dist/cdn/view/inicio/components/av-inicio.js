import{crearComponente as e,define as c,html as p}from"../../../js/base/componente.js?v=3c3042";import{ir as n}from"../../../js/core/router.js?v=eb61py";import{ABIERTO_TITULO as d,caracteristicas as v,COMUNIDAD as m,personas as l,pilares as u,planes as g,productividad as f,tecnologia as h}from"../utils/landing.js?v=h4f8yf";import"./av-hero.js?v=9uj1yp";import"./av-comunidad.js?v=hz45kf";import"./av-caracteristicas.js?v=ecvhqp";import"./av-precios.js?v=wdax1k";import"./av-abierto.js?v=jmaw61";const y=e(import.meta.url,"av-inicio",{sesion:!1},(s,r)=>{const o=i=>{const{vista:t}=i.detail;n(t)};s.append(p`
    <div class="pagina" part="pagina" onav-inicio-ir=${o}>
      <av-hero id="hero"></av-hero>
      <av-comunidad id="comunidad"></av-comunidad>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <div class="franja"><av-caracteristicas id="productividad"></av-caracteristicas></div>
      <av-precios id="precios"></av-precios>
      <av-caracteristicas id="tecnologia"></av-caracteristicas>
      <av-abierto id="abierto"></av-abierto>
      <footer class="pie" part="pie">
        <span class="marca">Avatar</span>
        <span>Gestión digital y automatización · Odys — Operation Dashboard Year System</span>
        <span>© ${new Date().getFullYear()}</span>
      </footer>
    </div>
  `);const a=i=>s.querySelector(`#${i}`);a("hero").props={sesion:r.sesion},a("comunidad").props={...m,personas:l(12)},a("caracteristicas").props={titulo:"Caracter\xEDsticas principales",items:v(),variante:"tarjetas"},a("productividad").props={titulo:"Productividad para tu equipo",items:f(),variante:"iconos"},a("precios").props={planes:g()},a("tecnologia").props={titulo:"Tecnolog\xEDa que te respalda",items:h(),variante:"iconos"},a("abierto").props={titulo:d,pilares:u()}});c("av-inicio",y);
