import{crearComponente as m,define as d,emitir as u,html as a}from"../../../js/base/componente.js?v=3c3042";import{colorRol as v,etiquetaRol as b,nombreDe as w,ordenarMiembros as g}from"../utils/organizacion.js?v=bn0ies";const f=m(import.meta.url,"av-miembros",{items:[],cargando:!1,puedeGestionar:!1},(i,r,e)=>{const s=g(r.items);i.append(a`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Miembros <iswc-badge color="neutral" pill>${s.length}</iswc-badge></strong>
      ${r.puedeGestionar?a`<iswc-button slot="header-actions" color="brand" id="invitar" oniswc-click=${()=>u(e,"av-miembros-invitar",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>`:null}
      ${r.cargando?a`<av-vacio id="cargando"></av-vacio>`:s.length===0?a`<av-vacio id="vacio"></av-vacio>`:a`<ul class="lista" part="lista">
            ${s.map((o,n)=>a`
              <li class="fila" data-iusuario=${o.iusuario}>
                <av-persona class="persona"></av-persona>
                <iswc-tag color=${v(o.rol)} pill>${b(o.rol)}</iswc-tag>
                <span class="cargo">${o.cargo??""}</span>
                ${r.puedeGestionar&&o.rol!=="propietario"?a`<iswc-button id=${`quitar-${n}`} variant="plain" color="danger" class="quitar" title="Quitar de la empresa"><iswc-icon icon="mdi:account-remove-outline"></iswc-icon></iswc-button>
                    <iswc-popconfirm for=${`quitar-${n}`} message=${`\xBFQuitar a ${w(o)} de la empresa?`} oniswc-popconfirm-confirm=${()=>u(e,"av-miembro-quitar",{iusuario:o.iusuario})}>
                      <iswc-button slot="confirm" color="danger">Sí, quitar</iswc-button>
                      <iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button>
                    </iswc-popconfirm>`:a`<span></span>`}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);const p=i.querySelectorAll("av-persona");s.forEach((o,n)=>{const l=p[n];l&&(l.props={iusuario:o.iusuario,nombre:o.usuario?.nombre??null,detalle:o.usuario?.email??o.iusuario})});const t=i.querySelector("#cargando");t&&(t.props={estado:"cargando"});const c=i.querySelector("#vacio");c&&(c.props={icono:"mdi:account-group-outline",titulo:"Sin miembros",texto:"Invita usuarios para que trabajen en esta empresa."})});d("av-miembros",f);
