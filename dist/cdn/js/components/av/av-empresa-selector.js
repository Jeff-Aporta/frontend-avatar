import{crearComponente as m,define as n,emitir as o,html as r}from"../../base/componente.js?v=y3pj6c";import{fijar as l}from"../../core/estado.js?v=w7n12d";const p=m(import.meta.url,"av-empresa-selector",{empresas:[],activa:null},(t,e,i)=>{if(e.empresas.length===0){t.append(r`<iswc-tag color="neutral" part="sin-empresa">Sin empresa</iswc-tag>`);return}const c=a=>{const s=Number(a.target.value);!s||s===e.activa||(l({empresa:s}),o(i,"av-empresa-cambio",{iempresa:s}))};t.append(r`
    <iswc-select class="selector" part="selector" aria-label="Empresa activa" value=${String(e.activa??e.empresas[0].iempresa)} oniswc-change=${c}>
      <iswc-icon slot="start" icon="mdi:domain"></iswc-icon>
      ${e.empresas.map(a=>r`<iswc-option value=${String(a.iempresa)}>${a.nombre}</iswc-option>`)}
    </iswc-select>
  `)});n("av-empresa-selector",p);
