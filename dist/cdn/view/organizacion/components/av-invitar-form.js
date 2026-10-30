import{crearComponente as m,define as v,emitir as u,html as r}from"../../../js/base/componente.js?v=hjriku";import{ROLES_EMPRESA as d}from"../../../js/consts/schemas/organizacion.schemas.js?v=6mjr4v";import{etiquetaRol as g,validarInvitacion as p}from"../utils/organizacion.js?v=bn0ies";const w=m(import.meta.url,"av-invitar-form",{abierto:!1,usuarios:[],ocupado:!1,error:""},(o,i,t)=>{const s=()=>{const a=o.querySelector("#rol").value,l={iusuario:o.querySelector("#usuario").value,rol:d.includes(a)?a:"miembro",cargo:o.querySelector("#cargo").value},c=p(l),n=o.querySelector("#aviso");if(c.length){n.textContent=c.join(". "),n.hidden=!1;return}n.hidden=!0,u(t,"av-invitar-guardar",{datos:l})},e=()=>u(t,"av-invitar-cerrar",{});o.append(r`
      <iswc-dialog id="dialogo" label="Invitar a la empresa" backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${e}>
        <div class="campos" part="campos">
          ${i.usuarios.length?r`<iswc-select id="usuario" label="Usuario" required placeholder="Elige un usuario">${i.usuarios.map(a=>r`<iswc-option value=${a.iusuario}>${a.nombre||a.iusuario} · ${a.iusuario}</iswc-option>`)}</iswc-select>`:r`<iswc-input id="usuario" label="Usuario" required placeholder="id del usuario" hint="Debe existir: lo crea un administrador."></iswc-input>`}
          <iswc-select id="rol" label="Rol" value="miembro">${d.map(a=>r`<iswc-option value=${a}>${g(a)}</iswc-option>`)}</iswc-select>
          <iswc-input id="cargo" label="Cargo" maxlength="120" placeholder="Opcional"></iswc-input>
          <iswc-callout id="aviso" tone="danger" ?hidden=${!i.error}>${i.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${e}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="guardar" color="brand" ?loading=${i.ocupado} oniswc-click=${s}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>
      </iswc-dialog>
    `)},(o,i,t)=>{if(i.usuarios!==t.usuarios)return!1;const s=o.querySelector("#dialogo");if(!s)return!1;s.open=i.abierto;const e=o.querySelector("#aviso");return e.textContent=i.error,e.hidden=!i.error,o.querySelector("#guardar").toggleAttribute("loading",i.ocupado),!0});v("av-invitar-form",w);
