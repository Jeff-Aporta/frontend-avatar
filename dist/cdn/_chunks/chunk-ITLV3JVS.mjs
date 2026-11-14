import{a as m,k as P,m as p,n as A,p as f}from"./chunk-SDQIKR5O.mjs";import{a as $,k as T,l as k,p as L}from"./chunk-RTQWBEUQ.mjs";import{ra as d,ta as C,wa as E,xa as y}from"./chunk-22HCQII4.mjs";async function S(a,t){if(await P(a,t),$.includes(T().vista)){location.reload();return}let l=L();k(l.vista,l.id)}var x=(a,t=!1)=>/429|intentos|bloque/i.test(f(a))?"Demasiados intentos: espera unos minutos.":t?"Contrase\xF1a incorrecta.":"PIN incorrecto.",u=null,H=E(new URL("js/components/av/av-perfil-selector.min.mjs",new URL("../",import.meta.url)).href,"av-perfil-selector",{perfiles:[],activo:""},(a,t,l)=>{let D=l,v="",s=!1,i=e=>a.querySelector(e),I=t.perfiles.find(e=>e.iusuario===t.activo),c=e=>{let n=i(".error");n.textContent=e,n.hidden=!e},g=async()=>{let e=i("#pin");if(!s&&!/^\d{4}$/.test(e.value))return c("Escribe los 4 d\xEDgitos.");if(s&&!e.value)return c("Escribe tu contrase\xF1a.");i("#entrar").toggleAttribute("loading",!0);try{await S(v,e.value),i("#dialogo").open=!1}catch(n){c(x(n,s)),e.value="",e.focus()}finally{i("#entrar").toggleAttribute("loading",!1)}},w=(e,n,h,o=!1)=>{v=e,s=o;let r=i("#pin");r.setAttribute("label",o?"Contrase\xF1a":"PIN de 4 d\xEDgitos"),o?(r.removeAttribute("maxlength"),r.removeAttribute("inputmode")):(r.setAttribute("maxlength","4"),r.setAttribute("inputmode","numeric")),i("#dialogo").setAttribute("label",o?"Entrar con contrase\xF1a":"Entrar con PIN"),i(".para").textContent=n,c(h),i("#pin").value="",i("#dialogo").open=!0,setTimeout(()=>i("#pin").focus(),80)},b=async({usuario:e,fin:n})=>{if(e===t.activo)return n?.();if(m(e))return A(e);let o=(t.perfiles.length?t.perfiles:await p().catch(()=>[])).find(r=>r.iusuario===e);if(o&&!o.pin)return w(e,o.nombre,"",!0),n?.();try{if(!/^\d{4}$/.test(o?.pin??""))throw new Error("sin PIN p\xFAblico");await S(e,o.pin)}catch(r){w(e,o?.nombre??e,o?.pin?x(r):"")}finally{n?.()}};a.append(d`
    ${t.activo?d`
      <iswc-dropdown class="menu" part="menu" placement="auto">
        <iswc-button slot="trigger" variant="outlined compact" color="neutral" with-caret aria-label="Cambiar de perfil">
          <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${I?.nombre.split(" ")[0]??"Perfiles"}
        </iswc-button>
        ${t.perfiles.map(e=>d`
          <iswc-dropdown-item value=${e.iusuario} oniswc-click=${()=>{b({usuario:e.iusuario})}}>
            <iswc-icon slot="start" icon=${e.iusuario===t.activo?"mdi:check-circle":m(e.iusuario)?"mdi:account-check-outline":"mdi:lock-outline"}></iswc-icon>${e.nombre} · ${e.rol}
          </iswc-dropdown-item>`)}
      </iswc-dropdown>`:null}
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${e=>{!s&&e.currentTarget.value.length===4&&g()}}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>i("#dialogo").open=!1}>Cancelar</iswc-button>
      <iswc-button variant="compact" slot="footer" id="entrar" color="brand" oniswc-click=${()=>{g()}}>Entrar</iswc-button>
    </iswc-dialog>
  `),u&&removeEventListener("av-perfil-elegir",u),u=e=>{b(e.detail)},addEventListener("av-perfil-elegir",u),t.activo&&!t.perfiles.length&&p().then(e=>D.props={perfiles:e}).catch(e=>y(f(e),"danger"))});C("av-perfil-selector",H);
