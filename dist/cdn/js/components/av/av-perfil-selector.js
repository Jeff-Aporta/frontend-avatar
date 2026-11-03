import{avisar as y,crearComponente as $,define as T,html as u}from"../../base/componente.js?v=uz3s44";import{cambiarPerfil as k,iniciarSesion as S,mensajeDe as w,perfilesPrueba as b}from"../../core/api.js?v=45sjif";import{tieneCuenta as P}from"../../core/cuentas.js?v=dvs2ou";import{destinoTrasAcceso as x,ir as D,rutaActual as I,VISTAS_PRIVADAS as L}from"../../core/router.js?v=3h9wag";async function h(a,t){if(await S(a,t),L.includes(I().vista)){location.reload();return}const l=x();D(l.vista,l.id)}const A=(a,t=!1)=>/429|intentos|bloque/i.test(w(a))?"Demasiados intentos: espera unos minutos.":t?"Contrase\xF1a incorrecta.":"PIN incorrecto.";let d=null;const H=$(import.meta.url,"av-perfil-selector",{perfiles:[],activo:""},(a,t,l)=>{const C=l;let m="",s=!1;const i=e=>a.querySelector(e),E=t.perfiles.find(e=>e.iusuario===t.activo),c=e=>{const n=i(".error");n.textContent=e,n.hidden=!e},p=async()=>{const e=i("#pin");if(!s&&!/^\d{4}$/.test(e.value))return c("Escribe los 4 d\xEDgitos.");if(s&&!e.value)return c("Escribe tu contrase\xF1a.");i("#entrar").toggleAttribute("loading",!0);try{await h(m,e.value),i("#dialogo").open=!1}catch(n){c(A(n,s)),e.value="",e.focus()}finally{i("#entrar").toggleAttribute("loading",!1)}},f=(e,n,v,o=!1)=>{m=e,s=o;const r=i("#pin");r.setAttribute("label",o?"Contrase\xF1a":"PIN de 4 d\xEDgitos"),o?(r.removeAttribute("maxlength"),r.removeAttribute("inputmode")):(r.setAttribute("maxlength","4"),r.setAttribute("inputmode","numeric")),i("#dialogo").setAttribute("label",o?"Entrar con contrase\xF1a":"Entrar con PIN"),i(".para").textContent=n,c(v),i("#pin").value="",i("#dialogo").open=!0,setTimeout(()=>i("#pin").focus(),80)},g=async({usuario:e,fin:n})=>{if(e===t.activo)return n?.();if(P(e))return k(e);const o=(t.perfiles.length?t.perfiles:await b().catch(()=>[])).find(r=>r.iusuario===e);if(o&&!o.pin)return f(e,o.nombre,"",!0),n?.();try{if(!/^\d{4}$/.test(o?.pin??""))throw new Error("sin PIN p\xFAblico");await h(e,o.pin)}catch(r){f(e,o?.nombre??e,o?.pin?A(r):"")}finally{n?.()}};a.append(u`
    ${t.activo?u`
      <iswc-dropdown class="menu" part="menu" placement="auto">
        <iswc-button slot="trigger" variant="outlined compact" color="neutral" with-caret aria-label="Cambiar de perfil">
          <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${E?.nombre.split(" ")[0]??"Perfiles"}
        </iswc-button>
        ${t.perfiles.map(e=>u`
          <iswc-dropdown-item value=${e.iusuario} oniswc-click=${()=>{g({usuario:e.iusuario})}}>
            <iswc-icon slot="start" icon=${e.iusuario===t.activo?"mdi:check-circle":P(e.iusuario)?"mdi:account-check-outline":"mdi:lock-outline"}></iswc-icon>${e.nombre} · ${e.rol}
          </iswc-dropdown-item>`)}
      </iswc-dropdown>`:null}
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${e=>{!s&&e.currentTarget.value.length===4&&p()}}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>i("#dialogo").open=!1}>Cancelar</iswc-button>
      <iswc-button variant="compact" slot="footer" id="entrar" color="brand" oniswc-click=${()=>{p()}}>Entrar</iswc-button>
    </iswc-dialog>
  `),d&&removeEventListener("av-perfil-elegir",d),d=e=>{g(e.detail)},addEventListener("av-perfil-elegir",d),t.activo&&!t.perfiles.length&&b().then(e=>C.props={perfiles:e}).catch(e=>y(w(e),"danger"))});T("av-perfil-selector",H);
