import{b as c,c as i}from"./chunk-N62ZI6CO.mjs";import{ra as s,ta as o,ua as e,wa as r}from"./chunk-22HCQII4.mjs";var l=r(new URL("view/crm/components/av-embudo.min.mjs",new URL("../",import.meta.url)).href,"av-embudo",{etapas:[],activa:null},(n,t,p)=>{n.append(s`
    <div class="fila" part="fila" role="group" aria-label="Embudo por etapa">
      ${t.etapas.map(a=>s`
        <iswc-button class="etapa" variant=${t.activa===a.etapa?"soft":"outlined"} color=${c(a.etapa)} data-etapa=${a.etapa} aria-pressed=${t.activa===a.etapa?"true":"false"}
          oniswc-click=${()=>e(p,"av-crm-filtrar",{etapa:t.activa===a.etapa?null:a.etapa})}>
          <span class="contenido"><span class="label">${a.label}</span><strong class="cantidad">${a.cantidad}</strong><span class="valor">${i(a.valor)}</span></span>
        </iswc-button>
      `)}
    </div>
  `)});o("av-embudo",l);
