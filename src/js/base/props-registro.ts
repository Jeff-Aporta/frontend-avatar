/**
 * props-registro.ts — qué claves de `.props` reconoce cada tag. Lo que no está aquí se avisa.
 *
 * Al crear un componente con `props`: su schema va en `consts/schemas/componentes.schemas.ts` (transversal) o en
 * `consts/schemas/<vista>.schemas.ts` (de una vista), dentro del mapa `*_PROPS` de ese archivo. Todo setter de `props`
 * pasa por `revisarProps`.
 */
import { avisarPropsNoIdentificadas, clavesDe, instalarVigilanciaAtributos } from './zod.js';
import { APP_PROPS } from '../consts/schemas/componentes.schemas.js';
import { INICIO_PROPS } from '../consts/schemas/inicio.schemas.js';
import { ACCESO_PROPS } from '../consts/schemas/acceso.schemas.js';
import { PANEL_PROPS } from '../consts/schemas/panel.schemas.js';
import { CANALES_PROPS } from '../consts/schemas/canales.schemas.js';
import { PROYECTOS_PROPS } from '../consts/schemas/proyectos.schemas.js';
import { CRM_PROPS } from '../consts/schemas/crm.schemas.js';
import { ORGANIZACION_PROPS } from '../consts/schemas/organizacion.schemas.js';
import { ASISTENTE_PROPS } from '../consts/schemas/asistente.schemas.js';
import { ADMIN_PROPS } from '../consts/schemas/admin.schemas.js';

const MAPA = new Map<string, ReadonlySet<string>>();

export function registrarClaves(tag: string, esquema: { shape: object }): void {
  MAPA.set(tag, clavesDe(esquema));
}

for (const grupo of [APP_PROPS, INICIO_PROPS, ACCESO_PROPS, PANEL_PROPS, CANALES_PROPS, PROYECTOS_PROPS, CRM_PROPS, ORGANIZACION_PROPS, ASISTENTE_PROPS, ADMIN_PROPS]) {
  for (const [tag, esquema] of Object.entries(grupo as Record<string, { shape: object }>)) registrarClaves(tag, esquema);
}

export function revisarProps(tag: string, valor: unknown): void {
  if (!valor || typeof valor !== 'object') return;
  const claves = MAPA.get(tag);
  if (claves) avisarPropsNoIdentificadas(tag, claves, valor);
}

if (typeof document !== 'undefined') instalarVigilanciaAtributos('av');
