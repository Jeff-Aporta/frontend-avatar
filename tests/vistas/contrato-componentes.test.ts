// contrato-componentes.test.ts — guardián de la arquitectura común: todo componente registrado trae sus cuatro hermanos
// y usa la API real del kit. Se apoya en `kit-tags.ts`: un componente nuevo entra solo a la auditoría.
//
//   W-COMP-20  cada tag registrado tiene .ts, .scss, .md y .json con su mismo nombre en la misma carpeta
//   W-COMP-21  cada .md lleva front matter (name, description) y los H2 de la ficha; la Anatomía nunca se excluye
//   W-COMP-22  ningún componente usa atributos que el kit no tiene: tone en iswc-callout, size en iswc-button
import { definirPruebas } from '../../src/vendor/iswc-root/tools/pruebas.ts';
import { APP_TAGS, FAMILIA_TAGS, PREFIJO, VIEW_TAGS } from '../../src/js/kit-tags.ts';

const raiz = new URL('../../', import.meta.url);
const SECCIONES = ['Anatomía', 'Atributos observados', 'Props', 'Eventos', 'Slots', 'Ejemplos'];

const componentes: { tag: string; base: URL }[] = [
  ...APP_TAGS.map((tag) => ({ tag, base: new URL(`src/js/components/${PREFIJO}/${tag}`, raiz) })),
  ...Object.entries(VIEW_TAGS).flatMap(([vista, tags]) => tags.map((tag) => ({ tag, base: new URL(`view/${vista}/components/${tag}`, raiz) }))),
  ...Object.entries(FAMILIA_TAGS).flatMap(([familia, tags]) => tags.map((tag) => ({ tag, base: new URL(`src/js/components/${familia}/${tag}`, raiz) }))),
];

const leer = (base: URL, ext: string): Promise<string | null> => Deno.readTextFile(new URL(`${base.href}.${ext}`)).catch(() => null);

export default definirPruebas([
  {
    nombre: 'contrato W-COMP-20 cada componente tiene ts, scss, md y json',
    categoria: 'what',
    async correr({ expect }) {
      for (const { tag, base } of componentes) {
        for (const ext of ['ts', 'scss', 'md', 'json']) expect(`${tag}.${ext}`, (await leer(base, ext)) !== null, 'no existe');
      }
    },
  },
  {
    nombre: 'contrato W-COMP-21 cada ficha md sigue la plantilla',
    categoria: 'what',
    async correr({ expect }) {
      for (const { tag, base } of componentes) {
        const md = await leer(base, 'md');
        if (md === null) continue;
        expect(`${tag} front matter`, new RegExp(`^---\\r?\\nname: ${tag}\\r?\\ndescription: .+`).test(md), 'falta name o description');
        const faltan = SECCIONES.filter((s) => !new RegExp(`^## ${s}\\s*$`, 'm').test(md));
        expect(`${tag} secciones`, faltan.length === 0, faltan.join(', '));
        expect(`${tag} anatomía`, !md.includes('exclude: Anatomía'), 'la Anatomía no se excluye');
      }
    },
  },
  {
    nombre: 'contrato W-COMP-22 ningún componente usa atributos que el kit no tiene',
    categoria: 'what',
    async correr({ expect }) {
      for (const { tag, base } of componentes) {
        const ts = (await leer(base, 'ts')) ?? '';
        const json = (await leer(base, 'json')) ?? '';
        expect(`${tag} tone`, !/<iswc-callout\b[^>]*\stone=/.test(ts + json), 'iswc-callout usa color');
        expect(`${tag} size`, !/<iswc-button\b[^>]*\ssize=/.test(ts), 'iswc-button escala por font-size o density');
      }
    },
  },
]);
