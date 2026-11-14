import{ra as a,ta as s,wa as t}from"../../../_chunks/chunk-22HCQII4.mjs";import"../../../_chunks/chunk-JOUQNVKA.mjs";import"../../../_chunks/chunk-2XJIRYNX.mjs";import"../../../_chunks/chunk-FWBWSRYW.mjs";import"../../../_chunks/chunk-S24WVIZS.mjs";var i=t(new URL("js/components/av/av-logo.min.mjs",new URL("../../../",import.meta.url)).href,"av-logo",{wordmark:!1,animado:!1},(e,o,r)=>{let p=o.wordmark||r.hasAttribute("wordmark"),n=o.animado||r.hasAttribute("animado");e.append(a`
    <span class="logo" part="logo" data-animado=${n?"1":"0"} role="img" aria-label="Avatar">
      <svg class="marca" part="marca" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="izq" x1="0" y1="1" x2="0.4" y2="0">
            <stop offset="0" stop-color="var(--_c2)"></stop>
            <stop offset="1" stop-color="var(--_c1)"></stop>
          </linearGradient>
          <linearGradient id="der" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stop-color="var(--_c1)"></stop>
            <stop offset="1" stop-color="var(--_c3)"></stop>
          </linearGradient>
        </defs>
        <path class="pierna" d="M17 51 31 15" stroke="url(#izq)"></path>
        <path class="pliegue" d="M20.6 47.5C25.5 40.5 33 37.2 41.6 38.4L38.6 30.6C30.4 30.4 24.4 35 21.4 41Z"></path>
        <path class="pierna" d="M33 15 47 51" stroke="url(#der)"></path>
        <path class="brillo" d="M17 51 31 15 47 51" pathLength="100"></path>
      </svg>
      ${p?a`<span class="nombre" part="nombre">Avatar</span>`:null}
    </span>
  `)});s("av-logo",i);
