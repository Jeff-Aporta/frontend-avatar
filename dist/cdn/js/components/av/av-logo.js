import{crearComponente as t,define as c,html as r}from"../../base/componente.js?v=17uldv";const n=t(import.meta.url,"av-logo",{wordmark:!1,animado:!1},(s,a,o)=>{const e=a.wordmark||o.hasAttribute("wordmark"),l=a.animado||o.hasAttribute("animado");s.append(r`
    <span class="logo" part="logo" data-animado=${l?"1":"0"} role="img" aria-label="Avatar">
      <svg class="marca" part="marca" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--_c1)"></stop>
            <stop offset="1" stop-color="var(--_c2)"></stop>
          </linearGradient>
        </defs>
        <path class="hex" d="M32 4 56 18v28L32 60 8 46V18Z" fill="url(#g)"></path>
        <path class="hex-borde" d="M32 7.5 53 19.8v24.4L32 56.5 11 44.2V19.8Z" fill="none"></path>
        <path class="monograma" d="M21 45 32 17l11 28" fill="none"></path>
        <path class="barra" d="M25.5 36h13" fill="none"></path>
        <circle class="nodo" cx="32" cy="36" r="2.6"></circle>
        <ellipse class="orbita" cx="32" cy="32" rx="27" ry="9.5" transform="rotate(-24 32 32)" fill="none"></ellipse>
        <circle class="satelite" cx="54.5" cy="22" r="3"></circle>
      </svg>
      ${e?r`<span class="nombre" part="nombre">Avatar</span>`:null}
    </span>
  `)});c("av-logo",n);
