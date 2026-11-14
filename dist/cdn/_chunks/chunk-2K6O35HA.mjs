import{a as m,b as n,c as d}from"./chunk-NEMNAR6X.mjs";import{d as w}from"./chunk-UMAI5G2Z.mjs";import{h as l,ra as c,ta as u,ua as t,wa as p}from"./chunk-22HCQII4.mjs";var b={activo:"Activo",pausado:"Pausado",cerrado:"Cerrado"},v=p(new URL("view/proyectos/components/av-proyecto-form.min.mjs",new URL("../",import.meta.url)).href,"av-proyecto-form",{abierto:!1,equipos:[],ocupado:!1,error:""},(r,e,i)=>{let a=()=>t(i,"av-proyecto-form-cerrar",{}),f=()=>{let o=m(r),s=l.safeParse({nombre:(o.nombre??"").trim(),descripcion:n(o.descripcion),estado:o.estado||"activo",finicio:n(o.finicio),ffin:n(o.ffin),iequipo:d(o.iequipo)});if(!s.success){t(i,"av-proyecto-form-error",{mensaje:"El nombre es obligatorio"});return}t(i,"av-proyecto-guardar",{datos:s.data})};r.append(c`
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
          <iswc-callout color="brand">Se crean las columnas Por hacer, En progreso, En revisión y Hecho.</iswc-callout>
          ${e.error?c`<iswc-callout color="danger">${e.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${a}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${e.ocupado} oniswc-click=${f}>Crear proyecto</iswc-button>
      </iswc-dialog>
    `)},(r,e,i)=>{if(e.equipos!==i.equipos||e.error!==i.error)return!1;let a=r.querySelector("#dialogo");return a?(a.open=e.abierto,r.querySelector("#guardar")?.toggleAttribute("loading",e.ocupado),!0):!1});u("av-proyecto-form",v);
