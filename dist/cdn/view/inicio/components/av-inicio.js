import{crearComponente as e,define as t,html as p}from"../../../js/base/componente.js?v=y3pj6c";import{ir as n}from"../../../js/core/router.js?v=p69ssf";import{caracteristicas as c,planes as m}from"../utils/landing.js?v=7z2r8t";import"./av-hero.js?v=v1cfta";import"./av-caracteristicas.js?v=fv0hoo";import"./av-precios.js?v=ljuqe3";const v=e(import.meta.url,"av-inicio",{sesion:!1},(s,i)=>{const r=a=>{const{vista:o}=a.detail;n(o)};s.append(p`
    <div class="pagina" part="pagina" onav-inicio-ir=${r}>
      <av-hero id="hero"></av-hero>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <av-precios id="precios"></av-precios>
      <footer class="pie" part="pie">
        <span>Avatar · Odys — Operation Dashboard Year System</span>
        <span>Web components (kit iswc) · API DER en Cloudflare</span>
      </footer>
    </div>
  `),s.querySelector("#hero").props={sesion:i.sesion},s.querySelector("#caracteristicas").props={items:c()},s.querySelector("#precios").props={planes:m()}});t("av-inicio",v);
