// registro.test.ts — guardián de la carga perezosa: lo que cada vista usa del kit está declarado en `kit-tags.ts`.
//
//   W-PLAT-13  todo `<iswc-*>` que pinta un componente de una vista está en SHELL_KIT_TAGS, en VIEW_KIT_TAGS de esa
//              vista o en HIJOS_KIT (lo registra su padre); los transversales solo usan tags del shell.
//   W-PLAT-14  ningún hijo (HIJOS_KIT) se pide al loader: el loader rechaza su nombre y tumba la carga del kit.
//   W-PLAT-15  toda vista que pinta `av-tabla` declara `GRID_TAG`: el transversal no lleva el tag literal en su plantilla.
//   W-COMP-11  cada familia (`src/js/components/<familia>/`, p. ej. el chat) solo usa tags del kit declarados para TODAS las
//              vistas que la cargan (VIEW_FAMILIAS), y sus tags tienen carpeta publicada.
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { GRID_TAG, SHELL_KIT_TAGS, VIEW_KIT_TAGS, HIJOS_KIT, VIEW_TAGS, FAMILIA_TAGS, VIEW_FAMILIAS, rutaComponente } = await import('../../dist/cdn/js/kit-tags.js');

const raiz = new URL('../../', import.meta.url);

/** Tags `iswc-*` que aparecen en las plantillas de los `.ts` de una carpeta. */
async function usados(carpeta: URL): Promise<Set<string>> {
  const out = new Set<string>();
  for await (const e of Deno.readDir(carpeta)) {
    if (!e.isFile || !e.name.endsWith('.ts') || e.name === 'all.ts') continue;
    const fuente = await Deno.readTextFile(new URL(e.name, carpeta));
    for (const m of fuente.matchAll(/<(iswc-[a-z-]+)/g)) out.add(m[1]!);
  }
  return out;
}

export default definirPruebas([
  {
    nombre: 'registro W-PLAT-13 cada iswc-* usado por una vista está declarado para su carga perezosa',
    categoria: 'what',
    async correr({ expect }) {
      const shell = new Set<string>([...SHELL_KIT_TAGS, ...HIJOS_KIT]);
      for (const vista of Object.keys(VIEW_TAGS)) {
        const propios = new Set<string>((VIEW_KIT_TAGS as Record<string, string[]>)[vista] ?? []);
        const faltan = [...(await usados(new URL(`view/${vista}/components/`, raiz)))].filter((t) => !shell.has(t) && !propios.has(t));
        expect(`vista ${vista}`, faltan.length === 0, `sin declarar en VIEW_KIT_TAGS.${vista}: ${faltan.join(', ')}`);
      }
      const transversales = [...(await usados(new URL('src/js/components/av/', raiz)))].filter((t) => !shell.has(t));
      expect('transversales solo con tags del shell', transversales.length === 0, transversales.join(', '));
    },
  },
  {
    nombre: 'registro W-PLAT-15 toda vista con av-tabla declara el grid del kit',
    categoria: 'what',
    async correr({ expect }) {
      for (const vista of Object.keys(VIEW_TAGS)) {
        let usa = false;
        const carpeta = new URL(`view/${vista}/components/`, raiz);
        for await (const e of Deno.readDir(carpeta)) {
          if (e.isFile && e.name.endsWith('.ts')) usa ||= (await Deno.readTextFile(new URL(e.name, carpeta))).includes('<av-tabla');
        }
        if (usa) expect(`vista ${vista}`, ((VIEW_KIT_TAGS as Record<string, string[]>)[vista] ?? []).includes(GRID_TAG), `falta ${GRID_TAG} en VIEW_KIT_TAGS.${vista}`);
      }
    },
  },
  {
    nombre: 'registro W-COMP-11 las familias declaran sus tags del kit en cada vista que las carga',
    categoria: 'what',
    async correr({ expect }) {
      const shell = new Set<string>([...SHELL_KIT_TAGS, ...HIJOS_KIT]);
      for (const [familia, tags] of Object.entries(FAMILIA_TAGS as Record<string, string[]>)) {
        const usa = await usados(new URL(`src/js/components/${familia}/`, raiz));
        const vistas = Object.entries(VIEW_FAMILIAS as Record<string, string[]>).filter(([, fs]) => fs.includes(familia)).map(([v]) => v);
        expect(`familia ${familia} la carga alguna vista`, vistas.length > 0);
        for (const v of vistas) {
          const propios = new Set<string>((VIEW_KIT_TAGS as Record<string, string[]>)[v] ?? []);
          const faltan = [...usa].filter((t) => !shell.has(t) && !propios.has(t));
          expect(`familia ${familia} en vista ${v}`, faltan.length === 0, `sin declarar en VIEW_KIT_TAGS.${v}: ${faltan.join(', ')}`);
        }
        for (const t of tags) expect(`${t} publicado en su familia`, rutaComponente(t) === `js/components/${familia}/`);
      }
    },
  },
  {
    nombre: 'registro W-PLAT-14 ningún hijo del kit se pide al loader',
    categoria: 'what',
    correr({ expect }) {
      const pedidos = [...SHELL_KIT_TAGS, ...Object.values(VIEW_KIT_TAGS as Record<string, string[]>).flat()];
      const hijos = pedidos.filter((t) => (HIJOS_KIT as readonly string[]).includes(t));
      expect('sin hijos en las listas de carga', hijos.length === 0, hijos.join(', '));
    },
  },
]);
