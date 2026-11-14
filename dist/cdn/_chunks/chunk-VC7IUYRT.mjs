import{ra as o,ta as i,ua as t,wa as s}from"./chunk-22HCQII4.mjs";var n=s(new URL("js/components/av/av-perfiles-tabla.min.mjs",new URL("../",import.meta.url)).href,"av-perfiles-tabla",{abierto:!1},(a,e,l)=>{let r=()=>t(l,"av-perfiles-cerrar",{});a.append(o`
      <iswc-dialog id="dialogo" label="Perfiles de prueba" backdrop-variant="basic" ?open=${e.abierto} oniswc-after-hide=${r}>
        <p class="nota">Cuentas de testing: el PIN es público hasta tener MVP.</p>
        ${e.abierto?o`<av-perfiles-lista modo="select" onav-perfil-usar=${r}></av-perfiles-lista>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${r}>Cerrar</iswc-button>
      </iswc-dialog>
    `)},(a,e)=>e.abierto?!1:(a.querySelector("#dialogo").open=!1,!0));i("av-perfiles-tabla",n);
