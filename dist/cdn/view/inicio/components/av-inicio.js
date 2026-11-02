import{crearComponente as e,define as c,html as p}from"../../../js/base/componente.js?v=49yoqc";import{ir as n}from"../../../js/core/router.js?v=l01npq";import{ABIERTO_TITULO as d,caracteristicas as v,COMUNIDAD as m,personas as l,pilares as u,planes as g,productividad as f,tecnologia as h}from"../utils/landing.js?v=h4f8yf";import"./av-hero.js?v=a6ort9";import"./av-comunidad.js?v=g4em8x";import"./av-caracteristicas.js?v=8ndcpw";import"./av-precios.js?v=ugbexv";import"./av-abierto.js?v=6ootfv";const C=e(import.meta.url,"av-inicio",{sesion:!1},(o,r)=>{const s=a=>{const{vista:t}=a.detail;n(t)};o.append(p`
    <div class="pagina" part="pagina" onav-inicio-ir=${s}>
      <av-hero id="hero"></av-hero>
      <av-comunidad id="comunidad"></av-comunidad>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <div class="franja"><av-caracteristicas id="productividad"></av-caracteristicas></div>
      <av-precios id="precios"></av-precios>
      <av-caracteristicas id="tecnologia"></av-caracteristicas>
      <av-abierto id="abierto"></av-abierto>
    </div>
  `);const i=a=>o.querySelector(`#${a}`);i("hero").props={sesion:r.sesion},i("comunidad").props={...m,personas:l(12)},i("caracteristicas").props={titulo:"Caracter\xEDsticas principales",items:v(),variante:"tarjetas"},i("productividad").props={titulo:"Productividad para tu equipo",items:f(),variante:"iconos"},i("precios").props={planes:g()},i("tecnologia").props={titulo:"Tecnolog\xEDa que te respalda",items:h(),variante:"iconos"},i("abierto").props={titulo:d,pilares:u()}});c("av-inicio",C);
