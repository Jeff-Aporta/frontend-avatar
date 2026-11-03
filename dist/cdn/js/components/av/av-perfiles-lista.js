import{crearComponente as c,define as l,emitir as u,html as a}from"../../base/componente.js?v=uz3s44";import{mensajeDe as d,perfilesPrueba as p}from"../../core/api.js?v=45sjif";const m=c(import.meta.url,"av-perfiles-lista",{perfiles:[],activo:"",ocupado:"",error:"",modo:"lista"},(t,i,o)=>{const r=o,n=e=>{r.props={ocupado:e},u(o,"av-perfil-usar",{usuario:e}),dispatchEvent(new CustomEvent("av-perfil-elegir",{detail:{usuario:e,fin:()=>r.props={ocupado:""}}}))};if(i.error){t.append(a`<iswc-callout color="danger">${i.error}</iswc-callout>`);return}if(!i.perfiles.length){t.append(a`<iswc-spinner class="carga"></iswc-spinner>`),p().then(e=>r.props={perfiles:e}).catch(e=>r.props={error:d(e)});return}if((o.getAttribute("modo")??i.modo)==="select"){t.append(a`
        <div class="elegir" part="elegir">
          <iswc-select class="cuenta" label="Cuenta" placeholder="Elige una cuenta" density="compact">
            ${i.perfiles.map(s=>a`<iswc-option value=${s.iusuario} ?disabled=${s.iusuario===i.activo}>${s.pin?`${s.nombre} \xB7 ${s.rol} \xB7 PIN ${s.pin}`:`${s.nombre} \xB7 pide contrase\xF1a`}</iswc-option>`)}
          </iswc-select>
          <iswc-button variant="compact" class="entrar" color="brand" ?loading=${!!i.ocupado}>Entrar con esta cuenta</iswc-button>
        </div>
      `);const e=t.querySelector(".cuenta");t.querySelector(".entrar")?.addEventListener("iswc-click",()=>{e.value&&n(e.value)});return}t.append(a`
      <div class="lista" part="lista">
        ${i.perfiles.map(e=>a`
          <iswc-button class="fila" part="fila" variant="plain compact" color="neutral" title=${e.descripcion} data-usuario=${e.iusuario}
            ?loading=${i.ocupado===e.iusuario} ?disabled=${!!i.ocupado||e.iusuario===i.activo} oniswc-click=${()=>n(e.iusuario)}>
            <iswc-person class="persona" usuario=${e.iusuario} nombre=${e.nombre} detalle=${e.rol}></iswc-person>
            ${e.pin?a`<code slot="end" class="pin" title="PIN de prueba">${e.pin}</code>`:a`<iswc-icon slot="end" icon="mdi:lock-outline" title="Pide contraseña"></iswc-icon>`}
          </iswc-button>`)}
      </div>
    `)});l("av-perfiles-lista",m);
