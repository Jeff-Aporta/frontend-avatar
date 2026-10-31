import{crearComponente as o,define as r,html as t}from"../../base/componente.js?v=17uldv";function l(s,a){const e=(s||a||"?").trim(),n=e.split(/\s+/).filter(Boolean);return(n.length>1?`${n[0][0]}${n[1][0]}`:e.slice(0,2)).toUpperCase()}const i=o(import.meta.url,"av-persona",{iusuario:"",nombre:null,detalle:"",compacto:!1},(s,a)=>{const e=a.nombre||a.iusuario;s.append(t`
    <span class="persona" part="persona" title=${a.compacto?e:""}>
      <iswc-avatar class="avatar" part="avatar" initials=${l(a.nombre,a.iusuario)} label=${e}></iswc-avatar>
      ${a.compacto?null:t`<span class="texto"><span class="nombre" part="nombre">${e}</span>${a.detalle?t`<span class="detalle" part="detalle">${a.detalle}</span>`:null}</span>`}
    </span>
  `)});r("av-persona",i);export{l as iniciales};
