import{crearComponente as d,define as m,emitir as l,html as c}from"../../../js/base/componente.js?v=zohalw";import{validarUsuario as v}from"../utils/admin.js?v=0s9r37";const w=d(import.meta.url,"av-usuario-form",{abierto:!1,datos:{nuevo:!0,iusuario:"",nombre:"",email:"",password:"",bactivo:!0},ocupado:!1,error:""},(e,a,i)=>{const t=()=>{const u={nuevo:a.datos.nuevo,iusuario:a.datos.nuevo?e.querySelector("#iusuario").value:a.datos.iusuario,nombre:e.querySelector("#nombre").value,email:e.querySelector("#email").value,password:e.querySelector("#password").value,bactivo:e.querySelector("#bactivo").checked},n=v(u),s=e.querySelector("#aviso");if(n.length){s.textContent=n.join(". "),s.hidden=!1;return}s.hidden=!0,l(i,"av-usuario-guardar",{datos:u})},r=()=>l(i,"av-usuario-cerrar",{}),o=a.datos.nuevo;e.append(c`
      <iswc-dialog id="dialogo" label=${o?"Nuevo usuario":`Editar ${a.datos.iusuario}`} backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${r}>
        <div class="campos" part="campos">
          ${o?c`<iswc-input id="iusuario" label="Usuario" required maxlength="120" autocomplete="off" value=${a.datos.iusuario}></iswc-input>`:null}
          <iswc-input id="nombre" label="Nombre" maxlength="200" value=${a.datos.nombre}></iswc-input>
          <iswc-input id="email" type="email" label="Correo" maxlength="200" value=${a.datos.email}></iswc-input>
          <iswc-input id="password" type="password" label=${o?"Contrase\xF1a":"Nueva contrase\xF1a"} password-toggle autocomplete="new-password" hint=${o?"M\xEDnimo 8 caracteres":"D\xE9jala vac\xEDa para no cambiarla"} ?required=${o}></iswc-input>
          <iswc-switch id="bactivo" ?checked=${a.datos.bactivo}>Activo</iswc-switch>
          <iswc-callout id="aviso" tone="danger" ?hidden=${!a.error}>${a.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${r}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="guardar" color="brand" ?loading=${a.ocupado} oniswc-click=${t}>${o?"Crear":"Guardar"}</iswc-button>
      </iswc-dialog>
    `)},(e,a,i)=>{if(a.datos!==i.datos)return!1;const t=e.querySelector("#dialogo");if(!t)return!1;t.open=a.abierto;const r=e.querySelector("#aviso");return r.textContent=a.error,r.hidden=!a.error,e.querySelector("#guardar").toggleAttribute("loading",a.ocupado),!0});m("av-usuario-form",w);
