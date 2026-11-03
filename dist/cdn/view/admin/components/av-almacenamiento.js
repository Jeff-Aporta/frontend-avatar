import{crearComponente as n,define as c,emitir as s,html as e}from"../../../js/base/componente.js?v=uz3s44";const m=n(import.meta.url,"av-almacenamiento",{maxMb:30,topeMb:95,archivos:null,bytes:null,ocupado:!1},(t,a,i)=>{const o=()=>s(i,"av-almacenamiento-guardar",{max_mb:Number(t.querySelector("#limite").value)});t.append(e`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header"><iswc-icon icon="mdi:database-cog-outline"></iswc-icon> Archivos</strong>
        <div class="campos">
          <iswc-input id="limite" type="number" min="1" max=${String(a.topeMb)} step="1" label="Tamaño máximo por archivo (MB)" hint=${`Hasta ${a.topeMb} MB por petici\xF3n en Cloudflare.`} value=${String(a.maxMb)}></iswc-input>
          <p class="uso">${a.archivos==null?"Calculando uso\u2026":e`${String(a.archivos)} archivos · <iswc-format-bytes value=${String(a.bytes??0)} autofit></iswc-format-bytes> guardados en R2`}</p>
        </div>
        <iswc-button variant="compact" slot="footer" color="brand" ?loading=${a.ocupado} oniswc-click=${o}>Guardar límite</iswc-button>
      </iswc-card>
    `)});c("av-almacenamiento",m);
