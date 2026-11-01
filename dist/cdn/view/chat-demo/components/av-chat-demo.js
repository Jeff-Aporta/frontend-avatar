import{avisar as u,crearComponente as g,define as C,html as l}from"../../../js/base/componente.js?v=m5nu5c";import{crearBackendDemo as _,personasDemo as f}from"../../../js/chat/backend-demo.js?v=iknyja";import{personaInicial as E,primeraLibre as A,urlComo as v}from"../utils/demo.js?v=07c8q0";function S(e,s,i){const o=i,n=f(),w=(()=>{try{return!!localStorage.getItem("avatar:token")}catch{return!1}})();e.append(l`
    <div class="demo" part="demo">
      <header class="barra" part="barra">
        <span class="marca"><span class="titulo">Chat <em>en vivo</em></span><iswc-tag class="etiqueta" color="brand" pill>demo</iswc-tag></span>
        <span class="ayuda" title="Abre otra pestaña y habla como otra persona: todo llega al instante.">Abre otra pestaña y habla como otra persona: todo llega al instante.</span>
        <span class="acciones"><span class="rotulo">Hablar como</span>
          <iswc-select class="como" aria-label="Hablar como" title="Hablar como">
            ${n.map(a=>l`<iswc-option value=${a.id}>${a.nombre}</iswc-option>`)}
          </iswc-select>
          <iswc-button class="otra" variant="soft compact" color="brand" title="Abrir otra pestaña como otra persona"><iswc-icon slot="start" icon="mdi:tab-plus"></iswc-icon><span class="texto">Otra pestaña</span></iswc-button>
          <iswc-button class="reiniciar" variant="plain compact" color="neutral" title="Volver a los datos de muestra"><iswc-icon slot="start" icon="mdi:restore"></iswc-icon><span class="texto">Reiniciar</span></iswc-button>
          ${w?l`<iswc-switch class="api" title="Conectar este chat al API real">API real</iswc-switch>`:null}
          <iswc-theme-toggle scope="root"></iswc-theme-toggle>
        </span>
      </header>
      <av-chat id="chat" class="chat"></av-chat>
    </div>
  `);const m=e.querySelector("#chat"),c=e.querySelector(".como");m.props={titulo:"Chats",clave:"av-chat-demo",chat:s.id};const p=a=>{o.__backend?.cerrar(),o.__backend=a,m.backend=a},r=a=>{c.value=a;try{history.replaceState(history.state,"",v(a))}catch{}p(_({yo:a}))};E(s.como).then(r),c.addEventListener("iswc-change",()=>{const a=c.value;a&&a!==o.__backend?.yo&&r(a)}),e.querySelector(".otra")?.addEventListener("iswc-click",()=>{const a=o.__backend,d=new Set([...a?.enLinea?.()??[],a?.yo??""]);window.open(v(A(n.map(t=>t.id),d)),"_blank","noopener")}),e.querySelector(".reiniciar")?.addEventListener("iswc-click",()=>{o.__backend?.reiniciar?.(),u("Demo reiniciado con los datos de muestra","success")}),e.querySelector(".api")?.addEventListener("iswc-change",async a=>{if(!a.detail?.checked)return r(c.value||n[0].id);try{const{conectar:t,cargarPerfil:b}=await import("../../../js/core/api.js?v=4m3ots"),{empresaActiva:k}=await import("../../../js/core/estado.js?v=w7n12d"),{crearBackendAvatar:y}=await import("../../../js/chat/backend-avatar.js?v=j5rvud");t(),await b();const h=k();if(!h)throw new Error("Sin empresa activa");p(y({iempresa:h}))}catch(t){u(`API real: ${t instanceof Error?t.message:String(t)}`,"danger"),r(c.value||n[0].id)}}),addEventListener("pagehide",()=>o.__backend?.cerrar(),{once:!0})}const L=g(import.meta.url,"av-chat-demo",{como:null,id:null},(e,s,i)=>S(e,s,i),()=>!0);C("av-chat-demo",L);
