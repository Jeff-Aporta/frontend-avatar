import{crearComponente as e,define as n,html as r}from"../../../js/base/componente.js?v=3wyanc";import{filasHoja as t}from"../utils/finanzas.js?v=5ywdnm";const c=e(import.meta.url,"av-finanzas-hoja",{transacciones:[]},(a,o)=>{const s=t(o.transacciones);a.append(r`
      <p class="nota">Borrador para cuadrar cifras: lo que edites aquí no cambia las transacciones ni se guarda.</p>
      <iswc-spreadsheet class="hoja" part="hoja" locale="es" rows=${s.length+5} cols="12" without-tabs></iswc-spreadsheet>
    `),a.querySelector(".hoja").value=s});n("av-finanzas-hoja",c);
