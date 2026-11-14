import{m as c,p as l}from"./chunk-SDQIKR5O.mjs";import{ra as a,ta as u,ua as d,wa as p}from"./chunk-22HCQII4.mjs";var m=p(new URL("js/components/av/av-perfiles-lista.min.mjs",new URL("../",import.meta.url)).href,"av-perfiles-lista",{perfiles:[],activo:"",ocupado:"",error:"",modo:"lista"},(t,i,n)=>{let r=n,o=e=>{r.props={ocupado:e},d(n,"av-perfil-usar",{usuario:e}),dispatchEvent(new CustomEvent("av-perfil-elegir",{detail:{usuario:e,fin:()=>r.props={ocupado:""}}}))};if(i.error){t.append(a`<iswc-callout color="danger">${i.error}</iswc-callout>`);return}if(!i.perfiles.length){t.append(a`<iswc-spinner class="carga"></iswc-spinner>`),c().then(e=>r.props={perfiles:e}).catch(e=>r.props={error:l(e)});return}if((n.getAttribute("modo")??i.modo)==="select"){t.append(a`
        <div class="elegir" part="elegir">
          <iswc-select class="cuenta" label="Cuenta" placeholder="Elige una cuenta" density="compact">
            ${i.perfiles.map(s=>a`<iswc-option value=${s.iusuario} ?disabled=${s.iusuario===i.activo}>${s.pin?`${s.nombre} \xB7 ${s.rol} \xB7 PIN ${s.pin}`:`${s.nombre} \xB7 pide contrase\xF1a`}</iswc-option>`)}
          </iswc-select>
          <iswc-button variant="compact" class="entrar" color="brand" ?loading=${!!i.ocupado}>Entrar con esta cuenta</iswc-button>
        </div>
      `);let e=t.querySelector(".cuenta");t.querySelector(".entrar")?.addEventListener("iswc-click",()=>{e.value&&o(e.value)});return}t.append(a`
      <div class="lista" part="lista">
        ${i.perfiles.map(e=>a`
          <iswc-button class="fila" part="fila" variant="plain compact" color="neutral" title=${e.descripcion} data-usuario=${e.iusuario}
            ?loading=${i.ocupado===e.iusuario} ?disabled=${!!i.ocupado||e.iusuario===i.activo} oniswc-click=${()=>o(e.iusuario)}>
            <iswc-person class="persona" usuario=${e.iusuario} nombre=${e.nombre} detalle=${e.rol}></iswc-person>
            ${e.pin?a`<code slot="end" class="pin" title="PIN de prueba">${e.pin}</code>`:a`<iswc-icon slot="end" icon="mdi:lock-outline" title="Pide contraseña"></iswc-icon>`}
          </iswc-button>`)}
      </div>
    `)});u("av-perfiles-lista",m);
