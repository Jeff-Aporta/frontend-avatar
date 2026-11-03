import{crearComponente as u,define as m,html as d}from"../../../js/base/componente.js?v=ykdqqm";import{iniciarSesion as g,mensajeDe as v,perfilesPrueba as w}from"../../../js/core/api.js?v=3l9tpn";import{ir as b,VISTA_SESION as f}from"../../../js/core/router.js?v=l01npq";import{mensajeAcceso as A}from"../utils/demo.js?v=0kekyh";function E(s,t,a){const o=[...s.shadowRoot?.querySelectorAll("iswc-input")??[]].slice(0,2);for(const e of o){const n=e.getAttribute("type")??e.getAttribute("name")??"",r=/password/i.test(n)||/password|clave|contrase/i.test(e.getAttribute("name")??"")||/password/i.test(e.getAttribute("label")??"")||/contrase/i.test(e.getAttribute("label")??"");e.value=r?a:t,e.dispatchEvent(new Event("input",{bubbles:!0}))}}const y=u(import.meta.url,"av-acceso",{ocupado:!1,error:""},(s,t,a)=>{const o=a,e=async r=>{const i=r.currentTarget,{username:c,password:l}=r.detail;o.props={ocupado:!0,error:""};try{await g(c,l),i.reset(),b(f)}catch(p){o.props={error:A(v(p))}}finally{o.props={ocupado:!1}}};s.append(d`
      <div class="pagina" part="pagina">
        <iswc-card class="panel" part="panel" variant="filled-outlined">
          <strong slot="header">Entrar a Avatar</strong>
          <iswc-tab-group active="entrar" without-scroll-controls>
            <iswc-tab slot="nav" panel="entrar">Entrar</iswc-tab>
            <iswc-tab slot="nav" panel="como">Entrar como…</iswc-tab>
            <iswc-tab-panel name="entrar">
              <iswc-login id="login" compact provider="Avatar" password-toggle ?busy=${t.ocupado} error=${t.error} oniswc-login-submit=${e}></iswc-login>
            </iswc-tab-panel>
            <iswc-tab-panel name="como"><av-perfiles-lista></av-perfiles-lista></iswc-tab-panel>
          </iswc-tab-group>
        </iswc-card>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="marca"></av-escena>
        </aside>
      </div>
    `);const n=s.querySelector("#login");w().then(async r=>{const i=r.find(c=>c.iusuario==="ana")??r[0];await customElements.whenDefined("iswc-login"),i&&E(n,i.iusuario,i.pin)}).catch(()=>{})},(s,t)=>{const a=s.querySelector("#login");return a?(a.busy=t.ocupado,t.error?a.setAttribute("error",t.error):a.removeAttribute("error"),!0):!1});m("av-acceso",y);export{E as rellenar};
