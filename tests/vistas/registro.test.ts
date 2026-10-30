// registro.test.ts — guardián de la carga perezosa: lo que cada vista usa del kit está declarado en `kit-tags.ts`.
//
//   W-PLAT-13  todo `<iswc-*>` que pinta un componente de una vista está en SHELL_KIT_TAGS, en VIEW_KIT_TAGS de esa
//              vista o en HIJOS_KIT (lo registra su padre); los transversales solo usan tags del shell.
//   W-PLAT-14  ningún hijo (HIJOS_KIT) se pide al loader: el loader rechaza su nombre y tumba la carga del kit.
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';

const { SHELL_KIT_TAGS, VIEW_KIT_TAGS, HIJOS_KIT, VIEW_TAGS } = await import('../../dist/cdn/js/kit-tags.js');

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
    nombre: 'registro W-PLAT-14 ningún hijo del kit se pide al loader',
    categoria: 'what',
    correr({ expect }) {
      const pedidos = [...SHELL_KIT_TAGS, ...Object.values(VIEW_KIT_TAGS as Record<string, string[]>).flat()];
      const hijos = pedidos.filter((t) => (HIJOS_KIT as readonly string[]).includes(t));
      expect('sin hijos en las listas de carga', hijos.length === 0, hijos.join(', '));
    },
  },
]);
