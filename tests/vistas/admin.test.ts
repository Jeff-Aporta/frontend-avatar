// admin.test.ts — dominio de la vista `admin` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-ADM-03  validación y cuerpo del usuario   W-ADM-05  id de rol, acciones por rol y valor legible
//   W-ADM-02  rol principal de un usuario
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const a = await import('../../dist/cdn/view/admin/utils/admin.js');

export default definirPruebas([
  {
    nombre: 'admin W-ADM-03 usuario: id y contraseña al crear, contraseña opcional al editar',
    categoria: 'what',
    correr({ eq, expect }) {
      const base = { nuevo: true, iusuario: 'dani', nombre: '', email: '', password: '12345678', bactivo: true };
      eq('válido', a.validarUsuario(base), []);
      expect('clave corta', a.validarUsuario({ ...base, password: '123' }).length === 1);
      expect('correo malo', a.validarUsuario({ ...base, email: 'x@' }).length === 1);
      eq('editar sin clave', a.validarUsuario({ ...base, nuevo: false, password: '' }), []);
      expect('cuerpo sin password vacía', !('password' in a.cuerpoUsuario({ ...base, nuevo: false, password: '' })));
    },
  },
  {
    nombre: 'admin W-ADM-05 id de rol normalizado, acciones por rol y valor legible',
    categoria: 'what',
    correr({ eq }) {
      eq('irol', a.normalizarIrol('  soporte técnico '), 'SOPORTE_TECNICO');
      const acciones = [{ irol: 'G', iaccion: 'b', valor: true }, { irol: 'G', iaccion: 'a', valor: false }, { irol: 'X', iaccion: 'c', valor: true }];
      eq('del rol ordenadas', a.accionesDe('G', acciones).map((x: { iaccion: string }) => x.iaccion), ['a', 'b']);
      eq('permite', a.valorLegible(true), 'permite');
      eq('por verbo', a.valorLegible({ GET: true, POST: false }), 'GET sí · POST no');
      eq('color', a.colorValor(false), 'danger');
    },
  },
  {
    nombre: 'admin W-ADM-02 rol principal: el marcado o el primero',
    categoria: 'what',
    correr({ eq }) {
      const asig = [{ iusuario: 'ana', irol: 'X', bprincipal: false }, { iusuario: 'ana', irol: 'GESTOR', bprincipal: true }, { iusuario: 'beto', irol: 'Y' }];
      eq('marcado', a.rolPrincipal('ana', asig), 'GESTOR');
      eq('primero', a.rolPrincipal('beto', asig), 'Y');
      eq('ninguno', a.rolPrincipal('carla', asig), null);
      eq('etiqueta', a.etiquetaRol('USR'), 'Usuario');
    },
  },
]);
