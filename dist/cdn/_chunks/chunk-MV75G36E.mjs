import{a as v,b as n}from"./chunk-NEMNAR6X.mjs";import{a as p,b,j as f,k as $,l as g,o as y}from"./chunk-UMAI5G2Z.mjs";import{g as m,ra as r,ta as d,ua as l,wa as w}from"./chunk-22HCQII4.mjs";var D=w(new URL("view/proyectos/components/av-tarea-form.min.mjs",new URL("../",import.meta.url)).href,"av-tarea-form",{abierto:!1,tarea:null,iproyecto:null,icolumna:null,columnas:[],miembros:[],ocupado:!1,error:""},(t,a,o)=>{let e=a.tarea,c=()=>l(o,"av-tarea-form-cerrar",{}),q=()=>{let i=v(t),u=m.safeParse({itarea:e?.itarea??null,iproyecto:e?.iproyecto??a.iproyecto,icolumna:Number(i.icolumna),titulo:(i.titulo??"").trim(),descripcion:n(i.descripcion),prioridad:i.prioridad||"media",asignado_a:n(i.asignado_a),fvence:n(i.fvence),etiquetas:f(i.etiquetas??"")});if(!u.success){l(o,"av-tarea-form-error",{mensaje:"Revisa el t\xEDtulo y la columna"});return}l(o,"av-tarea-guardar",{datos:u.data})},s=e?.icolumna??a.icolumna??y(a.columnas);t.append(r`
      <iswc-dialog id="dialogo" label=${e?`Editar ${e.codigo??"tarea"}`:"Nueva tarea"} backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${c}>
        <div class="campos" part="campos">
          <iswc-input name="titulo" label="Título" required value=${e?.titulo??""} placeholder="Qué hay que hacer"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="3" value=${e?.descripcion??""}></iswc-textarea>
          <div class="fila">
            <iswc-select name="prioridad" label="Prioridad" value=${e?.prioridad??"media"}>
              ${p.map(i=>r`<iswc-option value=${i}>${b[i]}</iswc-option>`)}
            </iswc-select>
            <iswc-select name="icolumna" label="Columna" value=${s==null?"":String(s)}>
              ${a.columnas.map(i=>r`<iswc-option value=${String(i.icolumna)}>${i.nombre}</iswc-option>`)}
            </iswc-select>
          </div>
          <div class="fila">
            <iswc-select name="asignado_a" label="Asignado a" clearable value=${e?.asignado_a??""}>
              <iswc-option value="">Sin asignar</iswc-option>
              ${a.miembros.map(i=>r`<iswc-option value=${i.iusuario}>${g(i)}</iswc-option>`)}
            </iswc-select>
            <iswc-input name="fvence" type="date" label="Vence" value=${e?.fvence?String(e.fvence).slice(0,10):""}></iswc-input>
          </div>
          <iswc-input name="etiquetas" label="Etiquetas" hint="Separadas por comas" value=${$(e?.etiquetas).join(", ")}></iswc-input>
          ${a.error?r`<iswc-callout color="danger">${a.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${c}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${a.ocupado} oniswc-click=${q}>${e?"Guardar":"Crear"}</iswc-button>
      </iswc-dialog>
    `)},(t,a,o)=>{if(a.tarea!==o.tarea||a.columnas!==o.columnas||a.miembros!==o.miembros||a.error!==o.error)return!1;let e=t.querySelector("#dialogo");if(!e)return!1;e.open=a.abierto;let c=t.querySelector("#guardar");return c&&c.toggleAttribute("loading",a.ocupado),!0});d("av-tarea-form",D);
