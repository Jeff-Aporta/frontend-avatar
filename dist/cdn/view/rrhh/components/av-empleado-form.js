import{crearComponente as u,define as p,emitir as n,html as l}from"../../../js/base/componente.js?v=ykdqqm";import{leerCampos as b,oNulo as c,oNumero as w}from"../../../js/base/campos.js?v=b0imlo";import{EmpleadoDatosSchema as v,ESTADOS_EMPLEADO as f}from"../../../js/consts/schemas/rrhh.schemas.js?v=9o17sp";import{fechaISO as $}from"../../../js/core/datos.js?v=2tahwq";import{ETIQUETA as g}from"../utils/rrhh.js?v=m5xhfk";const E=u(import.meta.url,"av-empleado-form",{abierto:!1,empleado:null,miembros:[],puedeEscribir:!1,ocupado:!1,error:""},(t,a,r)=>{const e=a.empleado,i=!a.puedeEscribir,s=()=>n(r,"av-empleado-form-cerrar",{}),d=()=>{const o=b(t),m=v.safeParse({iempleado:e?.iempleado??null,nombre:o.nombre??"",email:c(o.email),departamento:c(o.departamento),cargo:c(o.cargo),salario:w(o.salario)??0,estado:o.estado||"activo",fingreso:c(o.fingreso),iusuario:c(o.iusuario)});if(!m.success){n(r,"av-empleado-form-error",{mensaje:"Revisa el nombre, el correo y el salario (no negativo)"});return}n(r,"av-empleado-guardar",{datos:m.data})};t.append(l`
      <iswc-dialog id="dialogo" label=${e?e.nombre:"Nuevo empleado"} backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${s}>
        <div class="campos" part="campos">
          <div class="fila">
            <iswc-input name="nombre" label="Nombre completo" required maxlength="160" ?readonly=${i} value=${e?.nombre??""}></iswc-input>
            <iswc-input name="email" type="email" label="Correo" maxlength="160" ?readonly=${i} value=${e?.email??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="departamento" label="Departamento" maxlength="80" ?readonly=${i} value=${e?.departamento??""}></iswc-input>
            <iswc-input name="cargo" label="Cargo" maxlength="120" ?readonly=${i} value=${e?.cargo??""}></iswc-input>
          </div>
          <div class="fila">
            <iswc-input name="salario" type="number" min="0" step="1000" label="Salario mensual" prefix="$" ?readonly=${i} value=${String(e?.salario??0)}></iswc-input>
            <iswc-select name="estado" label="Estado" ?disabled=${i} value=${e?.estado??"activo"}>${f.map(o=>l`<iswc-option value=${o}>${g[o]}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="fingreso" type="date" label="Fecha de ingreso" ?readonly=${i} value=${$(e?.fingreso)}></iswc-input>
            <iswc-select name="iusuario" label="Usuario vinculado" clearable placeholder="Sin usuario" hint="Recibe avisos de sus solicitudes" ?disabled=${i} value=${e?.iusuario??""}>
              ${a.miembros.map(o=>l`<iswc-option value=${o.iusuario}>${o.usuario?.nombre||o.iusuario}</iswc-option>`)}
            </iswc-select>
          </div>
          ${a.error?l`<iswc-callout color="danger">${a.error}</iswc-callout>`:null}
          ${i?l`<iswc-callout color="brand">Solo quien tiene el permiso de recursos humanos (avatar.rrhh) modifica empleados.</iswc-callout>`:null}
        </div>
        ${e&&!i?l`<iswc-button slot="footer" id="eliminar" variant="outlined compact" color="danger"><iswc-icon slot="start" icon="mdi:delete-outline"></iswc-icon>Eliminar</iswc-button><iswc-popconfirm slot="footer" for="eliminar" message="¿Eliminar este empleado? Mejor márcalo como retirado si tiene historial." oniswc-popconfirm-confirm=${()=>n(r,"av-empleado-eliminar",{iempleado:e.iempleado})}><iswc-button variant="compact" slot="confirm" color="danger">Sí, eliminar</iswc-button><iswc-button slot="cancel" variant="outlined compact" color="neutral">No</iswc-button></iswc-popconfirm>`:null}
        ${e&&!i&&e.estado!=="retirado"?l`<iswc-button slot="footer" variant="outlined compact" color="brand" oniswc-click=${()=>n(r,"av-solicitud-nueva",{iempleado:e.iempleado})}><iswc-icon slot="start" icon="mdi:calendar-plus"></iswc-icon>Solicitud</iswc-button>`:null}
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${s}>${i?"Cerrar":"Cancelar"}</iswc-button>
        ${i?null:l`<iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${a.ocupado} oniswc-click=${d}>${e?"Guardar":"Crear empleado"}</iswc-button>`}
      </iswc-dialog>
    `)},(t,a,r)=>{if(a.empleado!==r.empleado||a.miembros!==r.miembros||a.error!==r.error||a.puedeEscribir!==r.puedeEscribir)return!1;const e=t.querySelector("#dialogo");return e?(e.open=a.abierto,t.querySelector("#guardar")?.toggleAttribute("loading",a.ocupado),!0):!1});p("av-empleado-form",E);
