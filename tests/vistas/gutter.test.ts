// gutter.test.ts — guardián del ancho: el contenido de página usa todo el ancho, con un solo hueco lateral.
//
//   W-PLAT-30  ningún contenedor de página se limita ni se centra con un `max-width` de página: el hueco lateral es `--av-gutter`.
//              Se permite limitar el largo de línea de un párrafo (menos de 50em), que no es un contenedor.
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const raiz = new URL('../../', import.meta.url);
const hojas = [...Deno.readDirSync(new URL('view/', raiz))].flatMap((d) => {
  const carpeta = new URL(`view/${d.name}/components/`, raiz);
  try {
    return [...Deno.readDirSync(carpeta)].filter((a) => a.name.endsWith('.scss')).map((a) => ({ nombre: `${d.name}/${a.name}`, texto: Deno.readTextFileSync(new URL(a.name, carpeta)) }));
  } catch {
    return [];
  }
});

export default definirPruebas([
  {
    nombre: 'plataforma W-PLAT-30 ninguna página se limita con max-width: el hueco lateral es el gutter',
    categoria: 'what',
    correr({ expect }) {
      for (const h of hojas) {
        const fuera = /^@media|^@container/;
        const anchos = h.texto.split(/\r?\n/).filter((l) => !fuera.test(l.trim()) && /^\s*max-width:\s*(\d+(?:\.\d+)?)em;/.test(l)).map((l) => Number(/max-width:\s*(\d+(?:\.\d+)?)em/.exec(l)![1]));
        expect(h.nombre, anchos.every((a) => a < 50), `max-width de página: ${anchos.join(', ')}em`);
      }
      const app = Deno.readTextFileSync(new URL('src/styles/app.scss', raiz));
      expect('token único', /--av-gutter:\s*1em;/.test(app));
    },
  },
]);
