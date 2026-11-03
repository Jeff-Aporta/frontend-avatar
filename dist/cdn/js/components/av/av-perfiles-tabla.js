import{crearComponente as i,define as l,emitir as s,html as r}from"../../base/componente.js?v=ykdqqm";import"./av-perfiles-lista.js?v=k59qph";const n=i(import.meta.url,"av-perfiles-tabla",{abierto:!1},(a,e,t)=>{const o=()=>s(t,"av-perfiles-cerrar",{});a.append(r`
      <iswc-dialog id="dialogo" label="Perfiles de prueba" backdrop-variant="basic" ?open=${e.abierto} oniswc-after-hide=${o}>
        <p class="nota">Cuentas de testing: el PIN es público hasta tener MVP.</p>
        ${e.abierto?r`<av-perfiles-lista modo="select" onav-perfil-usar=${o}></av-perfiles-lista>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${o}>Cerrar</iswc-button>
      </iswc-dialog>
    `)},(a,e)=>e.abierto?!1:(a.querySelector("#dialogo").open=!1,!0));l("av-perfiles-tabla",n);
