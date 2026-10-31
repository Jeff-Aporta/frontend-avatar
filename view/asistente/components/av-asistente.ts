/**
 * <av-asistente> — shell del chat con AVO (`/asistente/`): carga el historial (`controller('consultas').query`), pinta los
 * turnos con `av-avo-mensaje`, envía la pregunta con `dominio()['preguntar']({ pregunta, iempresa })` y ofrece las
 * sugerencias de la última respuesta como chips que envían esa pregunta.
 */
import { crearComponente, define, html } from '../../../src/js/base/componente.js';
import { z } from '../../../src/js/base/zod.js';
import { RespuestaAsistenteSchema } from '../../../src/js/consts/schemas/api.schemas.js';
import { type AvAsistenteProps, ConsultaSchema } from '../../../src/js/consts/schemas/asistente.schemas.js';
import { controller, dominio, mensajeDe } from '../../../src/js/core/api.js';
import { empresaActiva, estado } from '../../../src/js/core/estado.js';
import { idLocal, preguntaValida, SUGERENCIAS_INICIALES, turnosDe } from '../utils/avo.js';
import './av-avo-mensaje.js';

type ConProps = HTMLElement & { props: Record<string, unknown> };
type AreaEl = HTMLElement & { value: string; focus(): void };
/** Host con `props` que se lee completo y se escribe parcial (mezcla con lo anterior). */
type Host = HTMLElement & { get props(): AvAsistenteProps; set props(v: Partial<AvAsistenteProps>) };

const AvAsistente = crearComponente<AvAsistenteProps>(
  import.meta.url,
  'av-asistente',
  { id: null, version: 0, turnos: [], sugerencias: [], pensando: false, cargando: true, error: '' },
  (root, props, host) => {
    const h = host as unknown as Host;
    const nombre = estado.yo?.nombre ?? estado.yo?.iusuario ?? '';
    const preguntar = async (texto: string) => {
      const pregunta = preguntaValida(texto);
      if (!pregunta || h.props.pensando) return;
      const ahora = new Date().toISOString();
      h.props = { turnos: [...h.props.turnos, { id: idLocal('p'), quien: 'yo', texto: pregunta, creado: ahora }], pensando: true, error: '' };
      try {
        const iempresa = empresaActiva();
        const r = RespuestaAsistenteSchema.safeParse(await dominio()['preguntar'](iempresa ? { pregunta, iempresa } : { pregunta }));
        if (!r.success) throw new Error('Respuesta de AVO con forma inesperada');
        h.props = { turnos: [...h.props.turnos, { id: `r-${r.data.iconsulta}`, quien: 'avo', texto: r.data.respuesta, creado: new Date().toISOString() }], sugerencias: r.data.sugerencias, pensando: false };
      } catch (err) {
        h.props = { pensando: false, error: mensajeDe(err) };
      }
    };
    const enviar = () => {
      const a = root.querySelector('#pregunta') as AreaEl | null;
      if (!a) return;
      const texto = a.value;
      a.value = '';
      void preguntar(texto);
    };
    const teclas = (e: Event) => {
      const k = e as KeyboardEvent;
      if (k.key === 'Enter' && !k.shiftKey && !k.isComposing) {
        k.preventDefault();
        enviar();
      }
    };
    const sugerencias = props.sugerencias.length ? props.sugerencias : SUGERENCIAS_INICIALES;
    root.append(html`
      <div class="pagina" part="pagina">
        <av-cabecera id="cabecera"></av-cabecera>
        ${props.error ? html`<iswc-callout tone="danger"><strong slot="title">AVO no pudo responder</strong>${props.error}</iswc-callout>` : null}
        <section class="chat" part="chat">
          <div class="turnos" id="turnos" part="turnos">
            ${props.cargando
              ? html`<av-vacio id="cargando"></av-vacio>`
              : props.turnos.length === 0
              ? html`<av-vacio id="bienvenida"></av-vacio>`
              : props.turnos.map((t) => {
                const el = document.createElement('av-avo-mensaje') as ConProps;
                el.props = { turno: t, nombre };
                return el;
              })}
            ${props.pensando ? html`<div class="pensando"><iswc-spinner></iswc-spinner><span>AVO está pensando…</span></div>` : null}
          </div>
          <div class="sugerencias" part="sugerencias">
            ${sugerencias.map((s) => html`<iswc-button class="sugerencia" variant="outlined" color="neutral" pill ?disabled=${props.pensando} oniswc-click=${() => void preguntar(s)}>${s}</iswc-button>`)}
          </div>
          <div class="redactor" part="redactor">
            <iswc-textarea id="pregunta" class="area" autosize min-rows="1" max-rows="5" placeholder="Pregúntale a AVO… (Enter envía)" ?disabled=${props.pensando} onkeydown=${teclas}></iswc-textarea>
            <iswc-button id="enviar" color="brand" ?loading=${props.pensando} oniswc-click=${enviar} title="Preguntar"><iswc-icon icon="mdi:send"></iswc-icon></iswc-button>
          </div>
        </section>
      </div>
    `);
    (root.querySelector('#cabecera') as ConProps).props = { titulo: 'Asistente AVO', subtitulo: 'Responde con los datos reales de tu empresa y te guía por Avatar', icono: 'mdi:robot-outline' };
    const cargando = root.querySelector('#cargando') as ConProps | null;
    if (cargando) cargando.props = { estado: 'cargando' };
    const bienvenida = root.querySelector('#bienvenida') as ConProps | null;
    if (bienvenida) bienvenida.props = { icono: 'mdi:robot-happy-outline', titulo: `Hola${nombre ? `, ${nombre}` : ''}. Soy AVO`, texto: 'Pregúntame por tareas, clientes, canales o miembros de tu empresa, o elige una sugerencia.' };
    const caja = root.querySelector('#turnos');
    if (caja) requestAnimationFrame(() => caja.scrollTo({ top: caja.scrollHeight }));
    if (!props.cargando) return;
    void (async () => {
      try {
        const filas = await controller('consultas').query({ orderBy: '-creado', pageSize: 20 }, { include: {} });
        const r = z.array(ConsultaSchema).safeParse(filas.map((f: { toJSON?: () => unknown }) => (typeof f.toJSON === 'function' ? f.toJSON() : f)));
        h.props = { turnos: r.success ? turnosDe(r.data) : [], cargando: false };
      } catch {
        h.props = { turnos: [], cargando: false };
      }
    })();
  },
);

define('av-asistente', AvAsistente);
