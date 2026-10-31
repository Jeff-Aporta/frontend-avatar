import{crearComponente as m,define as d,emitir as u,html as i}from"../../../js/base/componente.js?v=p6quri";import{colorRol as w,etiquetaRol as b,nombreDe as g,ordenarMiembros as v}from"../utils/organizacion.js?v=bn0ies";const f=m(import.meta.url,"av-miembros",{items:[],cargando:!1,puedeGestionar:!1},(a,s,e)=>{const r=v(s.items);a.append(i`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Miembros <iswc-badge color="neutral" pill>${r.length}</iswc-badge></strong>
      ${s.puedeGestionar?i`<iswc-button slot="header-actions" color="brand" id="invitar" oniswc-click=${()=>u(e,"av-miembros-invitar",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>`:null}
      ${s.cargando?i`<iswc-empty-state id="cargando"></iswc-empty-state>`:r.length===0?i`<iswc-empty-state id="vacio"></iswc-empty-state>`:i`<ul class="lista" part="lista">
            ${r.map((o,t)=>i`
              <li class="fila" data-iusuario=${o.iusuario}>
                <iswc-person class="persona"></iswc-person>
                <iswc-tag color=${w(o.rol)} pill>${b(o.rol)}</iswc-tag>
                <span class="cargo">${o.cargo??""}</span>
                ${s.puedeGestionar&&o.rol!=="propietario"?i`<iswc-button id=${`quitar-${t}`} variant="plain" color="danger" class="quitar" title="Quitar de la empresa"><iswc-icon icon="mdi:account-remove-outline"></iswc-icon></iswc-button>
                    <iswc-popconfirm for=${`quitar-${t}`} message=${`\xBFQuitar a ${g(o)} de la empresa?`} oniswc-popconfirm-confirm=${()=>u(e,"av-miembro-quitar",{iusuario:o.iusuario})}>
                      <iswc-button slot="confirm" color="danger">Sí, quitar</iswc-button>
                      <iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button>
                    </iswc-popconfirm>`:i`<span></span>`}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `);const p=a.querySelectorAll("iswc-person");r.forEach((o,t)=>{const l=p[t];l&&(l.props={usuario:o.iusuario,nombre:o.usuario?.nombre??null,detalle:o.usuario?.email??o.iusuario})});const n=a.querySelector("#cargando");n&&(n.props={estado:"cargando"});const c=a.querySelector("#vacio");c&&(c.props={icono:"mdi:account-group-outline",titulo:"Sin miembros",texto:"Invita usuarios para que trabajen en esta empresa."})});d("av-miembros",f);
