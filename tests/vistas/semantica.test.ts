// semantica.test.ts — búsqueda por significado del front (sin navegador ni modelo), sobre lo PUBLICADO en dist/cdn.
//
//   W-SEM-01  int8 ida y vuelta: codificar → decodificar conserva la dirección del vector (coseno ≈ 1)
//   W-SEM-02  con el vector de la consulta (horneado con bge-m3), el comando esperado sale primero
//   W-SEM-03  sin vector la búsqueda es léxica (sin acentos ni mayúsculas) y no inventa resultados
import { readFileSync } from 'node:fs';
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const s = await import('../../dist/cdn/js/core/semantica.js');
const horneado = JSON.parse(readFileSync(new URL('../../assets/ia/comandos.json', import.meta.url), 'utf8'));
const consultas = JSON.parse(readFileSync(new URL('./fixtures/consultas-comandos.json', import.meta.url), 'utf8')) as { texto: string; espera: string; vector: number[] }[];
const corpus = s.decodificar(horneado);

export default definirPruebas([
  {
    nombre: 'semantica W-SEM-01 la cuantización int8 conserva los vectores',
    categoria: 'how',
    correr({ expect }) {
      const v = [[0.6, -0.8, 0], [0, 0.28, -0.96]];
      const ida = s.decodificar({ modelo: 'x', dims: 3, items: [{ id: 'a', texto: 'a' }, { id: 'b', texto: 'b' }], ...s.codificar(v) });
      expect('coseno a', s.coseno(ida.vectores[0], v[0]!) > 0.999);
      expect('coseno b', s.coseno(ida.vectores[1], v[1]!) > 0.999);
      expect('corpus horneado con 1024 dims', corpus.dims === 1024 && corpus.vectores.length === corpus.items.length);
    },
  },
  {
    nombre: 'semantica W-SEM-02 la paleta entiende lo que se pide con otras palabras',
    categoria: 'what',
    correr({ eq }) {
      for (const c of consultas) {
        const top = s.ordenar(corpus, c.texto, c.vector, 3)[0]?.item.id;
        eq(`«${c.texto}»`, top, c.espera);
      }
    },
  },
  {
    nombre: 'semantica W-SEM-03 sin vector la búsqueda es léxica',
    categoria: 'what',
    correr({ eq, expect }) {
      eq('acentos y mayúsculas', s.ordenar(corpus, 'NOMINA', null, 3)[0]?.item.id, 'ir-rrhh');
      eq('nada que ver → vacío', s.ordenar(corpus, 'zzzz', null, 3).length, 0);
      expect('normalizar', s.normalizar('  Árbol   VERDE ') === 'arbol verde');
    },
  },
]);
