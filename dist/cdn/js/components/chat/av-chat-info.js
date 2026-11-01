import{crearComponente as _,define as D,emitir as s,html as t}from"../../base/componente.js?v=m5nu5c";import{claveDia as G,horaCorta as H,iniciales as k,rotuloDia as z}from"../../chat/formato.js?v=xzgyvo";import{textos as L}from"../../chat/textos.js?v=cthyvo";import{iconoArchivo as M}from"./av-chat-adjunto.js?v=ffh5yn";const P=_(import.meta.url,"av-chat-info",{abierto:!1,tema:null,modo:"chat",id:null,tipo:"directo",nombre:"",descripcion:"",foto:null,iniciales:"",color:0,estado:"",yo:"",soyAdmin:!1,miembros:[],fijado:!1,silenciado:!1,archivado:!1,multimedia:[],archivos:[],enlaces:[],destacados:[],mensaje:null},(u,a,y)=>{const o=y;if(!a.id)return;const n=L(),b=()=>s(o,"av-chat-panel-cerrar",{panel:"info"}),v=i=>i?`${z(G(i),n)} \xB7 ${H(i)}`:"";if(a.modo==="mensaje"&&a.mensaje){const i=a.mensaje,c=i.filas.filter(e=>e.leido),m=i.filas.filter(e=>!e.leido&&e.entregado),I=i.filas.filter(e=>!e.leido&&!e.entregado),$=(e,q,f,p,S)=>f.length?t`
        <section class="bloque ${S}">
          <iswc-heading level="4"><iswc-icon icon=${q}></iswc-icon>${e}</iswc-heading>
          <ul class="gente">${f.map(l=>t`<li><span class="foto" data-color=${String(l.color)}><iswc-avatar initials=${k(l.nombre)} label=${l.nombre}></iswc-avatar></span><span class="datos"><strong>${l.nombre}</strong>${p?t`<span>${v(l[p])}</span>`:null}</span></li>`)}</ul>
        </section>`:null;u.append(t`
        <aside class="info" part="info">
          <header class="cabeza"><iswc-button variant="plain compact" color="neutral" title=${n.cerrar} aria-label=${n.cerrar} oniswc-click=${b}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button><iswc-heading level="3">${n.infoMensaje}</iswc-heading></header>
          <div class="cuerpo">
            <blockquote class="previa"><p>${i.texto}</p><span>${v(i.ts)}</span></blockquote>
            ${$(n.leidoPor,"mdi:check-all",c,"leido","leidos")}
            ${$(n.entregadoA,"mdi:check-all",m,"entregado","entregados")}
            ${$(n.pendienteDe,"mdi:clock-outline",I,null,"pendientes")}
          </div>
        </aside>
      `);return}const r=a.tipo!=="directo",w=i=>s(o,"av-chat-preferencias",{icanal:a.id,...i}),d=()=>t`<p class="nada">${n.sinElementos}</p>`,j=i=>i.length?t`<div class="mosaico">${i.map(c=>t`<iswc-button class="mini" variant="row" color="neutral" title=${c.titulo} onclick=${()=>s(o,"av-chat-accion",{accion:"ver",imensaje:c.ref})}>${c.tipo==="video"?t`<video src=${c.url} preload="metadata" muted></video><iswc-icon class="play" icon="mdi:play-circle"></iswc-icon>`:t`<img src=${c.url} alt=${c.titulo} loading="lazy">`}</iswc-button>`)}</div>`:d(),E=i=>i.length?t`<ul class="filas">${i.map(c=>t`<li><iswc-icon class="ico" icon=${M(c.titulo,c.tipo)}></iswc-icon><span class="datos"><strong>${c.titulo}</strong><span><iswc-format-bytes value=${String(c.bytes)} autofit></iswc-format-bytes> · ${c.detalle}</span></span><iswc-button variant="plain compact" color="neutral" href=${c.url} download=${c.titulo} title=${n.descargar} aria-label=${n.descargar}><iswc-icon icon="mdi:download"></iswc-icon></iswc-button></li>`)}</ul>`:d(),A=i=>i.length?t`<ul class="filas">${i.map(c=>t`<li><iswc-icon class="ico" icon="mdi:link-variant"></iswc-icon><span class="datos"><a href=${c.url} target="_blank" rel="noopener noreferrer">${c.url}</a><span>${c.detalle}</span></span></li>`)}</ul>`:d(),C=i=>i.length?t`<ul class="filas">${i.map(c=>t`<li><iswc-button class="destacado" variant="row" color="neutral" onclick=${()=>s(o,"av-chat-abrir",{icanal:a.id,imensaje:c.ref})}><iswc-icon class="ico estrella" icon="mdi:star"></iswc-icon><span class="datos"><strong data-color=${String(c.color)}>${c.titulo}</strong><span>${c.detalle}</span></span></iswc-button></li>`)}</ul>`:d(),g=o.__tab??"multimedia";u.append(t`
      <aside class="info" part="info">
        <header class="cabeza">
          <iswc-button variant="plain compact" color="neutral" title=${n.cerrar} aria-label=${n.cerrar} oniswc-click=${b}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
          <iswc-heading level="3">${r?n.infoGrupo:n.infoContacto}</iswc-heading>
          ${r&&a.soyAdmin?t`<iswc-button variant="plain compact" color="neutral" title=${n.editarGrupo} aria-label=${n.editarGrupo} oniswc-click=${()=>s(o,"av-chat-panel",{panel:"grupo-editar"})}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>`:null}
        </header>
        <div class="cuerpo">
          <section class="heroe">
            <span class="foto grande" data-color=${String(a.color)}><iswc-avatar initials=${a.iniciales} image=${a.foto??""} label=${a.nombre}></iswc-avatar></span>
            <iswc-heading level="2">${a.nombre}</iswc-heading>
            <p class="estado">${r?`${a.miembros.length} ${n.integrantes}`:a.estado}</p>
            ${a.descripcion?t`<p class="descripcion">${a.descripcion}</p>`:null}
          </section>
          <section class="interruptores">
            <iswc-button variant=${a.silenciado?"soft":"plain"} color=${a.silenciado?"brand":"neutral"} oniswc-click=${()=>w({silenciado:!a.silenciado})}><iswc-icon slot="start" icon=${a.silenciado?"mdi:bell-off":"mdi:bell-outline"}></iswc-icon>${a.silenciado?n.activarSonido:n.silenciar}</iswc-button>
            <iswc-button variant=${a.fijado?"soft":"plain"} color=${a.fijado?"brand":"neutral"} oniswc-click=${()=>w({fijado:!a.fijado})}><iswc-icon slot="start" icon="mdi:pin-outline"></iswc-icon>${a.fijado?n.desfijarChat:n.fijarChat}</iswc-button>
            <iswc-button variant=${a.archivado?"soft":"plain"} color=${a.archivado?"brand":"neutral"} oniswc-click=${()=>w({archivado:!a.archivado})}><iswc-icon slot="start" icon="mdi:archive-outline"></iswc-icon>${a.archivado?n.desarchivar:n.archivar}</iswc-button>
          </section>
          <av-chat-tema class="tema"></av-chat-tema>
          <iswc-tab-group class="pestanas" active=${g} oniswc-tab-show=${i=>{o.__tab=i.detail?.name??g}}>
            <iswc-tab slot="nav" panel="multimedia">${n.multimedia} <small>${a.multimedia.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="archivos">${n.archivos} <small>${a.archivos.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="enlaces">${n.enlaces} <small>${a.enlaces.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="destacados">${n.destacados} <small>${a.destacados.length}</small></iswc-tab>
            <iswc-tab-panel name="multimedia">${j(a.multimedia)}</iswc-tab-panel>
            <iswc-tab-panel name="archivos">${E(a.archivos)}</iswc-tab-panel>
            <iswc-tab-panel name="enlaces">${A(a.enlaces)}</iswc-tab-panel>
            <iswc-tab-panel name="destacados">${C(a.destacados)}</iswc-tab-panel>
          </iswc-tab-group>
          ${r?t`
            <section class="integrantes">
              <iswc-heading level="4"><span>${a.miembros.length} ${n.integrantes}</span>
                ${a.soyAdmin?t`<iswc-button variant="soft compact" color="brand" pill oniswc-click=${()=>s(o,"av-chat-panel",{panel:"grupo-agregar"})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>${n.agregarIntegrantes}</iswc-button>`:null}
              </iswc-heading>
              <ul class="gente">
                ${a.miembros.map(i=>t`
                  <li>
                    <iswc-button class="persona" variant="row" color="neutral" ?disabled=${i.id===a.yo} onclick=${()=>s(o,"av-chat-directo",{iusuario:i.id})}>
                      <span class="foto" data-color=${String(i.color)}><iswc-avatar initials=${k(i.nombre)} image=${i.foto??""} label=${i.nombre}></iswc-avatar>${i.enLinea?t`<span class="presencia"></span>`:null}</span>
                      <span class="datos"><strong>${i.id===a.yo?`${i.nombre} (${n.tu})`:i.nombre}</strong><span>${i.detalle}</span></span>
                      ${i.rol==="admin"?t`<iswc-tag class="rol" color="brand" pill>${n.admin}</iswc-tag>`:null}
                    </iswc-button>
                    ${a.soyAdmin&&i.id!==a.yo?t`
                      <iswc-dropdown placement="bottom-end" oniswc-select=${c=>{const m=c.detail?.item?.value;m&&s(o,"av-chat-miembros",{accion:m,usuarios:[i.id]})}}>
                        <iswc-button slot="trigger" variant="plain compact" color="neutral" title=${n.menu} aria-label=${n.menu}><iswc-icon icon="mdi:dots-vertical"></iswc-icon></iswc-button>
                        ${i.rol==="admin"?t`<iswc-dropdown-item value="miembro"><iswc-icon slot="icon" icon="mdi:shield-off-outline"></iswc-icon>${n.quitarAdmin}</iswc-dropdown-item>`:t`<iswc-dropdown-item value="admin"><iswc-icon slot="icon" icon="mdi:shield-account-outline"></iswc-icon>${n.hacerAdmin}</iswc-dropdown-item>`}
                        <iswc-dropdown-item value="quitar" color="danger"><iswc-icon slot="icon" icon="mdi:account-remove-outline"></iswc-icon>${n.quitarDelGrupo}</iswc-dropdown-item>
                      </iswc-dropdown>`:null}
                  </li>`)}
              </ul>
              <iswc-button class="salir" variant="soft compact" color="danger" oniswc-click=${()=>s(o,"av-chat-miembros",{accion:"salir",usuarios:[]})}><iswc-icon slot="start" icon="mdi:exit-run"></iswc-icon>${n.salirDelGrupo}</iswc-button>
            </section>`:null}
        </div>
      </aside>
    `);const h=u.querySelector("av-chat-tema");h&&(h.props={tema:a.tema})});D("av-chat-info",P);
