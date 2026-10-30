import{crearComponente as e,define as o,html as c}from"../../base/componente.js?v=3c3042";const s=e(import.meta.url,"av-cabecera",{titulo:"",subtitulo:"",icono:""},(t,a)=>{t.append(c`
    <header class="cabecera" part="cabecera">
      <div class="texto">
        <h1 class="titulo" part="titulo">${a.icono?c`<iswc-icon icon=${a.icono}></iswc-icon>`:null}<span>${a.titulo}</span></h1>
        ${a.subtitulo?c`<p class="subtitulo" part="subtitulo">${a.subtitulo}</p>`:null}
      </div>
      <div class="acciones" part="acciones"><slot name="acciones"></slot></div>
    </header>
  `)});o("av-cabecera",s);
