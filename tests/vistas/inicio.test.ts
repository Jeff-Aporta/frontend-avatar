// inicio.test.ts — dominio de la landing y del acceso (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-PUB-02   la landing presenta 4 características (icono, título, texto) y 3 planes con el anual destacado
//   W-PUB-05   las cuentas de prueba son las sembradas por el API y los errores del login se traducen
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { caracteristicas, planes, LEMA } = await import('../../dist/cdn/view/inicio/utils/landing.js');
const { mensajeAcceso } = await import('../../dist/cdn/view/acceso/utils/demo.js');

export default definirPruebas([
  {
    nombre: 'inicio W-PUB-02 cuatro características y tres planes con el anual destacado',
    categoria: 'what',
    correr({ eq, expect }) {
      const c = caracteristicas();
      eq('cuatro', c.length, 4);
      expect('completas', c.every((x: { icono: string; titulo: string; texto: string }) => x.icono.includes(':') && x.titulo && x.texto));
      const p = planes();
      eq('tres planes', p.map((x: { id: string }) => x.id), ['mensual', 'anual', 'trienal']);
      eq('destacado', p.filter((x: { destacado: boolean }) => x.destacado).map((x: { id: string }) => x.id), ['anual']);
      expect('lema', LEMA.titulo.length > 10);
    },
  },
  {
    nombre: 'acceso W-PUB-05 mensajes de error legibles',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('401', mensajeAcceso('Usuario o contraseña inválidos'), 'Usuario o contraseña inválidos.');
      eq('429', mensajeAcceso('429 Demasiados intentos'), 'Demasiados intentos: espera unos minutos.');
      eq('red', mensajeAcceso('Failed to fetch'), 'No se pudo contactar el API. Revisa la conexión.');
    },
  },
]);
