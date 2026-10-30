// canales.test.ts — dominio de la vista `canales` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-CAN-03   canales con no leídos primero, luego actividad reciente, luego nombre
//   W-CAN-05   mensajes en orden cronológico agrupados por día con rótulo Hoy/Ayer
//   W-CAN-06   propio/ajeno según el usuario de la sesión
//   W-CAN-08   texto vacío o > 4000 no se envía; se recorta
//   W-CAN-17   id de ruta desconocido abre el primer canal
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { ordenarCanales, totalSinLeer, agruparPorDia, claveDia, rotuloDia, esPropio, textoParaEnviar, canalActivo } = await import('../../dist/cdn/view/canales/utils/chat.js');

const canal = (icanal: number, nombre: string, sin_leer: number, creado: string | null) => ({ icanal, iempresa: 1, iequipo: null, nombre, tipo: 'publico', descripcion: null, sin_leer, ultimo: creado ? { contenido: 'x', iusuario: 'ana', creado } : null });
const mensaje = (imensaje: number, iusuario: string, creado: string) => ({ imensaje, icanal: 1, iusuario, contenido: `m${imensaje}`, creado });

export default definirPruebas([
  {
    nombre: 'canales W-CAN-03 no leídos primero, luego reciente, luego nombre',
    categoria: 'what',
    correr({ eq }) {
      const lista = [canal(1, 'b', 0, '2026-10-01T00:00:00Z'), canal(2, 'a', 0, '2026-10-02T00:00:00Z'), canal(3, 'c', 3, null), canal(4, 'd', 0, null), canal(5, 'aa', 0, null)];
      eq('orden', ordenarCanales(lista).map((c: { icanal: number }) => c.icanal), [3, 2, 1, 5, 4]);
      eq('total no leídos', totalSinLeer(lista), 3);
    },
  },
  {
    nombre: 'canales W-CAN-05 agrupa por día en orden y rotula Hoy/Ayer',
    categoria: 'what',
    correr({ eq, expect }) {
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);
      const grupos = agruparPorDia([mensaje(3, 'ana', hoy.toISOString()), mensaje(1, 'beto', ayer.toISOString()), mensaje(2, 'ana', ayer.toISOString())]);
      eq('dos días', grupos.length, 2);
      eq('ayer primero', grupos[0]!.rotulo, 'Ayer');
      eq('hoy después', grupos[1]!.rotulo, 'Hoy');
      eq('orden dentro del día', grupos[0]!.mensajes.map((m: { imensaje: number }) => m.imensaje), [1, 2]);
      expect('sin fecha rotulada', rotuloDia('sin-fecha') === 'Sin fecha' && claveDia(null) === 'sin-fecha');
    },
  },
  {
    nombre: 'canales W-CAN-06 propio solo si lo escribió el usuario de la sesión',
    categoria: 'what',
    correr({ expect }) {
      const m = mensaje(1, 'beto', '2026-10-30T00:00:00Z');
      expect('propio', esPropio(m, 'beto'));
      expect('ajeno', !esPropio(m, 'ana'));
      expect('sin sesión nunca propio', !esPropio(m, ''));
    },
  },
  {
    nombre: 'canales W-CAN-08 valida el texto a enviar',
    categoria: 'what',
    correr({ eq }) {
      eq('recorta', textoParaEnviar('  hola  '), 'hola');
      eq('vacío', textoParaEnviar('   '), null);
      eq('demasiado largo', textoParaEnviar('x'.repeat(4001)), null);
    },
  },
  {
    nombre: 'canales W-CAN-17 id desconocido abre el primero',
    categoria: 'what',
    correr({ eq }) {
      const lista = [canal(7, 'a', 0, null), canal(9, 'b', 0, null)];
      eq('por id', canalActivo(lista, '9')?.icanal, 9);
      eq('desconocido', canalActivo(lista, '99')?.icanal, 7);
      eq('sin canales', canalActivo([], null), null);
    },
  },
]);
