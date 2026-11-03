import{crearComponente as w,define as u,emitir as l,html as o}from"../../base/componente.js?v=3wyanc";import{textos as v}from"../../chat/textos.js?v=iqk9yi";import{ICONO_MARCA as $}from"./marcas.js?v=s62wqx";const f=w(import.meta.url,"av-chat-item",{chat:null,activo:!1},(d,t,r)=>{const i=t.chat;if(!i)return;const a=v(),m=()=>l(r,"av-chat-abrir",{icanal:i.id}),p=c=>{c.stopPropagation();const s=c.detail?.item?.value??"",n={};s==="fijar"&&(n.fijado=!i.fijado),s==="silenciar"&&(n.silenciado=!i.silenciado),s==="archivar"&&(n.archivado=!i.archivado),s==="noleido"&&(n.marcadoNoLeido=!(i.noLeidos>0||i.marcadoNoLeido)),l(r,"av-chat-preferencias",{icanal:i.id,...n})},e=i.noLeidos>0||i.marcadoNoLeido;d.append(o`
    <div class="fila" part="fila" data-activo=${t.activo?"1":"0"} data-sinleer=${e?"1":"0"} onclick=${m}>
      <span class="foto" data-color=${String(i.color)}>
        <iswc-avatar class="avatar" initials=${i.iniciales} image=${i.foto??""} label=${i.nombre} shape="circle"></iswc-avatar>
        ${i.tipo!=="directo"?o`<iswc-icon class="tipo" icon=${i.tipo==="publico"?"mdi:bullhorn-variant-outline":"mdi:account-group"}></iswc-icon>`:null}
        ${i.enLinea?o`<span class="presencia" title=${a.enLinea}></span>`:null}
      </span>
      <span class="cuerpo">
        <span class="linea">
          <strong class="nombre">${i.nombre}</strong>
          <span class="hora">${i.hora}</span>
        </span>
        <span class="linea">
          ${i.escribiendo?o`<span class="previa escribiendo">${i.escribiendo}</span>`:o`<span class="previa">${i.marca?o`<iswc-icon class="marca" data-marca=${i.marca} icon=${$[i.marca]}></iswc-icon>`:null}${i.autorUltimo?o`<span class="autor">${i.autorUltimo}: </span>`:null}${i.ultimo}</span>`}
          <span class="estado">
            ${i.silenciado?o`<iswc-icon class="icono" icon="mdi:bell-off-outline" title=${a.silenciar}></iswc-icon>`:null}
            ${i.fijado?o`<iswc-icon class="icono" icon="mdi:pin-outline" title=${a.fijarChat}></iswc-icon>`:null}
            ${i.noLeidos>0?o`<span class="contador" data-silenciado=${i.silenciado?"1":"0"}>${i.noLeidos>99?"99+":i.noLeidos}</span>`:i.marcadoNoLeido?o`<span class="contador punto"></span>`:null}
          </span>
        </span>
      </span>
      <iswc-dropdown class="menu" placement="bottom-end" oniswc-select=${p} onclick=${c=>c.stopPropagation()}>
        <iswc-button slot="trigger" class="menu-boton" variant="plain compact" color="neutral" title=${a.menu} aria-label=${a.menu} tabindex="-1"><iswc-icon icon="mdi:chevron-down"></iswc-icon></iswc-button>
        <iswc-dropdown-item value="fijar"><iswc-icon slot="icon" icon=${i.fijado?"mdi:pin-off-outline":"mdi:pin-outline"}></iswc-icon>${i.fijado?a.desfijarChat:a.fijarChat}</iswc-dropdown-item>
        <iswc-dropdown-item value="silenciar"><iswc-icon slot="icon" icon=${i.silenciado?"mdi:bell-outline":"mdi:bell-off-outline"}></iswc-icon>${i.silenciado?a.activarSonido:a.silenciar}</iswc-dropdown-item>
        <iswc-dropdown-item value="archivar"><iswc-icon slot="icon" icon=${i.archivado?"mdi:archive-arrow-up-outline":"mdi:archive-arrow-down-outline"}></iswc-icon>${i.archivado?a.desarchivar:a.archivar}</iswc-dropdown-item>
        <iswc-dropdown-item value="noleido"><iswc-icon slot="icon" icon=${e?"mdi:email-open-outline":"mdi:email-mark-as-unread"}></iswc-icon>${e?a.marcarLeido:a.marcarNoLeido}</iswc-dropdown-item>
      </iswc-dropdown>
    </div>
  `)});u("av-chat-item",f);
