/**
 * landing.ts — dominio de la landing pública (sin DOM): características, planes y el lema. Los componentes solo pintan.
 * Textos de la presentación «Avatar — Gestión Digital y Automatización» (Odys) y de la web original.
 */
import type { Caracteristica, Plan } from '../../../src/js/consts/schemas/inicio.schemas.js';

/** Lema de la portada. */
export const LEMA = { titulo: 'Todo tu negocio en una sola plataforma', texto: 'Simplifica, automatiza y acelera tus procesos con Avatar: canales de comunicación, proyectos kanban, tickets, CRM y un asistente con IA para tu equipo.' };

/** Las cuatro características principales, en este orden. */
export function caracteristicas(): Caracteristica[] {
  return [
    { icono: 'mdi:forum-outline', titulo: 'Comunicación por canales', texto: 'Canales públicos, privados y directos por empresa y equipo: la conversación donde está el trabajo.' },
    { icono: 'mdi:view-column-outline', titulo: 'Gestión de proyectos', texto: 'Tableros kanban con tickets, prioridades, vencimientos, asignación y comentarios.' },
    { icono: 'mdi:account-heart-outline', titulo: 'CRM y clientes', texto: 'Embudo de ventas por etapas con el valor del pipeline siempre a la vista.' },
    { icono: 'mdi:robot-outline', titulo: 'Asistente AVO 24/7', texto: 'Responde con los datos reales de tu empresa y te guía por la plataforma.' },
  ];
}

/** Planes del modelo de negocio (suscripción). */
export function planes(): Plan[] {
  return [
    { id: 'mensual', titulo: 'Mensual', precio: '$100 USD', periodo: 'por mes', destacado: false, incluye: ['Usuarios ilimitados', 'Canales y proyectos', 'CRM', 'Asistente AVO'] },
    { id: 'anual', titulo: 'Anual', precio: '$1,000 USD', periodo: 'por año', destacado: true, incluye: ['Todo lo del mensual', '2 meses gratis', 'Soporte prioritario'] },
    { id: 'trienal', titulo: '3 años', precio: '$2,100 USD', periodo: 'pago único', destacado: false, incluye: ['Todo lo del anual', 'Mejor precio por mes', 'Onboarding guiado'] },
  ];
}
