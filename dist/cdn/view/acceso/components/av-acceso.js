import{crearComponente as u,define as d,html as m}from"../../../js/base/componente.js?v=ehrr8d";import{iniciarSesion as g,mensajeDe as v}from"../../../js/core/api.js?v=il5qcm";import{ir as A,VISTA_SESION as b}from"../../../js/core/router.js?v=a7apgx";import{credencialesDemo as f,mensajeAcceso as y}from"../utils/demo.js?v=nmrys8";import"./av-credenciales-demo.js?v=vhqynp";function E(t,s,o){const a=t.shadowRoot?.querySelectorAll("iswc-input")??[];for(const e of a){const i=e.getAttribute("type")??e.getAttribute("name")??"",r=/password/i.test(i)||/password|clave|contrase/i.test(e.getAttribute("name")??"")||/password/i.test(e.getAttribute("label")??"")||/contrase/i.test(e.getAttribute("label")??"");e.value=r?o:s,e.dispatchEvent(new Event("input",{bubbles:!0}))}}const w=u(import.meta.url,"av-acceso",{ocupado:!1,error:""},(t,s,o)=>{const a=o,e=async r=>{const c=r.currentTarget,{username:l,password:n}=r.detail;a.props={ocupado:!0,error:""};try{await g(l,n),c.reset(),A(b)}catch(p){a.props={error:y(v(p))}}finally{a.props={ocupado:!1}}},i=r=>{const{usuario:c,password:l}=r.detail,n=t.querySelector("#login");n&&(E(n,c,l),n.focus())};t.append(m`
      <div class="pagina" part="pagina">
        <section class="panel" part="panel">
          <iswc-login id="login" heading="Entrar a Avatar" subtitle="Tu equipo, tus canales y tus proyectos en un solo lugar" provider="Avatar" password-toggle ?busy=${s.ocupado} error=${s.error} oniswc-login-submit=${e}></iswc-login>
          <av-credenciales-demo id="demo" onav-credencial-elegida=${i}></av-credenciales-demo>
        </section>
        <aside class="lado" part="lado" aria-hidden="true">
          <av-escena class="ilustracion" escena="acceso"></av-escena>
        </aside>
      </div>
    `),t.querySelector("#demo").props={items:f()}},(t,s)=>{const o=t.querySelector("#login");return o?(o.busy=s.ocupado,s.error?o.setAttribute("error",s.error):o.removeAttribute("error"),!0):!1});d("av-acceso",w);export{E as rellenar};
