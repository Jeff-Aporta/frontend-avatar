// notificaciones.test.ts — tiempo real y avisos sin navegador, sobre lo PUBLICADO en dist/cdn: lista del centro, contadores,
// qué merece aviso, latido que detecta un socket muerto y el demo sobre una sala simulada (dos navegadores sin canal común).
//
//   W-NOTI-01  chats sin leer y avisos en una sola lista       W-NOTI-02  contadores por vista y título de la pestaña
//   W-NOTI-03  no se avisa lo propio, lo callado ni lo abierto  W-NOTI-04  la mención no se repite como mensaje
//   W-NOTI-05  sin respuesta al latido, reconecta               W-NOTI-06  demo entre navegadores: mensaje, reacción, aviso
//   W-NOTI-07  demo tras recargar: repone lo que faltó          W-NOTI-08  sin conexión queda pendiente y sale al volver
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const A = await import('../../dist/cdn/js/notificaciones/avisos.js');
const E = await import('../../dist/cdn/js/chat/estado.js');
const { Sala } = await import('../../dist/cdn/js/chat/sala.js');
const { crearBackendDemo } = await import('../../dist/cdn/js/chat/backend-demo.js');

const esperar = (ms = 20) => new Promise((r) => setTimeout(r, ms));
/** Almacén local de «un navegador». */
const navegador = () => {
  const d = new Map<string, string>();
  return { getItem: (k: string) => d.get(k) ?? null, setItem: (k: string, v: string) => void d.set(k, v), removeItem: (k: string) => void d.delete(k) };
};

type Socket = { readyState: number; send(d: string): void; close(): void; onopen: ((e: unknown) => void) | null; onclose: ((e: unknown) => void) | null; onerror: ((e: unknown) => void) | null; onmessage: ((e: { data: unknown }) => void) | null };

/** Sala del demo en memoria: el mismo protocolo que `SalaRT`. */
function salaFalsa() {
  const ops: { seq: number; oid: string; op: unknown }[] = [];
  const sockets = new Set<Socket>();
  const origen = 1_800_000_000_000;
  return {
    ops,
    cortar() {
      for (const s of [...sockets]) {
        s.readyState = 3;
        sockets.delete(s);
        s.onclose?.({});
      }
    },
    crearSocket(url: string): Socket {
      const q = new URL(url.replace('ws:', 'http:')).searchParams;
      const s: Socket = {
        readyState: 0, onopen: null, onclose: null, onerror: null, onmessage: null,
        send(d) {
          if (d === 'ping') return s.onmessage?.({ data: 'pong' });
          const ev = JSON.parse(d) as { oid: string; op: { op: string } };
          if (['escribiendo', 'senal'].includes(ev.op.op)) {
            for (const o of sockets) if (o !== s) o.onmessage?.({ data: JSON.stringify({ tipo: 'demo.op', oid: ev.oid, op: ev.op }) });
            return;
          }
          const fila = { seq: ops.length + 1, oid: ev.oid, op: ev.op };
          ops.push(fila);
          s.onmessage?.({ data: JSON.stringify({ tipo: 'demo.ack', oid: ev.oid, seq: fila.seq }) });
          for (const o of sockets) if (o !== s) o.onmessage?.({ data: JSON.stringify({ tipo: 'demo.op', ...fila }) });
        },
        close() {
          s.readyState = 3;
          sockets.delete(s);
          s.onclose?.({});
        },
      };
      queueMicrotask(() => {
        s.readyState = 1;
        sockets.add(s);
        s.onopen?.({});
        const reinicio = Number(q.get('origen')) !== origen;
        const desde = reinicio ? 0 : Number(q.get('desde'));
        const emitir = (d: unknown) => s.onmessage?.({ data: JSON.stringify(d) });
        emitir({ tipo: 'demo.estado', origen, seq: ops.length, reinicio, conectados: [] });
        emitir({ tipo: 'demo.lote', ops: ops.filter((o) => o.seq > desde) });
        emitir({ tipo: 'demo.listo', seq: ops.length });
      });
      return s;
    },
  };
}

const demo = (sala: ReturnType<typeof salaFalsa>, yo: string, almacen: ReturnType<typeof navegador>) => crearBackendDemo({ yo, almacen, crearCanal: () => null, vivo: false, sala: 'ws://sala.test', crearSocket: (u: string) => sala.crearSocket(u) });

