import{adoptCss as y,define as _,emitir as x,html as g}from"./_paty.js?v=wt56bb";const J=["ifile","kind","src","src-thumb","src-med","src-original","mime","filename","iconversacion","width","height","durationSec","transcripcion","mode","jfile"],C=/<av-paty-adjunto\b[^>]*?>/g,O=/<\/av-paty-adjunto>/g;function N(n){const t=String(n??"").trim().toLowerCase();return t==="audio"?"audio":t==="documento"||t==="file"||t==="doc"?"documento":"imagen"}function k(n){const t=String(n??"").trim();if(!t)return null;try{const e=JSON.parse(t);return!e||typeof e!="object"||Array.isArray(e)?null:e}catch{return null}}function v(n){return String(n?.url??"").trim()}function j(n,t,e=[]){for(const i of t){const r=v(n?.variants?.[i]);if(r)return r}for(const i of e){const r=String(i??"").trim();if(r)return r}return""}function E(n,t){const e=n.toLowerCase(),i=t.toLowerCase();return e.includes("pdf")||i.endsWith(".pdf")?"mdi:file-pdf-box":e.includes("sheet")||e.includes("excel")||/\.xlsx?$/.test(i)||i.endsWith(".csv")?"mdi:file-excel-box":e.includes("word")||/\.docx?$/.test(i)?"mdi:file-word-box":e.includes("text")||/\.(txt|md|csv)$/.test(i)?"mdi:file-document-outline":e.includes("zip")||e.includes("compressed")||/\.(zip|rar|7z)$/.test(i)?"mdi:folder-zip-outline":e.startsWith("image/")?"mdi:file-image-outline":e.startsWith("audio/")?"mdi:file-music-outline":"mdi:paperclip"}function F(n,t){const e=t.includes(".")?t.split(".").pop():"";return e&&e.length<=5?e.toUpperCase():n.includes("pdf")?"PDF":n.includes("sheet")||n.includes("excel")?"XLS":n.includes("word")?"DOC":n.startsWith("text/")?"TXT":"FILE"}function f(n){return String(n??"").replace(/"/g,"&quot;")}class D extends HTMLElement{#t;#i=null;static get observedAttributes(){return J}constructor(){super(),this.#t=this.attachShadow({mode:"open"})}connectedCallback(){this.#i?.disconnect(),this.#i=new MutationObserver(()=>this.#n()),this.#i.observe(this,{childList:!0,subtree:!0}),this.#n()}disconnectedCallback(){this.#i?.disconnect(),this.#i=null}attributeChangedCallback(t,e,i){e===i||!this.isConnected||this.#n()}#r(){const t=k(this.getAttribute("jfile")),e=this.#s(),i={kind:t?.kind??e?.kind??this.getAttribute("kind")??void 0,mime:t?.mime??e?.mime??this.getAttribute("mime")??void 0,filename:t?.filename??e?.filename??this.getAttribute("filename")??void 0,meta:{...e?.meta??{},...t?.meta??{}},variants:{...e?.variants??{},...t?.variants??{}}},r=String(this.getAttribute("src-thumb")??"").trim(),d=String(this.getAttribute("src-med")??"").trim(),u=String(this.getAttribute("src-original")??"").trim(),a=String(this.getAttribute("src")??"").trim();r&&(i.variants={...i.variants,thumb:{...i.variants?.thumb??{},url:r}}),d&&(i.variants={...i.variants,med:{...i.variants?.med??{},url:d}}),u&&(i.variants={...i.variants,original:{...i.variants?.original??{},url:u}});const c=Number(this.getAttribute("width")??i.meta?.width),o=Number(this.getAttribute("height")??i.meta?.height),s=Number(this.getAttribute("durationSec")??i.meta?.durationSec),l=N(i.kind??this.getAttribute("kind")),h=j(i,["thumb","med","original"],[a]),p=j(i,["original","med","thumb"],[a]),b=j(i,["original","med","thumb"],[a]);return{ifile:String(this.getAttribute("ifile")??"").trim(),kind:l,mime:String(i.mime??"").trim(),filename:String(i.filename??"").trim(),preview:h,full:p,media:b,width:Number.isFinite(c)&&c>0?c:null,height:Number.isFinite(o)&&o>0?o:null,durationSec:Number.isFinite(s)&&s>0?s:null,transcripcion:String(this.getAttribute("transcripcion")??"").trim(),modo:this.getAttribute("mode")==="md"?"md":"xml"}}#s(){const t=this.querySelector(":scope > meta"),e=this.querySelector(":scope > variants");if(!t&&!e&&!this.querySelector(":scope > variant"))return null;const i={};if(t){const u=Number(t.getAttribute("width")),a=Number(t.getAttribute("height")),c=Number(t.getAttribute("durationSec")),o=Number(t.getAttribute("iconversacion"));Number.isFinite(u)&&u>0&&(i.width=u),Number.isFinite(a)&&a>0&&(i.height=a),Number.isFinite(c)&&c>0&&(i.durationSec=c),Number.isFinite(o)&&o>0&&(i.iconversacion=o)}const r={},d=e?e.querySelectorAll("variant"):this.querySelectorAll(":scope > variant");for(const u of d){const a=String(u.getAttribute("name")??"").trim();if(a!=="thumb"&&a!=="med"&&a!=="original")continue;const c=String(u.getAttribute("url")??"").trim(),o=Number(u.getAttribute("bytes"));r[a]={url:c||void 0,bytes:Number.isFinite(o)&&o>0?o:void 0}}return{kind:this.getAttribute("kind")??void 0,mime:this.getAttribute("mime")??void 0,filename:this.getAttribute("filename")??void 0,meta:Object.keys(i).length?i:void 0,variants:Object.keys(r).length?r:void 0}}#e(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}#n(){const t=this.#r(),e=t.ifile?`#${this.#e(t.ifile)}`:"";if(t.modo==="md"){const i=t.kind==="audio"?`[Audio ${e}]${t.transcripcion||"(sin transcripci\xF3n)"}`:t.kind==="documento"?`[Documento ${e}]${t.filename||t.media||"(sin nombre)"}`:`[Imagen ${e}]`;this.#t.replaceChildren(g`<span class="md" part="md">${this.#e(i)}</span>`),y(this.#t,import.meta.url,"av-paty-adjunto");return}if(t.kind==="audio"){const i=t.filename||"Nota de voz";this.#t.replaceChildren(g`
        <article class="adjunto adjunto--audio" part="adjunto" title=${i}>
          <iswc-icon class="adjunto__icono" icon="mdi:microphone"></iswc-icon>
          ${t.media?g`<audio
                class="adjunto__audio"
                controls
                preload="metadata"
                aria-label=${`Audio ${e||i}`}
                src=${t.media}
              ></audio>`:g`<span class="adjunto__vacio">sin audio</span>`}
          ${t.durationSec?g`<span class="adjunto__meta">${Math.round(t.durationSec)}s</span>`:null}
        </article>
      `)}else if(t.kind==="documento"){const i=t.filename||t.media||"documento",r=E(t.mime,i),d=F(t.mime,i);this.#t.replaceChildren(g`
        <a
          class="adjunto adjunto--documento"
          part="adjunto"
          href=${t.media||"#"}
          ?disabled=${!t.media}
          target="_blank"
          rel="noopener noreferrer"
          download=${t.filename||!0}
          title=${i}
          aria-label=${`Documento ${i}`}
        >
          <iswc-icon class="adjunto__icono" icon=${r}></iswc-icon>
          <span class="adjunto__nombre">${this.#e(i)}</span>
          <span class="adjunto__ext">${this.#e(d)}</span>
        </a>
      `)}else{const i=t.width&&t.height?t.width/t.height:1,r=`width: ${Math.max(.6,Math.min(2.4,i)).toFixed(3)}em`,d=t.filename||`Imagen ${e||"adjunta"}`;this.#t.replaceChildren(g`
        <a
          class="adjunto adjunto--imagen"
          part="adjunto"
          href=${t.full||t.preview||"#"}
          ?disabled=${!(t.full||t.preview)}
          target="_blank"
          rel="noopener noreferrer"
          title=${d}
          aria-label=${d}
          style=${r}
        >
          ${t.preview?g`<img
                class="adjunto__preview"
                src=${t.preview}
                alt=${d}
                loading="lazy"
              />`:g`<span class="adjunto__placeholder"><iswc-icon icon="mdi:image-outline"></iswc-icon></span>`}
        </a>
      `)}y(this.#t,import.meta.url,"av-paty-adjunto")}}_("av-paty-adjunto",D);function V(n,t,e="xml"){if(!n||!t.length)return n;const i=new Map;for(const r of t)r.ifile&&!i.has(r.ifile)&&i.set(r.ifile,r);return n.replace(/<av-paty-adjunto\b([^>]*?)\/?>(?:[\s\S]*?<\/av-paty-adjunto>)?/g,(r,d)=>{const u=new Map;for(const S of String(d).matchAll(/([a-zA-Z][\w-]*)\s*=\s*"([^"]*)"/g))u.set(S[1].toLowerCase(),S[2]);const a=String(u.get("ifile")??"").trim(),c=String(u.get("kind")??"imagen").trim(),o=N(c),s=i.get(a);if(!s)return r;const l=typeof s.jfile=="string"?k(s.jfile):s.jfile??null,h=s.variants?.thumb||v(l?.variants?.thumb),p=s.variants?.med||v(l?.variants?.med),b=s.variants?.original||v(l?.variants?.original)||s.src,A=o==="imagen"?h||p||b||s.src||"":b||p||h||s.src||"",m=[`ifile="${f(a)}"`,`kind="${o}"`,`mode="${e}"`];A&&m.push(`src="${f(A)}"`),h&&m.push(`src-thumb="${f(h)}"`),p&&m.push(`src-med="${f(p)}"`),b&&m.push(`src-original="${f(b)}"`);const $=s.mime||l?.mime,w=s.filename||l?.filename;return $&&m.push(`mime="${f($)}"`),w&&m.push(`filename="${f(w)}"`),l?.meta?.width&&m.push(`width="${f(String(l.meta.width))}"`),l?.meta?.height&&m.push(`height="${f(String(l.meta.height))}"`),o==="audio"&&s.transcripcion&&m.push(`transcripcion="${f(s.transcripcion)}"`),l&&m.push(`jfile="${f(JSON.stringify(l))}"`),`<av-paty-adjunto ${m.join(" ")}></av-paty-adjunto>`})}function q(n){x(n,"av-paty-adjunto-play",{ifile:n.getAttribute("ifile")??""})}const z={RE_PATY_ADJUNTO:C,RE_PATY_ADJUNTO_CLOSE:O};export{z as __internals,q as reproducirAdjuntoAudio,V as upgradePatyAdjuntosEnHtml};
