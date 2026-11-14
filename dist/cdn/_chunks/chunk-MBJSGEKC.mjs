import{a as l,b as u,c as m,d as p}from"./chunk-DSFXORMY.mjs";import{ra as o,ta as c,ua as s,wa as n}from"./chunk-22HCQII4.mjs";var d=n(new URL("view/organizacion/components/av-miembros.min.mjs",new URL("../",import.meta.url)).href,"av-miembros",{items:[],cargando:!1,puedeGestionar:!1},(w,a,r)=>{let t=m(a.items);w.append(o`
    <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
      <strong slot="header"><iswc-icon icon="mdi:account-group-outline"></iswc-icon> Miembros <iswc-badge color="neutral" pill>${t.length}</iswc-badge></strong>
      ${a.puedeGestionar?o`<iswc-button variant="compact" slot="header-actions" color="brand" id="invitar" oniswc-click=${()=>s(r,"av-miembros-invitar",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Invitar</iswc-button>`:null}
      ${a.cargando?o`<iswc-empty-state estado="cargando"></iswc-empty-state>`:t.length===0?o`<iswc-empty-state icono="mdi:account-group-outline" titulo="Sin miembros" texto="Invita usuarios para que trabajen en esta empresa."></iswc-empty-state>`:o`<ul class="lista" part="lista">
            ${t.map((i,e)=>o`
              <li class="fila" data-iusuario=${i.iusuario}>
                <iswc-person class="persona" usuario=${i.iusuario} nombre=${i.usuario?.nombre??""} detalle=${i.usuario?.email??i.iusuario}></iswc-person>
                <iswc-tag color=${l(i.rol)} pill>${u(i.rol)}</iswc-tag>
                <span class="cargo">${i.cargo??""}</span>
                ${a.puedeGestionar&&i.rol!=="propietario"?o`<iswc-button id=${`quitar-${e}`} variant="plain compact" color="danger" class="quitar" title="Quitar de la empresa"><iswc-icon icon="mdi:account-remove-outline"></iswc-icon></iswc-button>
                    <iswc-popconfirm for=${`quitar-${e}`} message=${`\xBFQuitar a ${p(i)} de la empresa?`} oniswc-popconfirm-confirm=${()=>s(r,"av-miembro-quitar",{iusuario:i.iusuario})}>
                      <iswc-button variant="compact" slot="confirm" color="danger">Sí, quitar</iswc-button>
                      <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
                    </iswc-popconfirm>`:o`<span></span>`}
              </li>
            `)}
          </ul>`}
    </iswc-card>
  `)});c("av-miembros",d);
