import{k as l,m as p,p as u}from"../../../_chunks/chunk-SDQIKR5O.mjs";import"../../../_chunks/chunk-3OLLRFAW.mjs";import"../../../_chunks/chunk-BY7FRINU.mjs";import"../../../_chunks/chunk-ZQI42E6M.mjs";import{b as g,l as w}from"../../../_chunks/chunk-RTQWBEUQ.mjs";import"../../../_chunks/chunk-YDU3QAVP.mjs";import{ra as d,ta as m,wa as v}from"../../../_chunks/chunk-22HCQII4.mjs";import"../../../_chunks/chunk-JOUQNVKA.mjs";import"../../../_chunks/chunk-2XJIRYNX.mjs";import"../../../_chunks/chunk-FWBWSRYW.mjs";import"../../../_chunks/chunk-S24WVIZS.mjs";function f(e){return/inválid|invalid|401/i.test(e)?"Usuario o contrase\xF1a inv\xE1lidos.":/429|intentos/i.test(e)?"Demasiados intentos: espera unos minutos.":/fetch|network|Failed/i.test(e)?"No se pudo contactar el API. Revisa la conexi\xF3n.":e}function E(e,s,r){let o=[...e.shadowRoot?.querySelectorAll("iswc-input")??[]].slice(0,2);for(let t of o){let c=t.getAttribute("type")??t.getAttribute("name")??"",a=/password/i.test(c)||/password|clave|contrase/i.test(t.getAttribute("name")??"")||/password/i.test(t.getAttribute("label")??"")||/contrase/i.test(t.getAttribute("label")??"");t.value=a?r:s,t.dispatchEvent(new Event("input",{bubbles:!0}))}}var h=v(new URL("view/acceso/components/av-acceso.min.mjs",new URL("../../../",import.meta.url)).href,"av-acceso",{ocupado:!1,error:""},(e,s,r)=>{let o=r,t=async a=>{let i=a.currentTarget,{username:n,password:b}=a.detail;o.props={ocupado:!0,error:""};try{await l(n,b),i.reset(),w(g)}catch(A){o.props={error:f(u(A))}}finally{o.props={ocupado:!1}}};e.append(d`
      <div class="pagina" part="pagina">
        <iswc-card class="panel" part="panel" variant="filled-outlined">
          <strong slot="header">Entrar a Avatar</strong>
          <iswc-tab-group active="entrar" without-scroll-controls>
            <iswc-tab slot="nav" panel="entrar">Entrar</iswc-tab>
            <iswc-tab slot="nav" panel="como">Entrar como…</iswc-tab>
            <iswc-tab-panel name="entrar">
              <iswc-login id="login" compact provider="Avatar" password-toggle ?busy=${s.ocupado} error=${s.error} oniswc-login-submit=${t}></iswc-login>
            </iswc-tab-panel>
            <iswc-tab-panel name="como"><av-perfiles-lista></av-perfiles-lista></iswc-tab-panel>
          </iswc-tab-group>
        </iswc-card>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="marca"></av-escena>
        </aside>
      </div>
    `);let c=e.querySelector("#login");p().then(async a=>{let i=a.find(n=>n.iusuario==="ana")??a.find(n=>n.pin);await customElements.whenDefined("iswc-login"),i&&E(c,i.iusuario,i.pin)}).catch(()=>{})},(e,s)=>{let r=e.querySelector("#login");return r?(r.busy=s.ocupado,s.error?r.setAttribute("error",s.error):r.removeAttribute("error"),!0):!1});m("av-acceso",h);export{E as rellenar};
