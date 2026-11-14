import{d as w,f as n,g as m,h as p,i as r}from"./chunk-KJRFWKXC.mjs";import{ra as o,ta as d,ua as e,wa as u}from"./chunk-22HCQII4.mjs";var $=u(new URL("view/admin/components/av-roles.min.mjs",new URL("../",import.meta.url)).href,"av-roles",{roles:[],acciones:[],catalogo:[],cargando:!1,ocupado:!1,error:""},(t,c,s)=>{let a=i=>t.querySelector(i)?.value??"",v=()=>{let i=w(a("#nuevo-irol"));i&&e(s,"av-rol-crear",{irol:i,nombre:a("#nuevo-nombre").trim()||i})},g=()=>{let i=a("#p-rol"),l=a("#p-accion");!i||!l||e(s,"av-accion-poner",{irol:i,iaccion:l,valor:a("#p-valor")!=="niega"})};t.append(o`
    <section class="roles" part="roles">
      ${c.error?o`<iswc-callout color="danger">${c.error}</iswc-callout>`:null}
      <div class="formularios">
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:shield-plus-outline"></iswc-icon> Nuevo rol</strong>
          <div class="fila">
            <iswc-input id="nuevo-irol" label="Id" placeholder="SOPORTE" maxlength="30" hint="Mayúsculas, sin espacios"></iswc-input>
            <iswc-input id="nuevo-nombre" label="Nombre" maxlength="120"></iswc-input>
            <iswc-button variant="compact" id="crear" color="brand" ?loading=${c.ocupado} oniswc-click=${v}>Crear</iswc-button>
          </div>
        </iswc-card>
        <iswc-card variant="filled-outlined">
          <strong slot="header"><iswc-icon icon="mdi:key-plus"></iswc-icon> Dar o negar una acción</strong>
          <div class="fila">
            <iswc-select id="p-rol" label="Rol">${c.roles.map(i=>o`<iswc-option value=${i.irol}>${r(i.irol)}</iswc-option>`)}</iswc-select>
            <iswc-select id="p-accion" label="Acción" max-visible="10">
              <iswc-option value="*">* (todas)</iswc-option>
              ${c.catalogo.map(i=>o`<iswc-option value=${i.id}>${i.id}</iswc-option>`)}
            </iswc-select>
            <iswc-select id="p-valor" label="Valor" value="permite"><iswc-option value="permite">Permite</iswc-option><iswc-option value="niega">Niega</iswc-option></iswc-select>
            <iswc-button variant="compact" id="poner" color="brand" ?loading=${c.ocupado} oniswc-click=${g}>Aplicar</iswc-button>
          </div>
        </iswc-card>
      </div>
      ${c.cargando?o`<iswc-skeleton class="esqueleto"></iswc-skeleton>`:o`<div class="rejilla" part="rejilla">
            ${c.roles.map(i=>o`
              <iswc-card variant="outlined" class="rol" data-irol=${i.irol}>
                <strong slot="header">${r(i.irol)} <iswc-tag color="neutral" pill>${i.irol}</iswc-tag></strong>
                ${i.nombre?o`<p class="descripcion">${i.nombre}</p>`:null}
                <ul class="acciones">
                  ${n(i.irol,c.acciones).length===0?o`<li class="nada">${i.irol==="ADMIN"?"Todo permitido (*)":"Hereda del rol base"}</li>`:null}
                  ${n(i.irol,c.acciones).map(l=>o`
                    <li class="accion">
                      <code class="id">${l.iaccion}</code>
                      <iswc-tag color=${p(l.valor)}>${m(l.valor)}</iswc-tag>
                      <iswc-button variant="plain compact" color="neutral" class="quitar" title="Quitar acción" oniswc-click=${()=>e(s,"av-accion-quitar",{irol:i.irol,iaccion:l.iaccion})}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
                    </li>
                  `)}
                </ul>
              </iswc-card>
            `)}
          </div>`}
    </section>
  `)});d("av-roles",$);
