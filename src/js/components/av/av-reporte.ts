/**
 * <av-reporte> — botón flotante para reportar un error desde cualquier página, en el celular o en el computador: texto, capturas o
 * imágenes (también pegadas) y notas de voz. El HTML de la página y el contexto viajan solos (`core/reporte.ts`, que se carga al abrir).
 * Con sesión de un usuario real no pide código; sin sesión o con un perfil de prueba, sí.
 */
import { avisar, crearComponente, define, html } from '../../base/componente.js';
import type { AvReporteProps } from '../../consts/schemas/componentes.schemas.js';
import { mensajeDe, perfilesPrueba } from '../../core/api.js';
import { estado } from '../../core/estado.js';

type Dialogo = HTMLElement & { open: boolean };
type Campo = HTMLElement & { value: string };
type Modulo = typeof import('../../core/reporte.js');

const MAX_ADJUNTOS = 8;
const MAX_MB = 20;
const ETIQUETA_ESTADO: Record<string, string> = { recibiendo: 'Recibiendo', pendiente: 'En cola', en_proceso: 'Un agente lo está atendiendo', atendido: 'Atendido' };

const cargar = (): Promise<Modulo> => import('../../core/reporte.js');

/** ¿Hace falta el código? Sin sesión o con un perfil de prueba; el API lo vuelve a comprobar. */
async function pideCodigo(): Promise<boolean> {
  const usuario = estado.yo?.iusuario;
  if (!estado.token || !usuario) return true;
  const perfiles = await perfilesPrueba().catch(() => []);
  return perfiles.some((p) => p.iusuario === usuario && p.prueba !== false);
}

