import{avisar as v,crearComponente as g,define as w,html as u}from"../../base/componente.js?v=zohalw";import{cambiarPerfil as b,iniciarSesion as P,mensajeDe as d,perfilesPrueba as h}from"../../core/api.js?v=3rnmgi";import{tieneCuenta as p}from"../../core/cuentas.js?v=dvs2ou";import{ir as C,rutaActual as E,VISTA_SESION as S,VISTAS_PRIVADAS as A}from"../../core/router.js?v=11mqc0";const $=g(import.meta.url,"av-perfil-selector",{perfiles:[],activo:""},(n,i,a)=>{const m=a;let s="";const t=e=>n.querySelector(e),f=i.perfiles.find(e=>e.iusuario===i.activo),r=e=>{const o=t(".error");o.textContent=e,o.hidden=!e},l=async()=>{const e=t("#pin");if(!/^\d{4}$/.test(e.value))return r("Escribe los 4 d\xEDgitos.");t("#entrar").toggleAttribute("loading",!0);try{await P(s,e.value),A.includes(E().vista)?location.reload():C(S)}catch(o){r(/429|intentos|bloque/i.test(d(o))?"Demasiados intentos: espera unos minutos.":"PIN incorrecto."),e.value="",e.focus()}finally{t("#entrar").toggleAttribute("loading",!1)}},c=e=>{if(e!==i.activo){if(p(e))return b(e);s=e,t(".para").textContent=i.perfiles.find(o=>o.iusuario===e)?.nombre??e,r(""),t("#pin").value="",t("#dialogo").open=!0,setTimeout(()=>t("#pin").focus(),80)}};n.append(u`
    <iswc-dropdown class="menu" part="menu" placement="auto">
      <iswc-button slot="trigger" variant="outlined" color="neutral" caret aria-label="Cambiar de perfil">
        <iswc-icon slot="start" icon="mdi:account-switch-outline"></iswc-icon>${f?.nombre.split(" ")[0]??"Perfiles"}
      </iswc-button>
      ${i.perfiles.map(e=>u`
        <iswc-dropdown-item value=${e.iusuario} oniswc-click=${()=>c(e.iusuario)}>
          <iswc-icon slot="start" icon=${e.iusuario===i.activo?"mdi:check-circle":p(e.iusuario)?"mdi:account-check-outline":"mdi:lock-outline"}></iswc-icon>${e.nombre} · ${e.rol}
        </iswc-dropdown-item>`)}
    </iswc-dropdown>
    <iswc-dialog id="dialogo" label="Entrar con PIN" backdrop-variant="basic">
      <div class="campos" part="campos">
        <p class="texto">Perfil: <strong class="para"></strong></p>
        <iswc-input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" label="PIN de 4 dígitos"
          oniswc-input=${e=>{e.currentTarget.value.length===4&&l()}}></iswc-input>
        <p class="error" role="alert" hidden></p>
      </div>
      <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${()=>t("#dialogo").open=!1}>Cancelar</iswc-button>
      <iswc-button slot="footer" id="entrar" color="brand" oniswc-click=${()=>{l()}}>Entrar</iswc-button>
    </iswc-dialog>
  `),a.addEventListener("av-perfil-pedir",e=>c(e.detail.usuario)),i.perfiles.length||h().then(e=>m.props={perfiles:e}).catch(e=>v(d(e),"danger"))});w("av-perfil-selector",$);
