import{crearComponente as o,define as c,emitir as n,html as t}from"../../../js/base/componente.js?v=zohalw";const i=o(import.meta.url,"av-correo-carpetas",{carpetas:[],activa:"entrada"},(e,r,s)=>{e.append(t`
    <nav class="carpetas" part="carpetas" aria-label="Carpetas del correo">
      ${r.carpetas.map(a=>t`
        <iswc-button class="carpeta" data-carpeta=${a.carpeta} variant=${a.carpeta===r.activa?"soft":"plain"} color=${a.carpeta===r.activa?"brand":"neutral"} aria-current=${a.carpeta===r.activa?"page":"false"}
          oniswc-click=${()=>n(s,"av-correos-carpeta",{carpeta:a.carpeta})}>
          <iswc-icon slot="start" icon=${a.icono}></iswc-icon>
          <span class="nombre">${a.label}</span>
          ${a.noLeidos?t`<iswc-badge slot="end" class="no-leidos" color="warning" variant="filled" pill>${a.noLeidos}</iswc-badge>`:a.total?t`<span slot="end" class="total">${a.total}</span>`:null}
        </iswc-button>
      `)}
    </nav>
  `)});c("av-correo-carpetas",i);
