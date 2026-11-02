import{crearComponente as n,define as l,emitir as u,html as s}from"../../base/componente.js?v=49yoqc";import{mensajeDe as d,perfilesPrueba as p}from"../../core/api.js?v=4m3ots";const m=n(import.meta.url,"av-perfiles-lista",{perfiles:[],activo:"",ocupado:"",error:"",modo:"lista"},(i,a,o)=>{const t=o,c=e=>{t.props={ocupado:e},u(o,"av-perfil-usar",{usuario:e}),dispatchEvent(new CustomEvent("av-perfil-elegir",{detail:{usuario:e,fin:()=>t.props={ocupado:""}}}))};if(a.error){i.append(s`<iswc-callout color="danger">${a.error}</iswc-callout>`);return}if(!a.perfiles.length){i.append(s`<iswc-spinner class="carga"></iswc-spinner>`),p().then(e=>t.props={perfiles:e}).catch(e=>t.props={error:d(e)});return}if((o.getAttribute("modo")??a.modo)==="select"){i.append(s`
        <div class="elegir" part="elegir">
          <iswc-select class="cuenta" label="Cuenta de prueba" placeholder="Elige una cuenta" density="compact">
            ${a.perfiles.map(r=>s`<iswc-option value=${r.iusuario} ?disabled=${r.iusuario===a.activo}>${r.nombre} · ${r.rol} · PIN ${r.pin}</iswc-option>`)}
          </iswc-select>
          <iswc-button variant="compact" class="entrar" color="brand" ?loading=${!!a.ocupado}>Entrar con esta cuenta</iswc-button>
        </div>
      `);const e=i.querySelector(".cuenta");i.querySelector(".entrar")?.addEventListener("iswc-click",()=>{e.value&&c(e.value)});return}i.append(s`
      <div class="lista" part="lista">
        ${a.perfiles.map(e=>s`
          <iswc-button class="fila" part="fila" variant="plain compact" color="neutral" title=${e.descripcion} data-usuario=${e.iusuario}
            ?loading=${a.ocupado===e.iusuario} ?disabled=${!!a.ocupado||e.iusuario===a.activo} oniswc-click=${()=>c(e.iusuario)}>
            <iswc-person class="persona" usuario=${e.iusuario} nombre=${e.nombre} detalle=${e.rol}></iswc-person>
            <code slot="end" class="pin" title="PIN de prueba">${e.pin}</code>
          </iswc-button>`)}
      </div>
    `)});l("av-perfiles-lista",m);
