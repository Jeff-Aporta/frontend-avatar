// chat.test.ts — núcleo del chat sin navegador (W-CHAT-46), sobre lo PUBLICADO en dist/cdn: reductor, formato ligero,
// agrupación, marcas de lectura, lista, cola local, sala con reconexión y el backend demo entre dos instancias.
//
//   W-CHAT-03  fijados arriba y luego por actividad          W-CHAT-04  filtros rápidos y búsqueda por nombre o persona
//   W-CHAT-08  estado «en línea» / «últ. vez»                W-CHAT-09  días y ráfagas de 5 minutos por autor
//   W-CHAT-10  línea de no leídos (solo ajenos)              W-CHAT-15  formato ligero saneado y emojis grandes
//   W-CHAT-16  texto vacío o > 4000 no se envía              W-CHAT-17  pendiente → enviado → entregado → leído (grupos: todos)
//   W-CHAT-18  cola local que sobrevive a recargar           W-CHAT-24  reacción única por persona (reemplaza / quita)
//   W-CHAT-25  editar propios de texto 15 min                W-CHAT-26  eliminar para mí / para todos (1 h)
//   W-CHAT-30  dos fronts conversan en tiempo real           W-CHAT-32  reconexión exponencial y cola de salida
//   W-CHAT-33  búsqueda por texto y por significado          W-CHAT-38  texto del mensaje de llamada
//   W-CHAT-42  idempotencia por clave y mensajes fuera de orden
//   W-CHAT-43  archivo grande o bloqueado se rechaza antes   W-CHAT-45  quien no es integrante no recibe eventos
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const E = await import('../../dist/cdn/js/chat/estado.js');
const F = await import('../../dist/cdn/js/chat/formato.js');
const { TEXTOS_ES } = await import('../../dist/cdn/js/chat/textos.js');
const { crearCola } = await import('../../dist/cdn/js/chat/cola.js');
const { Sala, retardo } = await import('../../dist/cdn/js/chat/sala.js');
const { crearBackendDemo, semilla, similitudLexica } = await import('../../dist/cdn/js/chat/backend-demo.js');

type M = Record<string, unknown> & { clave: string; ts: string; autor: string };
const AHORA = Date.parse('2026-10-30T15:00:00Z');
const hace = (min: number) => new Date(AHORA - min * 60000).toISOString();
const vacia = { hasta: null, cuando: null };
const chat = (id: string, extra: Record<string, unknown> = {}) => ({
  id, tipo: 'directo', nombre: '', descripcion: '', foto: null, miembros: [{ id: 'ana', rol: 'miembro' }, { id: 'beto', rol: 'miembro' }], fijado: false, silenciado: false,
  archivado: false, marcadoNoLeido: false, noLeidos: 0, mensajeFijado: null, actividad: hace(60), creado: hace(600), lecturas: {}, ultimo: null, ...extra,
});
const msg = (clave: string, autor: string, min: number, extra: Record<string, unknown> = {}): M => ({
  clave, id: null, chat: 'c1', autor, tipo: 'texto', texto: `m ${clave}`, ts: hace(min), editado: null, eliminado: false, reenviado: false, respuestaA: null, adjunto: null,
  reacciones: [], estado: 'enviado', progreso: null, destacado: false, oculto: false, meta: {}, ...extra,
});
const base = (yo = 'ana', chats = [chat('c1')]) => E.reducir(E.estadoInicial(yo), { tipo: 'inicio', yo, usuarios: [], chats });
const lectura = (hasta: string) => ({ entregado: { hasta, cuando: hasta }, leido: { hasta, cuando: hasta } });

