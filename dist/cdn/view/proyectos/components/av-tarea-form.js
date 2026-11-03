import{crearComponente as d,define as w,emitir as l,html as c}from"../../../js/base/componente.js?v=ykdqqm";import{TareaDatosSchema as v}from"../../../js/consts/schemas/proyectos.schemas.js?v=0ck3x7";import{leerCampos as b,oNulo as n}from"../utils/formulario.js?v=kxvqfk";import{columnaInicial as p,etiquetasDe as f,nombreMiembro as $,parsearEtiquetas as g,PRIORIDAD_LABEL as q,PRIORIDADES as y}from"../utils/tareas.js?v=qfk170";const D=d(import.meta.url,"av-tarea-form",{abierto:!1,tarea:null,iproyecto:null,icolumna:null,columnas:[],miembros:[],ocupado:!1,error:""},(r,a,o)=>{const e=a.tarea,t=()=>l(o,"av-tarea-form-cerrar",{}),m=()=>{const i=b(r),u=v.safeParse({itarea:e?.itarea??null,iproyecto:e?.iproyecto??a.iproyecto,icolumna:Number(i.icolumna),titulo:(i.titulo??"").trim(),descripcion:n(i.descripcion),prioridad:i.prioridad||"media",asignado_a:n(i.asignado_a),fvence:n(i.fvence),etiquetas:g(i.etiquetas??"")});if(!u.success){l(o,"av-tarea-form-error",{mensaje:"Revisa el t\xEDtulo y la columna"});return}l(o,"av-tarea-guardar",{datos:u.data})},s=e?.icolumna??a.icolumna??p(a.columnas);r.append(c`
      <iswc-dialog id="dialogo" label=${e?`Editar ${e.codigo??"tarea"}`:"Nueva tarea"} backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${t}>
        <div class="campos" part="campos">
          <iswc-input name="titulo" label="Título" required value=${e?.titulo??""} placeholder="Qué hay que hacer"></iswc-input>
          <iswc-textarea name="descripcion" label="Descripción" rows="3" value=${e?.descripcion??""}></iswc-textarea>
          <div class="fila">
            <iswc-select name="prioridad" label="Prioridad" value=${e?.prioridad??"media"}>
              ${y.map(i=>c`<iswc-option value=${i}>${q[i]}</iswc-option>`)}
            </iswc-select>
            <iswc-select name="icolumna" label="Columna" value=${s==null?"":String(s)}>
              ${a.columnas.map(i=>c`<iswc-option value=${String(i.icolumna)}>${i.nombre}</iswc-option>`)}
            </iswc-select>
          </div>
          <div class="fila">
            <iswc-select name="asignado_a" label="Asignado a" clearable value=${e?.asignado_a??""}>
              <iswc-option value="">Sin asignar</iswc-option>
              ${a.miembros.map(i=>c`<iswc-option value=${i.iusuario}>${$(i)}</iswc-option>`)}
            </iswc-select>
            <iswc-input name="fvence" type="date" label="Vence" value=${e?.fvence?String(e.fvence).slice(0,10):""}></iswc-input>
          </div>
          <iswc-input name="etiquetas" label="Etiquetas" hint="Separadas por comas" value=${f(e?.etiquetas).join(", ")}></iswc-input>
          ${a.error?c`<iswc-callout color="danger">${a.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${t}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${a.ocupado} oniswc-click=${m}>${e?"Guardar":"Crear"}</iswc-button>
      </iswc-dialog>
    `)},(r,a,o)=>{if(a.tarea!==o.tarea||a.columnas!==o.columnas||a.miembros!==o.miembros||a.error!==o.error)return!1;const e=r.querySelector("#dialogo");if(!e)return!1;e.open=a.abierto;const t=r.querySelector("#guardar");return t&&t.toggleAttribute("loading",a.ocupado),!0});w("av-tarea-form",D);
