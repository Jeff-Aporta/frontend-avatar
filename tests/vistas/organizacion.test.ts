// organizacion.test.ts — dominio de la vista `organizacion` (sin navegador), sobre lo PUBLICADO en dist/cdn.
//
//   W-ORG-03  validación de empresa      W-ORG-05  orden de miembros por rol
//   W-ORG-06  validación de invitación   W-ORG-07  integrantes agrupados (líder primero) y candidatos
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const o = await import('../../dist/cdn/view/organizacion/utils/organizacion.js');

export default definirPruebas([
  {
    nombre: 'organizacion W-ORG-03 empresa: nombre obligatorio y NIT válido',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('válida', o.validarEmpresa({ iempresa: null, nombre: 'Avatar', nit: '900.123-7', sector: '', descripcion: '' }), []);
      expect('sin nombre', o.validarEmpresa({ iempresa: null, nombre: '  ', nit: '', sector: '', descripcion: '' }).length === 1);
      expect('NIT inválido', o.validarEmpresa({ iempresa: null, nombre: 'X', nit: '90 12', sector: '', descripcion: '' }).length === 1);
      eq('cuerpo limpio', o.cuerpoEmpresa({ iempresa: null, nombre: ' X ', nit: '', sector: 'TI', descripcion: '' }), { nombre: 'X', nit: null, sector: 'TI', descripcion: null });
    },
  },
  {
    nombre: 'organizacion W-ORG-05 miembros por rol y luego por nombre',
    categoria: 'what',
    correr({ eq }) {
      const m = (iusuario: string, rol: string, nombre: string) => ({ iempresa: 1, iusuario, rol, usuario: { iusuario, nombre } });
      const orden = o.ordenarMiembros([m('c', 'miembro', 'Carla'), m('a', 'admin', 'Ana'), m('z', 'propietario', 'Zoe'), m('b', 'miembro', 'Beto')]);
      eq('orden', orden.map((x: { iusuario: string }) => x.iusuario), ['z', 'a', 'b', 'c']);
      eq('etiqueta', o.etiquetaRol('propietario'), 'Propietario');
    },
  },
  {
    nombre: 'organizacion W-ORG-06 invitación exige usuario',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('válida', o.validarInvitacion({ iusuario: 'dani', rol: 'miembro', cargo: '' }), []);
      expect('sin usuario', o.validarInvitacion({ iusuario: '', rol: 'miembro', cargo: '' }).length === 1);
    },
  },
  {
    nombre: 'organizacion W-ORG-07 integrantes agrupados con líder primero y candidatos sin repetir',
    categoria: 'what',
    correr({ eq }) {
      const it = [{ iequipo: 1, iusuario: 'b', rol: 'integrante' }, { iequipo: 1, iusuario: 'a', rol: 'lider' }, { iequipo: 2, iusuario: 'c', rol: 'integrante' }];
      const g = o.agruparIntegrantes(it);
      eq('equipo 1', g.get(1).map((x: { iusuario: string }) => x.iusuario), ['a', 'b']);
      const miembros = ['a', 'b', 'd'].map((iusuario) => ({ iempresa: 1, iusuario, rol: 'miembro' }));
      eq('candidatos', o.candidatos(miembros, g.get(1)).map((x: { iusuario: string }) => x.iusuario), ['d']);
      eq('color inválido', o.colorEquipo('rojo'), 'var(--iswc-accent)');
    },
  },
]);