/** Bus en memoria que imita BroadcastChannel entre instancias del demo (asíncrono, como el real). */
function bus() {
  const canales: Array<{ onmessage: ((ev: { data: unknown }) => void) | null; postMessage(d: unknown): void; close(): void }> = [];
  return (_nombre: string) => {
    const c = {
      onmessage: null as ((ev: { data: unknown }) => void) | null,
      postMessage(d: unknown) {
        for (const o of canales) if (o !== c) queueMicrotask(() => o.onmessage?.({ data: structuredClone(d) }));
      },
      close() {
        canales.splice(canales.indexOf(c), 1);
      },
    };
    canales.push(c);
    return c;
  };
}
const esperar = (ms = 20) => new Promise((r) => setTimeout(r, ms));

export default definirPruebas([
  {
    nombre: 'chat W-CHAT-17 enviar optimista → confirmado → entregado → leído',
    categoria: 'what',
    correr({ eq }) {
      let e = base();
      const m = msg('k1', 'ana', 1, { estado: 'pendiente' });
      e = E.reducir(e, { tipo: 'mensaje', mensaje: m });
      const marca = () => F.marcaDe(e.mensajes['c1'][0], e.chats['c1'], 'ana');
      eq('pendiente (reloj)', marca(), 'pendiente');
      e = E.reducir(e, { tipo: 'mensaje.confirmado', chat: 'c1', clave: 'k1', id: '77', ts: m.ts });
      eq('enviado ✓', marca(), 'enviado');
      eq('id del servidor', e.mensajes['c1'][0].id, '77');
      e = E.reducir(e, { tipo: 'entregado', chat: 'c1', usuario: 'beto', hasta: m.ts, cuando: hace(0) });
      eq('entregado ✓✓', marca(), 'entregado');
      e = E.reducir(e, { tipo: 'leido', chat: 'c1', usuario: 'beto', hasta: m.ts, cuando: hace(0) });
      eq('leído ✓✓ color', marca(), 'leido');
      e = E.reducir(e, { tipo: 'mensaje.fallido', chat: 'c1', clave: 'k1' });
      eq('fallido', marca(), 'fallido');
    },
  },
  {
    nombre: 'chat W-CHAT-17 en grupos «leído» exige a todos los integrantes',
    categoria: 'what',
    correr({ eq }) {
      const g = chat('c1', { tipo: 'grupo', miembros: ['ana', 'beto', 'carla'].map((id) => ({ id, rol: 'miembro' })) });
      const m = msg('k', 'ana', 2);
      const c1 = { ...g, lecturas: { beto: lectura(m.ts) } };
      eq('falta carla: enviado', F.marcaDe(m, c1, 'ana'), 'enviado');
      const c2 = { ...g, lecturas: { beto: lectura(m.ts), carla: { entregado: { hasta: m.ts, cuando: m.ts }, leido: vacia } } };
      eq('todos recibieron: entregado', F.marcaDe(m, c2, 'ana'), 'entregado');
      const c3 = { ...g, lecturas: { beto: lectura(m.ts), carla: lectura(m.ts) } };
      eq('todos leyeron: leído', F.marcaDe(m, c3, 'ana'), 'leido');
      eq('ajenos sin marca', F.marcaDe({ ...m, autor: 'beto' }, c3, 'ana'), null);
      eq('llamadas sin marca', F.marcaDe({ ...m, tipo: 'llamada' }, c3, 'ana'), null);
    },
  },
  {
    nombre: 'chat W-CHAT-24 una reacción por persona: otra la reemplaza, la misma se quita',
    categoria: 'what',
    correr({ eq }) {
      let e = E.reducir(base(), { tipo: 'mensaje', mensaje: msg('k', 'beto', 3) });
      const r = (emoji: string | null, usuario = 'ana') => (e = E.reducir(e, { tipo: 'reaccion', chat: 'c1', ref: 'k', usuario, emoji }));
      r('👍');
      r('❤️', 'beto');
      r('😂');
      eq('reemplaza la de ana', e.mensajes['c1'][0].reacciones, [{ usuario: 'beto', emoji: '❤️' }, { usuario: 'ana', emoji: '😂' }]);
      r(null);
      eq('quitar deja solo la de beto', e.mensajes['c1'][0].reacciones, [{ usuario: 'beto', emoji: '❤️' }]);
    },
  },
  {
    nombre: 'chat W-CHAT-25 editar: propios de texto, 15 minutos y queda «editado»',
    categoria: 'what',
    correr({ eq, expect }) {
      const m = msg('k', 'ana', 10);
      expect('propio reciente se edita', F.puedeEditar(m, 'ana', AHORA));
      expect('ajeno no', !F.puedeEditar(m, 'beto', AHORA));
      expect('pasados 15 min no', !F.puedeEditar(msg('v', 'ana', 16), 'ana', AHORA));
      expect('archivos no', !F.puedeEditar({ ...m, tipo: 'imagen' }, 'ana', AHORA));
      let e = E.reducir(base(), { tipo: 'mensaje', mensaje: m });
      e = E.reducir(e, { tipo: 'mensaje.editado', chat: 'c1', ref: 'k', texto: 'nuevo', editado: hace(0) });
      eq('texto', e.mensajes['c1'][0].texto, 'nuevo');
      expect('marca editado', !!e.mensajes['c1'][0].editado);
      eq('la lista refleja la edición', e.chats['c1'].ultimo?.texto, 'nuevo');
    },
  },
  {
    nombre: 'chat W-CHAT-26 eliminar para mí lo oculta; para todos lo reemplaza (propios, 1 hora)',
    categoria: 'what',
    correr({ eq, expect }) {
      let e = E.reducir(base(), { tipo: 'mensaje', mensaje: msg('a', 'beto', 5) });
      e = E.reducir(e, { tipo: 'mensaje', mensaje: msg('b', 'ana', 4, { texto: 'secreto', reacciones: [{ usuario: 'beto', emoji: '👍' }] }) });
      e = E.reducir(e, { tipo: 'mensaje.eliminado', chat: 'c1', ref: 'a', paraTodos: false });
      expect('oculto para mí', e.mensajes['c1'][0].oculto);
      e = E.reducir(e, { tipo: 'mensaje.eliminado', chat: 'c1', ref: 'b', paraTodos: true });
      const b = e.mensajes['c1'][1];
      expect('eliminado para todos', b.eliminado && b.texto === '' && b.reacciones.length === 0);
      eq('agrupar no muestra el oculto', F.agrupar(e.mensajes['c1'], { t: TEXTOS_ES }).filter((i: { tipo: string }) => i.tipo === 'mensaje').length, 1);
      expect('propio dentro de 1 h', F.puedeEliminarParaTodos(msg('x', 'ana', 59), 'ana', AHORA));
      expect('propio pasada 1 h no', !F.puedeEliminarParaTodos(msg('x', 'ana', 61), 'ana', AHORA));
      expect('ajeno no', !F.puedeEliminarParaTodos(msg('x', 'beto', 1), 'ana', AHORA));
    },
  },
  {
    nombre: 'chat W-CHAT-42 idempotente por clave y ordena los que llegan fuera de orden',
    categoria: 'what',
    correr({ eq }) {
      let e = base();
      for (const m of [msg('c', 'beto', 1), msg('a', 'beto', 3), msg('b', 'ana', 2), msg('a', 'beto', 3)]) e = E.reducir(e, { tipo: 'mensaje', mensaje: m });
      eq('sin duplicados y en orden', e.mensajes['c1'].map((m: M) => m.clave), ['a', 'b', 'c']);
      e = E.reducir(e, { tipo: 'historial', chat: 'c1', mensajes: [msg('z', 'beto', 9), msg('a', 'beto', 3)], hayMas: true });
      eq('historial fusiona', e.mensajes['c1'].map((m: M) => m.clave), ['z', 'a', 'b', 'c']);
      eq('hay más', e.hayMas['c1'], true);
      e = E.reducir(e, { tipo: 'mensaje', mensaje: msg('srv', 'beto', 3, { id: '9' }) });
      e = E.reducir(e, { tipo: 'mensaje', mensaje: msg('otra-clave', 'beto', 3, { id: '9' }) });
      eq('mismo id del servidor no se duplica', e.mensajes['c1'].filter((m: M) => m.id === '9').length, 1);
    },
  },
  {
    nombre: 'chat W-CHAT-15 formato ligero saneado y emojis grandes',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('negrita/cursiva/tachado', F.formatearHtml('*hola* _mundo_ ~viejo~'), '<strong>hola</strong> <em>mundo</em> <s>viejo</s>');
      eq('código', F.formatearHtml('usa `npm i`'), 'usa <code class="codigo">npm i</code>');
      expect('bloque', F.formatearHtml('```\nx = 1\n```').includes('<pre class="bloque"><code>x = 1</code></pre>'));
      expect('enlace clicable', F.formatearHtml('ver https://odys.co/a?b=1').includes('<a class="enlace" href="https://odys.co/a?b=1" target="_blank" rel="noopener noreferrer">'));
      expect('mención', F.formatearHtml('hola @Beto').includes('<span class="mencion">@Beto</span>'));
      eq('HTML escapado (nada se inyecta)', F.formatearHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
      eq('sin formato dentro de código', F.formatearHtml('`*no*`'), '<code class="codigo">*no*</code>');
      eq('correo no es mención', F.formatearHtml('a@b.co'), 'a@b.co');
      eq('1 emoji', F.soloEmojis('👍'), 1);
      eq('3 emojis (con ZWJ)', F.soloEmojis('👩‍💻 🎉 ❤️'), 3);
      eq('4 no', F.soloEmojis('😀😀😀😀'), 0);
      eq('texto no', F.soloEmojis('ok 👍'), 0);
      eq('vista previa sin marcas', F.sinFormato('*Hola* _equipo_'), 'Hola equipo');
    },
  },
  {
    nombre: 'chat W-CHAT-09 agrupa por día y por autor en ráfagas de 5 minutos',
    categoria: 'what',
    correr({ eq }) {
      const ayer = new Date(AHORA - 86400000).toISOString();
      const ms = [msg('a', 'beto', 0, { ts: ayer }), msg('b', 'beto', 30), msg('c', 'beto', 27), msg('d', 'beto', 20), msg('e', 'ana', 19), msg('s', 'ana', 18, { tipo: 'sistema' }), msg('f', 'ana', 17)];
      const items = F.agrupar(ms, { t: TEXTOS_ES, hoy: new Date(AHORA) });
      eq('tipos', items.map((i: { tipo: string }) => i.tipo), ['dia', 'mensaje', 'dia', 'mensaje', 'mensaje', 'mensaje', 'mensaje', 'mensaje', 'mensaje']);
      eq('rótulos', items.filter((i: { tipo: string }) => i.tipo === 'dia').map((i: { rotulo: string }) => i.rotulo), ['Ayer', 'Hoy']);
      const flags = items.filter((i: { tipo: string }) => i.tipo === 'mensaje').map((i: { primero: boolean; ultimo: boolean; mensaje: M }) => `${i.mensaje.clave}${i.primero ? '^' : ''}${i.ultimo ? '$' : ''}`);
      eq('ráfagas (^ abre, $ cierra)', flags, ['a^$', 'b^', 'c$', 'd^$', 'e^$', 's^$', 'f^$']);
    },
  },
  {
    nombre: 'chat W-CHAT-10 línea de no leídos en el primer ajeno sin leer, contando solo ajenos',
    categoria: 'what',
    correr({ eq }) {
      let e = base('ana', [chat('c1', { lecturas: { ana: lectura(hace(10)) } })]);
      e = E.reducir(e, { tipo: 'historial', chat: 'c1', mensajes: [msg('a', 'beto', 12), msg('b', 'beto', 8), msg('c', 'beto', 7)], hayMas: false });
      e = E.reducir(e, { tipo: 'chat', chat: { id: 'c1', noLeidos: 2 } });
      eq('primer no leído', E.primerNoLeido(e, 'c1'), 'b');
      e = E.reducir(e, { tipo: 'mensaje', mensaje: msg('d', 'ana', 1) });
      const linea = F.agrupar(e.mensajes['c1'], { primerNoLeido: 'b', t: TEXTOS_ES, yo: 'ana' }).find((i: { tipo: string }) => i.tipo === 'noleidos');
      eq('cuenta 2 (no el propio)', linea?.n, 2);
      e = E.reducir(e, { tipo: 'leido', chat: 'c1', usuario: 'ana', hasta: hace(1), cuando: hace(0) });
      eq('leer limpia el contador', e.chats['c1'].noLeidos, 0);
      eq('sin no leídos, sin línea', E.primerNoLeido(e, 'c1'), null);
    },
  },
  {
    nombre: 'chat W-CHAT-03 fijados arriba y luego por actividad reciente',
    categoria: 'what',
    correr({ eq }) {
      const lista = [chat('a', { actividad: hace(30) }), chat('b', { actividad: hace(5) }), chat('c', { actividad: hace(90), fijado: true }), chat('d', { actividad: hace(1) })];
      eq('orden', E.ordenarChats(lista).map((c: { id: string }) => c.id), ['c', 'd', 'b', 'a']);
      let e = base('ana', lista);
      e = E.reducir(e, { tipo: 'mensaje', mensaje: { ...msg('n', 'beto', 0), chat: 'a' } });
      eq('un mensaje nuevo sube el chat', E.ordenarChats(Object.values(e.chats)).map((c: { id: string }) => c.id), ['c', 'a', 'd', 'b']);
      eq('y cuenta como no leído', e.chats['a'].noLeidos, 1);
    },
  },
  {
    nombre: 'chat W-CHAT-04 filtros Todos/No leídos/Grupos/Directos, archivados aparte y búsqueda por persona',
    categoria: 'what',
    correr({ eq }) {
      const usuarios = { ana: { id: 'ana', nombre: 'Ana Torres' }, beto: { id: 'beto', nombre: 'Beto Ruiz' }, carla: { id: 'carla', nombre: 'Carla Gómez' } };
      const lista = [
        chat('d1', { actividad: hace(1) }),
        chat('g1', { tipo: 'grupo', nombre: 'Diseño', miembros: [{ id: 'ana', rol: 'admin' }, { id: 'carla', rol: 'miembro' }], noLeidos: 3, actividad: hace(2) }),
        chat('x', { tipo: 'grupo', nombre: 'Viejo', archivado: true }),
      ];
      const f = (filtro: string, q = '', archivados = false) => E.filtrarChats(lista, { filtro, q, archivados, usuarios, yo: 'ana' }).map((c: { id: string }) => c.id);
      eq('todos sin archivados', f('todos'), ['d1', 'g1']);
      eq('no leídos', f('noleidos'), ['g1']);
      eq('grupos', f('grupos'), ['g1']);
      eq('directos', f('directos'), ['d1']);
      eq('archivados', f('todos', '', true), ['x']);
      eq('por persona (sin tildes)', f('todos', 'gomez'), ['g1']);
      eq('directo por el nombre del otro', f('todos', 'beto'), ['d1']);
      eq('nombre de un directo', E.nombreChat(lista[0], usuarios, 'ana'), 'Beto Ruiz');
    },
  },
  {
    nombre: 'chat W-CHAT-16 W-CHAT-43 validación de texto y archivos antes de enviar',
    categoria: 'what',
    correr({ eq }) {
      eq('recorta', F.validarTexto('  hola '), 'hola');
      eq('vacío', F.validarTexto('   '), null);
      eq('> 4000', F.validarTexto('x'.repeat(4001)), null);
      eq('4000 justo', F.validarTexto('x'.repeat(4000))?.length, 4000);
      eq('archivo ok', F.validarArchivo({ name: 'a.pdf', size: 1000 }, TEXTOS_ES), null);
      eq('más de 25 MB', F.validarArchivo({ name: 'a.zip', size: 26 * 1024 * 1024 }, TEXTOS_ES), TEXTOS_ES.archivoGrande(25));
      eq('tipo bloqueado', F.validarArchivo({ name: 'setup.EXE', size: 10 }, TEXTOS_ES), TEXTOS_ES.archivoBloqueado);
      eq('tipo por mime', [F.tipoDeMime('image/png'), F.tipoDeMime('video/mp4'), F.tipoDeMime('audio/webm'), F.tipoDeMime('application/pdf')], ['imagen', 'video', 'audio', 'archivo']);
    },
  },
  {
    nombre: 'chat W-CHAT-18 la cola local guarda lo pendiente y sobrevive a recargar',
    categoria: 'what',
    correr({ eq }) {
      const mem = new Map<string, string>();
      const almacen: Storage = { length: 0, key: () => null, clear: () => mem.clear(), getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
      const cola = crearCola('ana', almacen);
      cola.poner({ clave: 'k1', chat: 'c1', tipo: 'texto', texto: 'hola', respuestaA: null, adjunto: null, reenviado: false, meta: {}, ts: hace(1), autor: 'ana' });
      cola.poner({ clave: 'k2', chat: 'c1', tipo: 'texto', texto: 'chao', respuestaA: null, adjunto: null, reenviado: false, meta: {}, ts: hace(0), autor: 'ana' });
      const recargada = crearCola('ana', almacen);
      eq('tras recargar siguen', recargada.leer().map((p: { clave: string }) => p.clave), ['k1', 'k2']);
      recargada.intento('k1');
      recargada.quitar('k2');
      eq('confirmado sale; intento cuenta', recargada.leer().map((p: { clave: string; intentos: number }) => [p.clave, p.intentos]), [['k1', 1]]);
      eq('otro usuario no la ve', crearCola('beto', almacen).leer().length, 0);
      eq('sin almacenamiento funciona en memoria', (() => { const c = crearCola('x', null); c.poner({ clave: 'z', chat: 'c', tipo: 'texto', texto: 't', respuestaA: null, adjunto: null, reenviado: false, meta: {}, ts: hace(0), autor: 'x' }); return c.leer().length; })(), 1);
    },
  },
  {
    nombre: 'chat W-CHAT-32 reconexión exponencial con tope y cola de salida al volver',
    categoria: 'what',
    async correr({ eq, expect }) {
      eq('retardos sin azar', [0, 1, 2, 3, 10].map((n) => retardo(n, 500, 15000, () => 0)), [500, 1000, 2000, 4000, 15000]);
      expect('azar hasta +20 %', retardo(1, 500, 15000, () => 1) === 1200);
      const sockets: Array<{ readyState: number; enviados: string[]; send(d: string): void; close(): void; onopen: ((e: unknown) => void) | null; onclose: ((e: unknown) => void) | null; onerror: ((e: unknown) => void) | null; onmessage: ((e: { data: unknown }) => void) | null }> = [];
      const estados: string[] = [];
      let reconecto = 0;
      const recibidos: unknown[] = [];
      const sala = new Sala({
        url: async () => 'wss://sala/test',
        crearSocket: () => {
          const s = { readyState: 0, enviados: [] as string[], send(d: string) { this.enviados.push(d); }, close() { this.readyState = 3; }, onopen: null, onclose: null, onerror: null, onmessage: null };
          sockets.push(s);
          return s;
        },
        alMensaje: (d: unknown) => recibidos.push(d),
        alEstado: (e: string) => estados.push(e),
        alReconectar: () => reconecto++,
        retardoBase: 5,
        retardoMax: 20,
        azar: () => 0,
        latidoMs: 60000,
      });
      sala.enviar({ tipo: 'mensaje.nuevo', datos: 1 });
      sala.conectar();
      await esperar(5);
      const s1 = sockets[0]!;
      s1.readyState = 1;
      s1.onopen?.({});
      eq('la cola sale al conectar', s1.enviados, [JSON.stringify({ tipo: 'mensaje.nuevo', datos: 1 })]);
      s1.onmessage?.({ data: JSON.stringify({ tipo: 'escribiendo', de: 'beto' }) });
      eq('entrega lo recibido', recibidos, [{ tipo: 'escribiendo', de: 'beto' }]);
      s1.readyState = 3;
      s1.onclose?.({});
      sala.enviar({ tipo: 'leido', datos: 2 });
      sala.enviar({ tipo: 'escribiendo' }, false);
      await esperar(30);
      const s2 = sockets[1]!;
      expect('reintentó', !!s2);
      s2.readyState = 1;
      s2.onopen?.({});
      eq('al volver manda lo encolado (no lo efímero)', s2.enviados, [JSON.stringify({ tipo: 'leido', datos: 2 })]);
      eq('avisa la reconexión (pedir lo que faltó)', reconecto, 1);
      expect('pasó por «conectando»', estados.includes('conectando') && estados.at(-1) === 'conectado');
      sala.cerrar();
      eq('cerrada', sala.estado, 'desconectado');
    },
  },
  {
    nombre: 'chat W-CHAT-30 dos fronts del demo conversan en tiempo real (mensaje, escribiendo, reacción, lectura)',
    categoria: 'what',
    async correr({ eq, expect }) {
      const crear = bus();
      const mem = new Map<string, string>();
      const almacen: Storage = { length: 0, key: () => null, clear: () => mem.clear(), getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
      const ana = crearBackendDemo({ yo: 'ana', crearCanal: crear, vivo: false, almacen });
      const beto = crearBackendDemo({ yo: 'beto', crearCanal: crear, vivo: false, almacen: null });
      const vistos: Array<{ tipo: string }> = [];
      beto.suscribir((e: { tipo: string }) => vistos.push(e));
      const ini = await beto.iniciar();
      expect('beto ve sus chats', ini.chats.some((c: { id: string }) => c.id === 'd-ana-beto'));
      ana.escribiendo('d-ana-beto', 'texto');
      const r = await ana.enviar({ clave: 'kk1', chat: 'd-ana-beto', tipo: 'texto', texto: 'hola beto', respuestaA: null, adjunto: null, reenviado: false, meta: {} });
      expect('confirma con id y ts', !!r.id && !!r.ts);
      await esperar();
      expect('le llegó «escribiendo»', vistos.some((e) => e.tipo === 'escribiendo'));
      const llego = vistos.find((e) => e.tipo === 'mensaje') as { mensaje: { texto: string; clave: string } } | undefined;
      eq('le llegó el mensaje', llego?.mensaje.texto, 'hola beto');
      const dup = await ana.enviar({ clave: 'kk1', chat: 'd-ana-beto', tipo: 'texto', texto: 'hola beto', respuestaA: null, adjunto: null, reenviado: false, meta: {} });
      eq('reenviar la misma clave no duplica (W-CHAT-42)', dup.id, r.id);
      const deAna: Array<{ tipo: string; usuario?: string; emoji?: string }> = [];
      ana.suscribir((e: { tipo: string }) => deAna.push(e));
      await beto.reaccionar('d-ana-beto', 'kk1', '❤️');
      await beto.leido('d-ana-beto', r.ts);
      await esperar();
      expect('ana ve la reacción', deAna.some((e) => e.tipo === 'reaccion' && e.emoji === '❤️'));
      expect('ana ve la lectura', deAna.some((e) => e.tipo === 'leido' && e.usuario === 'beto'));
      const h = await beto.historial('d-ana-beto');
      expect('queda en el historial', h.mensajes.some((m: { clave: string }) => m.clave === 'kk1'));
      ana.cerrar();
      beto.cerrar();
    },
  },
  {
    nombre: 'chat W-CHAT-45 quien no es integrante no ve el chat ni recibe sus eventos',
    categoria: 'what',
    async correr({ eq, expect }) {
      const crear = bus();
      const ana = crearBackendDemo({ yo: 'ana', crearCanal: crear, vivo: false, almacen: null });
      const elena = crearBackendDemo({ yo: 'elena', crearCanal: crear, vivo: false, almacen: null });
      const vistos: Array<{ tipo: string; chat?: string; mensaje?: { chat: string } }> = [];
      elena.suscribir((e: { tipo: string }) => vistos.push(e));
      const ini = await elena.iniciar();
      expect('elena no ve el directo de ana y beto', !ini.chats.some((c: { id: string }) => c.id === 'd-ana-beto'));
      await ana.enviar({ clave: 'priv', chat: 'd-ana-beto', tipo: 'texto', texto: 'privado', respuestaA: null, adjunto: null, reenviado: false, meta: {} });
      await esperar();
      eq('no le llega nada de ese chat', vistos.filter((e) => e.chat === 'd-ana-beto' || e.mensaje?.chat === 'd-ana-beto').length, 0);
      eq('ni el historial', (await elena.historial('d-ana-beto')).mensajes.length, 0);
      eq('ni la búsqueda', (await elena.buscar('privado', 'texto')).length, 0);
      ana.cerrar();
      elena.cerrar();
    },
  },
  {
    nombre: 'chat W-CHAT-33 busca por texto y por significado (demo léxico) solo en chats visibles',
    categoria: 'what',
    async correr({ expect }) {
      const ana = crearBackendDemo({ yo: 'ana', vivo: false, almacen: null, crearCanal: () => null });
      const texto = await ana.buscar('presupuesto', 'texto');
      expect('por palabra', texto.some((r: { texto: string }) => r.texto.includes('presupuesto')));
      const sem = await ana.buscar('reunión del lunes', 'semantica');
      expect('por significado encuentra «nos vemos el lunes»', sem.some((r: { texto: string }) => /vemos el lunes/.test(r.texto)));
      expect('similitud: sinónimos suman', similitudLexica('reunión', 'nos vemos mañana') > 0 && similitudLexica('reunión', 'factura pagada') === 0);
      const enChat = await ana.buscar('lunes', 'texto', 'p-general');
      expect('acotada a un chat', enChat.every((r: { chat: string }) => r.chat === 'p-general'));
      ana.cerrar();
    },
  },
  {
    nombre: 'chat W-CHAT-08 W-CHAT-38 textos de presencia y de llamadas',
    categoria: 'what',
    correr({ eq }) {
      const hoy = new Date(AHORA);
      const h = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      eq('en línea', F.textoPresencia({ enLinea: true, ultimaVez: null }, TEXTOS_ES, hoy), 'en línea');
      const antes = new Date(AHORA - 30 * 60000);
      eq('últ. vez hoy', F.textoPresencia({ enLinea: false, ultimaVez: antes.toISOString() }, TEXTOS_ES, hoy), `últ. vez hoy a las ${h(antes)}`);
      eq('llamada con duración', F.textoLlamada({ medio: 'voz', duracion: 192 }, TEXTOS_ES), 'Llamada de voz · 3:12');
      eq('videollamada perdida', F.textoLlamada({ medio: 'video', perdida: true }, TEXTOS_ES), 'Videollamada perdida');
      eq('iniciales', [F.iniciales('Ana Torres'), F.iniciales('Lucía (bot)'), F.iniciales('')], ['AT', 'LB', '?']);
      eq('color estable', F.colorDe('beto'), F.colorDe('beto'));
    },
  },
  {
    nombre: 'chat W-CHAT-39 la semilla del demo trae personas, grupos, directos y un canal público',
    categoria: 'what',
    correr({ expect }) {
      const s = semilla(AHORA);
      expect('personas de muestra', s.usuarios.length >= 5);
      expect('tipos de chat', ['directo', 'grupo', 'publico'].every((t) => s.chats.some((c: { tipo: string }) => c.tipo === t)));
      expect('un fijado y reacciones', s.chats.some((c: { mensajeFijado: string | null }) => !!c.mensajeFijado) && s.mensajes.some((m: { reacciones: unknown[] }) => m.reacciones.length > 0));
    },
  },
]);
