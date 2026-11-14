import{a as $,r as b}from"./chunk-CNLG4QTM.mjs";import{a as d,b as g,c as n}from"./chunk-C3A57DEW.mjs";import{d as f}from"./chunk-EYJKOFS6.mjs";import{fa as u,la as p,ra as r,ta as w,ua as c,wa as v}from"./chunk-22HCQII4.mjs";var S=v(new URL("view/rrhh/components/av-solicitud-form.min.mjs",new URL("../",import.meta.url)).href,"av-solicitud-form",{abierto:!1,empleados:[],iempleado:null,ocupado:!1,error:""},(o,a,i)=>{let l=f(),m=()=>c(i,"av-solicitud-form-cerrar",{}),s=()=>{let e=d(o),t=b({desde:e.desde,hasta:e.hasta});o.querySelector(".dias").textContent=e.tipo==="certificado"?"Un certificado no descuenta d\xEDas.":`${t} d\xEDa${t===1?"":"s"} calendario`},h=()=>{let e=d(o),t=p.safeParse({iempleado:n(e.iempleado)??0,tipo:e.tipo,desde:e.desde,hasta:e.hasta||e.desde,motivo:g(e.motivo)});if(!t.success||!t.data.iempleado){c(i,"av-solicitud-form-error",{mensaje:n(e.iempleado)?"Revisa las fechas: la final no puede ser anterior a la inicial":"Elige el empleado"});return}c(i,"av-solicitud-guardar",{datos:t.data})};o.append(r`
      <iswc-dialog id="dialogo" label="Nueva solicitud" backdrop-variant="basic" ?open=${a.abierto} oniswc-hide=${m}>
        <div class="campos" part="campos" oniswc-change=${s} oniswc-input=${s}>
          <iswc-select name="iempleado" label="Empleado" required placeholder="Elige el empleado" value=${a.iempleado?String(a.iempleado):""}>
            ${a.empleados.filter(e=>e.estado!=="retirado").map(e=>r`<iswc-option value=${String(e.iempleado)}>${e.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-select name="tipo" label="Tipo" value="vacaciones">${u.map(e=>r`<iswc-option value=${e}>${$[e]}</iswc-option>`)}</iswc-select>
          <div class="fila">
            <iswc-input name="desde" type="date" label="Desde" required value=${l}></iswc-input>
            <iswc-input name="hasta" type="date" label="Hasta" value=${l}></iswc-input>
          </div>
          <p class="dias" aria-live="polite"></p>
          <iswc-textarea name="motivo" label="Motivo" rows="3"></iswc-textarea>
          ${a.error?r`<iswc-callout color="danger">${a.error}</iswc-callout>`:null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${m}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="guardar" ?loading=${a.ocupado} oniswc-click=${h}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Registrar</iswc-button>
      </iswc-dialog>
    `),s()},(o,a,i)=>{if(a.empleados!==i.empleados||a.iempleado!==i.iempleado||a.error!==i.error)return!1;let l=o.querySelector("#dialogo");return l?(l.open=a.abierto,o.querySelector("#guardar")?.toggleAttribute("loading",a.ocupado),!0):!1});w("av-solicitud-form",S);
