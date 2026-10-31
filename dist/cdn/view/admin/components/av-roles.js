import{crearComponente as w,define as v,emitir as s,html as c}from"../../../js/base/componente.js?v=ehrr8d";import{accionesDe as r,colorValor as m,etiquetaRol as t,normalizarIrol as p,valorLegible as g}from"../utils/admin.js?v=0s9r37";const $=w(import.meta.url,"av-roles",{roles:[],acciones:[],catalogo:[],cargando:!1,ocupado:!1,error:""},(n,o,e)=>{const a=i=>n.querySelector(i)?.value??"",d=()=>{const i=p(a("#nuevo-irol"));i&&s(e,"av-rol-crear",{irol:i,nombre:a("#nuevo-nombre").trim()||i})},u=()=>{const i=a("#p-rol"),l=a("#p-accion");!i||!l||s(e,"av-accion-poner",{irol:i,iaccion:l,valor:a("#p-valor")!=="niega"})};n.append(c`
    <section class="roles" part="roles">
      ${o.error?c`<iswc-callout tone="danger">${o.error}</iswc-callout>`:null}
      <div class="formularios">
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:shield-plus-outline"></iswc-icon> Nuevo rol</strong>
          <div class="fila">
            <iswc-input id="nuevo-irol" label="Id" placeholder="SOPORTE" maxlength="30" hint="Mayúsculas, sin espacios"></iswc-input>
            <iswc-input id="nuevo-nombre" label="Nombre" maxlength="120"></iswc-input>
            <iswc-button id="crear" color="brand" ?loading=${o.ocupado} oniswc-click=${d}>Crear</iswc-button>
          </div>
        </iswc-card>
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:key-plus"></iswc-icon> Dar o negar una acción</strong>
          <div class="fila">
            <iswc-select id="p-rol" label="Rol">${o.roles.map(i=>c`<iswc-option value=${i.irol}>${t(i.irol)}</iswc-option>`)}</iswc-select>
            <iswc-select id="p-accion" label="Acción" max-visible="10">
              <iswc-option value="*">* (todas)</iswc-option>
              ${o.catalogo.map(i=>c`<iswc-option value=${i.id}>${i.id}</iswc-option>`)}
            </iswc-select>
            <iswc-select id="p-valor" label="Valor" value="permite"><iswc-option value="permite">Permite</iswc-option><iswc-option value="niega">Niega</iswc-option></iswc-select>
            <iswc-button id="poner" color="brand" ?loading=${o.ocupado} oniswc-click=${u}>Aplicar</iswc-button>
          </div>
        </iswc-card>
      </div>
      ${o.cargando?c`<iswc-skeleton class="esqueleto"></iswc-skeleton>`:c`<div class="rejilla" part="rejilla">
            ${o.roles.map(i=>c`
              <iswc-card variant="outlined" class="rol" data-irol=${i.irol}>
                <strong slot="header">${t(i.irol)} <iswc-tag color="neutral" pill>${i.irol}</iswc-tag></strong>
                ${i.nombre?c`<p class="descripcion">${i.nombre}</p>`:null}
                <ul class="acciones">
                  ${r(i.irol,o.acciones).length===0?c`<li class="nada">${i.irol==="ADMIN"?"Todo permitido (*)":"Hereda del rol base"}</li>`:null}
                  ${r(i.irol,o.acciones).map(l=>c`
                    <li class="accion">
                      <code class="id">${l.iaccion}</code>
                      <iswc-tag color=${m(l.valor)}>${g(l.valor)}</iswc-tag>
                      <iswc-button variant="plain" color="neutral" class="quitar" title="Quitar acción" oniswc-click=${()=>s(e,"av-accion-quitar",{irol:i.irol,iaccion:l.iaccion})}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
                    </li>
                  `)}
                </ul>
              </iswc-card>
            `)}
          </div>`}
    </section>
  `)});v("av-roles",$);
