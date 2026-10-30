import{crearComponente as u,define as d,emitir as t,html as c}from"../../../js/base/componente.js?v=3c3042";import{ProyectoDatosSchema as p}from"../../../js/consts/schemas/proyectos.schemas.js?v=0q6fjp";import{leerCampos as m,oNulo as n,oNumero as f}from"../utils/formulario.js?v=kxvqfk";import{ESTADOS_PROYECTO as w}from"../utils/tareas.js?v=qfk170";const b={activo:"Activo",pausado:"Pausado",cerrado:"Cerrado"},v=u(import.meta.url,"av-proyecto-form",{abierto:!1,equipos:[],ocupado:!1,error:""},(r,e,i)=>{const a=()=>t(i,"av-proyecto-form-cerrar",{}),l=()=>{const o=m(r),s=p.safeParse({nombre:(o.nombre??"").trim(),descripcion:n(o.descripcion),estado:o.estado||"activo",finicio:n(o.finicio),ffin:n(o.ffin),iequipo:f(o.iequipo)});if(!s.success){t(i,"av-proyecto-form-error",{mensaje:"El nombre es obligatorio"});return}t(i,"av-proyecto-guardar",{datos:s.data})};r.append(c`
      <iswc-dialog id="dialogo" label="Nuevo proyecto" backdrop-variant="basic" ?open=${e.abierto} oniswc-hide=${a}>
        <div class="campos" part="campos">
          <iswc-input name="nombre" label="Nombre" required placeholder="Plataforma Odys"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="2"></iswc-textarea>
          <div class="fila">
            <iswc-select name="estado" label="Estado" value="activo">${w.map(o=>c`<iswc-option value=${o}>${b[o]}</iswc-option>`)}</iswc-select>
            <iswc-select name="iequipo" label="Equipo" clearable><iswc-option value="">Sin equipo</iswc-option>${e.equipos.map(o=>c`<iswc-option value=${String(o.iequipo)}>${o.nombre}</iswc-option>`)}</iswc-select>
          </div>
          <div class="fila">
            <iswc-input name="finicio" type="date" label="Inicio"></iswc-input>
            <iswc-input name="ffin" type="date" label="Fin"></iswc-input>
          </div>
          <iswc-callout tone="info">Se crean las columnas Por hacer, En progreso, En revisión y Hecho.</iswc-callout>
          ${e.error?c`<iswc-callout tone="danger">${e.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${a}>Cancelar</iswc-button>
        <iswc-button slot="footer" color="brand" id="guardar" ?loading=${e.ocupado} oniswc-click=${l}>Crear proyecto</iswc-button>
      </iswc-dialog>
    `)},(r,e,i)=>{if(e.equipos!==i.equipos||e.error!==i.error)return!1;const a=r.querySelector("#dialogo");return a?(a.open=e.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",e.ocupado),!0):!1});d("av-proyecto-form",v);
