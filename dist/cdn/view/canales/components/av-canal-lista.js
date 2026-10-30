import{crearComponente as c,define as r,emitir as t,html as i}from"../../../js/base/componente.js?v=3c3042";import{ICONO_CANAL as u,ordenarCanales as d}from"../utils/chat.js?v=zzzoma";const v=c(import.meta.url,"av-canal-lista",{canales:[],activo:null,cargando:!1,puedeCrear:!1},(s,n,e)=>{const l=d(n.canales);s.append(i`
    <nav class="lista" part="lista" aria-label="Canales">
      <header class="cabeza">
        <strong>Canales</strong>
        ${n.puedeCrear?i`<iswc-button class="nuevo" variant="plain" color="brand" oniswc-click=${()=>t(e,"av-canal-nuevo")}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nuevo</iswc-button>`:null}
      </header>
      ${n.cargando&&l.length===0?i`<div class="esqueletos">${[1,2,3].map(()=>i`<iswc-skeleton class="esqueleto"></iswc-skeleton>`)}</div>`:l.length===0?i`<av-vacio id="vacio"></av-vacio>`:i`<ul class="filas">
            ${l.map(a=>i`
              <li class="fila" part="fila" data-activo=${a.icanal===n.activo?"1":"0"} data-icanal=${String(a.icanal)}>
                <iswc-button class="boton" variant=${a.icanal===n.activo?"soft":"plain"} color=${a.icanal===n.activo?"brand":"neutral"} oniswc-click=${()=>t(e,"av-canal-elegido",{icanal:a.icanal})}>
                  <iswc-icon slot="start" icon=${u[a.tipo]??"mdi:pound"}></iswc-icon>
                  <span class="texto"><span class="nombre">${a.nombre}</span><span class="ultimo">${a.ultimo?`${a.ultimo.iusuario}: ${a.ultimo.contenido}`:a.descripcion??""}</span></span>
                  ${a.sin_leer>0?i`<iswc-badge slot="end" color="danger" pill>${a.sin_leer}</iswc-badge>`:null}
                </iswc-button>
              </li>
            `)}
          </ul>`}
    </nav>
  `);const o=s.querySelector("#vacio");o&&(o.props={icono:"mdi:forum-outline",titulo:"Sin canales",texto:n.puedeCrear?"Crea el primer canal de la empresa.":"A\xFAn no hay canales visibles para ti."})});r("av-canal-lista",v);
