// demos.test.ts — guardián del explorador de demos: todo componente registrado tiene su playground `iswc-preview/v1`
// válido y su línea en `view/demo/manifest.json`. Un JSON que no cumple dejaba la galería vacía sin avisar.
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';
import { DefinicionDemoSchema, ManifestDemoSchema } from '../../src/js/consts/schemas/demo.schemas.ts';
import { APP_TAGS, FAMILIA_TAGS, VIEW_TAGS } from '../../src/js/kit-tags.ts';

const raiz = new URL('../../view/demo/', import.meta.url);
const manifest = ManifestDemoSchema.parse(JSON.parse(await Deno.readTextFile(new URL('manifest.json', raiz))));
const definiciones = await Promise.all(manifest.map(async (m) => ({ ...m, json: JSON.parse(await Deno.readTextFile(new URL(m.file, raiz))) as unknown })));

export default definirPruebas([
  {
    nombre: 'demos W-DEMO-01 todo componente registrado está en el manifest y viceversa',
    categoria: 'what',
    correr({ eq }) {
      const registrados = [...APP_TAGS, ...Object.values(VIEW_TAGS).flat(), ...Object.values(FAMILIA_TAGS).flat()].map(String).sort();
      eq('mismos tags', manifest.map((m) => m.tag).sort(), registrados);
    },
  },
  {
    nombre: 'demos W-DEMO-02 cada definición cumple iswc-preview/v1 y es del tag que dice el manifest',
    categoria: 'what',
    correr({ expect }) {
      for (const d of definiciones) {
        const r = DefinicionDemoSchema.safeParse(d.json);
        expect(d.tag, r.success && r.data.tag === d.tag, r.success ? 'otro tag' : JSON.stringify(r.error.issues[0]));
      }
    },
  },
  {
    nombre: 'demos W-DEMO-03 cada demo tiene un bloque vivo con target y controles que lo aplican',
    categoria: 'what',
    correr({ expect }) {
      for (const d of definiciones) {
        const def = DefinicionDemoSchema.parse(d.json);
        const bloques = def.sections.flatMap((s) => s.blocks).filter((b) => b.kind === 'demo');
        expect(d.tag, bloques.some((b) => b.target && b.controls?.length), 'sin playground');
      }
    },
  },
]);
