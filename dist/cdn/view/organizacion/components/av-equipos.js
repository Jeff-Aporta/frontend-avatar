import{crearComponente as q,define as $,emitir as s,html as a}from"../../../js/base/componente.js?v=0air4b";import{ROLES_EQUIPO as w}from"../../../js/consts/schemas/organizacion.schemas.js?v=6mjr4v";import{candidatos as f,colorEquipo as y,etiquetaRol as u,nombreDe as v}from"../utils/organizacion.js?v=bn0ies";const E=q(import.meta.url,"av-equipos",{items:[],miembros:[],cargando:!1,puedeGestionar:!1,ocupado:!1,error:""},(o,l,r)=>{let p=null;const t=i=>{p=i,o.querySelector("#f-titulo").textContent=i?"Editar equipo":"Nuevo equipo",o.querySelector("#f-nombre").value=i?.nombre??"",o.querySelector("#f-descripcion").value=i?.descripcion??"",o.querySelector("#f-color").value=i?.color&&/^#[0-9a-fA-F]{6}$/.test(i.color)?i.color:"#2563eb",o.querySelector("#f-aviso").hidden=!0,o.querySelector("#form").show()},b=()=>{const i=o.querySelector("#f-nombre").value.trim(),n=o.querySelector("#f-aviso");if(!i){n.textContent="El nombre es obligatorio",n.hidden=!1;return}n.hidden=!0,s(r,"av-equipo-guardar",{iequipo:p?.iequipo??null,nombre:i,descripcion:o.querySelector("#f-descripcion").value.trim()||null,color:o.querySelector("#f-color").value||null})},g=(i,n)=>{const c=o.querySelector(`#cand-${n}`)?.value,e=o.querySelector(`#rolc-${n}`)?.value??"integrante";c&&s(r,"av-integrante-agregar",{iequipo:i.iequipo,iusuario:c,rol:w.includes(e)?e:"integrante"})};o.append(a`
    <section class="equipos" part="equipos">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Equipos <iswc-badge color="neutral" pill>${l.items.length}</iswc-badge></strong>
        ${l.puedeGestionar?a`<iswc-button id="nuevo" color="brand" oniswc-click=${()=>t(null)}><iswc-icon slot="start" icon="mdi:plus"></iswc-icon>Nuevo equipo</iswc-button>`:null}
      </div>
      ${l.error?a`<iswc-callout tone="danger">${l.error}</iswc-callout>`:null}
      ${l.cargando?a`<av-vacio id="cargando"></av-vacio>`:l.items.length===0?a`<av-vacio id="vacio">${l.puedeGestionar?a`<iswc-button color="brand" oniswc-click=${()=>t(null)}>Crear el primero</iswc-button>`:null}</av-vacio>`:a`<div class="rejilla" part="rejilla">
            ${l.items.map((i,n)=>{const c=f(l.miembros,i.integrantes);return a`
                <iswc-card variant="outlined" class="equipo" data-iequipo=${String(i.iequipo)} style=${`--equipo: ${y(i.color)}`}>
                  <strong slot="header" class="cabeza"><span class="punto"></span>${i.nombre}</strong>
                  ${l.puedeGestionar?a`<span slot="header-actions" class="acciones">
                        <iswc-button variant="plain" color="neutral" title="Editar" oniswc-click=${()=>t(i)}><iswc-icon icon="mdi:pencil-outline"></iswc-icon></iswc-button>
                        <iswc-button id=${`del-${n}`} variant="plain" color="danger" title="Eliminar"><iswc-icon icon="mdi:delete-outline"></iswc-icon></iswc-button>
                        <iswc-popconfirm for=${`del-${n}`} message=${`\xBFEliminar el equipo ${i.nombre}?`} oniswc-popconfirm-confirm=${()=>s(r,"av-equipo-eliminar",{iequipo:i.iequipo})}>
                          <iswc-button slot="confirm" color="danger">Sí, eliminar</iswc-button>
                          <iswc-button slot="cancel" variant="outlined" color="neutral">No</iswc-button>
                        </iswc-popconfirm>
                      </span>`:null}
                  ${i.descripcion?a`<p class="descripcion">${i.descripcion}</p>`:null}
                  <ul class="integrantes">
                    ${i.integrantes.length===0?a`<li class="nadie">Sin integrantes</li>`:null}
                    ${i.integrantes.map(e=>a`
                      <li class="integrante">
                        <av-persona class="persona" data-iusuario=${e.iusuario}></av-persona>
                        ${e.rol==="lider"?a`<iswc-tag color="brand" pill>${u("lider")}</iswc-tag>`:null}
                        ${l.puedeGestionar?a`<iswc-button variant="plain" color="neutral" class="quitar" title=${`Quitar a ${v(e)}`} oniswc-click=${()=>s(r,"av-integrante-quitar",{iequipo:i.iequipo,iusuario:e.iusuario})}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>`:null}
                      </li>
                    `)}
                  </ul>
                  ${l.puedeGestionar&&c.length?a`<div slot="footer" class="agregar">
                        <iswc-select id=${`cand-${n}`} placeholder="Agregar miembro" aria-label="Miembro a agregar">${c.map(e=>a`<iswc-option value=${e.iusuario}>${v(e)}</iswc-option>`)}</iswc-select>
                        <iswc-select id=${`rolc-${n}`} value="integrante" aria-label="Rol en el equipo">${w.map(e=>a`<iswc-option value=${e}>${u(e)}</iswc-option>`)}</iswc-select>
                        <iswc-button variant="outlined" color="brand" oniswc-click=${()=>g(i,n)}><iswc-icon icon="mdi:plus"></iswc-icon></iswc-button>
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
          <iswc-callout id="f-aviso" tone="danger" hidden></iswc-callout>
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${()=>o.querySelector("#form").hide()}>Cancelar</iswc-button>
        <iswc-button slot="footer" id="f-guardar" color="brand" ?loading=${l.ocupado} oniswc-click=${b}>Guardar</iswc-button>
      </iswc-dialog>
    </section>
  `);for(const i of o.querySelectorAll("av-persona")){const n=i.dataset.iusuario??"",c=l.items.flatMap(e=>e.integrantes).find(e=>e.iusuario===n);i.props={iusuario:n,nombre:c?.usuario?.nombre??null,detalle:c?u(c.rol):""}}const d=o.querySelector("#cargando");d&&(d.props={estado:"cargando"});const m=o.querySelector("#vacio");m&&(m.props={icono:"mdi:account-multiple-outline",titulo:"Sin equipos",texto:"Crea equipos para agrupar canales y proyectos."})});$("av-equipos",E);
