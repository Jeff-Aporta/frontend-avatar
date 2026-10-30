import{crearComponente as W,define as X,html as l,avisar as c}from"../../../js/base/componente.js?v=hjriku";import{z as p}from"../../../js/base/zod.js?v=zn6b7f";import{AccionRolSchema as Y,CatalogoEntradaSchema as Z,RolSchema as T,RolUsuarioSchema as oo,SesionSchema as ao,UsuarioSchema as so}from"../../../js/consts/schemas/admin.schemas.js?v=5zttum";import{auth as b,cerrarSesion as ro,mensajeDe as h,permisos as U,refrescarPermisos as O}from"../../../js/core/api.js?v=v1qv0g";import{estado as q}from"../../../js/core/estado.js?v=w7n12d";import{ACCION as io,puede as to}from"../../../js/core/permisos.js?v=eisl5j";import{ir as eo}from"../../../js/core/router.js?v=jrn1bm";import{cuerpoUsuario as H,GRUPO as E}from"../utils/admin.js?v=0s9r37";import"./av-usuario-form.js?v=yt9ytq";import"./av-usuarios.js?v=wkmxyo";import"./av-roles.js?v=1d90e9";const no=i=>i&&typeof i=="object"&&"toJSON"in i&&typeof i.toJSON=="function"?i.toJSON():i,v=i=>Array.isArray(i)?i.map(no):[],L=i=>i instanceof Date?i.toISOString():typeof i=="string"?i:"",co=W(import.meta.url,"av-admin",{id:null,pestana:"usuarios",version:0},(i,S,M)=>{const A=M,d=to(q.perfil,io.seguridad,"PUT"),t=r=>i.querySelector(r),m=r=>c(h(r),"danger"),n=(r,o)=>{const s=(r==="auth"?b():U()).controllers[o];if(!s)throw new Error(`No hay controller ${o}`);return s};let y=[],R=[],f=[];const g=async()=>{const r=t("#usuarios");if(r){r.props={cargando:!0};try{const[o,s,a]=await Promise.all([n("auth","usuarios").list(),n("permisos","roles").query({where:{igrupo:E}}),n("permisos","rolesUsuario").list()]),e=p.array(so).safeParse(v(o)),u=p.array(T).safeParse(v(s)),w=p.array(oo).safeParse(v(a));y=e.success?e.data:[],R=u.success?u.data:[],f=w.success?w.data:[]}catch(o){m(o)}r.props={items:y,roles:R,asignaciones:f,cargando:!1}}},k=r=>t("#usuario-form").props={abierto:!0,datos:r,error:"",ocupado:!1},z=async r=>{const{datos:o}=r.detail,s=t("#usuario-form");s.props={ocupado:!0,error:""};try{const a=n("auth","usuarios");o.nuevo?await a.post(a.pojo(H(o))):await a.put(a.pojo(H(o))),s.props={abierto:!1,ocupado:!1},c(o.nuevo?`Usuario ${o.iusuario} creado`:"Usuario actualizado","success"),await g()}catch(a){s.props={ocupado:!1,error:h(a)}}},J=r=>{const{iusuario:o}=r.detail,s=y.find(a=>a.iusuario===o);s&&k({nuevo:!1,iusuario:s.iusuario,nombre:s.nombre??"",email:s.email??"",password:"",bactivo:s.bactivo!==!1})},F=async r=>{const{iusuario:o}=r.detail;if(o===q.yo?.iusuario)return c("No puedes eliminar tu propio usuario","warning");try{const s=n("auth","usuarios");await s.delete(s.pojo({iusuario:o})),c(`Usuario ${o} eliminado`,"neutral"),await g()}catch(s){m(s)}},I=async r=>{const{iusuario:o,irol:s}=r.detail;try{const a=n("permisos","rolesUsuario");for(const e of f.filter(u=>u.iusuario===o&&u.irol!==s))await a.delete(a.pojo({iusuario:o,irol:e.irol}));s&&!f.some(e=>e.iusuario===o&&e.irol===s)&&await a.post(a.pojo({iusuario:o,irol:s,bprincipal:!0})),c(`Rol de ${o} actualizado`,"success"),await O(),await g()}catch(a){m(a)}},j=async()=>{const r=t("#roles");if(r){r.props={cargando:!0,error:""};try{const[o,s,a]=await Promise.all([n("permisos","roles").query({where:{igrupo:E}}),n("permisos","acciones").list(),U().catalog()]),e=p.array(T).safeParse(v(o)),u=p.array(Y).safeParse(v(s)),w=p.array(Z).safeParse(a),V=new Set((e.success?e.data:[]).map(P=>P.irol));r.props={roles:e.success?e.data:[],acciones:u.success?u.data.filter(P=>V.has(P.irol)):[],catalogo:w.success?w.data:[],cargando:!1}}catch(o){r.props={cargando:!1,error:h(o)}}}},$=async(r,o)=>{const s=t("#roles");s.props={ocupado:!0,error:""};try{await r(),c(o,"success"),await O(),s.props={ocupado:!1},await j()}catch(a){s.props={ocupado:!1,error:h(a)}}},D=r=>{const{irol:o,nombre:s}=r.detail,a=n("permisos","roles");$(()=>a.post(a.pojo({irol:o,igrupo:E,nombre:s,bactivo:!0})),`Rol ${o} creado`)},_=r=>{const{irol:o,iaccion:s,valor:a}=r.detail;$(()=>U().load({acciones:[{irol:o,iaccion:s,valor:a}]}),`${s} \u2192 ${o}`)},x=r=>{const{irol:o,iaccion:s}=r.detail,a=n("permisos","acciones");$(()=>a.delete(a.pojo({irol:o,iaccion:s})),`Acci\xF3n ${s} quitada de ${o}`)},C=async()=>{const r=t("#sesiones");if(r)try{const o=p.array(ao).safeParse(await b().sessions()),s=o.success?o.data:[];r.replaceChildren(l`${s.map(a=>l`
        <li class="sesion" data-actual=${a.actual?"1":"0"}>
          <iswc-icon icon=${/m[oó]vil|android|iphone/i.test(a.dispositivo??"")?"mdi:cellphone":"mdi:monitor"}></iswc-icon>
          <span class="texto"><strong>${a.navegador??"Navegador"} · ${a.so??"SO"}</strong><span>${a.ip??""}${a.actual?" \xB7 esta sesi\xF3n":""}</span></span>
          ${L(a.ultimo_acceso??a.emitido)?l`<iswc-relative-time date=${L(a.ultimo_acceso??a.emitido)} format="short"></iswc-relative-time>`:l`<span></span>`}
        </li>`)}`)}catch(o){m(o)}},G=async()=>{const r=t("#c-actual").value,o=t("#c-nueva").value,s=t("#c-repetir").value;if(o.length<8)return c("La nueva contrase\xF1a debe tener al menos 8 caracteres","warning");if(o!==s)return c("Las contrase\xF1as no coinciden","warning");try{await b().changePassword({actual:r,nueva:o});for(const a of["#c-actual","#c-nueva","#c-repetir"])t(a).value="";c("Contrase\xF1a actualizada; las dem\xE1s sesiones se cerraron","success"),await C()}catch(a){m(a)}},B=async()=>{try{await b().logoutAll()}catch(r){m(r)}await ro(),eo("acceso")},K=r=>{const{name:o}=r.detail;(o==="usuarios"||o==="roles"||o==="cuenta")&&(A.props.pestana=o)},Q=d?S.pestana:"cuenta";i.append(l`
    <div class="pagina" part="pagina"
      onav-usuario-nuevo=${()=>k({nuevo:!0,iusuario:"",nombre:"",email:"",password:"",bactivo:!0})}
      onav-usuario-editar=${J} onav-usuario-eliminar=${F} onav-usuario-rol=${I}
      onav-usuario-guardar=${z} onav-usuario-cerrar=${()=>t("#usuario-form").props={abierto:!1}}
      onav-rol-crear=${D} onav-accion-poner=${_} onav-accion-quitar=${x}>
      <av-cabecera id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${()=>A.props={version:(S.version??0)+1}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
      </av-cabecera>
      ${d?null:l`<av-vacio id="sin-permiso"></av-vacio>`}
      <iswc-tab-group active=${Q} oniswc-tab-show=${K}>
        ${d?l`<iswc-tab slot="nav" panel="usuarios"><iswc-icon slot="start" icon="mdi:account-multiple-outline"></iswc-icon>Usuarios</iswc-tab>
          <iswc-tab slot="nav" panel="roles"><iswc-icon slot="start" icon="mdi:shield-key-outline"></iswc-icon>Roles y permisos</iswc-tab>`:null}
        <iswc-tab slot="nav" panel="cuenta"><iswc-icon slot="start" icon="mdi:account-cog-outline"></iswc-icon>Mi cuenta</iswc-tab>
        ${d?l`<iswc-tab-panel name="usuarios"><av-usuarios id="usuarios"></av-usuarios></iswc-tab-panel>
          <iswc-tab-panel name="roles"><av-roles id="roles"></av-roles></iswc-tab-panel>`:null}
        <iswc-tab-panel name="cuenta">
          <div class="cuenta">
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:lock-reset"></iswc-icon> Cambiar contraseña</strong>
              <div class="campos">
                <iswc-input id="c-actual" type="password" label="Contraseña actual" password-toggle autocomplete="current-password"></iswc-input>
                <iswc-input id="c-nueva" type="password" label="Nueva contraseña" password-toggle autocomplete="new-password" hint="Mínimo 8 caracteres"></iswc-input>
                <iswc-input id="c-repetir" type="password" label="Repetir nueva" password-toggle autocomplete="new-password"></iswc-input>
              </div>
              <iswc-button slot="footer" id="cambiar-clave" color="brand" oniswc-click=${G}>Cambiar contraseña</iswc-button>
            </iswc-card>
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:devices"></iswc-icon> Sesiones activas</strong>
              <iswc-button slot="header-actions" variant="plain" color="neutral" oniswc-click=${C}><iswc-icon icon="mdi:refresh"></iswc-icon></iswc-button>
              <ul id="sesiones" class="sesiones"></ul>
              <iswc-button slot="footer" id="cerrar-todas" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:logout"></iswc-icon>Cerrar todas las sesiones</iswc-button>
              <iswc-popconfirm for="cerrar-todas" message="Se cerrará tu sesión en todos los dispositivos, también en este." oniswc-popconfirm-confirm=${B}>
                <iswc-button slot="confirm" color="danger">Cerrar todas</iswc-button>
                <iswc-button slot="cancel" variant="outlined" color="neutral">Cancelar</iswc-button>
              </iswc-popconfirm>
            </iswc-card>
          </div>
        </iswc-tab-panel>
      </iswc-tab-group>
      <av-usuario-form id="usuario-form"></av-usuario-form>
    </div>
  `),t("#cabecera").props={titulo:"Administraci\xF3n",subtitulo:d?"Usuarios, roles y permisos de Avatar":"Tu cuenta y tus sesiones",icono:"mdi:shield-account-outline"};const N=t("#sin-permiso");N&&(N.props={icono:"mdi:shield-lock-outline",titulo:"Sin permiso de administraci\xF3n",texto:"Solo un administrador gestiona usuarios y roles. Aqu\xED puedes administrar tu cuenta."}),C(),d&&(g(),j())});X("av-admin",co);
