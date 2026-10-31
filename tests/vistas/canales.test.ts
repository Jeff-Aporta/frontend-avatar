// canales.test.ts — dominio de la vista `canales` (sin navegador), sobre lo PUBLICADO en dist/cdn. La conversación es el
// chat de la spec 42 (probado en chat.test.ts); aquí, lo propio de la vista:
//
//   W-CAN-14   sin empresa activa la vista lo dice y no consulta
//   W-CHAT-41  sin permiso `avatar.chat` lo explica y no consulta
//   W-CAN-19   un error de «ruta inexistente» del API significa que el chat aún no está publicado (cae al demo local)
//   W-CAN-17   el id de la ruta abre ese chat (vacío → ninguno)
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { estadoCanales, apiChatPendiente, chatDeRuta } = await import('../../dist/cdn/view/canales/utils/canales.js');
const { ACCION } = await import('../../dist/cdn/js/core/permisos.js');

const perfil = (perms: Record<string, unknown>) => ({ usuario: 'u', irol: 'USR', igrupo: 'AVATAR', roles: ['USR'], perms });

export default definirPruebas([
  {
    nombre: 'canales W-CAN-14 W-CHAT-41 sin empresa o sin permiso de chat no se consulta',
    categoria: 'what',
    correr({ eq }) {
      const conChat = perfil({ [ACCION.chat]: true });
      eq('sin empresa', estadoCanales(null, conChat), 'sin-empresa');
      eq('sin permiso', estadoCanales(3, perfil({ [ACCION.chat]: false })), 'sin-permiso');
      eq('sin perfil', estadoCanales(3, null), 'sin-permiso');
      eq('listo', estadoCanales(3, conChat), 'listo');
    },
  },
  {
    nombre: 'canales W-CAN-19 API del chat pendiente → demo local',
    categoria: 'what',
    correr({ expect }) {
      expect('path no definido en el plugin', apiChatPendiente('El plugin "avatar" no define el path "historial"'));
      expect('404', apiChatPendiente('404 Not Found'));
      expect('otros errores no', !apiChatPendiente('Sesión vencida'));
    },
  },
  {
    nombre: 'canales W-CAN-17 el id de la ruta abre ese chat',
    categoria: 'what',
    correr({ eq }) {
      eq('id', chatDeRuta(' 12 '), '12');
      eq('vacío', chatDeRuta(''), null);
      eq('nulo', chatDeRuta(null), null);
    },
  },
]);
