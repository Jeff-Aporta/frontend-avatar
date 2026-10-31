/**
 * _paty.ts — adaptador de los componentes traídos de ISW-TestPatyIA a la base de Avatar: misma API de `_shared`, sin
 * depender de ese repositorio. Desaparece cuando cada componente se apruebe para iswc o se descarte.
 */
import { adoptCss as adoptarCss, precargarCss as precargar } from '../../base/componente.js';

export { adoptarPropsTardias, define, emitir, html } from '../../base/componente.js';

const nombreDe = (url: string): string => new URL(url).pathname.split('/').pop()!.replace(/\.js$/, '');
export const adoptCss = (shadow: ShadowRoot, url: string, nombre = nombreDe(url)): void => adoptarCss(shadow, url, nombre);
export const precargarCss = (url: string, nombre = nombreDe(url)): void => precargar(url, nombre);
