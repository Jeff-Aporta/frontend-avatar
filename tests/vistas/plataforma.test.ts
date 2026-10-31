// plataforma.test.ts — núcleo sin navegador, sobre lo PUBLICADO en dist/cdn: router de rutas reales y permisos.
//
//   W-PLAT-10  cada vista es una ruta real (/canales/); una URL se traduce a su vista y de vuelta; desconocida → inicio;
//              una vista privada sin sesión → acceso; ninguna URL lleva # ni parámetros
//   W-PLAT-11  el vector de permisos de DER decide por acción y verbo: true, false, partido por verbo y comodín "*"
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { urlDe, vistaDeUrl, resolver, VISTAS_PRIVADAS } = await import('../../dist/cdn/js/core/router.js');
const { PAGINAS } = await import('../../dist/cdn/js/consts/paginas.js');

const RAIZ = 'https://jeff-aporta.github.io/frontend-avatar/';
const { puede, rolDe, ACCION } = await import('../../dist/cdn/js/core/permisos.js');

const perfil = (perms: Record<string, unknown>, roles: string[] = []) => ({ usuario: 'u', irol: roles[0] ?? 'USR', igrupo: 'AVATAR', roles, perms });

export default definirPruebas([
  {
    nombre: 'plataforma W-PLAT-10 rutas reales por vista y vistas privadas protegidas',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('portada', urlDe('inicio', RAIZ), RAIZ);
      eq('ruta de vista', urlDe('canales', RAIZ), `${RAIZ}canales/`);
      eq('url → vista', vistaDeUrl(`${RAIZ}proyectos/`, RAIZ), 'proyectos');
      eq('index.html explícito', vistaDeUrl(`${RAIZ}crm/index.html`, RAIZ), 'crm');
      eq('raíz → inicio', vistaDeUrl(RAIZ, RAIZ), 'inicio');
      eq('desconocida → inicio', vistaDeUrl(`${RAIZ}loquesea/`, RAIZ), 'inicio');
      expect('ninguna ruta con # ni ?', PAGINAS.every((p: { vista: string }) => !/[#?]/.test(urlDe(p.vista, RAIZ))));
      expect('ida y vuelta en todas', PAGINAS.every((p: { vista: string }) => vistaDeUrl(urlDe(p.vista, RAIZ), RAIZ) === p.vista));
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
