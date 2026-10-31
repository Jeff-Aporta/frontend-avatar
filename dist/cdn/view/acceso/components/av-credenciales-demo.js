import{crearComponente as t,define as l,emitir as d,html as r}from"../../../js/base/componente.js?v=p6quri";const u=t(import.meta.url,"av-credenciales-demo",{items:[]},(e,a,i)=>{e.append(r`
    <iswc-card variant="filled-outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Cuentas de prueba</strong>
      <ul class="lista" part="lista">
        ${a.items.map(s=>r`
          <li class="fila">
            <iswc-person class="persona"></iswc-person>
            <span class="descripcion">${s.descripcion} PIN <code>${s.password}</code></span>
            <iswc-button variant="outlined" color="neutral" class="usar" data-usuario=${s.usuario} oniswc-click=${()=>d(i,"av-credencial-elegida",{usuario:s.usuario,password:s.password})}>Usar</iswc-button>
          </li>
        `)}
      </ul>
      <p class="nota">Cada cuenta entra con su PIN de 4 dígitos.</p>
    </iswc-card>
  `);const c=e.querySelectorAll("iswc-person");a.items.forEach((s,n)=>{const o=c[n];o&&(o.props={usuario:s.usuario,nombre:s.usuario,detalle:s.rol})})});l("av-credenciales-demo",u);
