/**
 * formulario.ts — lectura de los campos del kit dentro de un shadow (sin suposiciones de framework): cada control
 * form-associated (`iswc-input`, `iswc-select`, `iswc-textarea`) lleva `name` y expone `value`.
 */

/** `name → value` de todos los campos con `name` dentro de la raíz. */
export function leerCampos(raiz: ParentNode): Record<string, string> {
  const out: Record<string, string> = {};
  for (const el of raiz.querySelectorAll<HTMLElement & { value?: unknown }>('[name]')) {
    const n = el.getAttribute('name');
    if (!n) continue;
    out[n] = el.value == null ? '' : String(el.value);
  }
  return out;
}

/** Texto vacío → `null`. */
export const oNulo = (s: string | undefined): string | null => (s && s.trim() ? s.trim() : null);

/** Texto → número o `null`. */
export function oNumero(s: string | undefined): number | null {
  if (!s || !s.trim()) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
