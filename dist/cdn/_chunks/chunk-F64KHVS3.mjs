import{b as r}from"./chunk-ZW3MWMB5.mjs";import{ra as n,ta as o,wa as e}from"./chunk-22HCQII4.mjs";var t=e(new URL("view/finanzas/components/av-finanzas-hoja.min.mjs",new URL("../",import.meta.url)).href,"av-finanzas-hoja",{transacciones:[]},(a,i)=>{let s=r(i.transacciones);a.append(n`
      <p class="nota">Borrador para cuadrar cifras: lo que edites aquí no cambia las transacciones ni se guarda.</p>
      <iswc-spreadsheet class="hoja" part="hoja" locale="es" rows=${s.length+5} cols="12" without-tabs></iswc-spreadsheet>
    `),a.querySelector(".hoja").value=s});o("av-finanzas-hoja",t);
