import{avisar as C,crearComponente as $,define as A,html as d}from"../../base/componente.js?v=ykdqqm";import{cambiarPerfil as T,iniciarSesion as k,mensajeDe as v,perfilesPrueba as g}from"../../core/api.js?v=3l9tpn";import{tieneCuenta as w}from"../../core/cuentas.js?v=dvs2ou";import{destinoTrasAcceso as S,ir as D,rutaActual as L,VISTAS_PRIVADAS as H}from"../../core/router.js?v=l01npq";async function b(n,t){if(await k(n,t),H.includes(L().vista)){location.reload();return}const r=S();D(r.vista,r.id)}const P=n=>/429|intentos|bloque/i.test(v(n))?"Demasiados intentos: espera unos minutos.":"PIN incorrecto.";let s=null;const I=$(import.meta.url,"av-perfil-selector",{perfiles:[],activo:""},(n,t,r)=>{const h=r;let u="";const i=e=>n.querySelector(e),y=t.perfiles.find(e=>e.iusuario===t.activo),c=e=>{const o=i(".error");o.textContent=e,o.hidden=!e},p=async()=>{const e=i("#pin");if(!/^\d{4}$/.test(e.value))return c("Escribe los 4 d\xEDgitos.");i("#entrar").toggleAttribute("loading",!0);try{await b(u,e.value),i("#dialogo").open=!1}catch(o){c(P(o)),e.value="",e.focus()}finally{i("#entrar").toggleAttribute("loading",!1)}},E=(e,o,f)=>{u=e,i(".para").textContent=o,c(f),i("#pin").value="",i("#dialogo").open=!0,setTimeout(()=>i("#pin").focus(),80)},m=async({usuario:e,fin:o})=>{if(e===t.activo)return o?.();if(w(e))return T(e);const a=(t.perfiles.length?t.perfiles:await g().catch(()=>[])).find(l=>l.iusuario===e);try{if(!/^\d{4}$/.test(a?.pin??""))throw new Error("sin PIN p\xFAblico");await b(e,a.pin)}catch(l){E(e,a?.nombre??e,a?.pin?P(l):"")}finally{o?.()}};n.append(d`
    ${t.activo?d`
      <iswc-dropdown class="menu" part="menu" placement="auto">
        <iswc-button slot="trigger" variant="outlined compact" color="neutral" with-caret aria-label="Cambiar de perfil">
          <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${y?.nombre.split(" ")[0]??"Perfiles"}
        </iswc-button>
        ${t.perfiles.map(e=>d`
          <iswc-dropdown-item value=${e.iusuario} oniswc-click=${()=>{m({usuario:e.iusuario})}}>
            <iswc-icon slot="start" icon=${e.iusuario===t.activo?"mdi:check-circle":w(e.iusuario)?"mdi:account-check-outline":"mdi:lock-outline"}></iswc-icon>${e.nombre} · ${e.rol}
          </iswc-dropdown-item>`)}
      </iswc-dropdown>`:null}
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${e=>{e.currentTarget.value.length===4&&p()}}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>i("#dialogo").open=!1}>Cancelar</iswc-button>
      <iswc-button variant="compact" slot="footer" id="entrar" color="brand" oniswc-click=${()=>{p()}}>Entrar</iswc-button>
    </iswc-dialog>
  `),s&&removeEventListener("av-perfil-elegir",s),s=e=>{m(e.detail)},addEventListener("av-perfil-elegir",s),t.activo&&!t.perfiles.length&&g().then(e=>h.props={perfiles:e}).catch(e=>C(v(e),"danger"))});A("av-perfil-selector",I);
