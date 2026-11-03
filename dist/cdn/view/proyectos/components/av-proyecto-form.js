import{crearComponente as u,define as p,emitir as t,html as c}from"../../../js/base/componente.js?v=ykdqqm";import{ProyectoDatosSchema as d}from"../../../js/consts/schemas/proyectos.schemas.js?v=0ck3x7";import{leerCampos as m,oNulo as n,oNumero as w}from"../utils/formulario.js?v=kxvqfk";import{ESTADOS_PROYECTO as f}from"../utils/tareas.js?v=qfk170";const b={activo:"Activo",pausado:"Pausado",cerrado:"Cerrado"},v=u(import.meta.url,"av-proyecto-form",{abierto:!1,equipos:[],ocupado:!1,error:""},(r,e,i)=>{const a=()=>t(i,"av-proyecto-form-cerrar",{}),s=()=>{const o=m(r),l=d.safeParse({nombre:(o.nombre??"").trim(),descripcion:n(o.descripcion),estado:o.estado||"activo",finicio:n(o.finicio),ffin:n(o.ffin),iequipo:w(o.iequipo)});if(!l.success){t(i,"av-proyecto-form-error",{mensaje:"El nombre es obligatorio"});return}t(i,"av-proyecto-guardar",{datos:l.data})};r.append(c`
      <iswc-dialog id="dialogo" label="Nuevo proyecto" backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${a}>
        <div class="campos" part="campos">
          <iswc-input name="nombre" label="Nombre" required placeholder="Plataforma Odys"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="2"></iswc-textarea>
          <div class="fila">
            <iswc-select name="estado" label="Estado" value="activo">${f.map(o=>c`<iswc-option value=${o}>${b[o]}</iswc-option>`)}</iswc-select>
            <iswc-select name="iequipo" label="Equipo" clearable><iswc-option value="">Sin equipo</iswc-option>${e.equipos.map(o=>c`<iswc-option value=${String(o.iequipo)}>${o.nombre}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="finicio" type="date" label="Inicio"></iswc-input>
            <iswc-input name="ffin" type="date" label="Fin"></iswc-input>
          </div>
          <iswc-callout color="brand">Se crean las columnas Por hacer, En progreso, En revisión y Hecho.</iswc-callout>
          ${e.error?c`<iswc-callout color="danger">${e.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${a}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${e.ocupado} oniswc-click=${s}>Crear proyecto</iswc-button>
      </iswc-dialog>
    `)},(r,e,i)=>{if(e.equipos!==i.equipos||e.error!==i.error)return!1;const a=r.querySelector("#dialogo");return a?(a.open=e.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",e.ocupado),!0):!1});p("av-proyecto-form",v);
