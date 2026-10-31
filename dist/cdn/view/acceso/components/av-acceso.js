import{crearComponente as m,define as g,html as v}from"../../../js/base/componente.js?v=zohalw";import{iniciarSesion as f,mensajeDe as w,perfilesPrueba as A}from"../../../js/core/api.js?v=3rnmgi";import{ir as E,VISTA_SESION as b}from"../../../js/core/router.js?v=11mqc0";import{credencialesDe as y,mensajeAcceso as h}from"../utils/demo.js?v=pqerqp";import"./av-credenciales-demo.js?v=8b6fjf";function u(s,o,r){const c=[...s.shadowRoot?.querySelectorAll("iswc-input")??[]].slice(0,2);for(const e of c){const l=e.getAttribute("type")??e.getAttribute("name")??"",p=/password/i.test(l)||/password|clave|contrase/i.test(e.getAttribute("name")??"")||/password/i.test(e.getAttribute("label")??"")||/contrase/i.test(e.getAttribute("label")??"");e.value=p?r:o,e.dispatchEvent(new Event("input",{bubbles:!0}))}}const L=m(import.meta.url,"av-acceso",{ocupado:!1,error:""},(s,o,r)=>{const c=r,e=async i=>{const t=i.currentTarget,{username:a,password:n}=i.detail;c.props={ocupado:!0,error:""};try{await f(a,n),t.reset(),E(b)}catch(d){c.props={error:h(w(d))}}finally{c.props={ocupado:!1}}},l=i=>{const{usuario:t,password:a}=i.detail,n=s.querySelector("#login");n&&(u(n,t,a),n.focus())};s.append(v`
      <div class="pagina" part="pagina">
        <section class="panel" part="panel">
          <iswc-login id="login" heading="Entrar a Avatar" provider="Avatar" password-toggle ?busy=${o.ocupado} error=${o.error} oniswc-login-submit=${e}></iswc-login>
          <av-credenciales-demo id="demo" onav-credencial-elegida=${l}></av-credenciales-demo>
        </section>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="acceso"></av-escena>
        </aside>
      </div>
    `);const p=s.querySelector("#login");A().then(async i=>{const t=y(i);s.querySelector("#demo").props={items:t};const a=t.find(n=>n.usuario==="ana")??t[0];await customElements.whenDefined("iswc-login"),a&&u(p,a.usuario,a.password)}).catch(()=>{})},(s,o)=>{const r=s.querySelector("#login");return r?(r.busy=o.ocupado,o.error?r.setAttribute("error",o.error):r.removeAttribute("error"),!0):!1});g("av-acceso",L);export{u as rellenar};
