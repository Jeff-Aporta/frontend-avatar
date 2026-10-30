/**
 * landing.ts — dominio de la landing pública (sin DOM): el contenido de cada sección, fiel a la web original en React
 * (Hero, Community, Features, Productivity, Pricing, Technology, OpenSoftware). Los componentes solo pintan.
 */
import type { Caracteristica, Plan, Pilar } from '../../../src/js/consts/schemas/inicio.schemas.js';

/** Lema de la portada. */
export const LEMA = {
  titulo: 'Todo tu negocio en una sola plataforma',
  texto: 'Simplifica, automatiza y acelera tus procesos con Avatar',
  enlace: 'Obtener información para empezar a generar ingresos',
};

/** Comunidad: lo que muestra la franja de personas. */
export const COMUNIDAD = {
  titulo: 'Únete a nuestra comunidad',
  texto: 'Empresas y equipos que ya trabajan conectados: canales, proyectos y clientes en un mismo lugar.',
  cifras: [
    { valor: '1,000+', etiqueta: 'usuarios el primer año' },
    { valor: '24/7', etiqueta: 'asistente AVO' },
    { valor: '100%', etiqueta: 'en la nube' },
  ],
};

/** Las cuatro características principales (Features). */
export function caracteristicas(): Caracteristica[] {
  return [
    { icono: 'mdi:speedometer', titulo: 'Automatización inteligente', texto: 'Del servicio al cliente a las tareas repetitivas: Avatar trabaja mientras tu equipo se enfoca en lo importante.' },
    { icono: 'mdi:account-group', titulo: 'Gestión de proyectos', texto: 'Tableros kanban con tickets, prioridades, vencimientos, asignación de roles y comentarios.' },
    { icono: 'mdi:cellphone-check', titulo: 'Onboarding interactivo', texto: 'GuíaMatic acompaña a cada persona paso a paso hasta dominar la plataforma.' },
    { icono: 'mdi:face-agent', titulo: 'Chatbot 24/7', texto: 'AVO responde con los datos reales de tu empresa, a cualquier hora.' },
  ];
}

/** Productividad (Productivity). */
export function productividad(): Caracteristica[] {
  return [
    { icono: 'mdi:speedometer-medium', titulo: 'Optimización de procesos', texto: 'Flujos claros entre canales, proyectos, inventario y finanzas.' },
    { icono: 'mdi:eye-outline', titulo: 'Visión en tiempo real', texto: 'Un panel con lo que pasa hoy: tareas, mensajes, pipeline y stock.' },
    { icono: 'mdi:chart-bar', titulo: 'Reportes personalizados', texto: 'Cifras por módulo listas para decidir, sin hojas de cálculo sueltas.' },
  ];
}

/** Tecnología (Technology). */
export function tecnologia(): Caracteristica[] {
  return [
    { icono: 'mdi:cloud-outline', titulo: 'Servicios en la nube', texto: 'API en Cloudflare con base de datos distribuida: rápida en cualquier lugar.' },
    { icono: 'mdi:robot-outline', titulo: 'Inteligencia Artificial', texto: 'Un asistente que entiende tu operación y te guía por la plataforma.' },
    { icono: 'mdi:database-outline', titulo: 'APIs robustas', texto: 'Contratos tipados, permisos por rol y sesiones seguras en cada petición.' },
  ];
}

/** Planes del modelo de negocio (suscripción). */
export function planes(): Plan[] {
  return [
    { id: 'mensual', titulo: 'Mensual', precio: '$100 USD', periodo: 'por mes', destacado: false, incluye: ['Usuarios ilimitados', 'Canales y proyectos', 'CRM e inventario', 'Asistente AVO'] },
    { id: 'anual', titulo: 'Anual', precio: '$1,000 USD', periodo: 'por año', destacado: true, incluye: ['Todo lo del mensual', '2 meses gratis', 'Soporte prioritario'] },
    { id: 'trienal', titulo: '3 años', precio: '$2,100 USD', periodo: 'pago único', destacado: false, incluye: ['Todo lo del anual', 'El mejor precio por mes', 'Onboarding guiado'] },
  ];
}

/** «Un software empresarial moderno, flexible y abierto» (OpenSoftware). */
export const ABIERTO_TITULO = 'Un software empresarial moderno, flexible y abierto';
export function pilares(): Pilar[] {
  return [
    { icono: 'mdi:account-group-outline', titulo: 'Tecnología abierta y colaborativa', texto: 'Construido sobre estándares web y componentes reutilizables que cualquier equipo puede extender.' },
    { icono: 'mdi:layers-outline', titulo: 'Modalidades', texto: 'Community: gratuita y abierta, ideal para explorar. Enterprise: infraestructura optimizada, soporte avanzado e integraciones.' },
    { icono: 'mdi:wrench-outline', titulo: 'Personalización sin límites', texto: 'Módulos, roles y paletas a la medida de cada empresa.' },
    { icono: 'mdi:puzzle-outline', titulo: 'Ecosistema colaborativo', texto: 'Integra tus sistemas y comparte componentes entre aplicaciones.' },
    { icono: 'mdi:lock-open-variant-outline', titulo: 'Sin restricciones ni ataduras', texto: 'Tus datos son tuyos: exporta y migra cuando quieras.' },
    { icono: 'mdi:star-outline', titulo: 'Una propuesta de valor única', texto: 'Comunicación, gestión y automatización en una sola plataforma.' },
  ];
}

/** Fotos de la franja de comunidad (assets/img/personas). */
export function personas(cantidad = 12): string[] {
  return Array.from({ length: cantidad }, (_, i) => `assets/img/personas/persona_${i + 1}.jpg`);
}
