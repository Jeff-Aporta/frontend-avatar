/**
 * catalogo-emojis.ts — todo emojibase repartido en las categorías del selector. Los curados encabezan su categoría; las
 * variantes de tono no se listan (son las mismas 1 de cada 6) y quedan fuera los indicadores regionales y los componentes
 * de pelo y tono, que no son emojis elegibles por sí solos.
 */
import { CURADOS } from './emojis-curados.ts';

export type Emojibase = { emoji: string; hexcode: string; label: string; tags?: string[]; group?: number; subgroup?: number; order?: number };
export type EmojiCatalogo = { id: string; k: string; categoria: string; grupo: string; es: string; en: string; tagsEs: string[]; tagsEn: string[] };

/** Grupo de emojibase → categoría; las banderas van con símbolos porque el selector no tiene categoría propia para ellas. */
const CATEGORIA_DE_GRUPO: Record<number, string> = { 0: 'caras', 1: 'gestos', 3: 'naturaleza', 4: 'comida', 5: 'viajes', 6: 'actividades', 7: 'objetos', 8: 'simbolos', 9: 'simbolos' };
/** Subgrupos de emojibase con corazones y signos de emoción (💥💫💯): lo que el selector agrupa en Corazones. */
const SUBGRUPOS_CORAZONES = new Set([14, 15]);
const NOMBRES: Record<string, string> = { caras: 'Caras', gestos: 'Gestos', corazones: 'Corazones', naturaleza: 'Naturaleza', comida: 'Comida', actividades: 'Actividades', viajes: 'Viajes', objetos: 'Objetos', simbolos: 'Símbolos' };
const COMPONENTE = 2;

const sinVs = (e: string): string => e.replaceAll('️', '');

export function armarCatalogo(es: Emojibase[], en: Emojibase[]): EmojiCatalogo[] {
  const porEs = new Map(es.map((e) => [e.hexcode, e]));
  const base = en.filter((e) => e.group !== undefined && e.group !== COMPONENTE).sort((a, b) => a.order! - b.order!);
  const porEmoji = new Map(base.map((e) => [sinVs(e.emoji), e]));
  const ficha = (id: string, k: string, categoria: string, b: Emojibase | undefined): EmojiCatalogo => {
    const a = b && porEs.get(b.hexcode);
    return { id, k, categoria, grupo: NOMBRES[categoria]!, es: a?.label ?? '', en: b?.label ?? '', tagsEs: a?.tags ?? [], tagsEn: b?.tags ?? [] };
  };
  const salida: EmojiCatalogo[] = [];
  const vistos = new Set<string>();
  for (const [categoria, lista] of Object.entries(CURADOS)) {
    for (const linea of lista.trim().split('\n')) {
      const [e, ...k] = linea.trim().split(' ');
      vistos.add(sinVs(e!));
      salida.push(ficha(e!, k.join(' '), categoria, porEmoji.get(sinVs(e!))));
    }
  }
  for (const b of base) {
    if (vistos.has(sinVs(b.emoji))) continue;
    const categoria = SUBGRUPOS_CORAZONES.has(b.subgroup!) ? 'corazones' : CATEGORIA_DE_GRUPO[b.group!]!;
    salida.push(ficha(b.emoji, porEs.get(b.hexcode)?.label ?? b.label, categoria, b));
  }
  const orden = Object.keys(NOMBRES);
  return salida.map((x, i) => [x, i] as const).sort((a, b) => orden.indexOf(a[0].categoria) - orden.indexOf(b[0].categoria) || a[1] - b[1]).map((x) => x[0]);
}

/** Lo que recibe el navegador al abrir el selector: por categoría, solo emoji y nombre. */
export function catalogoServido(l: EmojiCatalogo[]): Record<string, { e: string; k: string }[]> {
  const salida: Record<string, { e: string; k: string }[]> = {};
  for (const x of l) (salida[x.categoria] ??= []).push({ e: x.id, k: x.k });
  return salida;
}
