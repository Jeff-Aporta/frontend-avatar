import{crearComponente as p,define as w,emitir as s,html as r}from"../../../js/base/componente.js?v=333q2n";import{leerCampos as n,oNulo as v,oNumero as m}from"../../../js/base/campos.js?v=b0imlo";import{SolicitudDatosSchema as f,TIPOS_SOLICITUD as g}from"../../../js/consts/schemas/rrhh.schemas.js?v=fqm81d";import{hoyISO as $}from"../../../js/core/datos.js?v=2tahwq";import{diasSolicitud as b,ETIQUETA as S}from"../utils/rrhh.js?v=n0wjd8";const h=p(import.meta.url,"av-solicitud-form",{abierto:!1,empleados:[],iempleado:null,ocupado:!1,error:""},(o,a,i)=>{const l=$(),d=()=>s(i,"av-solicitud-form-cerrar",{}),c=()=>{const e=n(o),t=b({desde:e.desde,hasta:e.hasta});o.querySelector(".dias").textContent=e.tipo==="certificado"?"Un certificado no descuenta d\xEDas.":`${t} d\xEDa${t===1?"":"s"} calendario`},u=()=>{const e=n(o),t=f.safeParse({iempleado:m(e.iempleado)??0,tipo:e.tipo,desde:e.desde,hasta:e.hasta||e.desde,motivo:v(e.motivo)});if(!t.success||!t.data.iempleado){s(i,"av-solicitud-form-error",{mensaje:m(e.iempleado)?"Revisa las fechas: la final no puede ser anterior a la inicial":"Elige el empleado"});return}s(i,"av-solicitud-guardar",{datos:t.data})};o.append(r`
      <iswc-dialog id="dialogo" label="Nueva solicitud" backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${d}>
        <div class="campos" part="campos" oniswc-change=${c} oniswc-input=${c}>
          <iswc-select name="iempleado" label="Empleado" required placeholder="Elige el empleado" value=${a.iempleado?String(a.iempleado):""}>
            ${a.empleados.filter(e=>e.estado!=="retirado").map(e=>r`<iswc-option value=${String(e.iempleado)}>${e.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-select name="tipo" label="Tipo" value="vacaciones">${g.map(e=>r`<iswc-option value=${e}>${S[e]}</iswc-option>`)}</iswc-select>
          <div class="fila">
            <iswc-input name="desde" type="date" label="Desde" required value=${l}></iswc-input>
            <iswc-input name="hasta" type="date" label="Hasta" value=${l}></iswc-input>
          </div>
          <p class="dias" aria-live="polite"></p>
          <iswc-textarea name="motivo" label="Motivo" rows="3"></iswc-textarea>
          ${a.error?r`<iswc-callout color="danger">${a.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined" color="neutral" oniswc-click=${d}>Cancelar</iswc-button>
        <iswc-button slot="footer" color="brand" id="guardar" ?loading=${a.ocupado} oniswc-click=${u}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `),c()},(o,a,i)=>{if(a.empleados!==i.empleados||a.iempleado!==i.iempleado||a.error!==i.error)return!1;const l=o.querySelector("#dialogo");return l?(l.open=a.abierto,o.querySelector("#guardar")?.toggleAttribute("loading",a.ocupado),!0):!1});w("av-solicitud-form",h);
