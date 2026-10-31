import{crearComponente as s,define as l,emitir as r,html as i}from"../../base/componente.js?v=333q2n";const c=s(import.meta.url,"av-perfiles-tabla",{abierto:!1,perfiles:[]},(o,e,t)=>{o.append(i`
      <iswc-dialog id="dialogo" label="Perfiles de prueba" backdrop-variant="basic" ?open=${e.abierto} oniswc-after-hide=${()=>r(t,"av-perfiles-cerrar",{})}>
        <p class="nota">Cuentas de testing: el PIN es público hasta tener MVP.</p>
        <div class="marco">
          <table class="tabla" part="tabla">
            <thead><tr><th scope="col">Usuario</th><th scope="col">Nombre</th><th scope="col">Rol</th><th scope="col">PIN</th><th scope="col"><span class="oculto">Acción</span></th></tr></thead>
            <tbody>
              ${e.perfiles.map(a=>i`
                <tr>
                  <td><code>${a.iusuario}</code></td>
                  <td>${a.nombre}</td>
                  <td>${a.rol}</td>
                  <td><code class="pin">${a.pin}</code></td>
                  <td><iswc-button variant="outlined" color="neutral" size="sm" oniswc-click=${()=>r(t,"av-perfil-usar",{usuario:a.iusuario})}>Usar</iswc-button></td>
                </tr>`)}
            </tbody>
          </table>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${()=>r(t,"av-perfiles-cerrar",{})}>Cerrar</iswc-button>
      </iswc-dialog>
    `)},(o,e,t)=>e.perfiles!==t.perfiles?!1:(o.querySelector("#dialogo").open=e.abierto,!0));l("av-perfiles-tabla",c);
