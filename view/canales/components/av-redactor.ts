/**
 * <av-redactor> — caja para escribir: `iswc-textarea` con autosize y botón «Enviar». Enter envía, Shift+Enter salto de
 * línea. Emite `av-mensaje-enviar { contenido }` (ya recortado y no vacío) y limpia el campo.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import type { AvRedactorProps } from '../../../src/js/consts/schemas/canales.schemas.js';
import { textoParaEnviar } from '../utils/chat.js';

type AreaEl = HTMLElement & { value: string; focus(): void };

const AvRedactor = crearComponente<AvRedactorProps>(
  import.meta.url,
  'av-redactor',
  { deshabilitado: false, enviando: false, placeholder: 'Escribe un mensaje… (Enter envía, Shift+Enter salto de línea)' },
  (root, props, host) => {
    const area = () => root.querySelector('#area') as AreaEl | null;
    const enviar = () => {
      const a = area();
      if (!a || props.deshabilitado) return;
      const contenido = textoParaEnviar(a.value);
      if (!contenido) return;
      emitir(host, 'av-mensaje-enviar', { contenido });
      a.value = '';
      a.focus();
    };
    const teclas = (e: Event) => {
      const k = e as KeyboardEvent;
      if (k.key === 'Enter' && !k.shiftKey && !k.isComposing) {
        k.preventDefault();
        enviar();
      }
    };
    root.append(html`
      <div class="redactor" part="redactor">
        <iswc-textarea id="area" class="area" part="area" autosize min-rows="1" max-rows="6" placeholder=${props.placeholder} ?disabled=${props.deshabilitado} onkeydown=${teclas}></iswc-textarea>
        <iswc-button id="enviar" class="enviar" color="brand" ?disabled=${props.deshabilitado} ?loading=${props.enviando} oniswc-click=${enviar} title="Enviar (Enter)">
          <iswc-icon icon="mdi:send"></iswc-icon>
        </iswc-button>
      </div>
      ${props.deshabilitado ? html`<p class="aviso">No tienes permiso para escribir en este canal.</p>` : null}
    `);
  },
  // Repintado parcial: enviando/deshabilitado solo tocan atributos (no se pierde lo escrito).
  (root, props) => {
    const boton = root.querySelector('#enviar');
    const a = root.querySelector('#area');
    if (!boton || !a) return false;
    boton.toggleAttribute('loading', props.enviando);
    boton.toggleAttribute('disabled', props.deshabilitado);
    a.toggleAttribute('disabled', props.deshabilitado);
    return true;
  },
);

define('av-redactor', AvRedactor);
