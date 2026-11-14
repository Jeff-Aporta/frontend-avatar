import{ra as e,ta as t,ua as o,wa as n}from"./chunk-22HCQII4.mjs";var s=n(new URL("view/admin/components/av-almacenamiento.min.mjs",new URL("../",import.meta.url)).href,"av-almacenamiento",{maxMb:30,topeMb:95,archivos:null,bytes:null,ocupado:!1},(i,a,c)=>{let m=()=>o(c,"av-almacenamiento-guardar",{max_mb:Number(i.querySelector("#limite").value)});i.append(e`
      <iswc-card variant="outlined" class="tarjeta" part="tarjeta">
        <strong slot="header"><iswc-icon icon="mdi:database-cog-outline"></iswc-icon> Archivos</strong>
        <div class="campos">
          <iswc-input id="limite" type="number" min="1" max=${String(a.topeMb)} step="1" label="Tamaño máximo por archivo (MB)" hint=${`Hasta ${a.topeMb} MB por petici\xF3n en Cloudflare.`} value=${String(a.maxMb)}></iswc-input>
          <p class="uso">${a.archivos==null?"Calculando uso\u2026":e`${String(a.archivos)} archivos · <iswc-format-bytes value=${String(a.bytes??0)} autofit></iswc-format-bytes> guardados en R2`}</p>
        </div>
        <iswc-button variant="compact" slot="footer" color="brand" ?loading=${a.ocupado} oniswc-click=${m}>Guardar límite</iswc-button>
      </iswc-card>
    `)});t("av-almacenamiento",s);
