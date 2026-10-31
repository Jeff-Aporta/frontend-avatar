import{crearComponente as v,define as f,html as A}from"../../../js/base/componente.js?v=ehrr8d";import{iniciarSesion as w,mensajeDe as E}from"../../../js/core/api.js?v=il5qcm";import{ir as b,VISTA_SESION as y}from"../../../js/core/router.js?v=9ifirh";import{credencialesDemo as h,mensajeAcceso as L}from"../utils/demo.js?v=nmrys8";import"./av-credenciales-demo.js?v=vhqynp";function d(s,o,r){const t=s.shadowRoot?.querySelectorAll("iswc-input")??[];for(const e of t){const c=e.getAttribute("type")??e.getAttribute("name")??"",n=/password/i.test(c)||/password|clave|contrase/i.test(e.getAttribute("name")??"")||/password/i.test(e.getAttribute("label")??"")||/contrase/i.test(e.getAttribute("label")??"");e.value=n?r:o,e.dispatchEvent(new Event("input",{bubbles:!0}))}}const S=v(import.meta.url,"av-acceso",{ocupado:!1,error:""},(s,o,r)=>{const t=r,e=async i=>{const p=i.currentTarget,{username:u,password:a}=i.detail;t.props={ocupado:!0,error:""};try{await w(u,a),p.reset(),b(y)}catch(g){t.props={error:L(E(g))}}finally{t.props={ocupado:!1}}},c=i=>{const{usuario:p,password:u}=i.detail,a=s.querySelector("#login");a&&(d(a,p,u),a.focus())};s.append(A`
      <div class="pagina" part="pagina">
        <section class="panel" part="panel">
          <iswc-login id="login" heading="Entrar a Avatar" provider="Avatar" password-toggle ?busy=${o.ocupado} error=${o.error} oniswc-login-submit=${e}></iswc-login>
          <av-credenciales-demo id="demo" onav-credencial-elegida=${c}></av-credenciales-demo>
        </section>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="acceso"></av-escena>
        </aside>
      </div>
    `);const n=h();s.querySelector("#demo").props={items:n};const[l]=n,m=s.querySelector("#login");l&&customElements.whenDefined("iswc-login").then(()=>d(m,l.usuario,l.password))},(s,o)=>{const r=s.querySelector("#login");return r?(r.busy=o.ocupado,o.error?r.setAttribute("error",o.error):r.removeAttribute("error"),!0):!1});f("av-acceso",S);export{d as rellenar};