const AvReporte = crearComponente<AvReporteProps>(import.meta.url, 'av-reporte', {}, (root) => {
  let adjuntos: File[] = [];
  let terminarGrabacion: (() => Promise<File>) | null = null;
  let codigo = '';
  const q = <T extends Element>(s: string) => root.querySelector(s) as T;
  const fallo = (texto: string) => {
    const e = q<HTMLElement>('.error');
    e.textContent = texto;
    e.hidden = !texto;
  };
  const pintarAdjuntos = () => {
    const lista = q<HTMLElement>('.adjuntos');
    lista.replaceChildren(...adjuntos.map((a, i) => html`
      <li class="adjunto">
        <iswc-icon icon=${a.type.startsWith('audio/') ? 'mdi:microphone-outline' : 'mdi:image-outline'} aria-hidden="true"></iswc-icon>
        <span class="nombre">${a.name}</span>
        <iswc-button variant="plain compact" color="neutral" aria-label=${`Quitar ${a.name}`} oniswc-click=${() => { adjuntos.splice(i, 1); pintarAdjuntos(); }}><iswc-icon icon="mdi:close"></iswc-icon></iswc-button>
      </li>`));
  };
  const agregar = (archivos: File[]) => {
    for (const a of archivos) {
      if (adjuntos.length >= MAX_ADJUNTOS) return fallo(`Máximo ${MAX_ADJUNTOS} adjuntos.`);
      if (a.size > MAX_MB * 1024 * 1024) return fallo(`${a.name} supera ${MAX_MB} MB.`);
      adjuntos.push(a);
    }
    fallo('');
    pintarAdjuntos();
  };
  const abrir = async () => {
    q<HTMLElement>('.formulario').hidden = false;
    q<HTMLElement>('.enviado').hidden = true;
    q<HTMLElement>('#enviar').hidden = false;
    fallo('');
    q<Dialogo>('#dialogo').open = true;
    q<HTMLElement>('#codigo').hidden = !(await pideCodigo());
    const m = await cargar();
    q<HTMLElement>('#capturar').hidden = !m.puedeCapturar();
  };
  const capturar = async () => {
    const dialogo = q<Dialogo>('#dialogo');
    dialogo.open = false; // la captura no debe tapar la página con el propio diálogo
    try {
      agregar([await (await cargar()).capturarPantalla()]);
    } catch (err) {
      if ((err as Error).name !== 'NotAllowedError') fallo(mensajeDe(err));
    } finally {
      dialogo.open = true;
    }
  };
  const grabar = async () => {
    const boton = q<HTMLElement>('#grabar');
    try {
      if (terminarGrabacion) {
        const fin = terminarGrabacion;
        terminarGrabacion = null;
        boton.textContent = 'Nota de voz';
        agregar([await fin()]);
        return;
      }
      terminarGrabacion = await (await cargar()).grabarVoz();
      boton.textContent = 'Detener y adjuntar';
    } catch (err) {
      terminarGrabacion = null;
      fallo(`No se pudo usar el micrófono: ${mensajeDe(err)}`);
    }
  };
  const verSeguimiento = async (r: Parameters<Modulo['seguimiento']>[0]) => {
    const s = await (await cargar()).seguimiento(r);
    q('.estado').textContent = ETIQUETA_ESTADO[s.estado] ?? s.estado;
    q<HTMLElement>('.bitacora').replaceChildren(...s.avance.map((l) => html`<li><iswc-relative-time date=${l.fh} format="short"></iswc-relative-time> ${l.texto}</li>`));
  };
  const enviar = async () => {
    const texto = q<Campo>('#texto').value?.trim() ?? '';
    codigo = q<Campo>('#codigo').value ?? codigo;
    if (!texto && !adjuntos.length) return fallo('Cuenta qué pasó o adjunta una captura o una nota de voz.');
    const boton = q('#enviar');
    boton.toggleAttribute('loading', true);
    try {
      const r = await (await cargar()).enviarReporte(texto, adjuntos, codigo);
      adjuntos = [];
      pintarAdjuntos();
      q<Campo>('#texto').value = '';
      q<HTMLElement>('.formulario').hidden = true;
      q<HTMLElement>('.enviado').hidden = false;
      q<HTMLElement>('#enviar').hidden = true;
      q('.numero').textContent = `#${r.ierror}`;
      q('.estado').textContent = ETIQUETA_ESTADO[r.estado] ?? r.estado;
      q<HTMLElement>('.bitacora').replaceChildren();
      q<HTMLElement>('#actualizar').onclick = () => void verSeguimiento(r).catch((err: unknown) => avisar(mensajeDe(err), 'danger'));
    } catch (err) {
      const m = mensajeDe(err);
      if (/código|incorrecto/i.test(m)) q<HTMLElement>('#codigo').hidden = false;
      fallo(m);
    } finally {
      boton.toggleAttribute('loading', false);
    }
  };
  root.append(html`
    <iswc-button class="flotante" part="boton" variant="outlined compact" color="neutral" aria-label="Reportar un error" title="Reportar un error" oniswc-click=${() => void abrir()}>
      <iswc-icon icon="mdi:bug-outline"></iswc-icon>
    </iswc-button>
    <iswc-dialog id="dialogo" label="Reportar un error" backdrop-variant="basic">
      <div class="formulario" part="formulario" onpaste=${(e: ClipboardEvent) => agregar([...(e.clipboardData?.files ?? [])].filter((f) => f.type.startsWith('image/')))}>
        <iswc-textarea id="texto" label="¿Qué pasó?" rows="4" placeholder="Qué hacías, qué esperabas y qué ocurrió"></iswc-textarea>
        <div class="acciones">
          <iswc-button id="capturar" variant="outlined compact" color="neutral" hidden oniswc-click=${() => void capturar()}><iswc-icon slot="start" icon="mdi:monitor-screenshot"></iswc-icon>Capturar pantalla</iswc-button>
          <iswc-button variant="outlined compact" color="neutral" oniswc-click=${() => q<HTMLInputElement>('.archivo').click()}><iswc-icon slot="start" icon="mdi:image-plus-outline"></iswc-icon>Imagen</iswc-button>
          <iswc-button id="grabar" variant="outlined compact" color="neutral" oniswc-click=${() => void grabar()}><iswc-icon slot="start" icon="mdi:microphone-outline"></iswc-icon>Nota de voz</iswc-button>
          <input class="archivo" type="file" accept="image/*,audio/*" multiple hidden onchange=${(e: Event) => { const c = e.currentTarget as HTMLInputElement; agregar([...(c.files ?? [])]); c.value = ''; }}>
        </div>
        <ul class="adjuntos"></ul>
        <iswc-input id="codigo" type="password" autocomplete="off" label="Código de reporte" hidden></iswc-input>
        <p class="nota">Se envía también el contenido de esta página y los últimos errores del navegador, sin contraseñas.</p>
      </div>
      <div class="enviado" hidden>
        <p>Reporte <strong class="numero"></strong> recibido. <span class="estado"></span>.</p>
        <ul class="bitacora"></ul>
        <iswc-button id="actualizar" variant="outlined compact" color="neutral"><iswc-icon slot="start" icon="mdi:refresh"></iswc-icon>Ver avance</iswc-button>
      </div>
      <p class="error" role="alert" hidden></p>
      <iswc-button slot="footer" variant="outlined compact" color="neutral" oniswc-click=${() => (q<Dialogo>('#dialogo').open = false)}>Cerrar</iswc-button>
      <iswc-button slot="footer" id="enviar" variant="compact" color="brand" oniswc-click=${() => void enviar()}>Enviar</iswc-button>
    </iswc-dialog>
  `);
});

define('av-reporte', AvReporte);
