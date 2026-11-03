import{crearComponente as g,define as $,emitir as r,html as o}from"../../../js/base/componente.js?v=uz3s44";import{ROLES_EQUIPO as d}from"../../../js/consts/schemas/organizacion.schemas.js?v=qwngf3";import{candidatos as q,colorEquipo as v,etiquetaRol as u,nombreDe as m}from"../utils/organizacion.js?v=rvg7bg";const f=g(import.meta.url,"av-equipos",{items:[],miembros:[],cargando:!1,puedeGestionar:!1,ocupado:!1,error:""},(a,c,l)=>{let p=null;const s=i=>{p=i,a.querySelector("#f-titulo").textContent=i?"Editar equipo":"Nuevo equipo",a.querySelector("#f-nombre").value=i?.nombre??"",a.querySelector("#f-descripcion").value=i?.descripcion??"",a.querySelector("#f-color").value=i?.color&&/^#[0-9a-fA-F]{6}$/.test(i.color)?i.color:"#2563eb",a.querySelector("#f-aviso").hidden=!0,a.querySelector("#form").show()},w=()=>{const i=a.querySelector("#f-nombre").value.trim(),n=a.querySelector("#f-aviso");if(!i){n.textContent="El nombre es obligatorio",n.hidden=!1;return}n.hidden=!0,r(l,"av-equipo-guardar",{iequipo:p?.iequipo??null,nombre:i,descripcion:a.querySelector("#f-descripcion").value.trim()||null,color:a.querySelector("#f-color").value||null})},b=(i,n)=>{const t=a.querySelector(`#cand-${n}`)?.value,e=a.querySelector(`#rolc-${n}`)?.value??"integrante";t&&r(l,"av-integrante-agregar",{iequipo:i.iequipo,iusuario:t,rol:d.includes(e)?e:"integrante"})};a.append(o`
    <section class="equipos" part="equipos">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Equipos <iswc-badge color="neutral" pill>${c.items.length}</iswc-badge></strong>
        ${c.puedeGestionar?o`<iswc-button variant="compact" id="nuevo" color="brand" oniswc-click=${()=>s(null)}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nuevo equipo</iswc-button>`:null}
      </div>
      ${c.error?o`<iswc-callout color="danger">${c.error}</iswc-callout>`:null}
      ${c.cargando?o`<iswc-empty-state estado="cargando"></iswc-empty-state>`:c.items.length===0?o`<iswc-empty-state icono="mdi:account-multiple-outline" titulo="Sin equipos" texto="Crea equipos para agrupar canales y proyectos.">${c.puedeGestionar?o`<iswc-button variant="compact" color="brand" oniswc-click=${()=>s(null)}>Crear el primero</iswc-button>`:null}</iswc-empty-state>`:o`<div class="rejilla" part="rejilla">
            ${c.items.map((i,n)=>{const t=q(c.miembros,i.integrantes);return o`
                <iswc-card variant="outlined" class="equipo" data-iequipo=${String(i.iequipo)} style=${`--equipo: ${v(i.color)}`}>
                  <strong slot="header" class="cabeza"><span class="punto"></span>${i.nombre}</strong>
                  ${c.puedeGestionar?o`<span slot="header-actions" class="acciones">
                        <iswc-button variant="plain compact" color="neutral" title="Editar" oniswc-click=${()=>s(i)}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>
                        <iswc-button id=${`del-${n}`} variant="plain compact" color="danger" title="Eliminar"><iswc-icon icon="mdi:delete-outline"></iswc-icon></iswc-button>
                        <iswc-popconfirm for=${`del-${n}`} message=${`\xBFEliminar el equipo ${i.nombre}?`} oniswc-popconfirm-confirm=${()=>r(l,"av-equipo-eliminar",{iequipo:i.iequipo})}>
                          <iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button>
                          <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
                        </iswc-popconfirm>
                      </span>`:null}
                  ${i.descripcion?o`<p class="descripcion">${i.descripcion}</p>`:null}
                  <ul class="integrantes">
                    ${i.integrantes.length===0?o`<li class="nadie">Sin integrantes</li>`:null}
                    ${i.integrantes.map(e=>o`
                      <li class="integrante">
                        <iswc-person class="persona" usuario=${e.iusuario} nombre=${e.usuario?.nombre??""} detalle=${u(e.rol)}></iswc-person>
                        ${e.rol==="lider"?o`<iswc-tag color="brand" pill>${u("lider")}</iswc-tag>`:null}
                        ${c.puedeGestionar?o`<iswc-button variant="plain compact" color="neutral" class="quitar" title=${`Quitar a ${m(e)}`} oniswc-click=${()=>r(l,"av-integrante-quitar",{iequipo:i.iequipo,iusuario:e.iusuario})}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`:null}
                      </li>
                    `)}
                  </ul>
                  ${c.puedeGestionar&&t.length?o`<div slot="footer" class="agregar">
                        <iswc-select id=${`cand-${n}`} placeholder="Agregar miembro" aria-label="Miembro a agregar">${t.map(e=>o`<iswc-option value=${e.iusuario}>${m(e)}</iswc-option>`)}</iswc-select>
                        <iswc-select id=${`rolc-${n}`} value="integrante" aria-label="Rol en el equipo">${d.map(e=>o`<iswc-option value=${e}>${u(e)}</iswc-option>`)}</iswc-select>
                        <iswc-button variant="outlined compact" color="brand" oniswc-click=${()=>b(i,n)}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>
                      </div>`:null}
                </iswc-card>
              `})}
          </div>`}
      <iswc-dialog id="form" backdrop-variant="basic">
        <span slot="label" id="f-titulo">Nuevo equipo</span>
        <div class="campos">
          <iswc-input id="f-nombre" label="Nombre" required maxlength="120"></iswc-input>
          <iswc-textarea id="f-descripcion" label="Descripción" rows="2"></iswc-textarea>
          <iswc-input id="f-color" type="color" label="Color" value="#2563eb"></iswc-input>
          <iswc-callout id="f-aviso" color="danger" hidden></iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${()=>a.querySelector("#form").hide()}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" id="f-guardar" color="brand" ?loading=${c.ocupado} oniswc-click=${w}>Guardar</iswc-button>
      </iswc-dialog>
    </section>
  `)});$("av-equipos",f);
