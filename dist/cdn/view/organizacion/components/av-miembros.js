import{crearComponente as n,define as l,emitir as e,html as o}from"../../../js/base/componente.js?v=kpvpk6";import{colorRol as u,etiquetaRol as m,nombreDe as p,ordenarMiembros as d}from"../utils/organizacion.js?v=bn0ies";const w=n(import.meta.url,"av-miembros",{items:[],cargando:!1,puedeGestionar:!1},(c,a,s)=>{const t=d(a.items);c.append(o`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Miembros <iswc-badge color="neutral" pill>${t.length}</iswc-badge></strong>
      ${a.puedeGestionar?o`<iswc-button variant="compact" slot="header-actions" color="brand" id="invitar" oniswc-click=${()=>e(s,"av-miembros-invitar",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>`:null}
      ${a.cargando?o`<iswc-empty-state estado="cargando"></iswc-empty-state>`:t.length===0?o`<iswc-empty-state icono="mdi:account-group-outline" titulo="Sin miembros" texto="Invita usuarios para que trabajen en esta empresa."></iswc-empty-state>`:o`<ul class="lista" part="lista">
            ${t.map((i,r)=>o`
              <li class="fila" data-iusuario=${i.iusuario}>
                <iswc-person class="persona" usuario=${i.iusuario} nombre=${i.usuario?.nombre??""} detalle=${i.usuario?.email??i.iusuario}></iswc-person>
                <iswc-tag color=${u(i.rol)} pill>${m(i.rol)}</iswc-tag>
                <span class="cargo">${i.cargo??""}</span>
                ${a.puedeGestionar&&i.rol!=="propietario"?o`<iswc-button id=${`quitar-${r}`} variant="plain compact" color="danger" class="quitar" title="Quitar de la empresa"><iswc-icon icon="mdi:account-remove-outline"></iswc-icon></iswc-button>
                    <iswc-popconfirm for=${`quitar-${r}`} message=${`\xBFQuitar a ${p(i)} de la empresa?`} oniswc-popconfirm-confirm=${()=>e(s,"av-miembro-quitar",{iusuario:i.iusuario})}>
                      <iswc-button variant="compact" slot="confirm" color="danger">Sí, quitar</iswc-button>
                      <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
                    </iswc-popconfirm>`:o`<span></span>`}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `)});l("av-miembros",w);
