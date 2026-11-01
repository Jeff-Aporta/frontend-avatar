/**
 * <av-chat-tema> — tema del chat: muestras predefinidas, el de la app y uno propio con dos colores y ángulo. Cambia para
 * todos los integrantes. Emite `av-chat-tema { tema }` (`null` vuelve al de la app).
 */
import { crearComponente, define, emitir, html } from '../../base/componente.js';
import type { AvChatTemaProps } from '../../consts/schemas/chat.schemas.js';
import { coloresDe, degradado, TEMAS } from '../../chat/temas.js';

type Campo = HTMLElement & { value: string };

const AvChatTema = crearComponente<AvChatTemaProps>(import.meta.url, 'av-chat-tema', { tema: null }, (root, props, host) => {
  const actual = props.tema?.id ?? '';
  const propio = coloresDe(props.tema) ?? TEMAS[0]!;
  const elegir = (tema: AvChatTemaProps['tema']) => emitir(host, 'av-chat-tema', { tema });
  const leer = (id: string) => (root.querySelector(`#${id}`) as Campo).value;
  const aplicarPropio = () => elegir({ id: 'propio', color1: leer('color1'), color2: leer('color2'), angulo: Number(leer('angulo')) || 135 });
  root.append(html`
    <section class="tema" part="tema">
      <iswc-heading class="titulo" level="4">Tema del chat</iswc-heading>
      <div class="muestras" role="group" aria-label="Tema del chat">
        <iswc-button class="muestra app" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(!props.tema)} title="Tema de la app" oniswc-click=${() => elegir(null)}>App</iswc-button>
        ${TEMAS.map((t) => html`<iswc-button class="muestra" variant="glyph" color="neutral" shape="pill" aria-pressed=${String(actual === t.id)} title=${t.nombre} aria-label=${t.nombre} style=${`--fondo:${degradado(t)}`} oniswc-click=${() => elegir({ id: t.id })}></iswc-button>`)}
      </div>
      <iswc-details class="propio" variant="plain" summary="Personalizar" ?open=${actual === 'propio'}>
        <div class="campos">
          <iswc-color-picker id="color1" label="Color 1" value=${propio.color1}></iswc-color-picker>
          <iswc-color-picker id="color2" label="Color 2" value=${propio.color2}></iswc-color-picker>
          <iswc-input id="angulo" type="number" min="0" max="360" step="15" label="Ángulo" value=${String(propio.angulo)}></iswc-input>
          <iswc-button variant="compact" color="brand" oniswc-click=${aplicarPropio}>Aplicar</iswc-button>
        </div>
      </iswc-details>
    </section>
  `);
});

define('av-chat-tema', AvChatTema);
