// cuentas.test.ts — bóveda de sesiones (W-PERF-02/03): varias cuentas en el navegador y un perfil activo por pestaña.
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const almacen = (): Storage => {
  const m = new Map<string, string>();
  return { length: 0, key: () => null, clear: () => m.clear(), getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
};
const jwt = (sub: string, exp: number) => `x.${btoa(JSON.stringify({ sub, exp }))}.y`;
const futuro = Math.floor(Date.now() / 1000) + 3600;

const fijarGlobal = (nombre: string, valor: Storage) => Object.defineProperty(globalThis, nombre, { value: valor, configurable: true, writable: true });
fijarGlobal('localStorage', almacen());
fijarGlobal('sessionStorage', almacen());
const C = await import('../../dist/cdn/js/core/cuentas.js');

export default definirPruebas([
  {
    nombre: 'cuentas W-PERF-02 guardar dos cuentas deja el cambio directo para ambas',
    categoria: 'what',
    correr({ eq, expect }) {
      C.guardarCuenta(jwt('ana', futuro));
      C.guardarCuenta(jwt('beto', futuro));
      eq('activa la última', C.usuarioActivo(), 'beto');
      expect('ana sigue guardada', C.tieneCuenta('ana'));
      expect('carla pide PIN', !C.tieneCuenta('carla'));
      C.activar('ana');
      eq('token de ana', C.tokenActivo(), jwt('ana', futuro));
    },
  },
  {
    nombre: 'cuentas W-PERF-03 cada pestaña conserva su perfil aunque otra cambie',
    categoria: 'what',
    correr({ eq }) {
      C.activar('ana');
      const pestanaNueva = almacen();
      fijarGlobal('sessionStorage', pestanaNueva);
      eq('la nueva hereda el último', C.usuarioActivo(), 'ana');
      C.activar('beto');
      eq('la nueva queda en beto', C.usuarioActivo(), 'beto');
      pestanaNueva.setItem('avatar:activo', 'beto');
      const primera = almacen();
      primera.setItem('avatar:activo', 'ana');
      fijarGlobal('sessionStorage', primera);
      eq('la primera sigue en ana', C.usuarioActivo(), 'ana');
    },
  },
  {
    nombre: 'cuentas W-PERF-04 un token vencido vuelve a pedir PIN y cerrar sesión lo olvida',
    categoria: 'what',
    correr({ eq, expect }) {
      C.guardarCuenta(jwt('carla', 1000));
      expect('vencida', !C.tieneCuenta('carla'));
      eq('sin token', C.tokenActivo(), null);
      C.guardarCuenta(jwt('dani', futuro));
      C.quitarActiva();
      expect('olvidada', !C.tieneCuenta('dani'));
    },
  },
]);
