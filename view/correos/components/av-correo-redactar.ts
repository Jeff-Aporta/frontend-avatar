/**
 * <av-correo-redactar> — diálogo para escribir un correo interno: destinatarios y CC (miembros de la empresa), asunto,
 * etiquetas separadas por coma y cuerpo. Sirve para redactar, responder y reenviar (el shell pasa el `borrador`).
 * Emite `av-correo-enviar { datos }` (validado con Zod), `av-correo-redactar-error { mensaje }` y
 * `av-correo-redactar-cerrar`.
 */
import { crearComponente, define, emitir, html } from '../../../src/js/base/componente.js';
import { type AvCorreoRedactarProps, CorreoDatosSchema } from '../../../src/js/consts/schemas/correos.schemas.js';
import { etiquetasDe } from '../utils/correos.js';

type DialogoEl = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string; values?: string[] };

const AvCorreoRedactar = crearComponente<AvCorreoRedactarProps>(
  import.meta.url,
  'av-correo-redactar',
  { abierto: false, borrador: { destinatarios: [], cc: [], asunto: '', cuerpo: '', etiquetas: [], respuesta_a: null }, miembros: [], yo: '', ocupado: false, error: '' },
  (root, props, host) => {
    const b = props.borrador;
    const otros = props.miembros.filter((m) => m.iusuario !== props.yo);
    const campo = (id: string) => root.querySelector(`#${id}`) as Campo;
    const lista = (id: string) => campo(id).values ?? (campo(id).value ? campo(id).value.split(',') : []);
    const cerrar = () => emitir(host, 'av-correo-redactar-cerrar', {});
    const enviar = () => {
      const r = CorreoDatosSchema.safeParse({
        destinatarios: lista('para'),
        cc: lista('cc'),
        asunto: campo('asunto').value ?? '',
        cuerpo: campo('cuerpo').value ?? '',
        etiquetas: etiquetasDe(campo('etiquetas').value ?? ''),
        respuesta_a: b.respuesta_a,
      });
      if (!r.success) {
        const faltan = [!lista('para').length && 'al menos un destinatario', !(campo('asunto').value ?? '').trim() && 'el asunto', !(campo('cuerpo').value ?? '').trim() && 'el mensaje'].filter(Boolean);
        emitir(host, 'av-correo-redactar-error', { mensaje: faltan.length ? `Falta ${faltan.join(', ')}` : 'Revisa los campos del correo' });
        return;
      }
      emitir(host, 'av-correo-enviar', { datos: r.data });
    };
    const opciones = () => otros.map((m) => html`<iswc-option value=${m.iusuario}>${m.usuario?.nombre || m.iusuario}</iswc-option>`);
    root.append(html`
      <iswc-dialog id="dialogo" label=${b.respuesta_a ? 'Responder' : b.asunto.startsWith('Rv:') ? 'Reenviar' : 'Nuevo correo'} backdrop-variant="basic" ?open=${props.abierto} oniswc-hide=${cerrar}>
        <div class="campos" part="campos">
          <iswc-select id="para" label="Para" multiple clearable placeholder="Elige destinatarios" value=${b.destinatarios.join(',')}>${opciones()}</iswc-select>
          <iswc-select id="cc" label="CC" multiple clearable placeholder="Con copia (opcional)" value=${b.cc.join(',')}>${opciones()}</iswc-select>
          <iswc-input id="asunto" label="Asunto" required maxlength="200" value=${b.asunto}></iswc-input>
          <iswc-input id="etiquetas" label="Etiquetas" placeholder="crm, urgente" hint="Separadas por coma" value=${b.etiquetas.join(', ')}><iswc-icon slot="start" icon="mdi:tag-outline"></iswc-icon></iswc-input>
          <iswc-textarea id="cuerpo" label="Mensaje" rows="9" required value=${b.cuerpo}></iswc-textarea>
          ${props.error ? html`<iswc-callout color="danger">${props.error}</iswc-callout>` : null}
        </div>
        <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${cerrar}>Cancelar</iswc-button>
        <iswc-button variant="compact" slot="footer" color="brand" id="enviar" ?loading=${props.ocupado} oniswc-click=${enviar}><iswc-icon slot="start" icon="mdi:send"></iswc-icon>Enviar</iswc-button>
      </iswc-dialog>
    `);
  },
  (root, props, previos) => {
    if (props.borrador !== previos.borrador || props.miembros !== previos.miembros || props.error !== previos.error) return false;
    const d = root.querySelector('#dialogo') as DialogoEl | null;
    if (!d) return false;
    d.open = props.abierto;
    root.querySelector('#enviar')?.toggleAttribute('loading', props.ocupado);
    return true;
  },
);

define('av-correo-redactar', AvCorreoRedactar);
