import"../../../_chunks/chunk-33MKG54W.mjs";import{a as c,b as n,c as p,d,e as v,f as m,g as l,h as u}from"../../../_chunks/chunk-HR4TMUC4.mjs";import"../../../_chunks/chunk-SKEI2ANK.mjs";import"../../../_chunks/chunk-XFJNGJ3G.mjs";import"../../../_chunks/chunk-HY3KAMAZ.mjs";import{l as t}from"../../../_chunks/chunk-RTQWBEUQ.mjs";import"../../../_chunks/chunk-YDU3QAVP.mjs";import{ra as r,ta as s,wa as e}from"../../../_chunks/chunk-22HCQII4.mjs";import"../../../_chunks/chunk-JOUQNVKA.mjs";import"../../../_chunks/chunk-2XJIRYNX.mjs";import"../../../_chunks/chunk-FWBWSRYW.mjs";import"../../../_chunks/chunk-S24WVIZS.mjs";var C=e(new URL("view/inicio/components/av-inicio.min.mjs",new URL("../../../",import.meta.url)).href,"av-inicio",{sesion:!1},(o,g)=>{let h=a=>{let{vista:f}=a.detail;t(f)};o.append(r`
    <div class="pagina" part="pagina" onav-inicio-ir=${h}>
      <av-hero id="hero"></av-hero>
      <av-comunidad id="comunidad"></av-comunidad>
      <av-caracteristicas id="caracteristicas"></av-caracteristicas>
      <div class="franja"><av-caracteristicas id="productividad"></av-caracteristicas></div>
      <av-precios id="precios"></av-precios>
      <av-caracteristicas id="tecnologia"></av-caracteristicas>
      <av-abierto id="abierto"></av-abierto>
    </div>
  `);let i=a=>o.querySelector(`#${a}`);i("hero").props={sesion:g.sesion},i("comunidad").props={...c,personas:u(12)},i("caracteristicas").props={titulo:"Caracter\xEDsticas principales",items:n(),variante:"tarjetas",escena:"modulos",lado:"izquierda"},i("productividad").props={titulo:"Productividad para tu equipo",items:p(),variante:"iconos",escena:"marca",lado:"derecha"},i("precios").props={planes:v()},i("tecnologia").props={titulo:"Tecnolog\xEDa que te respalda",items:d(),variante:"iconos"},i("abierto").props={titulo:m,pilares:l()}});s("av-inicio",C);
