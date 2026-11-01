import{crearComponente as m,define as u,html as s}from"../../base/componente.js?v=kpvpk6";import{ESCENAS as p,urlPieza as g}from"../../core/escenas.js?v=aig35t";const d=(a,t)=>{const e=`--x:${a.x}%;--y:${a.y}%;--ancho:${a.ancho}%;--z:${a.z??1};--retraso:${a.retraso??0}s;--giro:${a.giro??0}deg`;return a.tipo==="pieza"?s`<img class="capa pieza" data-anim=${a.anim??"ninguna"} style=${e} src=${g(a.pieza,t)} alt="" loading="lazy" decoding="async" draggable="false">`:s`<span class="capa forma" data-forma=${a.forma} data-color=${a.color} data-anim=${a.anim??"ninguna"} style=${e}></span>`},$=m(import.meta.url,"av-escena",{escena:"bienvenida",etiqueta:""},(a,t,e)=>{const l=e.getAttribute("escena")??t.escena,o=e.getAttribute("etiqueta")??t.etiqueta,i=p[l]??p.vacio,r=s`
    <figure class="lienzo" part="lienzo" style=${`--proporcion:${i.proporcion}`}>
      <span class="halo" part="halo"></span>
      ${i.capas.map(c=>d(c,document.baseURI))}
    </figure>
  `,n=r.firstElementChild;o?(n.setAttribute("role","img"),n.setAttribute("aria-label",o)):n.setAttribute("aria-hidden","true"),a.append(r)});u("av-escena",$);
