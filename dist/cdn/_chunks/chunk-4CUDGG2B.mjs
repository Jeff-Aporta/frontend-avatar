import{e as c,i as t}from"./chunk-KJRFWKXC.mjs";import{ra as r,ta as m,ua as n,wa as w}from"./chunk-22HCQII4.mjs";var v=w(new URL("view/admin/components/av-usuarios.min.mjs",new URL("../",import.meta.url)).href,"av-usuarios",{items:[],roles:[],asignaciones:[],cargando:!1},(a,e,s)=>{let o=null,p=()=>{let i=a.querySelector("#seleccion");i.hidden=!o,o&&(a.querySelector("#sel-nombre").textContent=o,a.querySelector("#sel-rol").value=c(o,e.asignaciones)??"")},g=i=>{let u=i.detail,d=u?.row?.iusuario??u?.id;o=typeof d=="string"?d:null,p()};a.append(r`
    <section class="usuarios" part="usuarios">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Usuarios <iswc-badge color="neutral" pill>${e.items.length}</iswc-badge></strong>
        <iswc-button variant="compact" id="nuevo" color="brand" oniswc-click=${()=>n(s,"av-usuario-nuevo",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Nuevo usuario</iswc-button>
      </div>
      <div id="seleccion" class="seleccion" part="seleccion" hidden>
        <strong id="sel-nombre"></strong>
        <iswc-select id="sel-rol" label="Rol principal" placeholder="Rol base (Usuario)" clearable oniswc-change=${i=>o&&n(s,"av-usuario-rol",{iusuario:o,irol:i.target.value??""})}>
          ${e.roles.filter(i=>i.irol!=="USR").map(i=>r`<iswc-option value=${i.irol}>${t(i.irol)}</iswc-option>`)}
        </iswc-select>
        <iswc-button variant="outlined compact" color="neutral" oniswc-click=${()=>o&&n(s,"av-usuario-editar",{iusuario:o})}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>
        <iswc-button id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button>
        <iswc-popconfirm for="eliminar" message="¿Eliminar el usuario seleccionado?" oniswc-popconfirm-confirm=${()=>o&&n(s,"av-usuario-eliminar",{iusuario:o})}>
          <iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button>
          <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
        </iswc-popconfirm>
      </div>
      <iswc-ag-grid id="grid" class="grid" part="grid" density="compact" get-row-id="id" ?loading=${e.cargando} oniswc-cell-click=${g}></iswc-ag-grid>
    </section>
  `);let l=a.querySelector("#grid");l.columns=[{field:"iusuario",headerName:"Usuario",width:140},{field:"nombre",headerName:"Nombre",flex:1},{field:"email",headerName:"Correo",flex:1},{field:"rol",headerName:"Rol",width:140},{field:"bactivo",headerName:"Activo",type:"boolean",width:90}],l.rows=e.items.map(i=>({id:i.iusuario,iusuario:i.iusuario,nombre:i.nombre??"",email:i.email??"",bactivo:i.bactivo!==!1,rol:t(c(i.iusuario,e.asignaciones)??"USR")}))});m("av-usuarios",v);
