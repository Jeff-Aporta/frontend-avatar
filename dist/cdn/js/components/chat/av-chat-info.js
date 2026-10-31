import{crearComponente as _,define as S,emitir as e,html as o}from"../../base/componente.js?v=17uldv";import{claveDia as D,horaCorta as G,iniciales as p,rotuloDia as z}from"../../chat/formato.js?v=d40ok6";import{textos as H}from"../../chat/textos.js?v=gpj3dh";import{iconoArchivo as P}from"./av-chat-adjunto.js?v=2tr1xt";const L=_(import.meta.url,"av-chat-info",{abierto:!1,modo:"chat",id:null,tipo:"directo",nombre:"",descripcion:"",foto:null,iniciales:"",color:0,estado:"",yo:"",soyAdmin:!1,miembros:[],fijado:!1,silenciado:!1,archivado:!1,multimedia:[],archivos:[],enlaces:[],destacados:[],mensaje:null},(w,a,y)=>{const c=y;if(!a.id)return;const n=H(),b=()=>e(c,"av-chat-panel-cerrar",{panel:"info"}),v=i=>i?`${z(D(i),n)} \xB7 ${G(i)}`:"";if(a.modo==="mensaje"&&a.mensaje){const i=a.mensaje,t=i.filas.filter(s=>s.leido),u=i.filas.filter(s=>!s.leido&&s.entregado),C=i.filas.filter(s=>!s.leido&&!s.entregado),$=(s,I,f,g,q)=>f.length?o`
        <section class="bloque ${q}">
          <h4><iswc-icon icon=${I}></iswc-icon>${s}</h4>
          <ul class="gente">${f.map(l=>o`<li><span class="foto" data-color=${String(l.color)}><iswc-avatar initials=${p(l.nombre)} label=${l.nombre}></iswc-avatar></span><span class="datos"><strong>${l.nombre}</strong>${g?o`<span>${v(l[g])}</span>`:null}</span></li>`)}</ul>
        </section>`:null;w.append(o`
        <aside class="info" part="info">
          <header class="cabeza"><iswc-button variant="plain" color="neutral" title=${n.cerrar} aria-label=${n.cerrar} oniswc-click=${b}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button><h3>${n.infoMensaje}</h3></header>
          <div class="cuerpo">
            <blockquote class="previa"><p>${i.texto}</p><span>${v(i.ts)}</span></blockquote>
            ${$(n.leidoPor,"mdi:check-all",t,"leido","leidos")}
            ${$(n.entregadoA,"mdi:check-all",u,"entregado","entregados")}
            ${$(n.pendienteDe,"mdi:clock-outline",C,null,"pendientes")}
          </div>
        </aside>
      `);return}const r=a.tipo!=="directo",m=i=>e(c,"av-chat-preferencias",{icanal:a.id,...i}),d=()=>o`<p class="nada">${n.sinElementos}</p>`,k=i=>i.length?o`<div class="mosaico">${i.map(t=>o`<button class="mini" type="button" title=${t.titulo} onclick=${()=>e(c,"av-chat-accion",{accion:"ver",imensaje:t.ref})}>${t.tipo==="video"?o`<video src=${t.url} preload="metadata" muted></video><iswc-icon class="play" icon="mdi:play-circle"></iswc-icon>`:o`<img src=${t.url} alt=${t.titulo} loading="lazy">`}</button>`)}</div>`:d(),j=i=>i.length?o`<ul class="filas">${i.map(t=>o`<li><iswc-icon class="ico" icon=${P(t.titulo,t.tipo)}></iswc-icon><span class="datos"><strong>${t.titulo}</strong><span><iswc-format-bytes value=${String(t.bytes)} autofit></iswc-format-bytes> · ${t.detalle}</span></span><iswc-button variant="plain" color="neutral" href=${t.url} download=${t.titulo} title=${n.descargar} aria-label=${n.descargar}><iswc-icon icon="mdi:download"></iswc-icon></iswc-button></li>`)}</ul>`:d(),A=i=>i.length?o`<ul class="filas">${i.map(t=>o`<li><iswc-icon class="ico" icon="mdi:link-variant"></iswc-icon><span class="datos"><a href=${t.url} target="_blank" rel="noopener noreferrer">${t.url}</a><span>${t.detalle}</span></span></li>`)}</ul>`:d(),E=i=>i.length?o`<ul class="filas">${i.map(t=>o`<li><button class="destacado" type="button" onclick=${()=>e(c,"av-chat-abrir",{icanal:a.id,imensaje:t.ref})}><iswc-icon class="ico estrella" icon="mdi:star"></iswc-icon><span class="datos"><strong data-color=${String(t.color)}>${t.titulo}</strong><span>${t.detalle}</span></span></button></li>`)}</ul>`:d(),h=c.__tab??"multimedia";w.append(o`
      <aside class="info" part="info">
        <header class="cabeza">
          <iswc-button variant="plain" color="neutral" title=${n.cerrar} aria-label=${n.cerrar} oniswc-click=${b}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
          <h3>${r?n.infoGrupo:n.infoContacto}</h3>
          ${r&&a.soyAdmin?o`<iswc-button variant="plain" color="neutral" title=${n.editarGrupo} aria-label=${n.editarGrupo} oniswc-click=${()=>e(c,"av-chat-panel",{panel:"grupo-editar"})}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>`:null}
        </header>
        <div class="cuerpo">
          <section class="heroe">
            <span class="foto grande" data-color=${String(a.color)}><iswc-avatar initials=${a.iniciales} image=${a.foto??""} label=${a.nombre}></iswc-avatar></span>
            <h2>${a.nombre}</h2>
            <p class="estado">${r?`${a.miembros.length} ${n.integrantes}`:a.estado}</p>
            ${a.descripcion?o`<p class="descripcion">${a.descripcion}</p>`:null}
          </section>
          <section class="interruptores">
            <iswc-button variant=${a.silenciado?"soft":"plain"} color=${a.silenciado?"brand":"neutral"} oniswc-click=${()=>m({silenciado:!a.silenciado})}><iswc-icon slot="start" icon=${a.silenciado?"mdi:bell-off":"mdi:bell-outline"}></iswc-icon>${a.silenciado?n.activarSonido:n.silenciar}</iswc-button>
            <iswc-button variant=${a.fijado?"soft":"plain"} color=${a.fijado?"brand":"neutral"} oniswc-click=${()=>m({fijado:!a.fijado})}><iswc-icon slot="start" icon="mdi:pin-outline"></iswc-icon>${a.fijado?n.desfijarChat:n.fijarChat}</iswc-button>
            <iswc-button variant=${a.archivado?"soft":"plain"} color=${a.archivado?"brand":"neutral"} oniswc-click=${()=>m({archivado:!a.archivado})}><iswc-icon slot="start" icon="mdi:archive-outline"></iswc-icon>${a.archivado?n.desarchivar:n.archivar}</iswc-button>
          </section>
          <iswc-tab-group class="pestanas" active=${h} oniswc-tab-show=${i=>{c.__tab=i.detail?.name??h}}>
            <iswc-tab slot="nav" panel="multimedia">${n.multimedia} <small>${a.multimedia.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="archivos">${n.archivos} <small>${a.archivos.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="enlaces">${n.enlaces} <small>${a.enlaces.length}</small></iswc-tab>
            <iswc-tab slot="nav" panel="destacados">${n.destacados} <small>${a.destacados.length}</small></iswc-tab>
            <iswc-tab-panel name="multimedia">${k(a.multimedia)}</iswc-tab-panel>
            <iswc-tab-panel name="archivos">${j(a.archivos)}</iswc-tab-panel>
            <iswc-tab-panel name="enlaces">${A(a.enlaces)}</iswc-tab-panel>
            <iswc-tab-panel name="destacados">${E(a.destacados)}</iswc-tab-panel>
          </iswc-tab-group>
          ${r?o`
            <section class="integrantes">
              <h4><span>${a.miembros.length} ${n.integrantes}</span>
                ${a.soyAdmin?o`<iswc-button variant="soft" color="brand" pill oniswc-click=${()=>e(c,"av-chat-panel",{panel:"grupo-agregar"})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>${n.agregarIntegrantes}</iswc-button>`:null}
              </h4>
              <ul class="gente">
                ${a.miembros.map(i=>o`
                  <li>
                    <button class="persona" type="button" ?disabled=${i.id===a.yo} onclick=${()=>e(c,"av-chat-directo",{iusuario:i.id})}>
                      <span class="foto" data-color=${String(i.color)}><iswc-avatar initials=${p(i.nombre)} image=${i.foto??""} label=${i.nombre}></iswc-avatar>${i.enLinea?o`<span class="presencia"></span>`:null}</span>
                      <span class="datos"><strong>${i.id===a.yo?`${i.nombre} (${n.tu})`:i.nombre}</strong><span>${i.detalle}</span></span>
                      ${i.rol==="admin"?o`<iswc-tag class="rol" color="brand" pill>${n.admin}</iswc-tag>`:null}
                    </button>
                    ${a.soyAdmin&&i.id!==a.yo?o`
                      <iswc-dropdown placement="bottom-end" oniswc-select=${t=>{const u=t.detail?.item?.value;u&&e(c,"av-chat-miembros",{accion:u,usuarios:[i.id]})}}>
                        <iswc-button slot="trigger" variant="plain" color="neutral" title=${n.menu} aria-label=${n.menu}><iswc-icon icon="mdi:dots-vertical"></iswc-icon></iswc-button>
                        ${i.rol==="admin"?o`<iswc-dropdown-item value="miembro"><iswc-icon slot="icon" icon="mdi:shield-off-outline"></iswc-icon>${n.quitarAdmin}</iswc-dropdown-item>`:o`<iswc-dropdown-item value="admin"><iswc-icon slot="icon" icon="mdi:shield-account-outline"></iswc-icon>${n.hacerAdmin}</iswc-dropdown-item>`}
                        <iswc-dropdown-item value="quitar" color="danger"><iswc-icon slot="icon" icon="mdi:account-remove-outline"></iswc-icon>${n.quitarDelGrupo}</iswc-dropdown-item>
                      </iswc-dropdown>`:null}
                  </li>`)}
              </ul>
              <iswc-button class="salir" variant="soft" color="danger" oniswc-click=${()=>e(c,"av-chat-miembros",{accion:"salir",usuarios:[]})}><iswc-icon slot="start" icon="mdi:exit-run"></iswc-icon>${n.salirDelGrupo}</iswc-button>
            </section>`:null}
        </div>
      </aside>
    `)});S("av-chat-info",L);
