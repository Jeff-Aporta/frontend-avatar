import{crearComponente as l,define as c,emitir as e,html as s}from"../../../js/base/componente.js?v=0air4b";import{colorEtapa as p,moneda as i}from"../utils/crm.js?v=a3gyoi";const n=l(import.meta.url,"av-embudo",{etapas:[],activa:null},(o,t,r)=>{o.append(s`
    <div class="fila" part="fila" role="group" aria-label="Embudo por etapa">
      ${t.etapas.map(a=>s`
        <iswc-button class="etapa" variant=${t.activa===a.etapa?"soft":"outlined"} color=${p(a.etapa)} data-etapa=${a.etapa} aria-pressed=${t.activa===a.etapa?"true":"false"}
          oniswc-click=${()=>e(r,"av-crm-filtrar",{etapa:t.activa===a.etapa?null:a.etapa})}>
          <span class="contenido"><span class="label">${a.label}</span><strong class="cantidad">${a.cantidad}</strong><span class="valor">${i(a.valor)}</span></span>
        </iswc-button>
      `)}
    </div>
  `)});c("av-embudo",n);