const chat = (id: string, extra: Record<string, unknown> = {}) => ({ id, tipo: 'grupo', nombre: id, descripcion: '', foto: null, tema: null, miembros: [], fijado: false, silenciado: false, archivado: false, marcadoNoLeido: false, noLeidos: 0, mensajeFijado: null, actividad: '2026-11-01T10:00:00Z', creado: '', lecturas: {}, ultimo: null, ...extra });
const borrador = (clave: string, chatId: string, texto: string) => ({ clave, chat: chatId, tipo: 'texto', texto, respuestaA: null, adjunto: null, reenviado: false, meta: {} });

export default definirPruebas([
  {
    nombre: 'notificaciones W-NOTI-01 chats sin leer y avisos en una sola lista, lo nuevo primero',
    categoria: 'what',
    async correr({ expect }) {
      const e = E.reducir(E.estadoInicial('ana'), { tipo: 'inicio', yo: 'ana', usuarios: [], chats: [chat('c1', { noLeidos: 3, actividad: '2026-11-01T10:00:00Z' }), chat('c2', { noLeidos: 2, silenciado: true }), chat('c3')] });
      const avisos = [{ id: '7', tipo: 'correo', titulo: 'Correo', cuerpo: '', ts: '2026-11-01T11:00:00Z', leida: false, referencia: {} }, { id: '8', tipo: 'mencion', titulo: 'Te mencionó', cuerpo: '', ts: '2026-11-01T09:00:00Z', leida: true, referencia: { icanal: 'c3' } }];
      const l = A.entradasDe(e, avisos, 'canales');
      expect('orden', l.map((x: { id: string }) => x.id).join() === '7,chat:c1,8', l.map((x: { id: string }) => x.id).join());
      expect('total sin leer', A.totalDe(l) === 4);
      expect('destino de correo', l[0]!.destino?.vista === 'correos');
      expect('destino de mención', l[2]!.destino?.id === 'c3');
      expect('lo callado no cuenta', !l.some((x: { id: string }) => x.id === 'chat:c2'));
    },
  },
  {
    nombre: 'notificaciones W-NOTI-02 contadores por vista y título de la pestaña',
    categoria: 'what',
    async correr({ expect }) {
      const l = [{ leida: false, cuenta: 3, destino: { vista: 'canales', id: 'c' } }, { leida: false, cuenta: 1, destino: { vista: 'correos', id: null } }, { leida: true, cuenta: 1, destino: { vista: 'correos', id: null } }];
      const v = A.porVista(l) as Record<string, number>;
      expect('canales', v['canales'] === 3);
      expect('correos sin las leídas', v['correos'] === 1);
      expect('con contador', A.tituloCon(4, 'Canales · Avatar') === '(4) Canales · Avatar');
      expect('reemplaza el anterior', A.tituloCon(5, '(4) Canales · Avatar') === '(5) Canales · Avatar');
      expect('sin contador', A.tituloCon(0, '(4) Canales · Avatar') === 'Canales · Avatar');
      expect('tope', A.tituloCon(120, 'x') === '(99+) x');
    },
  },
  {
    nombre: 'notificaciones W-NOTI-03 W-NOTI-04 qué merece aviso',
    categoria: 'what',
    async correr({ expect }) {
      const base = { autor: 'beto', yo: 'ana', tipo: 'texto', silenciado: false, abierto: false, visible: true, mencionaAlYo: false };
      expect('ajeno en otro chat', A.mensajeAvisable(base));
      expect('propio', !A.mensajeAvisable({ ...base, autor: 'ana' }));
      expect('de sistema', !A.mensajeAvisable({ ...base, tipo: 'sistema' }));
      expect('silenciado', !A.mensajeAvisable({ ...base, silenciado: true }));
      expect('el chat que miro', !A.mensajeAvisable({ ...base, abierto: true }));
      expect('el chat abierto en una pestaña oculta sí', A.mensajeAvisable({ ...base, abierto: true, visible: false }));
      expect('la mención va por su aviso', !A.mensajeAvisable({ ...base, mencionaAlYo: true }));
    },
  },
  {
    nombre: 'notificaciones W-NOTI-05 sin respuesta al latido se reconecta',
    categoria: 'what',
    async correr({ expect }) {
      const creados: Socket[] = [];
      const sala = new Sala({
        url: () => Promise.resolve('ws://x'), alMensaje: () => undefined, latidoMs: 10, retardoBase: 1, retardoMax: 1, azar: () => 0,
        crearSocket: () => {
          const s: Socket = { readyState: 1, send: () => undefined, close: () => undefined, onopen: null, onclose: null, onerror: null, onmessage: null };
          creados.push(s);
          queueMicrotask(() => s.onopen?.({}));
          return s;
        },
      });
      sala.conectar();
      await esperar(90);
      sala.cerrar();
      expect('abrió otro socket sin que llegara onclose', creados.length >= 2, String(creados.length));
    },
  },
  {
    nombre: 'notificaciones W-NOTI-06 demo entre navegadores sin canal común: mensaje, reacción y aviso',
    categoria: 'what',
    async correr({ expect }) {
      const sala = salaFalsa();
      const ana = demo(sala, 'ana', navegador());
      const beto = demo(sala, 'beto', navegador());
      const vistos: string[] = [];
      const avisos: string[] = [];
      ana.suscribir((e: { tipo: string; mensaje?: { texto: string } }) => {
        if (e.tipo === 'mensaje') vistos.push(e.mensaje!.texto);
      });
      ana.avisos.alAviso((a: { tipo: string }) => avisos.push(a.tipo));
      await ana.iniciar();
      await beto.iniciar();
      await esperar();
      await beto.enviar(borrador('c1', 'd-ana-beto', 'Hola @Ana'));
      await esperar();
      expect('el mensaje cruza por la sala', vistos.includes('Hola @Ana'));
      expect('la mención crea su aviso', avisos.includes('mencion'), avisos.join());
      await ana.reaccionar('d-ana-beto', 'c1', '🔥');
      beto.simular('tarea', 'ana');
      await esperar();
      expect('tarea', avisos.includes('tarea'), avisos.join());
      const h = await beto.historial('d-ana-beto');
      expect('la reacción llegó', h.mensajes.find((m: { clave: string }) => m.clave === 'c1').reacciones.some((r: { emoji: string }) => r.emoji === '🔥'));
      ana.cerrar();
      beto.cerrar();
    },
  },
  {
    nombre: 'notificaciones W-NOTI-07 demo tras recargar: lo enviado por otro sigue ahí y los leídos persisten',
    categoria: 'what',
    async correr({ expect }) {
      const sala = salaFalsa();
      const disco = navegador();
      const ana1 = demo(sala, 'ana', disco);
      const beto = demo(sala, 'beto', navegador());
      await ana1.iniciar();
      await beto.iniciar();
      await esperar();
      ana1.cerrar(); // Ana recarga: mientras tanto Beto escribe
      await beto.enviar(borrador('c2', 'd-ana-beto', 'Mientras recargabas'));
      beto.simular('correo', 'ana');
      await esperar(200);
      const ana2 = demo(sala, 'ana', disco);
      await ana2.iniciar();
      await esperar();
      const h = await ana2.historial('d-ana-beto');
      expect('el mensaje de Beto', h.mensajes.some((m: { texto: string }) => m.texto === 'Mientras recargabas'));
      const lista = await ana2.avisos.listar();
      expect('el aviso que le faltaba', lista.some((a: { tipo: string; leida: boolean }) => a.tipo === 'correo' && !a.leida));
      await ana2.avisos.leer(null);
      await esperar();
      ana2.cerrar();
      await esperar(200);
      const ana3 = demo(sala, 'ana', navegador()); // otro perfil de Ana: todo sale de la sala
      await ana3.iniciar();
      await esperar();
      expect('leído en la sala', (await ana3.avisos.listar()).every((a: { leida: boolean }) => a.leida));
      ana3.cerrar();
      beto.cerrar();
    },
  },
  {
    nombre: 'notificaciones W-NOTI-08 sin conexión queda pendiente y sale al volver',
    categoria: 'what',
    async correr({ expect }) {
      const sala = salaFalsa();
      const ana = crearBackendDemo({ yo: 'ana', almacen: navegador(), crearCanal: () => null, vivo: false, sala: 'ws://sala.test', crearSocket: (u: string) => sala.crearSocket(u) });
      const beto = demo(sala, 'beto', navegador());
      const vistos: string[] = [];
      beto.suscribir((e: { tipo: string; mensaje?: { texto: string } }) => {
        if (e.tipo === 'mensaje') vistos.push(e.mensaje!.texto);
      });
      await ana.iniciar();
      await beto.iniciar();
      await esperar();
      sala.cortar();
      await ana.enviar(borrador('c3', 'd-ana-beto', 'Sin red'));
      await esperar(30);
      expect('aún no llegó', !vistos.includes('Sin red'));
      await esperar(1400);
      expect('llegó al reconectar', vistos.includes('Sin red'), `${sala.ops.length} ops`);
      expect('una sola vez en la sala', sala.ops.filter((o) => (o.op as { m?: { clave: string } }).m?.clave === 'c3').length === 1);
      ana.cerrar();
      beto.cerrar();
    },
  },
]);
