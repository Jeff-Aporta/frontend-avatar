import{crearComponente as p,define as g,emitir as n,html as l}from"../../../js/base/componente.js?v=3wyanc";import{etiquetaRol as u,rolPrincipal as d}from"../utils/admin.js?v=0s9r37";const v=p(import.meta.url,"av-usuarios",{items:[],roles:[],asignaciones:[],cargando:!1},(a,e,s)=>{let o=null;const m=()=>{const i=a.querySelector("#seleccion");i.hidden=!o,o&&(a.querySelector("#sel-nombre").textContent=o,a.querySelector("#sel-rol").value=d(o,e.asignaciones)??"")},w=i=>{const c=i.detail,t=c?.row?.iusuario??c?.id;o=typeof t=="string"?t:null,m()};a.append(l`
    <section class="usuarios" part="usuarios">
      <div class="barra">
        <strong class="titulo"><iswc-icon icon="mdi:account-multiple-outline"></iswc-icon> Usuarios <iswc-badge color="neutral" pill>${e.items.length}</iswc-badge></strong>
        <iswc-button variant="compact" id="nuevo" color="brand" oniswc-click=${()=>n(s,"av-usuario-nuevo",{})}><iswc-icon slot="start" icon="mdi:account-plus-outline"></iswc-icon>Nuevo usuario</iswc-button>
      </div>
      <div id="seleccion" class="seleccion" part="seleccion" hidden>
        <strong id="sel-nombre"></strong>
        <iswc-select id="sel-rol" label="Rol principal" placeholder="Rol base (Usuario)" clearable oniswc-change=${i=>o&&n(s,"av-usuario-rol",{iusuario:o,irol:i.target.value??""})}>
          ${e.roles.filter(i=>i.irol!=="USR").map(i=>l`<iswc-option value=${i.irol}>${u(i.irol)}</iswc-option>`)}
        </iswc-select>
        <iswc-button variant="outlined compact" color="neutral" oniswc-click=${()=>o&&n(s,"av-usuario-editar",{iusuario:o})}><iswc-icon slot="start" icon="mdi:pencil-outline"></iswc-icon>Editar</iswc-button>
        <iswc-button id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button>
        <iswc-popconfirm for="eliminar" message="¿Eliminar el usuario seleccionado?" oniswc-popconfirm-confirm=${()=>o&&n(s,"av-usuario-eliminar",{iusuario:o})}>
          <iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button>
          <iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button>
        </iswc-popconfirm>
      </div>
      <iswc-ag-grid id="grid" class="grid" part="grid" density="compact" get-row-id="id" ?loading=${e.cargando} oniswc-cell-click=${w}></iswc-ag-grid>
    </section>
  `);const r=a.querySelector("#grid");r.columns=[{field:"iusuario",headerName:"Usuario",width:140},{field:"nombre",headerName:"Nombre",flex:1},{field:"email",headerName:"Correo",flex:1},{field:"rol",headerName:"Rol",width:140},{field:"bactivo",headerName:"Activo",type:"boolean",width:90}],r.rows=e.items.map(i=>({id:i.iusuario,iusuario:i.iusuario,nombre:i.nombre??"",email:i.email??"",bactivo:i.bactivo!==!1,rol:u(d(i.iusuario,e.asignaciones)??"USR")}))});g("av-usuarios",v);
