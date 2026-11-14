import{ra as r,ta as t,ua as o,wa as s}from"./chunk-22HCQII4.mjs";var i=s(new URL("view/correos/components/av-correo-carpetas.min.mjs",new URL("../",import.meta.url)).href,"av-correo-carpetas",{carpetas:[],activa:"entrada"},(c,e,n)=>{c.append(r`
    <nav class="carpetas" part="carpetas" aria-label="Carpetas del correo">
      ${e.carpetas.map(a=>r`
        <iswc-button class="carpeta" data-carpeta=${a.carpeta} variant=${a.carpeta===e.activa?"soft":"plain"} color=${a.carpeta===e.activa?"brand":"neutral"} aria-current=${a.carpeta===e.activa?"page":"false"}
          oniswc-click=${()=>o(n,"av-correos-carpeta",{carpeta:a.carpeta})}>
          <iswc-icon slot="start" icon=${a.icono}></iswc-icon>
          <span class="nombre">${a.label}</span>
          ${a.noLeidos?r`<iswc-badge slot="end" class="no-leidos" color="warning" variant="filled" pill>${a.noLeidos}</iswc-badge>`:a.total?r`<span slot="end" class="total">${a.total}</span>`:null}
        </iswc-button>
      `)}
    </nav>
  `)});t("av-correo-carpetas",i);
