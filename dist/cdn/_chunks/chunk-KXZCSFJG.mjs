import{b as p,f as w}from"./chunk-DSFXORMY.mjs";import{m as c,ra as r,ta as m,ua as l,wa as v}from"./chunk-22HCQII4.mjs";var g=v(new URL("view/organizacion/components/av-invitar-form.min.mjs",new URL("../",import.meta.url)).href,"av-invitar-form",{abierto:!1,usuarios:[],ocupado:!1,error:""},(o,i,t)=>{let n=()=>{let a=o.querySelector("#rol").value,u={iusuario:o.querySelector("#usuario").value,rol:c.includes(a)?a:"miembro",cargo:o.querySelector("#cargo").value},d=w(u),s=o.querySelector("#aviso");if(d.length){s.textContent=d.join(". "),s.hidden=!1;return}s.hidden=!0,l(t,"av-invitar-guardar",{datos:u})},e=()=>l(t,"av-invitar-cerrar",{});o.append(r`
      <iswc-dialog id="dialogo" label="Invitar a la empresa" backdrop-variant="basic" ?open=${i.abierto} oniswc-hide=${e}>
        <div class="campos" part="campos">
          ${i.usuarios.length?r`<iswc-select id="usuario" label="Usuario" required placeholder="Elige un usuario">${i.usuarios.map(a=>r`<iswc-option value=${a.iusuario}>${a.nombre||a.iusuario} · ${a.iusuario}</iswc-option>`)}</iswc-select>`:r`<iswc-input id="usuario" label="Usuario" required placeholder="id del usuario" hint="Debe existir: lo crea un administrador."></iswc-input>`}
          <iswc-select id="rol" label="Rol" value="miembro">${c.map(a=>r`<iswc-option value=${a}>${p(a)}</iswc-option>`)}</iswc-select>
          <iswc-input id="cargo" label="Cargo" maxlength="120" placeholder="Opcional"></iswc-input>
          <iswc-callout id="aviso" color="danger" ?hidden=${!i.error}>${i.error}</iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${e}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" id="guardar" color="brand" ?loading=${i.ocupado} oniswc-click=${n}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>
      </iswc-dialog>
    `)},(o,i,t)=>{if(i.usuarios!==t.usuarios)return!1;let n=o.querySelector("#dialogo");if(!n)return!1;n.open=i.abierto;let e=o.querySelector("#aviso");return e.textContent=i.error,e.hidden=!i.error,o.querySelector("#guardar").toggleAttribute("loading",i.ocupado),!0});m("av-invitar-form",g);
