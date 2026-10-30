// plataforma.test.ts — núcleo sin navegador, sobre lo PUBLICADO en dist/cdn: router por hash y lectura de permisos.
//
//   W-PLAT-10  el hash se traduce a { vista, id }; vacío o desconocido → inicio; una vista privada sin sesión → acceso
//   W-PLAT-11  el vector de permisos de DER decide por acción y verbo: true, false, partido por verbo y comodín "*"
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { parsear, hashDe, resolver, VISTAS_PRIVADAS } = await import('../../dist/cdn/js/core/router.js');
const { puede, rolDe, ACCION } = await import('../../dist/cdn/js/core/permisos.js');

const perfil = (perms: Record<string, unknown>, roles: string[] = []) => ({ usuario: 'u', irol: roles[0] ?? 'USR', igrupo: 'AVATAR', roles, perms });

export default definirPruebas([
  {
    nombre: 'plataforma W-PLAT-10 el router traduce el hash y protege las vistas privadas',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('vacío → inicio', parsear(''), { vista: 'inicio', id: null });
      eq('con id', parsear('#/canales/12'), { vista: 'canales', id: '12' });
      eq('desconocida → inicio', parsear('#/loquesea'), { vista: 'inicio', id: null });
      eq('hash de vuelta', hashDe('proyectos', 3), '#/proyectos/3');
      eq('sin sesión a privada → acceso', resolver({ vista: 'panel', id: null }, false), { vista: 'acceso', id: null });
      eq('con sesión se respeta', resolver({ vista: 'panel', id: null }, true), { vista: 'panel', id: null });
      expect('privadas conocidas', VISTAS_PRIVADAS.includes('admin') && !VISTAS_PRIVADAS.includes('inicio'));
    },
  },
  {
    nombre: 'plataforma W-PLAT-11 puede() lee el vector de permisos de DER',
    categoria: 'what',
    correr({ eq }) {
      const usr = perfil({ '*': { GET: true, POST: false, PUT: false, DELETE: false }, [ACCION.chat]: true, [ACCION.tareas]: true });
      eq('USR chatea', puede(usr, ACCION.chat), true);
      eq('USR no gestiona', puede(usr, ACCION.gestionar), false);
      eq('USR lee', puede(usr, 'GET:/empresas', 'GET'), true);
      eq('ADMIN todo', puede(perfil({ '*': true }, ['ADMIN']), ACCION.seguridad, 'PUT'), true);
      eq('sin perfil nada', puede(null, ACCION.chat), false);
      eq('rol legible', rolDe(perfil({}, ['GESTOR'])), 'Gestor');
    },
  },
]);
