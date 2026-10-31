import{crearComponente as Z,define as aa,html as p,avisar as c}from"../../../js/base/componente.js?v=p6quri";import{z as m}from"../../../js/base/zod.js?v=zn6b7f";import{AccionRolSchema as oa,CatalogoEntradaSchema as sa,RolSchema as M,RolUsuarioSchema as ra,SesionSchema as ia,UsuarioSchema as ta}from"../../../js/consts/schemas/admin.schemas.js?v=1jfbuj";import{auth as g,cerrarSesion as ea,dominio as O,mensajeDe as h,permisos as A,refrescarPermisos as q}from"../../../js/core/api.js?v=3rnmgi";import{estado as L}from"../../../js/core/estado.js?v=w7n12d";import{ACCION as na,puede as ca}from"../../../js/core/permisos.js?v=h0y97j";import{ir as ua}from"../../../js/core/router.js?v=11mqc0";import{cuerpoUsuario as H,GRUPO as E}from"../utils/admin.js?v=0s9r37";import"./av-usuario-form.js?v=iyzg2g";import"./av-usuarios.js?v=x27a5e";import"./av-roles.js?v=qg0hus";import"./av-almacenamiento.js?v=bujsh6";const la=i=>i&&typeof i=="object"&&"toJSON"in i&&typeof i.toJSON=="function"?i.toJSON():i,v=i=>Array.isArray(i)?i.map(la):[],_=i=>i instanceof Date?i.toISOString():typeof i=="string"?i:"",pa=Z(import.meta.url,"av-admin",{id:null,pestana:"usuarios",version:0},(i,U,z)=>{const S=z,d=ca(L.perfil,na.seguridad,"PUT"),t=o=>i.querySelector(o),u=o=>c(h(o),"danger"),n=(o,a)=>{const s=(o==="auth"?g():A()).controllers[a];if(!s)throw new Error(`No hay controller ${a}`);return s};let y=[],R=[],b=[];const f=async()=>{const o=t("#usuarios");if(o){o.props={cargando:!0};try{const[a,s,r]=await Promise.all([n("auth","usuarios").list(),n("permisos","roles").query({where:{igrupo:E}}),n("permisos","rolesUsuario").list()]),e=m.array(ta).safeParse(v(a)),l=m.array(M).safeParse(v(s)),w=m.array(ra).safeParse(v(r));y=e.success?e.data:[],R=l.success?l.data:[],b=w.success?w.data:[]}catch(a){u(a)}o.props={items:y,roles:R,asignaciones:b,cargando:!1}}},k=o=>t("#usuario-form").props={abierto:!0,datos:o,error:"",ocupado:!1},x=async o=>{const{datos:a}=o.detail,s=t("#usuario-form");s.props={ocupado:!0,error:""};try{const r=n("auth","usuarios");a.nuevo?await r.post(r.pojo(H(a))):await r.put(r.pojo(H(a))),s.props={abierto:!1,ocupado:!1},c(a.nuevo?`Usuario ${a.iusuario} creado`:"Usuario actualizado","success"),await f()}catch(r){s.props={ocupado:!1,error:h(r)}}},J=o=>{const{iusuario:a}=o.detail,s=y.find(r=>r.iusuario===a);s&&k({nuevo:!1,iusuario:s.iusuario,nombre:s.nombre??"",email:s.email??"",password:"",bactivo:s.bactivo!==!1})},F=async o=>{const{iusuario:a}=o.detail;if(a===L.yo?.iusuario)return c("No puedes eliminar tu propio usuario","warning");try{const s=n("auth","usuarios");await s.delete(s.pojo({iusuario:a})),c(`Usuario ${a} eliminado`,"neutral"),await f()}catch(s){u(s)}},I=async o=>{const{iusuario:a,irol:s}=o.detail;try{const r=n("permisos","rolesUsuario");for(const e of b.filter(l=>l.iusuario===a&&l.irol!==s))await r.delete(r.pojo({iusuario:a,irol:e.irol}));s&&!b.some(e=>e.iusuario===a&&e.irol===s)&&await r.post(r.pojo({iusuario:a,irol:s,bprincipal:!0})),c(`Rol de ${a} actualizado`,"success"),await q(),await f()}catch(r){u(r)}},j=async()=>{const o=t("#roles");if(o){o.props={cargando:!0,error:""};try{const[a,s,r]=await Promise.all([n("permisos","roles").query({where:{igrupo:E}}),n("permisos","acciones").list(),A().catalog()]),e=m.array(M).safeParse(v(a)),l=m.array(oa).safeParse(v(s)),w=m.array(sa).safeParse(r),Y=new Set((e.success?e.data:[]).map(P=>P.irol));o.props={roles:e.success?e.data:[],acciones:l.success?l.data.filter(P=>Y.has(P.irol)):[],catalogo:w.success?w.data:[],cargando:!1}}catch(a){o.props={cargando:!1,error:h(a)}}}},C=async(o,a)=>{const s=t("#roles");s.props={ocupado:!0,error:""};try{await o(),c(a,"success"),await q(),s.props={ocupado:!1},await j()}catch(r){s.props={ocupado:!1,error:h(r)}}},D=o=>{const{irol:a,nombre:s}=o.detail,r=n("permisos","roles");C(()=>r.post(r.pojo({irol:a,igrupo:E,nombre:s,bactivo:!0})),`Rol ${a} creado`)},G=o=>{const{irol:a,iaccion:s,valor:r}=o.detail;C(()=>A().load({acciones:[{irol:a,iaccion:s,valor:r}]}),`${s} \u2192 ${a}`)},B=o=>{const{irol:a,iaccion:s}=o.detail,r=n("permisos","acciones");C(()=>r.delete(r.pojo({irol:a,iaccion:s})),`Acci\xF3n ${s} quitada de ${a}`)},$=async()=>{const o=t("#sesiones");if(o)try{const a=m.array(ia).safeParse(await g().sessions()),s=a.success?a.data:[];o.replaceChildren(p`${s.map(r=>p`
        <li class="sesion" data-actual=${r.actual?"1":"0"}>
          <iswc-icon icon=${/m[oó]vil|android|iphone/i.test(r.dispositivo??"")?"mdi:cellphone":"mdi:monitor"}></iswc-icon>
          <span class="texto"><strong>${r.navegador??"Navegador"} · ${r.so??"SO"}</strong><span>${r.ip??""}${r.actual?" \xB7 esta sesi\xF3n":""}</span></span>
          ${_(r.ultimo_acceso??r.emitido)?p`<iswc-relative-time date=${_(r.ultimo_acceso??r.emitido)} format="short"></iswc-relative-time>`:p`<span></span>`}
        </li>`)}`)}catch(a){u(a)}},K=async()=>{const o=t("#c-actual").value,a=t("#c-nueva").value,s=t("#c-repetir").value;if(a.length<8)return c("La nueva contrase\xF1a debe tener al menos 8 caracteres","warning");if(a!==s)return c("Las contrase\xF1as no coinciden","warning");try{await g().changePassword({actual:o,nueva:a});for(const r of["#c-actual","#c-nueva","#c-repetir"])t(r).value="";c("Contrase\xF1a actualizada; las dem\xE1s sesiones se cerraron","success"),await $()}catch(r){u(r)}},Q=async()=>{try{await g().logoutAll()}catch(o){u(o)}await ea(),ua("acceso")},N=async()=>{const o=t("#almacenamiento");if(o)try{const a=await O().ajustesArchivos(!0);o.props={maxMb:a.max_mb,topeMb:a.tope_mb,archivos:a.archivos,bytes:a.bytes}}catch(a){u(a)}},V=async o=>{const a=t("#almacenamiento");a.props={ocupado:!0};try{await O().guardarAjustesArchivos(o.detail),c("L\xEDmite actualizado","success"),await N()}catch(s){u(s)}a.props={ocupado:!1}},W=o=>{const{name:a}=o.detail;(a==="usuarios"||a==="roles"||a==="almacenamiento"||a==="cuenta")&&(S.props.pestana=a)},X=d?U.pestana:"cuenta";i.append(p`
    <div class="pagina" part="pagina"
      onav-usuario-nuevo=${()=>k({nuevo:!0,iusuario:"",nombre:"",email:"",password:"",bactivo:!0})}
      onav-usuario-editar=${J} onav-usuario-eliminar=${F} onav-usuario-rol=${I}
      onav-usuario-guardar=${x} onav-usuario-cerrar=${()=>t("#usuario-form").props={abierto:!1}}
      onav-almacenamiento-guardar=${V} onav-rol-crear=${D} onav-accion-poner=${G} onav-accion-quitar=${B}>
      <iswc-page-header id="cabecera">
        <iswc-button slot="acciones" variant="outlined" color="neutral" oniswc-click=${()=>S.props={version:(U.version??0)+1}}><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Actualizar</iswc-button>
      </iswc-page-header>
      ${d?null:p`<iswc-empty-state id="sin-permiso"></iswc-empty-state>`}
      <iswc-tab-group active=${X} oniswc-tab-show=${W}>
        ${d?p`<iswc-tab slot="nav" panel="usuarios"><iswc-icon slot="start" icon="mdi:account-multiple-outline"></iswc-icon>Usuarios</iswc-tab>
          <iswc-tab slot="nav" panel="roles"><iswc-icon slot="start" icon="mdi:shield-key-outline"></iswc-icon>Roles y permisos</iswc-tab>
          <iswc-tab slot="nav" panel="almacenamiento"><iswc-icon slot="start" icon="mdi:database-cog-outline"></iswc-icon>Almacenamiento</iswc-tab>`:null}
        <iswc-tab slot="nav" panel="cuenta"><iswc-icon slot="start" icon="mdi:account-cog-outline"></iswc-icon>Mi cuenta</iswc-tab>
        ${d?p`<iswc-tab-panel name="usuarios"><av-usuarios id="usuarios"></av-usuarios></iswc-tab-panel>
          <iswc-tab-panel name="roles"><av-roles id="roles"></av-roles></iswc-tab-panel>
          <iswc-tab-panel name="almacenamiento"><av-almacenamiento id="almacenamiento"></av-almacenamiento></iswc-tab-panel>`:null}
        <iswc-tab-panel name="cuenta">
          <div class="cuenta">
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:lock-reset"></iswc-icon> Cambiar contraseña</strong>
              <div class="campos">
                <iswc-input id="c-actual" type="password" label="Contraseña actual" password-toggle autocomplete="current-password"></iswc-input>
                <iswc-input id="c-nueva" type="password" label="Nueva contraseña" password-toggle autocomplete="new-password" hint="Mínimo 8 caracteres"></iswc-input>
                <iswc-input id="c-repetir" type="password" label="Repetir nueva" password-toggle autocomplete="new-password"></iswc-input>
              </div>
              <iswc-button slot="footer" id="cambiar-clave" color="brand" oniswc-click=${K}>Cambiar contraseña</iswc-button>
            </iswc-card>
            <iswc-card variant="outlined">
              <strong slot="header"><iswc-icon icon="mdi:devices"></iswc-icon> Sesiones activas</strong>
              <iswc-button slot="header-actions" variant="plain" color="neutral" oniswc-click=${$}><iswc-icon icon="mdi:refresh"></iswc-icon></iswc-button>
              <ul id="sesiones" class="sesiones"></ul>
              <iswc-button slot="footer" id="cerrar-todas" variant="outlined" color="danger"><iswc-icon slot="start" icon="mdi:logout"></iswc-icon>Cerrar todas las sesiones</iswc-button>
              <iswc-popconfirm for="cerrar-todas" message="Se cerrará tu sesión en todos los dispositivos, también en este." oniswc-popconfirm-confirm=${Q}>
                <iswc-button slot="confirm" color="danger">Cerrar todas</iswc-button>
                <iswc-button slot="cancel" variant="outlined" color="neutral">Cancelar</iswc-button>
              </iswc-popconfirm>
            </iswc-card>
          </div>
        </iswc-tab-panel>
      </iswc-tab-group>
      <av-usuario-form id="usuario-form"></av-usuario-form>
    </div>
  `),t("#cabecera").props={titulo:"Administraci\xF3n",subtitulo:d?"Usuarios, roles y permisos de Avatar":"Tu cuenta y tus sesiones",icono:"mdi:shield-account-outline"};const T=t("#sin-permiso");T&&(T.props={icono:"mdi:shield-lock-outline",titulo:"Sin permiso de administraci\xF3n",texto:"Solo un administrador gestiona usuarios y roles. Aqu\xED puedes administrar tu cuenta."}),$(),d&&(f(),j(),N())});aa("av-admin",pa);
